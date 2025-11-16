import {Router} from 'express';
import axios from 'axios';
import {loanDb} from './database';
import type {
  LoanApplication,
  ApiResponse,
  PaginatedResponse,
} from '@loan-platform/shared-types';

const WORKFLOW_SERVICE_URL = process.env.WORKFLOW_SERVICE_URL || 'http://localhost:4004';

// Helper function to trigger workflow execution
async function triggerWorkflow(loanId: string): Promise<void> {
  try {
    await axios.post(`${WORKFLOW_SERVICE_URL}/api/execute/${loanId}`);
  } catch (error) {
    // Log error but don't fail the request
    console.error(`Failed to trigger workflow for loan ${loanId}:`, error);
  }
}

const router = Router();

// Create new loan application
router.post('/applications', async (req, res) => {
  try {
    const application: LoanApplication = req.body;
    application.id = `loan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    application.createdAt = new Date().toISOString();
    application.updatedAt = application.createdAt;
    application.status = 'Draft';
    application.stage = 'Draft';

    const created = await loanDb.createLoan(application);

    const response: ApiResponse<LoanApplication> = {
      success: true,
      data: created,
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: 'CREATE_FAILED',
        message:
          error instanceof Error ? error.message : 'Failed to create loan application',
      },
    };
    res.status(500).json(response);
  }
});

// Get loan application by ID
router.get('/applications/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const application = await loanDb.getLoan(id);

    if (!application) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Loan application not found',
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
        code: 'FETCH_FAILED',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch loan application',
      },
    };
    res.status(500).json(response);
  }
});

// Update loan application
router.put('/applications/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const application = await loanDb.getLoan(id);

    if (!application) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Loan application not found',
        },
      };
      return res.status(404).json(response);
    }

    const updated = await loanDb.updateLoan(id, {
      ...req.body,
      updatedAt: new Date().toISOString(),
    });

    const response: ApiResponse<LoanApplication> = {
      success: true,
      data: updated,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: 'UPDATE_FAILED',
        message:
          error instanceof Error ? error.message : 'Failed to update loan application',
      },
    };
    res.status(500).json(response);
  }
});

// Submit loan application to underwriting
router.post('/applications/:id/submit', async (req, res) => {
  try {
    const {id} = req.params;
    const application = await loanDb.getLoan(id);

    if (!application) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Loan application not found',
        },
      };
      return res.status(404).json(response);
    }

    // Update status and stage
    const updated = await loanDb.updateLoan(id, {
      status: 'Submitted',
      stage: 'PreUnderwriting',
      submittedAt: new Date().toISOString(),
    });

    // Trigger workflow to move to underwriting
    triggerWorkflow(id).catch(console.error);

    const response: ApiResponse<LoanApplication> = {
      success: true,
      data: updated,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: 'SUBMIT_FAILED',
        message:
          error instanceof Error ? error.message : 'Failed to submit loan application',
      },
    };
    res.status(500).json(response);
  }
});

// List loan applications (with pagination)
router.get('/applications', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const borrowerId = req.query.borrowerId as string | undefined;
    const status = req.query.status as string | undefined;
    const stage = req.query.stage as string | undefined;

    const result = await loanDb.listLoans({
      borrowerId,
      status,
      stage,
      page,
      pageSize,
    });

    const response: ApiResponse<PaginatedResponse<LoanApplication>> = {
      success: true,
      data: result,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch loan applications',
      },
    };
    res.status(500).json(response);
  }
});

// Get loans ready for broker sign-off (Clear to Close)
router.get('/applications/ready-for-signoff', async (req, res) => {
  try {
    const applications = await loanDb.getLoansReadyForSignOff();

    const response: ApiResponse<LoanApplication[]> = {
      success: true,
      data: applications,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch loans ready for signoff',
      },
    };
    res.status(500).json(response);
  }
});

// Sign off and close loan
router.post('/applications/:id/signoff', async (req, res) => {
  try {
    const {id} = req.params;
    const application = await loanDb.getLoan(id);

    if (!application) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Loan application not found',
        },
      };
      return res.status(404).json(response);
    }

    if (application.stage !== 'ClearToClose') {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: 'INVALID_STAGE',
          message: 'Loan must be in ClearToClose stage to sign off',
        },
      };
      return res.status(400).json(response);
    }

    // Update to Closed stage
    const updated = await loanDb.updateLoan(id, {
      stage: 'Closed',
      status: 'Approved',
      closedAt: new Date().toISOString(),
    });

    const response: ApiResponse<LoanApplication> = {
      success: true,
      data: updated,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: 'SIGNOFF_FAILED',
        message:
          error instanceof Error ? error.message : 'Failed to sign off loan',
      },
    };
    res.status(500).json(response);
  }
});

export default router;

