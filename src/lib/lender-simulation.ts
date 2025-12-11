import { Full1003Data } from '@/types/form-1003';

// --- Gateway Interface (Production Ready) ---
export interface LenderSubmissionResult {
    submissionId: string;
    status: 'Received' | 'Underwriting' | 'Approved' | 'Conditioned' | 'Rejected' | 'Error';
    portalUrl?: string;
    message: string;
    estimatedTurnaroundTime?: string;
}

export interface LenderStatusUpdate {
    submissionId: string;
    status: 'Received' | 'Underwriting' | 'Approved' | 'Conditioned' | 'Rejected';
    updatedAt: string;
    conditions?: string[]; // List of condition descriptions
    comments?: string;
}

export interface LenderGateway {
    submitLoan: (loanId: string, data: Full1003Data, lenderId: string, credentials?: { clientId: string; clientSecret: string }) => Promise<LenderSubmissionResult>;
    checkStatus: (submissionId: string, lenderId: string) => Promise<LenderStatusUpdate>;
}

// --- Simulated Implementation ---

const MOCK_SUBMISSIONS: Record<string, LenderStatusUpdate> = {};

export class SimulatedLenderService implements LenderGateway {

    async submitLoan(loanId: string, data: Full1003Data, lenderId: string, credentials?: { clientId: string; clientSecret: string }): Promise<LenderSubmissionResult> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const submissionId = `SUB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const timestamp = new Date().toISOString();

        // Initial State
        MOCK_SUBMISSIONS[submissionId] = {
            submissionId,
            status: 'Received',
            updatedAt: timestamp,
            comments: credentials
                ? 'Authenticated API submission received via secure gateway.'
                : 'Application received and queued for initial review (Simulated).'
        };

        // Determine behavior based on Lender ID
        const isRocket = lenderId.toLowerCase().includes('rocket');
        const isUWM = lenderId.toLowerCase().includes('uwm');

        return {
            submissionId,
            status: 'Received',
            portalUrl: isRocket ? `https://portal.rocket-sim.com/loans/${loanId}` : `https://easypath.uwm-sim.com/${loanId}`,
            message: credentials
                ? `Successfully submitted to ${isRocket ? 'Rocket Pro TPO' : isUWM ? 'UWM' : 'Lender'} using Broker API Credentials.`
                : `Successfully submitted simulation for ${isRocket ? 'Rocket Pro TPO' : isUWM ? 'UWM' : 'Lender Portal'}.`,
            estimatedTurnaroundTime: isUWM ? '4 Hours' : '24 Hours'
        };
    }

    async checkStatus(submissionId: string, lenderId: string): Promise<LenderStatusUpdate> {
        await new Promise(resolve => setTimeout(resolve, 800)); // Network delay

        const submission = MOCK_SUBMISSIONS[submissionId];
        if (!submission) {
            throw new Error(`Submission ${submissionId} not found`);
        }

        // --- SIMULATION LOGIC ---
        // Advance the status based on time elapsed since creation
        const now = new Date();
        const created = new Date(submission.updatedAt);
        const elapsedSeconds = (now.getTime() - created.getTime()) / 1000;

        // Fast-forward simulation:
        // 0-10s: Received
        // 10-30s: Underwriting
        // 30s+: Approved or Conditioned (Deterministically based on submission ID length even/odd)

        let nextStatus = submission.status;
        let conditions: string[] = [];
        let comments = submission.comments;

        if (elapsedSeconds > 10 && submission.status === 'Received') {
            nextStatus = 'Underwriting';
            comments = 'Underwriter assigned. Reviewing credit and income docs.';
        } else if (elapsedSeconds > 30 && submission.status === 'Underwriting') {
            // Deterministic outcome simulation
            const isConditioned = submissionId.charCodeAt(submissionId.length - 1) % 2 === 0;
            if (isConditioned) {
                nextStatus = 'Conditioned';
                conditions = [
                    'Provide large deposit explanation for $5000 deposit on 01/15',
                    'Updated Paystub needed (must be within 30 days)'
                ];
                comments = 'Conditional Approval issued. Please address findings.';
            } else {
                nextStatus = 'Approved';
                comments = 'Clear to Close! Final approval issued.';
            }
        }

        // Update the mock store safely (in a real app this is DB update)
        if (nextStatus !== submission.status) {
            MOCK_SUBMISSIONS[submissionId] = {
                ...submission,
                status: nextStatus,
                conditions: conditions.length > 0 ? conditions : undefined,
                comments,
                updatedAt: now.toISOString()
            };
        }

        return MOCK_SUBMISSIONS[submissionId];
    }
}

// Export Singleton
export const lenderService = new SimulatedLenderService();
