import Stripe from 'stripe';
import Payment from './payment.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const chargeUserOffSession = async ({ user, amount, reason, disputeId }) => {
  if (!user.stripeCustomerId) throw new Error('User has no saved payment method');

  // Get default payment method
  const paymentMethods = await stripe.paymentMethods.list({
    customer: user.stripeCustomerId,
    type: 'card',
  });
  if (!paymentMethods.data.length) throw new Error('No payment method found for user');

  const paymentMethod = paymentMethods.data[0].id;

  // Create PaymentIntent for off-session charge
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'aud',
    customer: user.stripeCustomerId,
    payment_method: paymentMethod,
    off_session: true,
    confirm: true,
    description: `Dispute charge: ${reason}`,
    metadata: {
      disputeId: disputeId,
      userId: user._id.toString(),
      reason,
    },
  });

  // Save payment record
  await Payment.create({
    type: 'dispute',
    customerId: user._id,
    amount,
    currency: 'aud',
    status: paymentIntent.status === 'succeeded' ? 'Paid' : 'Failed',
    stripe: {
      paymentIntentId: paymentIntent.id,
    },
    metadata: {
      disputeId,
      reason,
    },
  });

  return paymentIntent;
};
