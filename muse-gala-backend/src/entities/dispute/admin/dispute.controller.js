import * as disputeService from './dispute.service.js';
import { generateResponse } from '../../../lib/responseFormate.js';
import { Dispute } from '../dispute.model.js';
import Stripe from 'stripe';
import { Booking } from '../../booking/booking.model.js';

export const getAllDisputes = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const { status, monthFilter } = req.query;

    const result = await disputeService.getAllDisputesService(
      page,
      limit,
      status,
      monthFilter
    );

    return generateResponse(
      res,
      200,
      true,
      'All disputes fetched successfully',
      result
    );
  } catch (error) {
    next(error);
  }
};

export const getDisputeById = async (req, res, next) => {
  try {
    const { disputeId } = req.params;

    if (!disputeId) {
      return generateResponse(res, 400, false, 'Dispute ID is required');
    }

    const dispute = await disputeService.getDisputeByIdService(disputeId);

    return generateResponse(
      res,
      200,
      true,
      'Dispute fetched successfully',
      dispute
    );
  } catch (error) {
    console.error('Error in getDisputeById:', error);
    next(error);
  }
};

export const responseToDispute = async (req, res, next) => {
  try {
    const adminId = req.user?._id;
    const { disputeId } = req.params;
    const { message, status } = req.body;

    if (!message) {
      return generateResponse(res, 400, false, 'Message is required');
    }

    const result = await disputeService.respondToDispute(
      adminId,
      disputeId,
      message,
      status
    );

    return generateResponse(
      res,
      200,
      true,
      'Admin response added successfully',
      result
    );
  } catch (error) {
    next(error);
  }
};

export const submitResolution = async (req, res, next) => {
  try {
    const adminId = req.user?._id;
    const { disputeId } = req.params;
    const { message } = req.body;

    if (!message) {
      return generateResponse(
        res,
        400,
        false,
        'Resolution message is required'
      );
    }

    const result = await disputeService.resolveDispute(
      adminId,
      disputeId,
      message
    );

    return generateResponse(
      res,
      200,
      true,
      'Dispute resolved successfully',
      result
    );
  } catch (error) {
    next(error);
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

export const initiateRefundController = async (req, res) => {
  const { disputeId, amount,reason } = req.body; // amount optional for partial refund

  try {
    // 1️⃣ Find dispute
    const dispute = await Dispute.findById(disputeId);
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });

    // 2️⃣ Find related booking
    const booking = await Booking.findById(dispute.booking).populate(
      'customer'
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // 3️⃣ Initiate refund on Stripe
    const refund = await stripe.refunds.create({
      payment_intent: booking.stripePaymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined // optional partial refund
    });

    console.log(`✅ Refund initiated: ${refund.id} for Booking ${booking._id}`);

    // 4️⃣ Mark booking as "Refund Pending"
    booking.paymentStatus = 'RefundPending';
    booking.refundDetails.push({
      reason: reason || 'Not mentioned',
      stripeRefundId: refund.id,
      amount: amount ?? booking.totalAmount,
      status: 'Pending',
      processedAt: new Date()
    });
    await booking.save();

    // 5️⃣ Update dispute timeline and status
    dispute.timeline.push({
      actor: req.user?._id || null,
      role: 'ADMIN',
      message: `Refund of $${amount ?? booking.totalAmount} initiated. Reason: ${reason || 'Not mentioned'}. Stripe Refund ID: ${refund.id}`,
      type: 'update',
      timestamp: new Date(),
    });
    dispute.status = 'Resolved';
    dispute.refundAmount = amount ?? booking.totalAmount;
    dispute.refundProcessed = true;
    dispute.refundDate = new Date();
    dispute.lastActionBy = req.user?._id || null;
    dispute.lastActionAt = new Date();
    dispute.updatedBy = req.user?._id || null;
    await dispute.save();

    // 6️⃣ Send refund notification email to customer
    try {
      const customer = booking.customer;
      // If populated, customer is an object; otherwise, fetch
      let customerObj = customer?.email ? customer : null;
      if (!customerObj) {
        const User = (await import('../../auth/auth.model.js')).default;
        customerObj = await User.findById(booking.customer);
      }
      if (customerObj?.email) {
        const { refundProcessedTemplate } = await import('../../../lib/emailTemplates/dispute.templates.js');
        const { sendEmail } = await import('../../../lib/resendEmial.js');
        await sendEmail({
          to: customerObj.email,
          subject: 'Your refund has been processed',
          html: refundProcessedTemplate(
            customerObj.firstName || customerObj.name || 'User',
            booking._id.toString(),
            amount ?? booking.totalAmount,
            booking.brand,
            booking.dressName,
            booking.colour,
            booking.size
          ),
        });
      }
    } catch (error_) {
      console.error('Error sending refund processed email:', error_);
    }

    res.json({
      message: 'Refund initiated successfully',
      refundId: refund.id,
      bookingId: booking._id
    });
  } catch (err) {
    console.error('❌ Error initiating refund:', err);
    res.status(500).json({ error: err.message || 'Refund failed' });
  }
};
