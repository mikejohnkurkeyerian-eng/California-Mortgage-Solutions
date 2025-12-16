import * as crypto from 'crypto';

// Use a consistent key for the demo. In production, this should be an environment variable.
// Generating a 32-byte key from a fixed secret for reproducibility in this environment.
const SECRET_KEY = crypto.scryptSync('loan-platform-secret-key', 'salt', 32);
const ALGORITHM = 'aes-256-gcm';

export interface EncryptedData {
    iv: string;
    content: string;
    authTag: string;
}

export class SecurityService {
    /**
     * Encrypts a text string using AES-256-GCM
     */
    static encrypt(text: string): EncryptedData {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        return {
            iv: iv.toString('hex'),
            content: encrypted,
            authTag: authTag.toString('hex')
        };
    }

    /**
     * Decrypts text using AES-256-GCM
     */
    static decrypt(encrypted: EncryptedData): string {
        const decipher = crypto.createDecipheriv(
            ALGORITHM,
            SECRET_KEY,
            Buffer.from(encrypted.iv, 'hex')
        );

        decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));

        let decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    /**
     * Masks a string, showing only the last 4 characters
     */
    static mask(text: string): string {
        if (!text || text.length <= 4) return '****';
        return '*'.repeat(text.length - 4) + text.slice(-4);
    }
}
