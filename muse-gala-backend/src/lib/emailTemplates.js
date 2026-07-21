// ✅ ESM
import { baseEmailTemplate, createInfoBox } from './emailTemplates/baseTemplate.js';

const verificationCodeTemplate = (code) => 
  baseEmailTemplate({
    title: 'Your Muse Gala verification code',
    subtitle: '',
    content: `
      <p>Hello,</p>
      <p>Your verification code is below.</p>
      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 32px; font-weight: bold; color: #000; letter-spacing: 4px; margin: 0;">${code}</p>
      </div>
      <p>This code expires in the next 5 minutes.</p>
      <p>If you didn’t request this, no action is required.</p>
      <p>Muse Gala</p>
    `,
  });

export default verificationCodeTemplate;
