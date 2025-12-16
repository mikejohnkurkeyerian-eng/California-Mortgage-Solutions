import type { LoanApplication } from "@loan-platform/shared-types";
import axios from "axios";

export interface Lender {
  id: string;
  name: string;
  apiBaseUrl: string;
  apiKey: string;
  apiSecret: string;
  ausProvider: "DU" | "LP" | "Other";
  creditBureauProvider: "Experian" | "Equifax" | "TransUnion" | "TriMerge";
  type: "Institutional" | "Private";
  enabled: boolean;
  // Lender-specific criteria
  minCreditScore?: number;
  maxLoanToValue?: number;
  maxDebtToIncome?: number;
  loanTypes?: string[]; // ["Conventional", "FHA", "VA", etc.]
}

export interface LenderRate {
  lenderId: string;
  lenderName: string;
  rate: number;
  apr: number;
  points: number;
  fees: number;
  lockPeriod: number; // days
  estimatedMonthlyPayment: number;
}

export interface LenderApprovalProbability {
  lenderId: string;
  lenderName: string;
  probability: number; // 0-100
  reasons: string[];
  riskFactors: string[];
}

export interface LenderComparison {
  lender: Lender;
  rate: LenderRate | null;
  approvalProbability: LenderApprovalProbability;
  score: number; // Combined score for AI selection
  recommended: boolean; // AI recommendation
}

/**
 * Fetch rates from a lender's pricing engine
 */
export async function fetchLenderRate(
  lender: Lender,
  loan: LoanApplication
): Promise<LenderRate | null> {
  try {
    console.log(`[AUTOMATED] Fetching rates from lender: ${lender.name}`);

    // In production, this would call the lender's pricing API
    // For demo, we'll simulate rate fetching
    const response = await axios.post(
      `${lender.apiBaseUrl}/api/pricing/quote`,
      {
        loanAmount: loan.property.loanAmount,
        loanType: loan.loanType,
        loanTerm: loan.loanTerm,
        propertyType: loan.property.propertyType,
        loanToValue: loan.loanToValueRatio || loan.property.loanAmount / loan.property.purchasePrice,
        debtToIncome: loan.debtToIncomeRatio || 0,
        creditScore: 720, // Would be pulled from credit report
        state: loan.property.address.state,
      },
      {
        headers: {
          "Authorization": `Bearer ${lender.apiKey}`,
          "X-API-Key": lender.apiKey,
        },
      }
    ).catch(() => {
      // Simulate rate if API is not available
      return null;
    });

    if (response && response.data) {
      return {
        lenderId: lender.id,
        lenderName: lender.name,
        rate: response.data.rate || 6.5,
        apr: response.data.apr || 6.75,
        points: response.data.points || 0,
        fees: response.data.fees || 2500,
        lockPeriod: response.data.lockPeriod || 45,
        estimatedMonthlyPayment: response.data.monthlyPayment || 2500,
      };
    }

    // Simulate rate for demo (would be actual API call in production)
    const baseRate = 6.5;
    const rateAdjustment = Math.random() * 1.0 - 0.5; // ±0.5% variation
    const rate = baseRate + rateAdjustment;
    const monthlyPayment = calculateMonthlyPayment(
      loan.property.loanAmount,
      rate / 100,
      loan.loanTerm
    );

    return {
      lenderId: lender.id,
      lenderName: lender.name,
      rate: parseFloat(rate.toFixed(3)),
      apr: parseFloat((rate + 0.25).toFixed(3)),
      points: 0,
      fees: 2500 + Math.random() * 1000,
      lockPeriod: 45,
      estimatedMonthlyPayment: monthlyPayment,
    };
  } catch (error) {
    console.error(`[AUTOMATED] Failed to fetch rate from ${lender.name}:`, error);
    return null;
  }
}

/**
 * Calculate approval probability for a lender based on loan profile
 */
