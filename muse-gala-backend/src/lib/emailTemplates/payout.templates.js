// ✅ Payout Email Templates
import { baseEmailTemplate, createInfoBox, createStatusBadge } from './baseTemplate.js';

/**
 * Template for lender when payout request is created
 */
export const payoutRequestCreatedTemplate = (lenderName, requestedAmount) =>
  baseEmailTemplate({
    title: 'PAYOUT REQUEST RECEIVED',

    content: `
      <p>Hi ${lenderName},</p>
      <p>Your payout request has been received and is pending approval.</p>
      ${createInfoBox({
      Amount: `$${requestedAmount}`,
    })}
      <p>We’ll notify you once it’s processed.</p>
    `,
  });

/**
 * Template for admin when new payout request is received
 */
export const payoutRequestReceivedTemplate = (lenderName, bookingId, requestedAmount) =>
  baseEmailTemplate({
    title: 'NEW PAYOUT REQUEST',

    content: `
      <p>A new payout request is ready for review.</p>
      ${createInfoBox({
      Lender: lenderName,
      'Booking ID': bookingId,
      'Payout amount': `$${requestedAmount}`,
    })}
    `,
  });

/**
 * Template for lender when payout is successfully transferred
 */
export const payoutTransferredTemplate = (lenderName, transferredAmount) =>
  baseEmailTemplate({
    title: 'PAYOUT COMPLETED',

    content: `
      <p>Hi ${lenderName},</p>
      <p>Your payout has been transferred successfully.</p>
      ${createInfoBox({
      Amount: `$${transferredAmount}`,
    })}
      <p>Funds typically arrive within 2–5 business days.</p>
    `,
  });

/**
 * Template for lender and admin when payout transfer fails
 */
export const payoutFailedTemplate = (recipientName) =>
  baseEmailTemplate({
    title: 'PAYOUT ISSUE',

    content: `
      <p>Hi ${recipientName},</p>
      <p>We were unable to process your payout.</p>
      <p>Please review your payment details and try again.</p>
    `,
  });
