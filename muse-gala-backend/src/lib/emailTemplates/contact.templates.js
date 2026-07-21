/**
 * Contact/Support Email Templates
 * Professional luxury styling for contact form notifications
 */

import { baseEmailTemplate, createInfoBox } from './baseTemplate.js';

/**
 * Email template for admin notification when a new contact is received
 * @param {Object} data - Contact data
 * @param {string} data.name - Contact person's name
 * @param {string} data.email - Contact person's email
 * @param {string} data.message - Contact message
 * @param {string} data.subject - Subject (for lender contacts)
 * @param {string} data.issueType - Issue type (for lender contacts)
 * @param {string} data.type - 'general' or 'lender'
 * @returns {string} HTML email template
 */
export const adminContactNotificationTemplate = (data) => {
  const isLender = data.type === 'lender';
  
  const infoData = isLender
    ? {
        'Issue Type': data.issueType ? data.issueType.charAt(0).toUpperCase() + data.issueType.slice(1) : 'Not specified',
        'Subject': data.subject || 'Not provided',
        'Lender ID': data.lenderId || 'N/A',
        'Submitted At': new Date().toLocaleString('en-AU', { 
          dateStyle: 'full', 
          timeStyle: 'short',
          timeZone: 'Australia/Sydney'
        }),
      }
    : {
        'Name': data.name || 'Not provided',
        'Email': data.email || 'Not provided',
        'Submitted At': new Date().toLocaleString('en-AU', { 
          dateStyle: 'full', 
          timeStyle: 'short',
          timeZone: 'Australia/Sydney'
        }),
      };

  const content = `
    <div class="content-left">
      <p>A new ${isLender ? 'lender support request' : 'contact inquiry'} has been received and requires your attention.</p>
      
      ${createInfoBox(infoData)}
      
      <div style="background-color: #f8f8f8; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #000;">
        <p style="font-weight: 600; color: #000; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
        <p style="color: #333; line-height: 1.8; margin: 0; font-style: italic;">"${data.message}"</p>
      </div>
      
      ${data.file ? `
        <p style="font-size: 13px; color: #666;">
          <strong>Attachment:</strong> <a href="${data.file}" style="color: #000;">View Attached File</a>
        </p>
      ` : ''}
      
      <p class="text-muted text-small" style="margin-top: 30px;">Please review and respond to this inquiry at your earliest convenience.</p>
    </div>
  `;

  return baseEmailTemplate({
    title: isLender ? 'NEW LENDER SUPPORT REQUEST' : 'NEW CONTACT INQUIRY',
    subtitle: 'A customer is awaiting your response',
    content,
    buttonText: 'VIEW IN DASHBOARD',
    buttonUrl: 'https://admin.musegala.com.au/support',
  });
};

/**
 * Email template for user confirmation when they submit a contact form
 * @param {Object} data - Contact data
 * @param {string} data.name - Contact person's name
 * @param {string} data.email - Contact person's email
 * @param {string} data.message - Contact message
 * @param {string} data.subject - Subject (for lender contacts)
 * @param {string} data.issueType - Issue type (for lender contacts)
 * @param {string} data.type - 'general' or 'lender'
 * @returns {string} HTML email template
 */
export const userContactConfirmationTemplate = (data) => {
  const isLender = data.type === 'lender';
  const userName = data.name || 'Valued Customer';

  const content = `
    <div class="content-left">
      <p>Dear ${userName},</p>
      
      <p>Thank you for reaching out to <strong>Muse Gala</strong>. We have received your ${isLender ? 'support request' : 'message'} and our dedicated team is reviewing it with the utmost care.</p>
      
      <p style="text-align: center; font-size: 16px; color: #333; margin: 30px 0;">We'll respond within <strong>24-48 hours</strong></p>
      
      <p style="font-weight: 500; margin-top: 25px;">What happens next?</p>
      <ul style="color: #555; line-height: 2; padding-left: 20px;">
        <li>Our team will carefully review your inquiry</li>
        <li>You'll receive a personalized response via email</li>
        <li>For urgent matters, we prioritize faster resolution</li>
      </ul>
      
      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <p style="font-weight: 600; color: #000; margin-bottom: 10px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Your Message</p>
        <p style="color: #555; line-height: 1.7; margin: 0; font-size: 14px;">"${data.message}"</p>
      </div>
      
      <p>We appreciate you choosing Muse Gala and look forward to assisting you.</p>
      
      <p style="margin-top: 30px;">
        Warm regards,<br/>
        <strong>The Muse Gala Team</strong>
      </p>
    </div>
  `;

  return baseEmailTemplate({
    title: 'MESSAGE RECEIVED',
    subtitle: 'Thank you for contacting Muse Gala',
    content,
    buttonText: 'EXPLORE MUSE GALA',
    buttonUrl: 'https://musegala.com.au',
  });
};

export default {
  adminContactNotificationTemplate,
  userContactConfirmationTemplate,
};
