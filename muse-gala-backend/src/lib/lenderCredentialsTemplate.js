// lib/emailTemplates.js
import { baseEmailTemplate, createInfoBox } from './emailTemplates/baseTemplate.js';

const lenderCredentialsTemplate = (name, email, password) =>
  baseEmailTemplate({
    title: 'WELCOME TO MUSE GALA',

    content: `
      <p>Hello ${name},</p>
      <p>Your lender account has been approved.</p>
      <p><strong>Login email:</strong> ${email}</p>
      <p><strong>Temporary password:</strong> ${password}</p>
      <p>Please update your details after logging in.</p>
      <p>— Muse Gala</p>
    `,
  });

export default lenderCredentialsTemplate;