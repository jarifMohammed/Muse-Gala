import { baseEmailTemplate, createInfoBox } from './baseTemplate.js';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const lenderMessageNotificationTemplate = ({
  customerName,
  lenderName,
  brandName,
  dressName,
  bookingId,
  messagePreview,
  chatUrl
}) => {
  const safeMessage = escapeHtml(
    messagePreview || 'The lender sent an attachment.'
  );

  const content = `
    <p>Hi ${escapeHtml(customerName || 'Customer')},</p>
    <p>You have a new message from ${escapeHtml(lenderName || 'your lender')} about your dress booking.</p>

    ${createInfoBox({
      'Brand': brandName || 'N/A',
      'Dress': dressName || 'Your Dress',
      'Booking ID': bookingId || 'N/A'
    })}

    <div style="background-color: #f8f8f8; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #000;">
      <p style="font-weight: 600; color: #000; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
      <p style="color: #333; line-height: 1.8; margin: 0;">${safeMessage}</p>
    </div>

    <p>Please open your Muse Gala messages to reply.</p>
    <p>- Muse Gala</p>
  `;

  return baseEmailTemplate({
    title: 'New message from your lender',
    subtitle: 'A lender has sent an update about your booking',
    content,
    buttonText: 'VIEW MESSAGE',
    buttonUrl: chatUrl
  });
};
