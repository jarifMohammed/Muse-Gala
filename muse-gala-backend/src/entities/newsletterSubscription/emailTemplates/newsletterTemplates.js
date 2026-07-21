/**
 * Email templates for Newsletter Subscription
 * Uses the base template for consistent Muse Gala branding
 */

import { baseEmailTemplate, adminNotificationTemplate } from '../../../lib/emailTemplates/baseTemplate.js';

/**
 * Admin notification when a new user subscribes
 */
export const adminNewSubscriberNotification = (email) => 
  adminNotificationTemplate(
    'New Newsletter Subscriber',
    'A new user has subscribed to the newsletter.',
    { Email: email }
  );

/**
 * Welcome email sent to new newsletter subscribers
 */
export const subscriberWelcomeEmail = () => 
  baseEmailTemplate({
    title: 'THANK YOU',
    subtitle: "You're now subscribed to the Muse Gala newsletter.",
    content: `
      <p>Get ready to stay updated with the latest fashion trends, exclusive offers, and special collections.</p>
      <p>We'll keep you inspired with curated content delivered straight to your inbox.</p>
    `,
  });