export function calculateApprovalProbability(
  lender: Lender,
  loan: LoanApplication
): LenderApprovalProbability {
  let probability = 85; // Base probability
  const reasons: string[] = [];
  const riskFactors: string[] = [];

  // Check loan type eligibility
  if (lender.loanTypes && !lender.loanTypes.includes(loan.loanType)) {
    probability = 0;
    reasons.push(`Lender does not offer ${loan.loanType} loans`);
    riskFactors.push(`Loan type mismatch: ${loan.loanType}`);
    return { lenderId: lender.id, lenderName: lender.name, probability, reasons, riskFactors };
  }

  // Check credit score (simulated - would be from credit report)
  const estimatedCreditScore = 720; // Would be pulled from credit report
  if (lender.minCreditScore && estimatedCreditScore < lender.minCreditScore) {
    probability -= 30;
    reasons.push(`Credit score (${estimatedCreditScore}) below lender minimum (${lender.minCreditScore})`);
    riskFactors.push(`Credit score below threshold`);
  } else if (estimatedCreditScore >= 740) {
    probability += 10;
    reasons.push("Excellent credit score (740+)");
  }

  // Check loan-to-value ratio
  const ltv = loan.loanToValueRatio || loan.property.loanAmount / loan.property.purchasePrice;
  if (lender.maxLoanToValue && ltv > lender.maxLoanToValue) {
    probability -= 25;
    reasons.push(`LTV (${(ltv * 100).toFixed(1)}%) exceeds lender maximum (${(lender.maxLoanToValue * 100).toFixed(1)}%)`);
    riskFactors.push(`High LTV ratio`);
  } else if (ltv <= 0.80) {
    probability += 5;
    reasons.push("LTV ratio within optimal range (≤80%)");
  }

  // Check debt-to-income ratio
  const dti = loan.debtToIncomeRatio || 0;
  if (lender.maxDebtToIncome && dti > lender.maxDebtToIncome) {
    probability -= 20;
    reasons.push(`DTI (${(dti * 100).toFixed(1)}%) exceeds lender maximum (${(lender.maxDebtToIncome * 100).toFixed(1)}%)`);
    riskFactors.push(`High debt-to-income ratio`);
  } else if (dti <= 0.36) {
    probability += 5;
    reasons.push("DTI ratio within optimal range (≤36%)");
  }

  // Check employment stability
  if (loan.employment.status === "Employed" && loan.employment.monthlyIncome) {
    probability += 5;
    reasons.push("Stable employment with verified income");
  } else if (loan.employment.status === "SelfEmployed" || loan.employment.status === "BusinessOwner") {
    probability -= 10;
    riskFactors.push("Self-employment requires additional documentation");
    reasons.push("Self-employed borrower (additional documentation required)");
  }

  // Check down payment
  const downPaymentPercent = loan.property.downPayment / loan.property.purchasePrice;
  if (downPaymentPercent >= 0.20) {
    probability += 10;
    reasons.push("Strong down payment (≥20%)");
  } else if (downPaymentPercent < 0.10) {
    probability -= 15;
    riskFactors.push("Low down payment");
    reasons.push("Down payment below 10% may require PMI");
  }

  // Ensure probability is within bounds
  probability = Math.max(0, Math.min(100, probability));

  // Categorize approval likelihood
  if (probability >= 85) {
    reasons.push("High approval likelihood");
  } else if (probability >= 70) {
    reasons.push("Good approval likelihood");
  } else if (probability >= 50) {
    reasons.push("Moderate approval likelihood");
  } else {
    reasons.push("Lower approval likelihood - may require additional conditions");
  }

  return {
    lenderId: lender.id,
    lenderName: lender.name,
    probability,
    reasons,
    riskFactors,
  };
}

/**
 * Calculate monthly payment
 */
function calculateMonthlyPayment(
  principal: number,
  monthlyRate: number,
  loanTermMonths: number
): number {
  if (monthlyRate === 0) {
    return principal / loanTermMonths;
  }
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) /
    (Math.pow(1 + monthlyRate, loanTermMonths) - 1)
  );
}

