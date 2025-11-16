import { Router } from "express";
import axios from "axios";
import { LoanWorkflow } from "./workflows/loan-workflow";
import type { ApiResponse, UnderwritingDecision, UnderwritingCondition } from "@shared-types";

const router = Router();
const workflow = new LoanWorkflow();

// Execute workflow for a loan
router.post("/execute/:loanId", async (req, res) => {
  try {
    const { loanId } = req.params;
    const result = await workflow.execute(loanId);

    const response: ApiResponse<unknown> = {
      success: result.success,
      data: result.data,
      error: result.error
        ? {
            code: "WORKFLOW_ERROR",
            message: result.error,
          }
        : undefined,
    };

    res.status(result.success ? 200 : 500).json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "EXECUTION_FAILED",
        message: error instanceof Error ? error.message : "Failed to execute workflow",
      },
    };
    res.status(500).json(response);
  }
});

// Handle document upload event
router.post("/events/document-uploaded", async (req, res) => {
  try {
    const { loanId, documentId } = req.body;

    if (!loanId || !documentId) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "MISSING_PARAMS",
          message: "loanId and documentId are required",
        },
      };
      return res.status(400).json(response);
    }

    const result = await workflow.onDocumentUploaded(loanId, documentId);

    const response: ApiResponse<unknown> = {
      success: result.success,
      data: result.data,
      error: result.error
        ? {
            code: "WORKFLOW_ERROR",
            message: result.error,
          }
        : undefined,
    };

    res.status(result.success ? 200 : 500).json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "EVENT_PROCESSING_FAILED",
        message: error instanceof Error ? error.message : "Failed to process document upload event",
      },
    };
    res.status(500).json(response);
  }
});

// Handle underwriting decision event
router.post("/events/underwriting-decision", async (req, res) => {
  try {
    const { loanId, decision, conditions } = req.body;

    if (!loanId || !decision) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "MISSING_PARAMS",
          message: "loanId and decision are required",
        },
      };
      return res.status(400).json(response);
    }

    const result = await workflow.onUnderwritingDecision(
      loanId,
      decision as UnderwritingDecision,
      conditions as UnderwritingCondition[] | undefined
    );

    const response: ApiResponse<unknown> = {
      success: result.success,
      data: result.data,
      error: result.error
        ? {
            code: "WORKFLOW_ERROR",
            message: result.error,
          }
        : undefined,
    };

    res.status(result.success ? 200 : 500).json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "EVENT_PROCESSING_FAILED",
        message: error instanceof Error ? error.message : "Failed to process underwriting decision event",
      },
    };
    res.status(500).json(response);
  }
});

// Handle condition satisfied event
router.post("/events/condition-satisfied", async (req, res) => {
  try {
    const { loanId, conditionId } = req.body;

    if (!loanId || !conditionId) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "MISSING_PARAMS",
          message: "loanId and conditionId are required",
        },
      };
      return res.status(400).json(response);
    }

    const result = await workflow.onConditionSatisfied(loanId, conditionId);

    const response: ApiResponse<unknown> = {
      success: result.success,
      data: result.data,
      error: result.error
        ? {
            code: "WORKFLOW_ERROR",
            message: result.error,
          }
        : undefined,
    };

    res.status(result.success ? 200 : 500).json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "EVENT_PROCESSING_FAILED",
        message: error instanceof Error ? error.message : "Failed to process condition satisfaction event",
      },
    };
    res.status(500).json(response);
  }
});

// Automatically request documents from borrower
router.post("/applications/:loanId/request-documents", async (req, res) => {
  try {
    const { loanId } = req.params;
    const result = await workflow.requestDocuments(loanId);

    const response: ApiResponse<unknown> = {
      success: result.success,
      data: result.data,
      error: result.error
        ? {
            code: "WORKFLOW_ERROR",
            message: result.error,
          }
        : undefined,
    };

    res.status(result.success ? 200 : 500).json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "REQUEST_FAILED",
        message: error instanceof Error ? error.message : "Failed to request documents",
      },
    };
    res.status(500).json(response);
  }
});

// Get workflow status for a loan
router.get("/status/:loanId", async (req, res) => {
  try {
    const { loanId } = req.params;
    const LOAN_SERVICE_URL = process.env.LOAN_SERVICE_URL || "http://localhost:4002";

    const loanResponse = await axios.get(`${LOAN_SERVICE_URL}/api/applications/${loanId}`);
    const loan = loanResponse.data.data;

    if (!loan) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Loan application not found",
        },
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<{
      loanId: string;
      stage: string;
      status: string;
      underwritingDecision?: string;
      conditions?: unknown[];
    }> = {
      success: true,
      data: {
        loanId: loan.id,
        stage: loan.stage,
        status: loan.status,
        underwritingDecision: loan.underwritingDecision,
        conditions: loan.underwritingConditions,
      },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "FETCH_FAILED",
        message: error instanceof Error ? error.message : "Failed to fetch workflow status",
      },
    };
    res.status(500).json(response);
  }
});

export default router;

