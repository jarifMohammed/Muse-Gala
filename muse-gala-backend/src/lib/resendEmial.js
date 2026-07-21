import { Resend } from "resend";

/**
 * Generic email sender utility
 */
export const sendEmail = async ({ to, subject, html }) => {
  // Initialize inside function to guarantee env vars are loaded
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddr = process.env.EMAIL_FROM;

  // Debug: log config on every call
  console.log(`[sendEmail] RESEND_API_KEY=${apiKey ? `${apiKey.slice(0, 8)}...` : 'MISSING'}`);
  console.log(`[sendEmail] EMAIL_FROM=${fromAddr || 'MISSING'}`);
  console.log(`[sendEmail] TO=${to} | SUBJECT="${subject}"`);

  if (!apiKey) {
    console.error('[sendEmail] ❌ RESEND_API_KEY is not set in environment!');
    throw new Error('RESEND_API_KEY is missing');
  }

  if (!fromAddr) {
    console.error('[sendEmail] ❌ EMAIL_FROM is not set in environment!');
    throw new Error('EMAIL_FROM is missing');
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromAddr,
      to,
      subject,
      html,
    });

    if (error) {
      console.error(`[sendEmail] ❌ Resend rejected email to [${to}]:`, JSON.stringify(error));
      throw new Error(`Resend rejected: ${error.message || JSON.stringify(error)}`);
    }

    console.log(`[sendEmail] ✅ Resend accepted email to [${to}], id=${data?.id}`);
    return { success: true, data };
  } catch (err) {
    console.error(`[sendEmail] ❌ Error sending to [${to}]:`, err.message);
    throw new Error(err.message || "Failed to send email");
  }
};

