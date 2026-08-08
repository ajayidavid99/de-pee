// src/libs/email.ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, url: string) {
  return await resend.emails.send({
    from: 'De-Pee Support <noreply@mail.depeeventures.com>',
    to: email,
    subject: 'Reset your password',
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${url}" style="background-color: #000; color: #fff; padding: 10px 18px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 12px 0;">Reset Password</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}