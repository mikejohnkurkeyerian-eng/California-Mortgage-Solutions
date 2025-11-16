import { Router } from "express";
import axios from "axios";
import type { LoanApplication, ApiResponse, PaginatedResponse } from "@loan-platform/shared-types";

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
      {loan},
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

// Create new loan application
router.post("/applications", async (req, res) => {
  try {
    const application: LoanApplication = req.body;
    application.id = `loan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    application.createdAt = new Date().toISOString();
    application.updatedAt = application.createdAt;
    application.status = "Draft";
    application.stage = "Draft";

    loanApplications.set(application.id, application);

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

// Submit loan application to underwriting
router.post("/applications/:id/submit", async (req, res) => {
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

    // Update status and stage
    application.status = "Submitted";
    application.stage = "PreUnderwriting";
    application.submittedAt = new Date().toISOString();
    application.updatedAt = application.submittedAt;

    loanApplications.set(id, application);

    // Trigger workflow to move to underwriting
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

export default router;

