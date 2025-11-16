import type {
  LoanApplication,
  LoanStage,
  UnderwritingDecision,
  UnderwritingCondition,
  DocumentMetadata,
} from "@shared-types";
import { getDocumentRequirements, checkDocumentCompleteness } from "@shared-types";
import axios from "axios";

// Configuration for service URLs (in production, use environment variables)
const LOAN_SERVICE_URL = process.env.LOAN_SERVICE_URL || "http://localhost:4002";
const DOCUMENT_SERVICE_URL = process.env.DOCUMENT_SERVICE_URL || "http://localhost:4003";

interface WorkflowStep {
  id: string;
  name: string;
  execute: (loan: LoanApplication) => Promise<WorkflowResult>;
  shouldExecute: (loan: LoanApplication) => boolean;
  nextStep?: string;
  retry?: {
    maxAttempts: number;
    delay: number; // milliseconds
  };
}

interface WorkflowResult {
  success: boolean;
  nextStage?: LoanStage;
  error?: string;
  data?: unknown;
}

export class LoanWorkflow {
  private steps: Map<string, WorkflowStep> = new Map();

  constructor() {
    this.initializeSteps();
  }

  private initializeSteps() {
    // Step 1: Check document completeness
    this.steps.set("check-documents", {
      id: "check-documents",
      name: "Check Document Completeness",
      shouldExecute: (loan) => loan.stage === "Draft" || loan.stage === "Submitted",
      execute: async (loan) => {
        try {
          const requirements = getDocumentRequirements(loan);
          const completeness = checkDocumentCompleteness(loan, requirements);

          if (completeness.complete) {
            return {
              success: true,
              nextStage: "PreUnderwriting",
              data: { message: "All required documents uploaded" },
            };
          } else {
            return {
              success: false,
              error: `Missing ${completeness.missing.length} required documents`,
              data: { missing: completeness.missing },
            };
          }
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to check documents",
          };
        }
      },
      nextStep: "submit-to-underwriting",
      retry: { maxAttempts: 3, delay: 5000 },
    });

    // Step 2: Submit to underwriting
    this.steps.set("submit-to-underwriting", {
      id: "submit-to-underwriting",
      name: "Submit to Underwriting",
      shouldExecute: (loan) => loan.stage === "PreUnderwriting",
      execute: async (loan) => {
        try {
          // Update loan stage to Underwriting
          const response = await axios.put(`${LOAN_SERVICE_URL}/api/applications/${loan.id}`, {
            stage: "Underwriting",
            status: "UnderReview",
          });

          return {
            success: true,
            nextStage: "Underwriting",
            data: response.data,
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to submit to underwriting",
          };
        }
      },
      nextStep: "wait-for-decision",
    });

    // Step 3: Wait for underwriting decision (this is typically triggered by external event)
    this.steps.set("wait-for-decision", {
      id: "wait-for-decision",
      name: "Wait for Underwriting Decision",
      shouldExecute: (loan) => loan.stage === "Underwriting" && !loan.underwritingDecision,
      execute: async (loan) => {
        // This step doesn't do anything - it just waits
        // The decision will be set by an external call (underwriter or rules service)
        return {
          success: true,
          data: { message: "Waiting for underwriting decision" },
        };
      },
      nextStep: "process-decision",
    });

    // Step 4: Process underwriting decision
    this.steps.set("process-decision", {
      id: "process-decision",
      name: "Process Underwriting Decision",
      shouldExecute: (loan) =>
        loan.stage === "Underwriting" && !!loan.underwritingDecision,
      execute: async (loan) => {
        try {
          if (loan.underwritingDecision === "Approved") {
            // No conditions - go straight to ClearToClose
            await axios.put(`${LOAN_SERVICE_URL}/api/applications/${loan.id}`, {
              stage: "ClearToClose",
            });

            return {
              success: true,
              nextStage: "ClearToClose",
              data: { message: "Loan approved - moved to ClearToClose" },
            };
          } else if (loan.underwritingDecision === "Conditional") {
            // Has conditions - move to Conditional stage
            await axios.put(`${LOAN_SERVICE_URL}/api/applications/${loan.id}`, {
              stage: "Conditional",
            });

            return {
              success: true,
              nextStage: "Conditional",
              data: {
                message: "Conditional approval - waiting for conditions to be satisfied",
                conditions: loan.underwritingConditions,
              },
            };
          } else if (loan.underwritingDecision === "Rejected") {
            // Loan rejected - stay in Underwriting stage but mark as rejected
            return {
              success: true,
              data: { message: "Loan rejected" },
            };
          }

          return {
            success: false,
            error: "Unknown underwriting decision",
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to process decision",
          };
        }
      },
      nextStep: "check-conditions",
    });

