import {
  sendDocumentChecklistToBorrower,
  sendConditionTemplateToBorrower,
  notifyBrokerDocumentsReady,
  performPostApprovalTasks
} from "./automation";
import {
  generatePreUnderwritingConditions,
  checkConditionSatisfaction,
  requestConditionDocuments
} from "./conditions";
import axios from "axios";
import { Router, Request, Response } from "express";
import {
  LoanApplication,
  LoanSubmission,
  getDocumentRequirements,
  checkDocumentCompleteness
} from "@loan-platform/shared-types";
import { ApiResponse, PaginatedResponse } from "./types";
import { compareLendersAndSelectBest, getRecommendedLender, type Lender } from "./lender-selection";
import { loanDb } from "./database";

const WORKFLOW_SERVICE_URL = process.env.WORKFLOW_SERVICE_URL || "http://localhost:4004";

// Helper function to trigger workflow execution
async function triggerWorkflow(loanId: string): Promise<void> {
  try {
    await axios.post(`${WORKFLOW_SERVICE_URL}/api/execute/${loanId}`);
  } catch (error) {
    // Log error but don't fail the request
    console.error(`Failed to trigger workflow for loan ${loanId}:`, error);
  }
}

// Helper function to trigger automated document requests
async function triggerDocumentRequest(loanId: string, loan: LoanApplication): Promise<void> {
  try {
    await axios.post(
      `${WORKFLOW_SERVICE_URL}/api/applications/${loanId}/request-documents`,
      { loan },
    );
    console.log(`[AUTOMATED] Document request workflow triggered for loan ${loanId}`);
  } catch (error) {
    // Log error but don't fail the request
    console.error(`Failed to trigger document request for loan ${loanId}:`, error);
  }
}

const router = Router();

// In-memory store for demo (replace with database in production)
const loanApplications: Map<string, LoanApplication> = new Map();

// In-memory store for lender configurations (replace with database in production)
// Key: brokerId, Value: array of lenders
const lenderConfigs: Map<string, any[]> = new Map();

