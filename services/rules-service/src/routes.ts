import {Router} from 'express';
import axios from 'axios';
import {UnderwritingCalculator} from './calculators';
import type {
  LoanApplication,
  ApiResponse,
  UnderwritingDecision,
  UnderwritingCondition,
} from '@shared-types';

const router = Router();
const calculator = new UnderwritingCalculator();

const LOAN_SERVICE_URL = process.env.LOAN_SERVICE_URL || 'http://localhost:4002';
const WORKFLOW_SERVICE_URL =
  process.env.WORKFLOW_SERVICE_URL || 'http://localhost:4004';

// Calculate DTI for a loan
router.post('/calculate/dti', async (req, res) => {
  try {
    const {loanId} = req.body;

    if (!loanId) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: 'MISSING_PARAMS',
          message: 'loanId is required',
        },
      };
      return res.status(400).json(response);
    }

    // Fetch loan
    const loanResponse = await axios.get(
      `${LOAN_SERVICE_URL}/api/applications/${loanId}`,
    );
    const loan: LoanApplication = loanResponse.data.data;

    if (!loan) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Loan application not found',
        },
      };
      return res.status(404).json(response);
    }

    const dti = calculator.calculateDTI(loan);

    const response: ApiResponse<{dti: number}> = {
      success: true,
      data: {dti},
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: 'CALCULATION_FAILED',
        message:
          error instanceof Error ? error.message : 'Failed to calculate DTI',
      },
    };
    res.status(500).json(response);
  }
});

// Calculate LTV for a loan
router.post('/calculate/ltv', async (req, res) => {
  try {
    const {loanId} = req.body;

    if (!loanId) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: 'MISSING_PARAMS',
          message: 'loanId is required',
        },
      };
      return res.status(400).json(response);
    }

    // Fetch loan
    const loanResponse = await axios.get(
      `${LOAN_SERVICE_URL}/api/applications/${loanId}`,
    );
    const loan: LoanApplication = loanResponse.data.data;

    if (!loan) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Loan application not found',
        },
      };
      return res.status(404).json(response);
    }

    const ltv = calculator.calculateLTV(loan);

    const response: ApiResponse<{ltv: number}> = {
      success: true,
      data: {ltv},
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: 'CALCULATION_FAILED',
        message:
          error instanceof Error ? error.message : 'Failed to calculate LTV',
      },
    };
    res.status(500).json(response);
  }
});

// Evaluate loan and make underwriting decision
router.post('/evaluate', async (req, res) => {
  try {
    const {loanId} = req.body;

    if (!loanId) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: 'MISSING_PARAMS',
          message: 'loanId is required',
        },
      };
      return res.status(400).json(response);
    }

    // Fetch loan
    const loanResponse = await axios.get(
      `${LOAN_SERVICE_URL}/api/applications/${loanId}`,
    );
    const loan: LoanApplication = loanResponse.data.data;

    if (!loan) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Loan application not found',
        },
      };
      return res.status(404).json(response);
    }

    // Evaluate loan
    const result = calculator.evaluateLoan(loan);

    // Update loan with decision
    await axios.put(`${LOAN_SERVICE_URL}/api/applications/${loanId}`, {
      underwritingDecision: result.decision,
      underwritingConditions: result.conditions,
      debtToIncomeRatio: result.dti,
      loanToValueRatio: result.ltv,
    });

    // Trigger workflow to process decision
    await axios.post(`${WORKFLOW_SERVICE_URL}/api/events/underwriting-decision`, {
      loanId,
      decision: result.decision,
      conditions: result.conditions,
    });

    const response: ApiResponse<{
      decision: UnderwritingDecision;
      dti: number;
      ltv: number;
      conditions: UnderwritingCondition[];
      notes: string[];
    }> = {
      success: true,
      data: result,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: 'EVALUATION_FAILED',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to evaluate loan application',
      },
    };
    res.status(500).json(response);
  }
});

export default router;

