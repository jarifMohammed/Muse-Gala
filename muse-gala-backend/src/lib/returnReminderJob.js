import cron from 'node-cron';
import { Booking } from '../entities/booking/booking.model.js';
import { sendEmail } from './resendEmial.js';
import { returnReminderTemplate } from './emailTemplates/return.templates.js';
import { buildReturnUrl } from './returnToken.js';
import { shouldStopReminders } from '../entities/booking/return/return.service.js';

/**
 * Return Reminder Job
 * Runs every day at 9:00 AM
 * Checks for bookings finishing in 2 days, 1 day, or today.
 */
export const startReturnReminderJob = () => {
    // 0 9 * * * = 9:00 AM daily
    cron.schedule('0 9 * * *', async () => {
        console.log('[Cron] Running Return Reminder Job...');
        try {
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            // Target dates: today, tomorrow, day after tomorrow
            const dates = [0, 1, 2].map(days => {
                const d = new Date(now);
                d.setDate(d.getDate() + days);
                return d;
            });

            // Find bookings ending in the next 2 days
            // Exclude statuses that have no dress in customer's hands
            // (never accepted, cancelled, or already completed)
            const bookings = await Booking.find({
                rentalEndDate: {
                    $gte: dates[0],
                    $lte: new Date(dates[2].getTime() + 24 * 60 * 60 * 1000)
                },
                returnRemindersStopped: false,
                deliveryStatus: {
                    $nin: [
                        // Never accepted / unfulfillable
                        'Pending',
                        'Cannot Fullfill',
                        'Rejected',
                        'RejectedByLender',
                        // Cancelled
                        'CancelledByAdmin',
                        'CancelledByCustomer',
                        'CancelledByLender',
                        // Already done
                        'ReceivedByLender',
                        'Completed',
                        'Dress Returned'
                    ]
                }
            }).populate('customer', 'firstName name email')
              .populate('masterdressId', 'brand dressName colors images')
              .populate('allocatedLender.lenderId', 'firstName name email returnAddress businessAddress location');

            console.log(`[Cron] Found ${bookings.length} potential bookings for return reminders.`);

            for (const booking of bookings) {
                // Double check stop rules
                if (shouldStopReminders(booking)) continue;

                const endDate = new Date(booking.rentalEndDate);
                endDate.setHours(0, 0, 0, 0);

                const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                let reminderType = 'reminder-2-days'; // Default
                if (diffDays === 0) reminderType = 'due-today';
                if (diffDays === 1) reminderType = 'reminder-1-day';

                const returnUrl = buildReturnUrl(booking.returnToken);
                const customerName = booking.customer?.firstName || booking.customer?.name || 'Customer';
                const dressName = booking.masterdressId?.dressName || booking.dressName || 'Your Dress';
                const brandName = booking.masterdressId?.brand || 'N/A';
                const dressSize = booking.size || 'N/A';
                const dressColour = booking.masterdressId?.colors?.[0] || 'N/A';
                const returnAddress = booking.allocatedLender?.lenderId?.returnAddress || booking.allocatedLender?.lenderId?.businessAddress || 'Please contact lender for return address';

                const formattedDueDate = endDate.toLocaleDateString('en-AU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                if (booking.customer?.email) {
                    try {
                        let subject = `REMINDER: ${diffDays} Day(s) Until Return`;
                        if (diffDays === 0) subject = 'DUE TODAY: Return Your Rental';
                        if (diffDays === 1) subject = 'REMINDER: Your Return is Due Tomorrow';

                        await sendEmail({
                            to: booking.customer.email,
                            subject,
                            html: returnReminderTemplate(
                                customerName,
                                dressName,
                                brandName,
                                dressSize,
                                dressColour,
                                booking._id,
                                formattedDueDate,
                                returnUrl,
                                reminderType,
                                returnAddress
                            )
                        });

                        // Update last reminder sent
                        await Booking.findByIdAndUpdate(booking._id, {
                            $set: { lastReminderSentAt: new Date() },
                            $inc: { reminderCount: 1 }
                        });

                        console.log(`[Cron] Sent ${reminderType} to ${booking.customer.email} for booking ${booking._id}`);
                    } catch (emailErr) {
                        console.error(`[Cron] Error sending reminder for booking ${booking._id}:`, emailErr);
                    }
                }
            }
        } catch (err) {
            console.error('[Cron] Return Reminder Job error:', err);
        }
    });
};
