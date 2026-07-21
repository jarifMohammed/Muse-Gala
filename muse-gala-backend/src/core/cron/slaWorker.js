import cron from 'node-cron';
import mongoose from 'mongoose';
import { Booking } from '../../entities/booking/booking.model.js';
import { reallocateBookingService } from '../../entities/booking/sla.service.js';
import MasterDress from '../../entities/admin/Lisitngs/ReviewandMain Site Listing/masterDressModel.js';
import User from '../../entities/auth/auth.model.js';
import { sendEmail } from '../../lib/resendEmial.js';

export const initSlaWorker = () => {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      // console.log('[SLA Worker] Running cron job...');
      const now = new Date();

      // 1. Process Timeouts
      const expiredBookings = await Booking.find({
        deliveryStatus: 'Pending',
        slaExpiresAt: { $lte: now }
      });

      for (const booking of expiredBookings) {
        console.log(`[SLA Worker] Booking ${booking._id} expired. Reallocating...`);
        try {
          await reallocateBookingService(booking._id, 'Timeout');
        } catch (err) {
          console.error(`[SLA Worker] Error reallocating booking ${booking._id}:`, err);
        }
      }

      // 2. Process Reminders
      const remindBookings = await Booking.find({
        deliveryStatus: 'Pending',
        slaReminderSent: false,
        slaReminderAt: { $lte: now }
      });

      for (const booking of remindBookings) {
        try {
          const lenderId = booking.allocatedLender?.lenderId;
          if (!lenderId) continue;
          
          const lender = await User.findById(lenderId);
          const masterDress = await MasterDress.findById(booking.masterdressId);

          if (lender && lender.email) {
            await sendEmail({
              to: lender.email,
              subject: 'Action Required: Booking Request Expiring',
              html: `
                <div style="font-family: sans-serif; color: #333; line-height: 1.6;">
                  <h2>Booking Request Expiring Soon</h2>
                  <p>Hi ${lender.firstName || lender.name || 'Lender'},</p>
                  <p>This is a reminder that a booking request for <strong>${masterDress?.dressName || 'a dress'}</strong> is waiting for your response.</p>
                  <p><strong>Expires At:</strong> ${new Date(booking.slaExpiresAt).toLocaleString()}</p>
                  <p>If you do not accept the booking before it expires, it will be automatically sent to another lender.</p>
                  <br/>
                  <p>— Muse Gala Team</p>
                </div>
              `
            });
          }

          // Mark reminder as sent
          booking.slaReminderSent = true;
          await booking.save();
          console.log(`[SLA Worker] Sent reminder for booking ${booking._id}`);
        } catch (err) {
          console.error(`[SLA Worker] Error sending reminder for booking ${booking._id}:`, err);
        }
      }

    } catch (error) {
      console.error('[SLA Worker] Error in cron execution:', error);
    }
  });

  console.log('[SLA Worker] Initialized and scheduled.');
};