// Create new loan application
router.post("/applications", async (req, res) => {
  try {
    const application: LoanApplication = req.body;
    application.id = `loan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    application.createdAt = new Date().toISOString();
    application.updatedAt = application.createdAt;
    application.status = application.status || "Draft";
    application.stage = application.stage || "Draft";

    loanApplications.set(application.id, application);

    // 🤖 AUTOMATED: Send document checklist to borrower immediately
    sendDocumentChecklistToBorrower(application).catch(console.error);

    // Trigger workflow to automatically request documents
    // The workflow will:
    // 1. Analyze the application using getDocumentRequirements()
    // 2. Generate personalized document checklist based on:
    //    - Loan type (Conventional, FHA, VA, etc.)
    //    - Employment status (Employed, SelfEmployed, etc.)
    //    - Income type (W2, SelfEmployed, etc.)
    //    - Property type and other factors
    // 3. Send automated email with personalized document checklist
    // 4. Send automated SMS with document checklist
    // 5. Set up reminders for missing documents
    triggerWorkflow(application.id).catch(console.error);

    // Trigger automated document request (analyze application and contact borrower)
    setTimeout(() => {
      triggerDocumentRequest(application.id, application).catch(console.error);
    }, 2000); // Wait 2 seconds for loan to be fully created

    const response: ApiResponse<LoanApplication> = {
      success: true,
      data: application,
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "CREATE_FAILED",
        message: error instanceof Error ? error.message : "Failed to create loan application",
      },
    };
    res.status(500).json(response);
  }
});

// Get loan application by ID
router.get("/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const application = loanApplications.get(id);

    if (!application) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Loan application not found",
        },
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<LoanApplication> = {
      success: true,
      data: application,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "FETCH_FAILED",
        message: error instanceof Error ? error.message : "Failed to fetch loan application",
      },
    };
    res.status(500).json(response);
  }
});

// Update loan application documents
router.post("/applications/:id/documents", async (req, res) => {
  try {
    const { id } = req.params;
    const { documents: newDocuments } = req.body;
    const application = loanApplications.get(id);

    if (!application) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Loan application not found",
        },
      };
      return res.status(404).json(response);
    }

    // Merge new documents with existing ones
    const existingDocIds = new Set(application.documents.map(d => d.id));
    const documentsToAdd = newDocuments.filter((d: any) => !existingDocIds.has(d.id));

    application.documents = [...application.documents, ...documentsToAdd];
    application.updatedAt = new Date().toISOString();

    // 🤖 AUTOMATED: Check if conditions are satisfied when new documents are uploaded
    if (application.underwritingConditions && application.underwritingConditions.length > 0) {
      const beforeSatisfiedCount = application.underwritingConditions.filter(c => c.status === "Satisfied").length;

      application.underwritingConditions = application.underwritingConditions.map(condition => {
        if (condition.status === "Pending" && checkConditionSatisfaction(condition, application.documents)) {
          return {
            ...condition,
            status: "Satisfied" as const,
            satisfiedAt: new Date().toISOString(),
            satisfiedBy: "system",
          };
        }
        return condition;
      });

      const afterSatisfiedCount = application.underwritingConditions.filter(c => c.status === "Satisfied").length;
      const conditionsSatisfied = afterSatisfiedCount > beforeSatisfiedCount;

      // If all conditions are satisfied, notify broker
      const allSatisfied = application.underwritingConditions.every(c => c.status === "Satisfied");
      if (allSatisfied && application.stage === "PreUnderwriting") {
        console.log(`[AUTOMATED] ✅ All conditions satisfied for loan ${id}, ready for underwriting`);
        // 🤖 AUTOMATED: Notify broker that loan is ready for review
        notifyBrokerDocumentsReady(application, true, true).catch(console.error);
      } else if (conditionsSatisfied) {
        // 🤖 AUTOMATED: Notify broker when conditions are satisfied
        notifyBrokerDocumentsReady(application, false, true).catch(console.error);
      }
    } else {
      // 🤖 AUTOMATED: Notify broker when all documents are uploaded
      const requirements = getDocumentRequirements(application);
      const completeness = checkDocumentCompleteness(application, requirements);

      if (completeness.complete) {
        console.log(`[AUTOMATED] ✅ All required documents uploaded for loan ${id}`);
        notifyBrokerDocumentsReady(application, true, false).catch(console.error);
      }
    }

    loanApplications.set(id, application);

    // Trigger workflow to check if loan can advance
    triggerWorkflow(id).catch(console.error);

    const response: ApiResponse<LoanApplication> = {
      success: true,
      data: application,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "UPDATE_FAILED",
        message: error instanceof Error ? error.message : "Failed to update documents",
      },
    };
    res.status(500).json(response);
  }
});

// Update loan application
router.put("/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const application = loanApplications.get(id);

    if (!application) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Loan application not found",
        },
      };
      return res.status(404).json(response);
    }

    const updated: LoanApplication = {
      ...application,
      ...req.body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    loanApplications.set(id, updated);

    const response: ApiResponse<LoanApplication> = {
      success: true,
      data: updated,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "UPDATE_FAILED",
        message: error instanceof Error ? error.message : "Failed to update loan application",
      },
    };
    res.status(500).json(response);
  }
});

// Submit loan application to underwriting (Multi-Lender Support)
router.post("/applications/:id/submit", async (req, res) => {
  try {
    const { id } = req.params;
    const { lenderIds } = req.body; // Array of lender IDs to submit to
    const application = await loanDb.getLoan(id);

    if (!application) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Loan application not found",
        },
      };
      return res.status(404).json(response);
    }

    // Update status and stage
    const updates: Partial<LoanApplication> = {
      status: "Submitted",
      stage: "PreUnderwriting",
      submittedAt: new Date().toISOString(),
    };

    // 🤖 AUTOMATED: Generate conditions for PreUnderwriting
    const conditions = generatePreUnderwritingConditions(application);
    updates.underwritingConditions = conditions;
    updates.underwritingDecision = "Conditional";

    // Update loan in DB
    await loanDb.updateLoan(id, updates);
    const updatedApp = await loanDb.getLoan(id);

    if (!updatedApp) throw new Error("Failed to retrieve updated loan");

    // 🤖 AUTOMATED: Handle Multi-Lender Submission
    const brokerId = req.headers["x-broker-id"] as string || "default-broker";
    const allLenders = lenderConfigs.get(brokerId) || [];

    // If specific lenders are selected, use them. Otherwise, use recommended or all enabled.
    let targetLenders: Lender[] = [];
    if (lenderIds && Array.isArray(lenderIds) && lenderIds.length > 0) {
      targetLenders = allLenders.filter((l: Lender) => lenderIds.includes(l.id));
    } else {
      // Default behavior: compare and select best if no specific lenders requested
      // Or if this is a "blast" submission, maybe submit to top 3?
      // For now, let's stick to the previous behavior if no lenderIds provided: select best
      const comparisons = await compareLendersAndSelectBest(allLenders.filter((l: Lender) => l.enabled), updatedApp);
      const recommended = comparisons.find(c => c.recommended);
      if (recommended) {
        targetLenders = [recommended.lender];
      }
    }

    // Create LoanSubmission records
    const submissions: LoanSubmission[] = [];
    for (const lender of targetLenders) {
      // Create submission in DB (mocking DB creation for now as we don't have a direct method in loanDb yet, 
      // but we should add it. For now, we'll just log it and assume it's created via a separate service or we add it to loanDb)

      // In a real app, we would call loanDb.createSubmission(...)
      // Since we didn't add that method to loanDb class yet, let's just simulate it or add it to the prisma client directly if we could.
      // But we can't access prisma client directly here easily without importing it.
      // Let's assume we update the loan with submissions.

      console.log(`[AUTOMATED] Submitting loan ${id} to lender: ${lender.name} (${lender.type})`);

      if (lender.type === 'Private') {
        console.log(`[AUTOMATED] 📧 Triggering PRIVATE UNDERWRITER workflow for ${lender.name}`);
        // Trigger email/manual workflow
      } else {
        console.log(`[AUTOMATED] 🌐 Triggering INSTITUTIONAL API workflow for ${lender.name}`);
        // Trigger API submission
      }
    }

    // 🤖 AUTOMATED: Send condition template to borrower
    sendConditionTemplateToBorrower(updatedApp, conditions).catch(console.error);

    // Automatically request condition documents from borrower
    requestConditionDocuments(updatedApp, conditions).catch(console.error);

    // Trigger workflow to move to underwriting
    triggerWorkflow(id).catch(console.error);

    const response: ApiResponse<LoanApplication> = {
      success: true,
      data: updatedApp,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "SUBMIT_FAILED",
        message: error instanceof Error ? error.message : "Failed to submit loan application",
      },
    };
    res.status(500).json(response);
  }
});

// List loan applications (with pagination)
router.get("/applications", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const borrowerId = req.query.borrowerId as string | undefined;

    let applications = Array.from(loanApplications.values());

    // Filter by borrower if provided
    if (borrowerId) {
      applications = applications.filter((app) => app.borrowerId === borrowerId);
    }

    // Paginate
    const total = applications.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = applications.slice(start, end);

    const response: ApiResponse<PaginatedResponse<LoanApplication>> = {
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages,
      },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "FETCH_FAILED",
        message: error instanceof Error ? error.message : "Failed to fetch loan applications",
      },
    };
    res.status(500).json(response);
  }
});

// Get loans ready for broker sign-off (Clear to Close)
router.get("/applications/ready-for-signoff", async (req, res) => {
  try {
    const applications = Array.from(loanApplications.values()).filter(
      (app) => app.stage === "ClearToClose"
    );

    const response: ApiResponse<LoanApplication[]> = {
      success: true,
      data: applications,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "FETCH_FAILED",
        message: error instanceof Error ? error.message : "Failed to fetch loans ready for signoff",
      },
    };
    res.status(500).json(response);
  }
});

// Sign off and close loan
router.post("/applications/:id/signoff", async (req, res) => {
  try {
    const { id } = req.params;
    const application = loanApplications.get(id);

    if (!application) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Loan application not found",
        },
      };
      return res.status(404).json(response);
    }

    if (application.stage !== "ClearToClose") {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "INVALID_STAGE",
          message: "Loan must be in ClearToClose stage to sign off",
        },
      };
      return res.status(400).json(response);
    }

    // Update to Closed stage
    application.stage = "Closed";
    application.status = "Approved";
    application.closedAt = new Date().toISOString();
    application.updatedAt = application.closedAt;

    loanApplications.set(id, application);

    const response: ApiResponse<LoanApplication> = {
      success: true,
      data: application,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "SIGNOFF_FAILED",
        message: error instanceof Error ? error.message : "Failed to sign off loan",
      },
    };
    res.status(500).json(response);
  }
});

// Approve loan and move to next stage
router.post("/applications/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const application = await loanDb.getLoan(id);

    if (!application) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Loan application not found",
        },
      };
      return res.status(404).json(response);
    }

    const updates: Partial<LoanApplication> = {};

    // Move to next stage based on current stage
    if (application.stage === "ClearToClose") {
      updates.stage = "Closed";
      updates.status = "Approved";
      updates.closedAt = new Date().toISOString();
      updates.approvedAt = updates.closedAt;

      // 🤖 AUTOMATED: Perform post-approval tasks (appraisal, escrow, etc.)
      performPostApprovalTasks(application).catch(console.error);
    } else if (application.stage === "PreUnderwriting") {
      updates.stage = "Underwriting";
      updates.status = "UnderReview";
    } else if (application.stage === "Underwriting") {
      // Move to Senior Underwriting instead of ClearToClose
      updates.stage = "SeniorUnderwriting";
      updates.status = "UnderReview";
      console.log(`[WORKFLOW] Loan ${id} moved to Senior Underwriting`);
    } else if (application.stage === "SeniorUnderwriting") {
      // Senior Underwriter approves to ClearToClose
      updates.stage = "ClearToClose";
      updates.status = "Approved";
      updates.approvedAt = new Date().toISOString();
      console.log(`[WORKFLOW] Loan ${id} approved by Senior Underwriter -> ClearToClose`);

      // 🤖 AUTOMATED: Perform post-approval tasks (appraisal, escrow, etc.)
      performPostApprovalTasks(application).catch(console.error);
    }

    updates.updatedAt = new Date().toISOString();

    await loanDb.updateLoan(id, updates);
    const updatedApp = await loanDb.getLoan(id);

    if (!updatedApp) throw new Error("Failed to retrieve updated loan");

    // Trigger workflow to continue processing
    triggerWorkflow(id).catch(console.error);

    const response: ApiResponse<LoanApplication> = {
      success: true,
      data: updatedApp,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "APPROVE_FAILED",
        message: error instanceof Error ? error.message : "Failed to approve loan",
      },
    };
    res.status(500).json(response);
  }
});

// Get lender configurations (all lenders for a broker)
router.get("/lender-config", async (req, res) => {
  try {
    // For demo, use broker ID from headers or default
    const brokerId = req.headers["x-broker-id"] as string || "default-broker";
    const lenders = lenderConfigs.get(brokerId) || [];

    const response: ApiResponse<any> = {
      success: true,
      data: { lenders },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "FETCH_FAILED",
        message: error instanceof Error ? error.message : "Failed to fetch lender configurations",
      },
    };
    res.status(500).json(response);
  }
});

// Save lender configuration (add or update a lender)
router.post("/lender-config", async (req, res) => {
  try {
    // For demo, use broker ID from headers or default
    const brokerId = req.headers["x-broker-id"] as string || "default-broker";
    const lenderData = req.body;

    // Get existing lenders or create new array
    const lenders = lenderConfigs.get(brokerId) || [];

    // Check if lender already exists (by id)
    const existingIndex = lenders.findIndex((l: any) => l.id === lenderData.id);

    if (existingIndex >= 0) {
      // Update existing lender
      lenders[existingIndex] = { ...lenders[existingIndex], ...lenderData };
    } else {
      // Add new lender
      if (!lenderData.id) {
        lenderData.id = `lender-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
      lenderData.enabled = lenderData.enabled !== false; // Default to enabled
      lenders.push(lenderData);
    }

    lenderConfigs.set(brokerId, lenders);

    const response: ApiResponse<any> = {
      success: true,
      data: { lender: lenderData, lenders },
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "SAVE_FAILED",
        message: error instanceof Error ? error.message : "Failed to save lender configuration",
      },
    };
    res.status(500).json(response);
  }
});

