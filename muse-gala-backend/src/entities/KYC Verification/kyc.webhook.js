import User from '../auth/auth.model.js';
import { sendEmail } from '../../lib/resendEmial.js';
import {
  kycVerifiedTemplate,
  kycRequiresInputTemplate,
  kycProcessingTemplate,
  kycFailedTemplate
} from '../../lib/emailTemplates/kyc.templates.js';

export const handleVerificationSessionEvent = async (event) => {
  const session = event.data.object;
  const userId = session.metadata.userId;
  if (!userId) {
    console.warn('Verification session missing userId metadata');
    return;
  }

  const user = await User.findById(userId);
  if (!user) {
    console.warn(`User not found for ID ${userId}`);
    return;
  }

  const now = new Date();

  switch (event.type) {
    case 'identity.verification_session.verified':
      user.kycVerified = true;
      user.kycStatus = 'verified';
      user.kycLastUpdated = now;
      user.kycDetails = session;

      // Clear session info since verification is done
      user.stripeVerificationSessionId = null;
      user.stripeVerificationSessionUrl = null;
      user.stripeVerificationSessionExpiresAt = null;

      // Send ID verification success email
      try {
        await sendEmail({
          to: user.email,
          subject: 'ID verification complete',
          html: kycVerifiedTemplate(user.firstName || user.lastName || user.username || 'User')
        });
      } catch (emailError) {
        console.error('Error sending ID verification verified email:', emailError);
      }
      break;

    case 'identity.verification_session.requires_input':
      user.kycVerified = false;
      user.kycStatus = 'requires_input';
      user.kycLastUpdated = now;
      user.kycDetails = session;
      // Keep session info so user can resume

      // Send ID verification still required email
      try {
        await sendEmail({
          to: user.email,
          subject: 'ID verification still required',
          html: kycRequiresInputTemplate(
            user.firstName || user.lastName || user.username || 'User'
          )
        });
      } catch (emailError) {
        console.error('Error sending ID verification requires input email:', emailError);
      }
      break;

    case 'identity.verification_session.processing':
      user.kycVerified = false;
      user.kycStatus = 'pending';
      user.kycLastUpdated = now;
      user.kycDetails = session;
      // Keep session info so user can resume

      // Send ID verification in progress email
      try {
        await sendEmail({
          to: user.email,
          subject: 'ID verification in progress',
          html: kycProcessingTemplate(user.firstName || user.lastName || user.username || 'User')
        });
      } catch (emailError) {
        console.error('Error sending ID verification processing email:', emailError);
      }
      break;

    case 'identity.verification_session.canceled':
    case 'identity.verification_session.expired':
      user.kycVerified = false;
      user.kycStatus = 'failed';
      user.kycLastUpdated = now;
      user.kycDetails = session;

      // Clear session info to force new session next time
      user.stripeVerificationSessionId = null;
      user.stripeVerificationSessionUrl = null;
      user.stripeVerificationSessionExpiresAt = null;

      // Send ID verification failed/expired email
      try {
        await sendEmail({
          to: user.email,
          subject: 'ID verification incomplete',
          html: kycFailedTemplate(user.firstName || user.lastName || user.username || 'User')
        });
      } catch (emailError) {
        console.error('Error sending ID verification failed email:', emailError);
      }
      break;

    default:
      // ignore other events
      return;
  }

  await user.save();
};
