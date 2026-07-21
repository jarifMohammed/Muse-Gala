import mongoose from 'mongoose';
import { Booking } from './booking.model.js';
import Listing from '../lender/Listings/listings.model.js';
import User from '../auth/auth.model.js';
import MasterDress from '../admin/Lisitngs/ReviewandMain Site Listing/masterDressModel.js';
import { sendEmail } from '../../lib/resendEmial.js';
import {
  bookingRejectedTemplate,
  bookingCreatedTemplate
} from '../../lib/emailTemplates/booking.templates.js';
import { calculateSlaTimestamps } from '../../lib/slaCalculator.js';

export const reallocateBookingService = async (bookingId, reason) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) throw new Error('Booking not found');

    if (booking.deliveryStatus !== 'Pending') {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: 'Booking is no longer pending.' };
    }

    // 1. Move current lender to history
    if (booking.allocatedLender && booking.allocatedLender.lenderId) {
      booking.allocationHistory.push({
        lenderId: booking.allocatedLender.lenderId,
        listingId: booking.allocatedLender.listingId || booking.listing,
        allocatedAt: booking.allocatedLender.allocatedAt,
        status: reason // 'Timeout' or 'Rejected'
      });
    }

    // 2. Check if we reached 5 attempts
    if (booking.allocationAttempts >= 5) {
      await cancelBookingDueToNoLender(booking, session);
      await session.commitTransaction();
      session.endSession();
      return { success: true, message: 'Max attempts reached. Booking cancelled.' };
    }

    // 3. Find next cheapest lender
    const masterDress = await MasterDress.findById(booking.masterdressId).session(session);
    if (!masterDress) throw new Error('Master dress not found');

    const triedLenderIds = booking.allocationHistory.map((h) => h.lenderId.toString());

    const nextListings = await Listing.find({
      _id: { $in: masterDress.listingIds },
      isActive: true,
      approvalStatus: 'approved',
      lenderId: { $nin: triedLenderIds }
    }).session(session);

    if (nextListings.length === 0) {
      await cancelBookingDueToNoLender(booking, session);
      await session.commitTransaction();
      session.endSession();
      return { success: true, message: 'No more lenders available. Booking cancelled.' };
    }

    // Sort by price
    const isShortRental = booking.rentalDurationDays <= 4;
    nextListings.sort((a, b) => {
      const priceA = isShortRental ? a.rentalPrice.fourDays : a.rentalPrice.eightDays;
      const priceB = isShortRental ? b.rentalPrice.fourDays : b.rentalPrice.eightDays;
      return priceA - priceB;
    });

    const nextListing = nextListings[0];
    const nextPrice = isShortRental ? nextListing.rentalPrice.fourDays : nextListing.rentalPrice.eightDays;

    // 4. Update booking with new lender
    booking.allocatedLender = {
      lenderId: nextListing.lenderId,
      listingId: nextListing._id,
      email: nextListing.lenderEmail || '',
      price: nextPrice,
      allocationType: booking.deliveryMethod === 'Pickup' ? 'LocalPickup' : 'Shipping',
      allocatedAt: new Date()
    };

    booking.lender = nextListing.lenderId;
    booking.listing = nextListing._id;
    booking.lenderPrice = nextPrice;
    booking.allocationAttempts += 1;
    
    // Recalculate SLA
    const { slaExpiresAt, slaReminderAt } = calculateSlaTimestamps(booking.rentalStartDate);
    booking.slaExpiresAt = slaExpiresAt;
    booking.slaReminderAt = slaReminderAt;
    booking.slaReminderSent = false;

    await booking.save({ session });
    await session.commitTransaction();
    session.endSession();

    // Send email to new lender (async, outside transaction)
    try {
      const newLender = await User.findById(nextListing.lenderId);
      if (newLender && newLender.email) {
        await sendEmail({
          to: newLender.email,
          subject: 'New Booking Request - Muse Gala',
          html: bookingCreatedTemplate(
            newLender.firstName || newLender.name || 'Lender',
            masterDress.brand || 'N/A',
            masterDress.dressName,
            booking.color || 'N/A',
            booking.size,
            booking.deliveryMethod,
            booking.rentalDurationDays,
            booking.lenderPrice
          )
        });
      }
    } catch (err) {
      console.error('Error sending email to new lender:', err);
    }

    return { success: true, message: 'Reallocated to next lender.' };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

async function cancelBookingDueToNoLender(booking, session) {
  booking.deliveryStatus = 'Cannot Fullfill';
  booking.slaExpiresAt = undefined;
  booking.slaReminderAt = undefined;
  await booking.save({ session });

  // Send email to customer
  try {
    const customer = await User.findById(booking.customer).session(session);
    const masterDress = await mongoose.model('MasterDress').findById(booking.masterdressId).session(session);
    if (customer && customer.email) {
      await sendEmail({
        to: customer.email,
        subject: 'Update on your booking - Muse Gala',
        html: bookingRejectedTemplate(
          customer.firstName || customer.name || 'Customer',
          masterDress?.brand || 'N/A',
          masterDress?.dressName || 'Your Dress',
          booking.color || 'N/A',
          booking.size || 'N/A',
          booking.deliveryMethod || 'Shipping'
        )
      });
    }
  } catch (err) {
    console.error('Error sending rejection email to customer:', err);
  }
}
