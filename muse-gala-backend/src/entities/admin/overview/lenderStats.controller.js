import User from '../../auth/auth.model.js';
import { generateResponse } from '../../../lib/responseFormate.js';

export const getLenderStats = async (req, res) => {
  try {
    const [totalApprovedLenders, totalPendingApplications, activeLenders] = await Promise.all([
      User.countDocuments({ role: 'LENDER', status: 'approved' }),
      User.countDocuments({ role: 'APPLICANT', status: 'pending' }),
      User.countDocuments({ role: 'LENDER', isActive: true })
    ]);

    return generateResponse(res, 200, true, 'Lender stats fetched', {
      totalApprovedLenders,
      totalPendingApplications,
      activeLenders
    });
  } catch (err) {
    return generateResponse(res, 500, false, 'Server error', err.message);
  }
};
