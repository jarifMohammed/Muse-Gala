import { chargeUserForDisputeService } from './dispute.charge.service.js';
import { generateResponse } from '../../../lib/responseFormate.js';

export const chargeUserForDisputeController = async (req, res) => {
  try {
    const { disputeId, reason, amount } = req.body;
    const adminId = req.user?._id;
    if (!disputeId || !reason || !amount) {
      return generateResponse(res, 400, false, 'disputeId, reason, and amount are required');
    }
    const result = await chargeUserForDisputeService({ disputeId, reason, amount, adminId });
    generateResponse(res, 200, true, 'User charged successfully for dispute', result);
  } catch (err) {
    generateResponse(res, 400, false, err.message || 'Failed to charge user');
  }
};
