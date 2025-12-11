import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;

if (apiKey) {
    if (!apiKey.startsWith('SG.')) {
        console.warn('WARNING: SENDGRID_API_KEY does not start with "SG.". Email sending may fail.');
    }
    sgMail.setApiKey(apiKey);
} else {
    console.warn('NOTICE: SENDGRID_API_KEY not found. Emails will be logged to console (Mock Mode).');
}

export interface EmailAttachment {
    content: string; // Base64
    filename: string;
    type: string;
    disposition?: 'attachment' | 'inline';
    contentId?: string;
}

export interface EmailPayload {
    to: string;
    from?: string; // default to configured sender
    subject: string;
    html: string;
    attachments?: EmailAttachment[];
}

export const sendEmail = async (payload: EmailPayload) => {
    // 1. Mock Mode (No Key)
    if (!apiKey) {
        console.log('--- MOCK EMAIL SENT ---');
        console.log(`To: ${payload.to}`);
        console.log(`Subject: ${payload.subject}`);
        console.log(`Attachments: ${payload.attachments?.length || 0}`);
        console.log('-----------------------');
        return { success: true, mock: true };
    }

    // 2. Real Mode (SendGrid)
    try {
        const msg = {
            to: payload.to,
            from: payload.from || 'noreply@mortgage-platform.com', // Replace with verified sender in production
            subject: payload.subject,
            html: payload.html,
            attachments: payload.attachments
        };

        const response = await sgMail.send(msg);
        console.log(`Email sent to ${payload.to}. StatusCode: ${response[0].statusCode}`);
        return { success: true, mock: false, response: response[0] };
    } catch (error: any) {
        console.error('SendGrid Error:', error);
        if (error.response) {
            console.error(error.response.body);
        }
        return { success: false, error: error.message };
    }
};

