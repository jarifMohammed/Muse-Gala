
import { Dispute } from '../dispute.model.js';
import User from '../../auth/auth.model.js';
import { sendEmail } from '../../../lib/resendEmial.js';
import { chargeUserOffSession } from '../../Payment/Booking/offSessionCharge.js';
import { baseEmailTemplate } from '../../../lib/emailTemplates/baseTemplate.js';


export const chargeUserForDisputeService = async ({ disputeId, reason, amount, adminId }) => {
  const dispute = await Dispute.findById(disputeId).populate('booking');
  if (!dispute) throw new Error('Dispute not found');
  const userId = dispute.booking.customer;
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Charge user off-session via Stripe
  const paymentIntent = await chargeUserOffSession({ user, amount, reason, disputeId });

  // Save charge info in dispute timeline
  dispute.timeline.push({
    actor: adminId,
    role: 'ADMIN',
    message: `Charged user $${amount} for: ${reason}`,
    type: 'update',
    timestamp: new Date(),
  });
  await dispute.save();

  // Notify user by email
  if (user.email) {
    const html = baseEmailTemplate({
      title: 'Additional Charge for Dispute',
      content: `
        <p>Dear ${user.firstName || user.name || 'User'},</p>
        <p>An additional charge of <b>$${amount}</b> has been applied to your account for the following reason related to your dispute:</p>
        <p><b>${reason}</b></p>
        <p>If you have questions, please contact support.</p>
      `
    });
    await sendEmail({
      to: user.email,
      subject: 'Additional Charge for Dispute',
      html
    });
  }

  return { disputeId, userId, amount, reason, paymentIntentId: paymentIntent.id };
};
