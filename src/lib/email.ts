import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendFactoryStatusEmail(email: string, status: string, name: string, rejectionReason?: string | null) {
  const subject = status === 'APPROVED' 
    ? 'Your Factory Profile has been Approved!' 
    : 'Update on Your Factory Profile Application';
    
  const html = status === 'APPROVED'
    ? `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2>Congratulations!</h2>
        <p>Dear ${name},</p>
        <p>Your factory profile has been successfully <strong>APPROVED</strong> on the Mahalla Cluster platform.</p>
        <p>You can now start listing products, raw materials, and posting jobs.</p>
        <p>Best regards,<br/>The Mahalla Cluster Team</p>
      </div>`
    : `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2>Application Update</h2>
        <p>Dear ${name},</p>
        <p>We have reviewed your factory profile application. Unfortunately, it has been <strong>REJECTED</strong>.</p>
        ${rejectionReason ? `<p><strong>Reason provided by the admin:</strong></p><blockquote style="background:#f9f9f9;border-left:4px solid #ef4444;padding:10px;">${rejectionReason}</blockquote>` : ''}
        <p>Please log in to your dashboard to make the necessary corrections and resubmit.</p>
        <p>Best regards,<br/>The Mahalla Cluster Team</p>
      </div>`;

  if (resend) {
    try {
      await resend.emails.send({
        from: 'Mahalla Cluster <noreply@mahalla-cluster.com>',
        to: email,
        subject,
        html,
      });
    } catch (error) {
      console.error('Failed to send email via Resend:', error);
    }
  } else {
    // Development fallback
    console.log('\n--- MOCK EMAIL SENT ---');
    console.log(`To: ${email}\nSubject: ${subject}\nBody: ${html.replace(/<[^>]*>?/gm, '')}`);
    console.log('-----------------------\n');
  }
}