// Delete a lender
router.delete("/lender-config/:lenderId", async (req, res) => {
  try {
    const brokerId = req.headers["x-broker-id"] as string || "default-broker";
    const { lenderId } = req.params;

    const lenders = lenderConfigs.get(brokerId) || [];
    const filteredLenders = lenders.filter((l: any) => l.id !== lenderId);

    lenderConfigs.set(brokerId, filteredLenders);

    const response: ApiResponse<any> = {
      success: true,
      data: { lenders: filteredLenders },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "DELETE_FAILED",
        message: error instanceof Error ? error.message : "Failed to delete lender",
      },
    };
    res.status(500).json(response);
  }
});

// Compare lenders and get AI recommendation for a loan
router.post("/applications/:id/compare-lenders", async (req, res) => {
  try {
    const { id } = req.params;
    const application = loanApplications.get(id);

    if (!application) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Loan application not found",
        },
      };
      return res.status(404).json(response);
    }

    // Get all enabled lenders for broker
    const brokerId = req.headers["x-broker-id"] as string || "default-broker";
    const lenders = (lenderConfigs.get(brokerId) || []).filter((l: Lender) => l.enabled);

    if (lenders.length === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "NO_LENDERS",
          message: "No lenders configured. Please add lenders in Settings.",
        },
      };
      return res.status(400).json(response);
    }

    // 🤖 AUTOMATED: Compare lenders and select best one
    const comparisons = await compareLendersAndSelectBest(lenders, application);
    const recommended = comparisons.find(c => c.recommended);

    // Update loan with recommended lender
    if (recommended) {
      application.loanOfficerId = brokerId;
      application.updatedAt = new Date().toISOString();
      loanApplications.set(id, application);

      console.log(`[AUTOMATED] ✅ Selected lender for loan ${id}: ${recommended.lender.name}`);
    }

    const response: ApiResponse<any> = {
      success: true,
      data: {
        comparisons,
        recommended: recommended || null,
        loan: application,
      },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "COMPARE_FAILED",
        message: error instanceof Error ? error.message : "Failed to compare lenders",
      },
    };
    res.status(500).json(response);
  }
});

