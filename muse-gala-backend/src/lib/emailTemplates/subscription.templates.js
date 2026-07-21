// ✅ Subscription Email Templates
import { baseEmailTemplate, createInfoBox, createStatusBadge } from './baseTemplate.js';

/**
 * Template for lender when subscription is activated (free or paid)
 */
export const subscriptionActivatedTemplate = (
  lenderName,
  planName
) =>
  baseEmailTemplate({
    title: 'SUBSCRIPTION ACTIVATED',

    content: `
      <p>Hi ${lenderName},</p>
      <p>Your subscription is now active.</p>
      <p><strong>Plan:</strong> ${planName}</p>
      <p>You can manage your subscription from your dashboard at any time.</p>
      <p>— Muse Gala</p>
    `,
    buttonText: 'GO TO DASHBOARD',
    buttonUrl: process.env.LENDER_FRONTEND_URL || 'https://lender.musegala.com.au',
  });

/**
 * Template for lender when subscription payment is successful (paid plan)
 */
export const subscriptionPaymentConfirmationTemplate = (
  lenderName,
  planName,
  amount,
  currency,
  paymentId,
  invoiceDate
) =>
  baseEmailTemplate({
    title: 'PAYMENT SUCCESSFUL',

    content: `
      <p>Hi ${lenderName},</p>
      <p>Your subscription payment has been processed successfully.</p>
      <div style="margin: 20px 0;">
        ${createStatusBadge('Paid ✓', 'success')}
      </div>
      <div style="background-color: #000; color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="font-size: 28px; font-weight: bold; margin: 0; color: #fff;">$${amount.toFixed(2)} ${currency}</p>
      </div>
      ${createInfoBox({
      'Plan': planName,
      'Amount': `$${amount.toFixed(2)} ${currency}`,
      'Payment ID': paymentId,
      'Invoice Date': invoiceDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    })}
      <p><strong>Next Steps:</strong> Your subscription is now active and you have full access to all premium features. You can manage your subscription settings in your account dashboard at any time.</p>
      <p>Thank you for choosing Muse Gala!</p>
    `,
  });

/**
 * Template for lender when subscription payment fails
 */
export const subscriptionPaymentFailedTemplate = (
  lenderName,
  planName,
  amount,
  currency,
  errorReason
) =>
  baseEmailTemplate({
    title: 'PAYMENT FAILED',

    content: `
      <p>Hi ${lenderName},</p>
      <p>Unfortunately, we were unable to process your subscription payment. Please review the details below and try again.</p>
      <div style="margin: 20px 0;">
        ${createStatusBadge('Failed', 'error')}
      </div>
      ${createInfoBox({
      'Plan': planName,
      'Amount': `$${amount.toFixed(2)} ${currency}`,
    })}
      <div class="info-box">
        <p><strong>Reason for Failure:</strong></p>
        <p>${errorReason}</p>
        <p class="text-muted text-small">Common reasons: Insufficient funds, expired card, or incorrect details. Please update your payment method and try again.</p>
      </div>
      <p>If you continue to experience issues, please contact our support team for assistance.</p>
      <p class="text-muted text-small">Your subscription will not be active until payment is successful.</p>
    `,
    buttonText: 'RETRY PAYMENT',
    buttonUrl: `${process.env.LENDER_FRONTEND_URL}/subscription/checkout`,
  });

/**
 * Template for lender when subscription checkout expires
 */
export const subscriptionCheckoutExpiredTemplate = (
  lenderName
) =>
  baseEmailTemplate({
    title: 'CHECKOUT SESSION EXPIRED',

    content: `
      <p>Hi ${lenderName},</p>
      <p>Your checkout session has expired.</p>
      <p>You can start again from your dashboard at any time.</p>
      <p>— Muse Gala</p>
    `,
    buttonText: 'GO TO DASHBOARD',
    buttonUrl: `${process.env.LENDER_FRONTEND_URL}/subscription-plans`,
  });

/**
 * Template for lender when subscription is refunded
 */
export const subscriptionRefundedTemplate = (
  lenderName,
  planName,
  refundAmount
) =>
  baseEmailTemplate({
    title: 'REFUND PROCESSED',

    content: `
      <p>Hi ${lenderName},</p>
      <p>Your subscription refund has been processed.</p>
      <p><strong>Amount:</strong> $${refundAmount}</p>
      <p>— Muse Gala</p>
    `,
  });

/**
 * Template for lender when subscription is expiring soon
 */
export const subscriptionExpiringTemplate = (
  lenderName,
  planName,
  daysRemaining,
  expiryDate
) => {
  const formattedExpiry = new Date(expiryDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return baseEmailTemplate({
    title: 'YOUR SUBSCRIPTION IS EXPIRING',

    content: `
      <p>Hi ${lenderName},</p>
      <p>Your subscription will expire soon.</p>
      <p>To avoid interruption, please renew before ${formattedExpiry}.</p>
      <p>— Muse Gala</p>
    `,
    buttonText: 'RENEW SUBSCRIPTION',
    buttonUrl: `${process.env.LENDER_FRONTEND_URL}/subscription/renew`,
  });
};
