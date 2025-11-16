import type {LoanApplication, UnderwritingDecision, UnderwritingCondition} from '@shared-types';

export interface UnderwritingResult {
  decision: UnderwritingDecision;
  dti: number;
  ltv: number;
  conditions: UnderwritingCondition[];
  notes: string[];
}

export class UnderwritingCalculator {
  /**
   * Calculate Debt-to-Income (DTI) ratio
   * DTI = (Total Monthly Debt Payments / Gross Monthly Income) * 100
   */
  calculateDTI(loan: LoanApplication): number {
    if (!loan.employment.monthlyIncome || loan.employment.monthlyIncome === 0) {
      return 0;
    }

    const totalMonthlyDebt = loan.debts.reduce(
      (sum, debt) => sum + debt.monthlyPayment,
      0,
    );

    // Add proposed mortgage payment (estimated)
    const monthlyMortgagePayment = this.estimateMonthlyPayment(
      loan.property.loanAmount,
      loan.loanTerm,
      0.065, // 6.5% interest rate estimate
    );

    const totalDebt = totalMonthlyDebt + monthlyMortgagePayment;
    const dti = (totalDebt / loan.employment.monthlyIncome) * 100;

    return Math.round(dti * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Calculate Loan-to-Value (LTV) ratio
   * LTV = (Loan Amount / Property Value) * 100
   */
  calculateLTV(loan: LoanApplication): number {
    if (!loan.property.purchasePrice || loan.property.purchasePrice === 0) {
      return 0;
    }

    const ltv = (loan.property.loanAmount / loan.property.purchasePrice) * 100;
    return Math.round(ltv * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Estimate monthly mortgage payment
   * Using standard amortization formula
   */
  private estimateMonthlyPayment(
    principal: number,
    termMonths: number,
    annualRate: number,
  ): number {
    if (principal === 0 || termMonths === 0) return 0;

    const monthlyRate = annualRate / 12;
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);

    return Math.round(payment * 100) / 100;
  }

  /**
   * Evaluate loan application and make underwriting decision
   */
  evaluateLoan(loan: LoanApplication): UnderwritingResult {
    const dti = this.calculateDTI(loan);
    const ltv = this.calculateLTV(loan);
    const conditions: UnderwritingCondition[] = [];
    const notes: string[] = [];

    // DTI Rules
    if (dti > 50) {
      conditions.push({
        id: `cond-${Date.now()}-1`,
        loanId: loan.id,
        type: 'PriorToDoc',
        description: 'DTI ratio exceeds 50%. Provide explanation or additional income documentation.',
        status: 'Pending',
        createdAt: new Date().toISOString(),
      });
      notes.push(`High DTI ratio: ${dti}%`);
    } else if (dti > 43) {
      conditions.push({
        id: `cond-${Date.now()}-2`,
        loanId: loan.id,
        type: 'PriorToDoc',
        description: 'DTI ratio is between 43-50%. Additional reserves may be required.',
        status: 'Pending',
        createdAt: new Date().toISOString(),
      });
      notes.push(`DTI ratio: ${dti}% (acceptable but high)`);
    }

    // LTV Rules
    if (ltv > 80 && loan.loanType === 'Conventional') {
      conditions.push({
        id: `cond-${Date.now()}-3`,
        loanId: loan.id,
        type: 'PriorToDoc',
        description: 'LTV exceeds 80%. Private Mortgage Insurance (PMI) required.',
        status: 'Pending',
        createdAt: new Date().toISOString(),
      });
      notes.push(`LTV ratio: ${ltv}% (PMI required)`);
    } else if (ltv > 90) {
      conditions.push({
        id: `cond-${Date.now()}-4`,
        loanId: loan.id,
        type: 'PriorToDoc',
        description: 'LTV exceeds 90%. Additional documentation and reserves required.',
        status: 'Pending',
        createdAt: new Date().toISOString(),
      });
      notes.push(`High LTV ratio: ${ltv}%`);
    }

    // Employment Rules
    if (loan.employment.status === 'SelfEmployed' || loan.employment.status === 'BusinessOwner') {
      // Check if tax returns are uploaded
      const hasTaxReturns = loan.documents.some(
        doc => doc.type === 'TaxReturn' || doc.type === 'BusinessTaxReturn',
      );
      if (!hasTaxReturns) {
        conditions.push({
          id: `cond-${Date.now()}-5`,
          loanId: loan.id,
          type: 'PriorToDoc',
          description: 'Tax returns required for self-employed borrowers (2 years).',
          status: 'Pending',
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Income Rules
    if (!loan.employment.monthlyIncome || loan.employment.monthlyIncome < 2000) {
      conditions.push({
        id: `cond-${Date.now()}-6`,
        loanId: loan.id,
        type: 'PriorToDoc',
        description: 'Monthly income appears insufficient. Provide additional income documentation or explanation.',
        status: 'Pending',
        createdAt: new Date().toISOString(),
      });
      notes.push('Low monthly income');
    }

    // Document Completeness
    const requiredDocs = ['DriverLicense', 'PayStub', 'W2', 'BankStatement'];
    const missingDocs = requiredDocs.filter(
      docType => !loan.documents.some(doc => doc.type === docType),
    );

    if (missingDocs.length > 0) {
      conditions.push({
        id: `cond-${Date.now()}-7`,
        loanId: loan.id,
        type: 'PriorToDoc',
        description: `Missing required documents: ${missingDocs.join(', ')}`,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      });
    }

    // Make Decision
    let decision: UnderwritingDecision = 'Approved';

    // Reject if DTI too high
    if (dti > 55) {
      decision = 'Rejected';
      notes.push('DTI ratio exceeds maximum threshold (55%)');
    }
    // Reject if LTV too high for conventional
    else if (ltv > 95 && loan.loanType === 'Conventional') {
      decision = 'Rejected';
      notes.push('LTV ratio too high for conventional loan');
    }
    // Conditional if there are conditions
    else if (conditions.length > 0) {
      decision = 'Conditional';
      notes.push(`${conditions.length} condition(s) must be satisfied`);
    }
    // Approved if all checks pass
    else {
      decision = 'Approved';
      notes.push('Loan meets all underwriting criteria');
    }

    return {
      decision,
      dti,
      ltv,
      conditions,
      notes,
    };
  }
}

