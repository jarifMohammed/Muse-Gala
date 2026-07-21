import NewsletterSubscription from './newsletterSubscription.model.js';
import { sendEmail } from '../../lib/resendEmial.js';
import { adminEmail } from '../../core/config/config.js';
import {
  adminNewSubscriberNotification,
  subscriberWelcomeEmail
} from './emailTemplates/newsletterTemplates.js';
import promoCodeModel from '../admin/promoCode/promoCode.model.js';
import { promoCodeTemplate } from '../../lib/emailTemplates/promoCode.template.js';

export const createNewsletterSubscriptionService = async (email) => {
  const existingSubscription = await NewsletterSubscription.findOne({ email });
  if (existingSubscription)
    throw new Error('Email already subscribed to the newsletter');

  const newsletterSubscription = new NewsletterSubscription({ email });

  await newsletterSubscription.save();

  const emailTasks = [];

  if (adminEmail) {
    emailTasks.push(
      sendEmail({
        to: adminEmail,
        subject: 'New Newsletter Subscription',
        html: adminNewSubscriberNotification(email)
      })
    );
  }

  emailTasks.push(
    sendEmail({
      to: email,
      subject: 'Welcome to Muse Gala Newsletter',
      html: subscriberWelcomeEmail()
    })
  );

  await Promise.all(emailTasks);
  return;
};

export const unsubscribeNewsletterService = async (email) => {
  const subscription = await NewsletterSubscription.findOne({ email });
  if (!subscription) {
    throw new Error('Email not found in newsletter subscriptions');
  }

  await NewsletterSubscription.deleteOne({ email });
  return;
};

export const getAllNewsletterSubscriptionService = async (
  page,
  limit,
  skip
) => {
  const newsletterSubscriptions = await NewsletterSubscription.find({})
    .sort({ subscribedAt: -1 })
    .lean();
  return {
    data: newsletterSubscriptions.slice(skip, skip + limit),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(newsletterSubscriptions.length / limit),
      totalItems: newsletterSubscriptions.length,
      itemsPerPage: limit
    }
  };
};

export const sendPromoOfferService = async (email) => {
  if (!email) throw new Error('Email is required');

  // Find the GIVE10 promo code
  const promo = await promoCodeModel.findOne({ code: 'GIVE10', isActive: true });
  
  if (!promo) {
    throw new Error('Promo code GIVE10 not found or is inactive');
  }

  // Send the email
  await sendEmail({
    to: email,
    subject: 'A GIFT FROM MUSE GALA',
    html: promoCodeTemplate({ 
      code: promo.code, 
      expiresAt: promo.expiresAt 
    })
  });

  return;
};