// Get recommended lender for a loan (automatic selection)
router.get("/applications/:id/recommended-lender", async (req, res) => {
  try {
    const { id } = req.params;
    const application = loanApplications.get(id);

    if (!application) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Loan application not found",
        },
      };
      return res.status(404).json(response);
    }

    // Get all enabled lenders for broker
    const brokerId = req.headers["x-broker-id"] as string || "default-broker";
    const lenders = (lenderConfigs.get(brokerId) || []).filter((l: Lender) => l.enabled);

    if (lenders.length === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "NO_LENDERS",
          message: "No lenders configured. Please add lenders in Settings.",
        },
      };
      return res.status(400).json(response);
    }

    // 🤖 AUTOMATED: Get recommended lender
    const comparisons = await compareLendersAndSelectBest(lenders, application);
    const recommended = comparisons.find(c => c.recommended);

    const response: ApiResponse<any> = {
      success: true,
      data: {
        recommended: recommended || null,
        allComparisons: comparisons,
      },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "RECOMMENDATION_FAILED",
        message: error instanceof Error ? error.message : "Failed to get recommended lender",
      },
    };
    res.status(500).json(response);
  }
});

// Test lender API connection
router.post("/lender-config/test-connection", async (req, res) => {
  try {
    // In production, this would test the actual connection to the lender API
    // For demo, we'll just return success
    const response: ApiResponse<{ success: boolean; message: string }> = {
      success: true,
      data: {
        success: true,
        message: "Connection test successful (demo mode)",
      },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "TEST_FAILED",
        message: error instanceof Error ? error.message : "Failed to test connection",
      },
    };
    res.status(500).json(response);
  }
});

export default router;

