
import { DocumentRequirement } from '@/context/DocumentContext';
import { UnderwritingResult } from './automated-underwriting';

export interface LoanContext {
    borrowerName: string;
    loanStatus: 'draft' | 'submitted' | 'processing_aus' | 'underwriting' | 'conditions_pending' | 'waiting_for_underwriter' | 'additional_conditions_pending' | 'senior_underwriting' | 'pre_approved' | 'approved' | 'clear_to_close';
    requirements: DocumentRequirement[];
    underwritingResult?: UnderwritingResult | null;
    conditions?: Array<{ id: string; title: string; description: string; type: 'document' | 'explanation' }>;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

const GREETINGS = [
    "Hello! I'm your AI Loan Advisor. How can I help you today?",
    "Hi there! I can answer questions about your loan status, rates, or required documents.",
    "Welcome back! I've analyzed your file. What would you like to know?"
];

const SUGGESTED_QUESTIONS = {
    draft: ["What documents do I need?", "How do I submit my application?", "Is my data secure?"],
    submitted: ["What happens next?", "How long does underwriting take?", "Can I update my documents?"],
    processing_aus: ["What are you analyzing?", "How long will this take?", "What if I get denied?"],
    underwriting: ["What is my current status?", "When will I get a decision?", "What is DTI?"],
    conditions_pending: ["What conditions are outstanding?", "Why do I need a gift letter?", "How do I upload more files?"],
    waiting_for_underwriter: ["What is manual underwriting?", "How long does this review take?", "Do I need to do anything?"],
    additional_conditions_pending: ["What new conditions were added?", "Why do you need more info?", "Can I explain this?"],
    senior_underwriting: ["What is a senior review?", "When will I be clear to close?", "Do I need to do anything?"],
    pre_approved: ["What are my loan options?", "How do I lock my rate?", "What are the closing costs?"],
    approved: ["What are my closing costs?", "How do I lock my rate?", "What is the next step?"],
    clear_to_close: ["When can I sign?", "What do I bring to closing?", "Can I get the keys now?"]
};

export class LoanAdvisorService {
    static getInitialGreeting(context: LoanContext): string {
        // Personalized greeting based on status
        if (context.loanStatus === 'conditions_pending') {
            const missingCount = context.conditions?.length || 0;
            return `Hi ${context.borrowerName}. I see you have ${missingCount} outstanding conditions to address. How can I help you clear them?`;
        }
        if (context.loanStatus === 'pre_approved') {
            return `Congratulations ${context.borrowerName}! You are Pre-Approved. I can help you compare loan options.`;
        }
        if (context.loanStatus === 'approved') {
            return `Congratulations ${context.borrowerName}! Your loan is approved. I can help you understand your closing options.`;
        }
        return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    }

    static getSuggestedQuestions(status: LoanContext['loanStatus']): string[] {
        return SUGGESTED_QUESTIONS[status] || SUGGESTED_QUESTIONS['draft'];
    }

    static async generateResponse(query: string, context: LoanContext): Promise<string> {
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const lowerQuery = query.toLowerCase();

        // 1. Status Questions
        if (lowerQuery.includes('status') || lowerQuery.includes('progress') || lowerQuery.includes('happening')) {
            switch (context.loanStatus) {
                case 'draft':
                    return "Your application is currently in **Draft** mode. You still need to upload the required documents before you can submit it for underwriting.";
                case 'submitted':
                    return "You've successfully **Submitted** your application! It is currently waiting in the queue to be picked up by our automated underwriter.";
                case 'processing_aus':
                    return "I'm currently running a preliminary analysis on your application. This usually takes about 30 seconds.";
                case 'underwriting':
                    return "Your loan is currently being reviewed by our **AI Underwriter**. This process typically takes 2-3 minutes. We are analyzing your income, assets, and credit profile.";
                case 'conditions_pending':
                    return "Your loan has been **Conditionally Approved**, but we need a few more things from you. Please check the 'Outstanding Conditions' section on your dashboard.";
                case 'senior_underwriting':
                    return "Your file has been escalated to a **Senior Underwriter** for final sign-off. We are just double-checking everything.";
                case 'pre_approved':
                    return "You are **Pre-Approved**! This means you meet our initial credit and income requirements. You can now select a specific loan program.";
                case 'approved':
                    return "Great news! Your loan is **Approved** and ready for closing. You can review your final loan options on the 'Loan Options' page.";
                case 'clear_to_close':
                    return "Congratulations! You are **Clear to Close**. This means your loan is fully approved and we are ready to fund.";
            }
        }

        // 2. Metric Questions (Rate, DTI, LTV)
        if (context.underwritingResult) {
            if (lowerQuery.includes('rate') || lowerQuery.includes('interest')) {
                const program = context.underwritingResult.eligiblePrograms[0];
                if (program) {
                    return `Based on your profile, you qualify for a rate of **${program.interestRate}%** (APR ${program.interestRate + 0.125}%). Rates change daily, so I recommend locking this soon.`;
                }
            }
            if (lowerQuery.includes('dti') || lowerQuery.includes('debt')) {
                const dti = context.underwritingResult.metrics.dti.toFixed(1);
                const status = context.underwritingResult.metrics.dti > 43 ? "slightly high" : "excellent";
                return `Your Debt-to-Income (DTI) ratio is **${dti}%**. This is considered ${status}. Lenders typically look for a DTI below 43%.`;
            }
            if (lowerQuery.includes('ltv') || lowerQuery.includes('value')) {
                const ltv = context.underwritingResult.metrics.ltv.toFixed(1);
                return `Your Loan-to-Value (LTV) ratio is **${ltv}%**. This means you are borrowing ${ltv}% of the home's value and putting down ${100 - parseFloat(ltv)}%.`;
            }
        }

        // 3. Document/Condition Questions
        if (lowerQuery.includes('document') || lowerQuery.includes('file') || lowerQuery.includes('upload')) {
            const missing = context.requirements.filter(r => r.status !== 'uploaded');
            if (missing.length > 0) {
                const names = missing.map(r => r.name).join(', ');
                return `You still need to upload the following documents: **${names}**. You can drag and drop them directly onto the dashboard.`;
            }
            return "You have uploaded all the required initial documents! If we need anything else, it will appear in the 'Conditions' section.";
        }

        if (lowerQuery.includes('condition') || lowerQuery.includes('missing')) {
            if (context.conditions && context.conditions.length > 0) {
                const list = context.conditions.map(c => `- ${c.title}`).join('\n');
                return `You have ${context.conditions.length} outstanding conditions:\n${list}\n\nPlease address these to move to Clear to Close.`;
            }
            return "You have no outstanding conditions at this time.";
        }

        // 4. Specific Explanations (Knowledge Base)
        if (lowerQuery.includes('gift letter')) {
            return "A **Gift Letter** is a document signed by the donor (usually a relative) stating that the money given to you for your down payment is a gift, not a loan, and does not need to be repaid.";
        }
        if (lowerQuery.includes('w2') || lowerQuery.includes('tax')) {
            return "We need your **W-2s** and **Tax Returns** to verify your employment history and stable income. This ensures you can comfortably afford the mortgage payments.";
        }
        if (lowerQuery.includes('appraisal')) {
            return "An **Appraisal** is an unbiased professional opinion of a home's value. Lenders require it to ensure the property is worth the amount of the loan.";
        }

        // 5. Fallback
        return "I'm not sure about that specific detail yet. I'm trained to answer questions about your loan status, documents, and mortgage terms. You can also contact your Loan Officer, John Smith, for complex scenarios.";
    }
}
