import { createLoan as createLoanAction, updateLoan as updateLoanAction, getLoans as getLoansAction, getDebugLoans as getDebugLoansAction } from '@/lib/actions/loan';
import { LoanApplication } from '@/types/shared';

// Re-export types
export type { LoanApplication };

export const getLoans = async (): Promise<LoanApplication[]> => {
  try {
    const loans = await getLoansAction();
    if (!Array.isArray(loans)) {
      console.warn('getLoansAction returned non-array:', loans);
      return [];
    }
    return loans as any[];
  } catch (error) {
    console.error('getLoans wrapper error:', error);
    return [];
  }
};

export const getDebugLoans = async () => {
  try {
    return await getDebugLoansAction();
  } catch (error) {
    console.error('getDebugLoans error:', error);
    return [];
  }
};

export const getLoanById = async (id: string): Promise<LoanApplication | undefined> => {
  const loans = await getLoansAction();
  return (loans as any[]).find(l => l.id === id);
};

export const createLoan = async (data: any): Promise<LoanApplication> => {
  const result = await createLoanAction(data);
  if (result.error) throw new Error(result.error);
  return result.loan as any;
};

export const updateLoan = async (id: string, data: any): Promise<LoanApplication> => {
  const result = await updateLoanAction(id, data);
  if (result.error) throw new Error(result.error);
  return result.loan as any;
};

// Keep other mock functions if not yet implemented in backend
export const submitLoanApplication = async (applicationId: string) => {
  console.log(`Submitting application ${applicationId}...`);
  // TODO: Implement server action for submission
  return { success: true, applicationId, status: 'Submitted' };
};

export const approveLoan = async (applicationId: string) => {
  console.log(`Approving application ${applicationId}...`);
  // TODO: Implement server action for approval
  return { success: true, applicationId, status: 'Approved' };
};

export const uploadDocument = async (file: File, type: string) => {
  console.log(`Uploading ${file.name} as ${type}...`);
  return { success: true, fileId: 'doc-' + Math.random().toString(36).substr(2, 9) };
};

export const saveFannieMaeCredentials = async (clientId: string, clientSecret: string) => {
  console.log('Saving Fannie Mae credentials...');
  // TODO: Implement server action
  return { success: true };
};

export const runAUS = async (loanId: string) => {
  console.log(`Running AUS for loan ${loanId}...`);
  // TODO: Implement server action
  return {
    id: 'AUS-' + Math.random().toString(36).substr(2, 9),
    recommendation: 'Approve/Eligible',
    mode: 'Real',
    findings: [
      { severity: 'Info', message: 'Credit score meets requirements.' },
      { severity: 'Info', message: 'DTI is within limits.' }
    ],
    logs: [
      { timestamp: new Date().toISOString(), level: 'SECURE', action: 'Auth', details: 'Authenticated with Fannie Mae' },
      { timestamp: new Date().toISOString(), level: 'INFO', action: 'Analysis', details: 'Completed analysis' }
    ]
  };
};

