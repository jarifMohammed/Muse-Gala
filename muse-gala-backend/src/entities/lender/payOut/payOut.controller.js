import Stripe from 'stripe';
import { generateResponse } from '../../../lib/responseFormate.js';
import { sendEmail } from '../../../lib/resendEmial.js';
import {
  payoutTransferredTemplate,
  payoutFailedTemplate
} from '../../../lib/emailTemplates/payout.templates.js';
import User from '../../auth/auth.model.js';
import { Booking } from '../../booking/booking.model.js';
import payOutModel from './payOut.model.js';
import {
  createPayoutRequestService,
  getAllPayoutsService,
  getPayoutByIdService,
  getPayoutsByLenderService
} from './payOut.service.js';
import mongoose from 'mongoose';

export const createPayoutController = async (req, res) => {
  try {
    const lenderId = req.user?._id;

    const { bookingId } = req.body;
    if (!bookingId) {
      return generateResponse(res, 400, false, 'Booking ID is required');
    }

    const payout = await createPayoutRequestService({ lenderId, bookingId });

    generateResponse(
      res,
      201,
      true,
      'Payout request created successfully',
      payout
    );
  } catch (err) {
    console.error(err);
    generateResponse(
      res,
      400,
      false,
      err.message || 'Failed to create payout request'
    );
  }
};

/**
 * GET /api/payouts/my
 * Lender: get all payouts
 */
export const getPayoutsByLenderController = async (req, res) => {
  try {
    const lenderId = req.user._id;
    const { page, limit } = req.query;

    const result = await getPayoutsByLenderService(lenderId, {
      page: Number(page) || 1,
      limit: Number(limit) || 10
    });

    generateResponse(res, 200, true, 'Payouts fetched successfully', result);
  } catch (err) {
    console.error(err);
    generateResponse(res, 400, false, err.message || 'Failed to fetch payouts');
  }
};

/**
 * GET /api/payouts/my/:id
 * Lender: get payout by ID
 */
export const getPayoutByIdController = async (req, res) => {
  try {
    const payoutId = req.params.id;

    const payout = await getPayoutByIdService(payoutId);

    generateResponse(res, 200, true, 'Payout fetched successfully', payout);
  } catch (err) {
    console.error(err);
    generateResponse(res, 400, false, err.message || 'Failed to fetch payout');
  }
};

/**
 * GET /api/payouts
 * Admin: get all payouts
 */
export const getAllPayoutsController = async (req, res) => {
  try {
    const { page, limit, status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const result = await getAllPayoutsService({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      filter
    });

    generateResponse(
      res,
      200,
      true,
      'All payouts fetched successfully',
      result
    );
  } catch (err) {
    console.error(err);
    generateResponse(res, 400, false, err.message || 'Failed to fetch payouts');
  }
};

/**
 * Accept payment by admin controller
 * it will transfer the requested amount to the lenders account
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const transferPayout = async (req, res, next) => {
  try {
    const { payoutId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(payoutId)) {
      return res.status(400).json({ message: 'Invalid payout ID' });
    }

    const payout = await payOutModel.findById(payoutId).lean();
    if (!payout) {
      return res.status(404).json({ message: 'Payout not found' });
    }

    if (payout.status === 'paid') {
      return res.status(400).json({ message: 'Payout already completed' });
    }

    const lender = await User.findById(payout.lenderId).lean();
    if (!lender) {
      return res.status(404).json({ message: 'Lender not found' });
    }

    const isStripe = payout.payoutMethod === 'Stripe';

    if (isStripe) {
      /* =========================
         STRIPE LOGIC (Automated)
      ========================= */
      const {
        stripeAccountId,
        chargesEnabled,
        payoutsEnabled,
        detailsSubmitted,
        stripeOnboardingCompleted
      } = lender;

      const errors = [];
      if (!stripeAccountId) errors.push('Missing stripeAccountId');
      if (!chargesEnabled) errors.push('chargesEnabled is false');
      if (!payoutsEnabled) errors.push('payoutsEnabled is false');
      if (!detailsSubmitted) errors.push('detailsSubmitted is false');
      if (!stripeOnboardingCompleted) errors.push('stripeOnboardingCompleted is false');

      if (errors.length > 0) {
        // Send failure emails...
        try {
          await sendEmail({
            to: lender.email,
            subject: 'Payout issue',
            html: payoutFailedTemplate(`${lender.firstName || ''} ${lender.lastName || ''}`.trim() || 'Lender')
          });
        } catch (e) {}
        return res.status(400).json({ message: 'Stripe account is not ready', errors });
      }

      const transfer = await stripe.transfers.create({
        amount: Math.round(payout.requestedAmount * 100), // in cents
        currency: 'aud',
        destination: stripeAccountId,
        metadata: { payoutId: payout._id.toString() }
      });

      await Promise.all([
        payOutModel.findByIdAndUpdate(payoutId, {
          status: 'paid',
          updatedAt: new Date(),
          stripeTransferId: transfer.id
        }),
        Booking.findByIdAndUpdate(payout.bookingId, { payoutStatus: 'transferred' })
      ]);

    } else {
      /* =========================
         MANUAL LOGIC (Bank/PayID)
      ========================= */
      // Admin handles the actual transfer outside the system. 
      // We just mark it as paid in the DB.
      await Promise.all([
        payOutModel.findByIdAndUpdate(payoutId, {
          status: 'paid',
          updatedAt: new Date(),
          notes: `Manual payout processed via ${payout.payoutMethod}`
        }),
        Booking.findByIdAndUpdate(payout.bookingId, { payoutStatus: 'transferred' })
      ]);
    }

    // Success Email
    try {
      await sendEmail({
        to: lender.email,
        subject: 'Payout completed',
        html: payoutTransferredTemplate(
          `${lender.firstName || ''} ${lender.lastName || ''}`.trim() || 'Lender',
          payout.requestedAmount.toFixed(2)
        )
      });
    } catch (e) {}

    return res.status(200).json({
      success: true,
      message: isStripe ? 'Payout transferred via Stripe' : 'Payout marked as paid manually'
    });

  } catch (error) {
    next(error);
  }
};
