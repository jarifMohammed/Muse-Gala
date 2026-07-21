// ✅ KYC Email Templates
import { baseEmailTemplate, createInfoBox, createStatusBadge } from './baseTemplate.js';

export const kycVerifiedTemplate = (userName) =>
  baseEmailTemplate({
    title: 'ID VERIFICATION COMPLETE',

    content: `
      <p>Hi ${userName},</p>
      <p>Your ID verification is complete.</p>
      <p>Your account is now fully verified.</p>
    `,
  });

export const kycRequiresInputTemplate = (userName) =>
  baseEmailTemplate({
    title: 'ID VERIFICATION STILL REQUIRED',

    content: `
      <p>Hi ${userName},</p>
      <p>We need a little more information to complete your ID verification.</p>
      <p>Please log in to your account to continue.</p>
    `,
    buttonText: 'CONTINUE ID VERIFICATION',
    buttonUrl: process.env.FRONTEND_URL || 'https://musegala.com.au',
  });

export const kycProcessingTemplate = (userName) =>
  baseEmailTemplate({
    title: 'ID VERIFICATION IN PROGRESS',

    content: `
      <p>Hi ${userName},</p>
      <p>Your ID verification is currently being processed.</p>
      <p>We’ll notify you once it’s complete.</p>
    `,
  });

export const kycFailedTemplate = (userName) =>
  baseEmailTemplate({
    title: 'ID VERIFICATION INCOMPLETE',

    content: `
      <p>Hi ${userName},</p>
      <p>Your ID verification session was not completed.</p>
      <p>Please start a new ID verification session to continue.</p>
    `,
    buttonText: 'START NEW SESSION',
    buttonUrl: process.env.FRONTEND_URL || 'https://musegala.com.au',
  });

export const kycInitiatedTemplate = (userName, verificationLink) =>
  baseEmailTemplate({
    title: 'ID VERIFICATION REQUIRED',

    content: `
      <p>Hi ${userName},</p>
      <p>To continue, please complete ID verification.</p>
    `,
    buttonText: 'START ID VERIFICATION',
    buttonUrl: verificationLink,
  });