/**
 * Compare lenders and select the best one using AI logic
 */
export async function compareLendersAndSelectBest(
  lenders: Lender[],
  loan: LoanApplication
): Promise<LenderComparison[]> {
  console.log(`[AUTOMATED] Comparing ${lenders.length} lenders for loan ${loan.id}`);

  const comparisons: LenderComparison[] = [];

  // Fetch rates and calculate approval probabilities for each lender
  for (const lender of lenders) {
    if (!lender.enabled) {
      console.log(`[AUTOMATED] Skipping disabled lender: ${lender.name}`);
      continue;
    }

    const [rate, approvalProbability] = await Promise.all([
      fetchLenderRate(lender, loan),
      Promise.resolve(calculateApprovalProbability(lender, loan)),
    ]);

    // Calculate combined score (rate + approval probability)
    // Lower rate = higher score, higher approval probability = higher score
    let score = 0;

    if (rate) {
      // Rate score (inverse - lower rate is better)
      // Normalize to 0-50 points (assuming rates are 5-8%)
      const rateScore = 50 - ((rate.rate - 5.0) * 10); // 5% = 50pts, 8% = 20pts
      score += Math.max(0, rateScore);
    }

    // Approval probability score (0-50 points)
    score += (approvalProbability.probability / 100) * 50;

    // Bonus points for no risk factors
    if (approvalProbability.riskFactors.length === 0) {
      score += 10;
    }

    comparisons.push({
      lender,
      rate,
      approvalProbability,
      score: Math.round(score * 10) / 10,
      recommended: false,
    });

    console.log(`[AUTOMATED] Lender: ${lender.name}`);
    console.log(`[AUTOMATED]   Rate: ${rate?.rate.toFixed(3)}% (if available)`);
    console.log(`[AUTOMATED]   Approval Probability: ${approvalProbability.probability}%`);
    console.log(`[AUTOMATED]   Score: ${score.toFixed(1)}`);
    console.log(`[AUTOMATED]   Reasons: ${approvalProbability.reasons.join(", ")}`);
  }

  // Sort by score (highest first)
  comparisons.sort((a, b) => b.score - a.score);

  // Select the best lender
  // Priority: 1. Approval probability (if < 50%, skip), 2. Best rate
  let bestLender: LenderComparison | null = null;

  // First, try to find lender with best rate among high-probability approvals
  const highProbabilityLenders = comparisons.filter(c => c.approvalProbability.probability >= 70);
  if (highProbabilityLenders.length > 0) {
    // Among high-probability lenders, pick the one with the best rate
    const sortedByRate = [...highProbabilityLenders].sort((a, b) => {
      if (!a.rate || !b.rate) return 0;
      return a.rate.rate - b.rate.rate;
    });
    bestLender = sortedByRate[0];
  } else {
    // If no high-probability lenders, pick the one with highest approval probability
    // (even if rate is higher, getting approved is more important)
    bestLender = comparisons.find(c => c.approvalProbability.probability >= 50) || comparisons[0];
  }

  // Mark recommended lender
  if (bestLender) {
    bestLender.recommended = true;
    console.log(`[AUTOMATED] ✅ Selected best lender: ${bestLender.lender.name}`);
    console.log(`[AUTOMATED]   Rate: ${bestLender.rate?.rate.toFixed(3)}%`);
    console.log(`[AUTOMATED]   Approval Probability: ${bestLender.approvalProbability.probability}%`);
    console.log(`[AUTOMATED]   Score: ${bestLender.score}`);
    console.log(`[AUTOMATED]   Reasons: ${bestLender.approvalProbability.reasons.join(", ")}`);
  }

  return comparisons;
}

/**
 * Get the recommended lender for a loan
 */
export async function getRecommendedLender(
  lenders: Lender[],
  loan: LoanApplication
): Promise<Lender | null> {
  const comparisons = await compareLendersAndSelectBest(lenders, loan);
  const recommended = comparisons.find(c => c.recommended);
  return recommended?.lender || null;
}

