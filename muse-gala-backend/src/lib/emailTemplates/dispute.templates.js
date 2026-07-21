// ✅ Dispute Email Templates
import { baseEmailTemplate, createInfoBox, createStatusBadge } from './baseTemplate.js';

export const disputeCreatedTemplate = (userName, bookingId, brandName, dressName, colour, dressSize) =>
  baseEmailTemplate({
    title: 'DISPUTE CREATED',

    content: `
      <p>Hi ${userName},</p>
      <p>A dispute has been opened for your booking.</p>
      ${createInfoBox({
      'Booking ID': bookingId,
      'Brand': brandName || 'N/A',
      'Dress': dressName || 'N/A',
      'Colour': colour || 'N/A',
      'Size': dressSize || 'N/A',
      'Status': 'Under review',
    })}
      <p>We’ll keep you updated as we review the details.</p>
    `,
  });

export const disputeUnderReviewTemplate = (userName, bookingId, brandName, dressName, colour, dressSize) =>
  baseEmailTemplate({
    title: 'DISPUTE UNDER REVIEW',

    content: `
      <p>Hi ${userName},</p>
      <p>Your dispute is currently being reviewed by our team.</p>
      ${createInfoBox({
      'Booking ID': bookingId,
      'Brand': brandName || 'N/A',
      'Dress': dressName || 'N/A',
      'Colour': colour || 'N/A',
      'Size': dressSize || 'N/A',
    })}
      <p>We’ll be in touch once a decision has been reached.</p>
    `,
  });

export const disputeMoreInfoNeededTemplate = (userName, bookingId, brandName, dressName, colour, dressSize) =>
  baseEmailTemplate({
    title: 'ADDITIONAL INFORMATION REQUIRED',

    content: `
      <p>Hi ${userName},</p>
      <p>We need a little more information to continue reviewing your dispute.</p>
      ${createInfoBox({
      'Booking ID': bookingId,
      'Brand': brandName || 'N/A',
      'Dress': dressName || 'N/A',
      'Colour': colour || 'N/A',
      'Size': dressSize || 'N/A',
    })}
      <p>Please log in to your account to provide the requested details.</p>
    `,
    buttonText: 'PROVIDE DETAILS',
    buttonUrl: process.env.FRONTEND_URL || 'https://musegala.com.au',
  });

export const disputeEscalatedTemplate = (userName, bookingId, brandName, dressName, colour, dressSize) =>
  baseEmailTemplate({
    title: 'DISPUTE ESCALATED',

    content: `
      <p>Hi ${userName},</p>
      <p>Your dispute has been escalated for further review.</p>
      ${createInfoBox({
      'Booking ID': bookingId,
      'Brand': brandName || 'N/A',
      'Dress': dressName || 'N/A',
      'Colour': colour || 'N/A',
      'Size': dressSize || 'N/A',
    })}
      <p>A senior team member will be in touch.</p>
    `,
  });

export const disputeResolvedTemplate = (userName, bookingId, resolution, refundAmount, brandName, dressName, colour, dressSize) =>
  baseEmailTemplate({
    title: 'DISPUTE RESOLVED',

    content: `
      <p>Hi ${userName},</p>
      <p>Your dispute has been reviewed and resolved.</p>
      ${createInfoBox({
      'Booking ID': bookingId,
      'Outcome': resolution,
      'Refund amount': refundAmount ? `$${refundAmount}` : '$0.00',
      'Brand': brandName || 'N/A',
      'Dress': dressName || 'N/A',
      'Colour': colour || 'N/A',
      'Size': dressSize || 'N/A',
    })}
      <p>If you have any questions, we’re here to help.</p>
    `,
  });

export const refundProcessedTemplate = (userName, bookingId, refundAmount, brandName, dressName, colour, dressSize) =>
  baseEmailTemplate({
    title: 'REFUND PROCESSED',

    content: `
      <p>Hi ${userName},</p>
      <p>Your refund has been processed successfully.</p>
      ${createInfoBox({
      'Booking ID': bookingId,
      'Amount': `$${refundAmount}`,
      'Brand': brandName || 'N/A',
      'Dress': dressName || 'N/A',
      'Colour': colour || 'N/A',
      'Size': dressSize || 'N/A',
    })}
      <p>Funds typically appear within 3–5 business days.</p>
    `,
  });

export const disputeResponseTemplate = (userName, bookingId) =>
  baseEmailTemplate({
    title: 'DISPUTE UPDATE',

    content: `
      <p>Hi ${userName},</p>
      <p>There’s a new update on your dispute.</p>
      ${createInfoBox({
      'Booking ID': bookingId,
    })}
      <p>Please log in to your account to view the message.</p>
    `,
    buttonText: 'VIEW MESSAGE',
    buttonUrl: process.env.FRONTEND_URL || 'https://musegala.com.au',
  });

export const disputeClosedTemplate = (userName, reason, bookingId) =>
  baseEmailTemplate({
    title: 'DISPUTE CASE CLOSED',

    content: `
      <p>Hello ${userName},</p>
      <p>Your dispute case has been officially closed.</p>
      ${createInfoBox({
      'Booking ID': bookingId,
      'Reason': reason,
      'Status': 'Closed',
    })}
      <p>If you believe this case needs to be reopened, please contact our support team within 30 days. Archive of this case will be available in your account history.</p>
    `,
  });
