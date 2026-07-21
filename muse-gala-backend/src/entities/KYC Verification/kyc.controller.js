
import { generateResponse } from '../../lib/responseFormate.js';
import User from '../auth/auth.model.js';
import { createOrReuseVerificationSession } from './kyc.service.js';


export const startOrResumeVerification = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // console.log("User found:", user);

    const { returnUrl } = req.query;

    const { url, reused } = await createOrReuseVerificationSession(user, returnUrl);

    return generateResponse(res, 200, true,{
      url,
      message: reused ? 'Resuming existing verification session' : 'New verification session created',
    });
  } catch (error) {
    console.error('Error starting/resuming verification:', error);
    return generateResponse(res, 500, false, 'Failed to start or resume verification');
  }
};

export const getKYCVerificationStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return generateResponse(res, 404, false, 'User not found');
    }

    return generateResponse(res, 200, true, {
      status: user.kycStatus || 'not_started',
      verified: user.kycVerified || false,
    });
  } catch (error) {
    console.error('Error fetching KYC verification status:', error);
    return generateResponse(res, 500, false, 'Failed to fetch verification status');
  }
};
