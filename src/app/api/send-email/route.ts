import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { to, subject, html, settings, attachments } = body;

        if (!settings) {
            return NextResponse.json({ error: 'No email settings provided' }, { status: 400 });
        }

        let transporter;

        if (settings.provider === 'gmail') {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: settings.smtpUser,
                    pass: settings.smtpPass
                }
            });
        } else if (settings.provider === 'custom_smtp') {
            transporter = nodemailer.createTransport({
                host: settings.smtpHost,
                port: settings.smtpPort || 587,
                secure: settings.smtpPort === 465,
                auth: {
                    user: settings.smtpUser,
                    pass: settings.smtpPass
                }
            });
        } else {
            // Placeholder for API providers (SendGrid/Resend) implementation
            // For now, we only support SMTP/Gmail as requested
            return NextResponse.json({ error: 'Provider not supported yet' }, { status: 400 });
        }

        console.log('Attempting to send email with settings:', {
            provider: settings.provider,
            from: settings.fromEmail,
            to: to,
            hasAttachments: attachments?.length > 0
        });

        const info = await transporter.sendMail({
            from: `"${settings.fromName}" <${settings.fromEmail}>`,
            to,
            subject,
            html,
            attachments: attachments // Pass attachments to nodemailer
        });

        console.log('Message sent: %s', info.messageId);
        return NextResponse.json({ success: true, messageId: info.messageId });

    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

