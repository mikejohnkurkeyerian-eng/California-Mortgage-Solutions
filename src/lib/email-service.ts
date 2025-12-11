import { DocumentRequirement } from '@/context/DocumentContext';
import { Underwriter, EmailSettings } from '@/context/BrokerContext';

export interface EmailPackage {
    to: string;
    subject: string;
    body: string;
    attachments: string[]; // List of filenames
}

export const EmailService = {
    async sendUnderwritingPackage(
        loanId: string,
        documents: DocumentRequirement[],
        recipient: { name: string; email: string },
        emailSettings?: EmailSettings
    ): Promise<boolean> {
        console.log(`[EmailService] Preparing underwriting package for Loan ${loanId}...`);

        // Filter for uploaded documents and prepare attachments
        const uploadedDocs = documents.filter(d => d.status === 'uploaded' || d.status === 'verified');

        const attachments = await Promise.all(uploadedDocs.flatMap(d => d.files.map(async f => {
            if (f.file) {
                const arrayBuffer = await f.file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                return {
                    filename: f.name,
                    content: buffer.toString('base64'),
                    encoding: 'base64'
                };
            }
            return null;
        })));

        // Filter out nulls (files without content)
        const validAttachments = attachments.filter(a => a !== null) as { filename: string; content: string }[];

        const emailPackage: EmailPackage = {
            to: recipient.email,
            subject: `New Loan Submission: Loan #${loanId}`,
            body: `
                Dear ${recipient.name},

                A new loan application has been submitted and requires underwriting review.

                Loan ID: ${loanId}
                Total Documents: ${uploadedDocs.length}
                
                The following documents are attached for your review:
                ${uploadedDocs.map(d => `- ${d.name} (${d.files.length} file${d.files.length > 1 ? 's' : ''})`).join('\n                ')}

                Please review the attached documents and provide your decision.

                Best regards,
                ${emailSettings?.fromName || 'Broker Console Bot'}
            `,
            attachments: [] // We pass the real attachments separately in the API call
        };

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('---------------------------------------------------');
        if (emailSettings) {
            console.log(`🚀 SENDING VIA ${emailSettings.provider.toUpperCase()}`);

            try {
                console.log('Sending email request to API...', { to: emailPackage.to, attachmentCount: validAttachments.length });

                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: emailPackage.to,
                        subject: emailPackage.subject,
                        html: emailPackage.body.replace(/\n/g, '<br>'), // Simple text to HTML conversion
                        attachments: validAttachments, // Send the attachments
                        settings: emailSettings
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Email API failed:', errorData);
                    return false;
                }

                console.log('Email sent successfully via API');
                return true;
            } catch (error) {
                console.error('❌ Error calling email API:', error);
                return false;
            }

        } else {
            console.log('⚠️  USING DEFAULT SIMULATION (No Email Configured)');
        }

        console.log('📧 EMAIL SENT SUCCESSFULLY');
        console.log(`To: ${emailPackage.to}`);
        console.log(`Subject: ${emailPackage.subject}`);
        console.log(`Attachments: ${emailPackage.attachments.join(', ')}`);
        console.log('---------------------------------------------------');

        return true;
    },
    async sendInvitation(
        brokerName: string,
        brokerId: string,
        recipientEmail: string,
        inviteLink: string,
        emailSettings?: EmailSettings
    ): Promise<boolean> {
        console.log(`[EmailService] Sending invitation from ${brokerName} to ${recipientEmail}...`);

        // Construct Body
        const body = `
            Hello,

            I'm ${brokerName}, and I'd like to invite you to start your mortgage application using our secure portal.

            Please click the link below to get started:
            ${inviteLink}

            If you have any questions, feel free to reply to this email.

            Best regards,
            ${brokerName}
        `;

        if (emailSettings?.provider) {
            try {
                // Use the API route which handles real email providers
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: recipientEmail,
                        subject: `Invitation to Apply for a Home Loan with ${brokerName}`,
                        html: body.replace(/\n/g, '<br>'),
                        settings: emailSettings
                    })
                });
                return response.ok;
            } catch (error) {
                console.error('Failed to send invitation:', error);
                return false;
            }
        } else {
            // Simulation
            console.log(`\n📧 SIMULATED INVITATION SENT 📧`);
            console.log(`To: ${recipientEmail}`);
            console.log(`Link: ${inviteLink}`);
            console.log(`From: ${brokerName}`);
        }
        return true;
    }
};

