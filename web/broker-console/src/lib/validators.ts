import { z } from 'zod';

export const COMMON_TYPOS: Record<string, string> = {
    'gmil.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gmaill.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'gail.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmali.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'yaho.com': 'yahoo.com',
    'yahooo.com': 'yahoo.com',
    'yhoo.com': 'yahoo.com',
    'hotmal.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'iclod.com': 'icloud.com'
};

export const BLOCKED_DOMAINS = [
    'test.com',
    'example.com',
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'throwawaymail.com',
    'yopmail.com'
];

export interface ValidationResult {
    isValid: boolean;
    error?: string;
    suggestion?: string;
}

export function validateEmail(email: string): ValidationResult {
    if (!email) return { isValid: false, error: 'Email is required' };

    const lowerEmail = email.toLowerCase().trim();

    // 1. Basic Structure Check (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(lowerEmail)) {
        return { isValid: false, error: 'Invalid email format' };
    }

    const [localPart, domain] = lowerEmail.split('@');

    // 2. Blocked Domains
    if (BLOCKED_DOMAINS.includes(domain)) {
        return { isValid: false, error: 'Please use a valid, permanent email address.' };
    }

    // 3. Fake "Test" Patterns
    if (localPart === 'test' || localPart === 'user' || localPart === 'admin' || localPart === 'demo') {
        if (domain === 'gmail.com' || domain === 'yahoo.com' || domain === 'hotmail.com') {
            // Let generic names pass on real domains if they own them, but maybe flag?
            // For now, strict block on test@test.com logic
        }
        if (domain === 'test.com') {
            return { isValid: false, error: 'Please use a real email address.' };
        }
    }

    // 4. Typo Detection
    if (COMMON_TYPOS[domain]) {
        return {
            isValid: false,
            error: `Did you mean ${COMMON_TYPOS[domain]}?`,
            suggestion: `${localPart}@${COMMON_TYPOS[domain]}`
        };
    }

    return { isValid: true };
}

// Zod Schema Helper
export const emailSchema = z.string().email().superRefine((val, ctx) => {
    const result = validateEmail(val);
    if (!result.isValid) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: result.error,
        });
    }
});
