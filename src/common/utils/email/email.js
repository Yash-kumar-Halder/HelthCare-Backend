import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
    if (transporter) {
        return transporter;
    }

    if (process.env.NODE_ENV === 'production') {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    return transporter;
}

export async function sendEmail({ to, subject, html }) {
    if (process.env.NODE_ENV !== 'production') {
        console.log('--- DEV EMAIL ---');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${html}`);
        console.log('--- END DEV EMAIL ---');
        return;
    }

    const t = getTransporter();
    if (!t) {
        console.error('Email transporter not configured');
        return;
    }

    await t.sendMail({
        from: process.env.SMTP_FROM || 'noreply@helthstack.com',
        to,
        subject,
        html,
    });
}

export function buildVerificationEmail(to, token) {
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const link = `${baseUrl}/verify-email?token=${token}`;

    return {
        to,
        subject: 'Verify your email - HelthStack',
        html: `
            <h2>Welcome to HelthStack!</h2>
            <p>Click the link below to verify your email address:</p>
            <a href="${link}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
                Verify Email
            </a>
            <p>This link expires in 24 hours.</p>
            <p>If you didn't create an account, ignore this email.</p>
        `,
    };
}