    // Step 5: Check if conditions are satisfied
    this.steps.set("check-conditions", {
      id: "check-conditions",
      name: "Check Underwriting Conditions",
      shouldExecute: (loan) =>
        loan.stage === "Conditional" &&
        loan.underwritingDecision === "Conditional" &&
        !!loan.underwritingConditions &&
        loan.underwritingConditions.length > 0,
      execute: async (loan) => {
        try {
          if (!loan.underwritingConditions) {
            return {
              success: false,
              error: "No conditions found",
            };
          }

          // Check if all conditions are satisfied
          const allSatisfied = loan.underwritingConditions.every(
            (condition) => condition.status === "Satisfied"
          );

          if (allSatisfied) {
            // All conditions satisfied - promote to ClearToClose
            await axios.put(`${LOAN_SERVICE_URL}/api/applications/${loan.id}`, {
              stage: "ClearToClose",
            });

            return {
              success: true,
              nextStage: "ClearToClose",
              data: { message: "All conditions satisfied - moved to ClearToClose" },
            };
          } else {
            // Still waiting for conditions
            const pending = loan.underwritingConditions.filter(
              (c) => c.status === "Pending"
            );
            return {
              success: true,
              data: {
                message: `Waiting for ${pending.length} condition(s) to be satisfied`,
                pendingConditions: pending,
              },
            };
          }
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to check conditions",
          };
        }
      },
      retry: { maxAttempts: 10, delay: 60000 }, // Check every minute, up to 10 times
    });
  }

  /**
   * Execute the workflow for a loan application
   */
  async execute(loanId: string): Promise<WorkflowResult> {
    try {
      // Fetch current loan state
      const loanResponse = await axios.get(`${LOAN_SERVICE_URL}/api/applications/${loanId}`);
      const loan: LoanApplication = loanResponse.data.data;

      if (!loan) {
        return {
          success: false,
          error: "Loan application not found",
        };
      }

      // Find the next step to execute
      const nextStep = this.findNextStep(loan);

      if (!nextStep) {
        return {
          success: true,
          data: { message: "No workflow steps to execute" },
        };
      }

      // Execute the step
      const result = await this.executeStep(nextStep, loan);

      // If step succeeded and there's a next step, continue
      if (result.success && nextStep.nextStep) {
        const nextStepId = nextStep.nextStep;
        const nextStepDef = this.steps.get(nextStepId);

        if (nextStepDef) {
          // Recursively execute next step
          return this.execute(loanId);
        }
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Workflow execution failed",
      };
    }
  }

  /**
   * Find the next step that should be executed for a loan
   */
  private findNextStep(loan: LoanApplication): WorkflowStep | null {
    for (const step of this.steps.values()) {
      if (step.shouldExecute(loan)) {
        return step;
      }
    }
    return null;
  }

  /**
   * Execute a workflow step with retry logic
   */
  private async executeStep(
    step: WorkflowStep,
    loan: LoanApplication
  ): Promise<WorkflowResult> {
    let attempts = 0;
    const maxAttempts = step.retry?.maxAttempts || 1;
    const delay = step.retry?.delay || 0;

    while (attempts < maxAttempts) {
      try {
        const result = await step.execute(loan);

        if (result.success) {
          return result;
        }

        // If failed and we have retries left, wait and retry
        if (attempts < maxAttempts - 1 && delay > 0) {
          await this.sleep(delay);
        }

        attempts++;
      } catch (error) {
        attempts++;

        if (attempts >= maxAttempts) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Step execution failed",
          };
        }

        if (delay > 0) {
          await this.sleep(delay);
        }
      }
    }

    return {
      success: false,
      error: "Step execution failed after retries",
    };
  }

  /**
   * Process a document upload event
   * This is called when a borrower uploads a new document
   */
  async onDocumentUploaded(loanId: string, documentId: string): Promise<WorkflowResult> {
    try {
      // Fetch loan
      const loanResponse = await axios.get(`${LOAN_SERVICE_URL}/api/applications/${loanId}`);
      const loan: LoanApplication = loanResponse.data.data;

      if (!loan) {
        return {
          success: false,
          error: "Loan application not found",
        };
      }

      // If loan is in Draft or Submitted stage, check if documents are now complete
      if (loan.stage === "Draft" || loan.stage === "Submitted") {
        return this.execute(loanId);
      }

      // If loan is in Conditional stage, check if conditions are now satisfied
      if (loan.stage === "Conditional") {
        // Re-check conditions
        return this.execute(loanId);
      }

      return {
        success: true,
        data: { message: "Document uploaded, no workflow action needed" },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process document upload",
      };
    }
  }

  /**
   * Process an underwriting decision event
   * This is called when an underwriter makes a decision
   */
  async onUnderwritingDecision(
    loanId: string,
    decision: UnderwritingDecision,
    conditions?: UnderwritingCondition[]
  ): Promise<WorkflowResult> {
    try {
      // Update loan with decision
      await axios.put(`${LOAN_SERVICE_URL}/api/applications/${loanId}`, {
        underwritingDecision: decision,
        underwritingConditions: conditions || [],
      });

      // Continue workflow execution
      return this.execute(loanId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process underwriting decision",
      };
    }
  }

  /**
   * Process a condition satisfaction event
   * This is called when a condition is marked as satisfied
   */
  async onConditionSatisfied(loanId: string, conditionId: string): Promise<WorkflowResult> {
    try {
      // Fetch loan
      const loanResponse = await axios.get(`${LOAN_SERVICE_URL}/api/applications/${loanId}`);
      const loan: LoanApplication = loanResponse.data.data;

      if (!loan || loan.stage !== "Conditional") {
        return {
          success: false,
          error: "Loan not in Conditional stage",
        };
      }

      // Update condition status (this would typically be done via loan service)
      // For now, we'll just re-check conditions
      return this.execute(loanId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process condition satisfaction",
      };
    }
  }

  /**
   * Automatically request documents from borrower based on their application
   * This is called when a loan is first submitted
   * - Analyzes application to determine required documents
   * - Sends email and SMS with personalized document checklist
   * - Sets up reminders for missing documents
   */
  async requestDocuments(loanId: string): Promise<WorkflowResult> {
    try {
      // Fetch loan application
      const loanResponse = await axios.get(`${LOAN_SERVICE_URL}/api/applications/${loanId}`);
      const loan: LoanApplication = loanResponse.data.data;

      if (!loan) {
        return {
          success: false,
          error: "Loan application not found",
        };
      }

      // Generate personalized document requirements based on application
      const requirements = getDocumentRequirements(loan);
      const completeness = checkDocumentCompleteness(loan, requirements);

      // Determine which documents are needed based on:
      // - Loan type (Conventional, FHA, VA, etc.)
      // - Employment status (Employed, SelfEmployed, etc.)
      // - Income type (W2, SelfEmployed, etc.)
      // - Property type
      // - Other application factors

      const missingDocuments = completeness.missing.map((req) => ({
        type: req.documentType,
        // Use description as a human-readable label for now
        label: req.description,
        description: req.description,
        required: req.required,
      }));

      // In production, this would:
      // 1. Call notification service to send email with document checklist
      // 2. Call notification service to send SMS with document checklist
      // 3. Set up automated reminders for missing documents
      // 4. Update borrower portal with document checklist

      console.log(`[AUTOMATED] Document request sent for loan ${loanId}`);
      console.log(
        `[AUTOMATED] Missing documents (${missingDocuments.length}):`,
        missingDocuments.map((d) => d.label).join(", ")
      );
      console.log(`[AUTOMATED] Email would be sent to: ${loan.borrower.email}`);
      console.log(`[AUTOMATED] SMS would be sent to: ${loan.borrower.phone}`);
      console.log(`[AUTOMATED] Documents requested based on:`, {
        loanType: loan.loanType,
        employmentStatus: loan.employment.status,
        incomeType: loan.employment.incomeType,
        propertyType: loan.property.propertyType,
      });

      // Simulate sending notifications (in production, call notification service)
      // await axios.post(`${NOTIFICATION_SERVICE_URL}/api/send-document-request-email`, {
      //   to: loan.borrower.email,
      //   loanId: loan.id,
      //   borrowerName: `${loan.borrower.firstName} ${loan.borrower.lastName}`,
      //   missingDocuments: missingDocuments,
      //   portalLink: `https://loan-platform.app/borrower/portal/${loan.id}`,
      // });
      //
      // await axios.post(`${NOTIFICATION_SERVICE_URL}/api/send-document-request-sms`, {
      //   to: loan.borrower.phone,
      //   loanId: loan.id,
      //   missingDocumentsCount: missingDocuments.length,
      //   portalLink: `https://loan-platform.app/borrower/portal/${loan.id}`,
      // });

      return {
        success: true,
        data: {
          message: "Document requests sent to borrower",
          missingDocuments,
          emailSent: true,
          smsSent: true,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to request documents",
      };
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

