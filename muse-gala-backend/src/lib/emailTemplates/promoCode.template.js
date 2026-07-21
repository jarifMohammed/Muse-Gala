// ✅ Promo Code Email Template
import { baseEmailTemplate, createInfoBox } from './baseTemplate.js';

export const promoCodeTemplate = ({ code, expiresAt }) => {
  const expiry = new Date(expiresAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return baseEmailTemplate({
    title: 'A GIFT FROM MUSE GALA',

    content: `
      <p>Here’s a little something for your next booking.</p>
      ${createInfoBox({
      Code: code,
      Expires: expiry,
    })}
    `,
  });
};
