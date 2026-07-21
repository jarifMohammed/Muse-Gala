import { baseEmailTemplate } from './emailTemplates/baseTemplate.js';

export const deactivationOtpEmail = (name, code) =>
  baseEmailTemplate({
    title: 'ACCOUNT DEACTIVATION VERIFICATION',
    
    content: `
      <p>Hi ${name},</p>
      <p>To continue with account deactivation, enter the code below.</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; background: #f2f2f2; padding: 20px; text-align: center;">
        ${code}
      </div>
      <p>This code expires in 10 minutes.</p>
      
      <p>— Muse Gala</p>
    `,
  });
