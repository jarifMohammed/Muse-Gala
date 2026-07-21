import cron from 'node-cron';
import { Booking } from '../entities/booking/booking.model.js';
import { sendEmail } from './resendEmial.js';
import {
    overdueReminderTemplate,
    escalatedOverdueTemplate,
    highRiskReturnTemplate,
    nonReturnedTemplate
} from './emailTemplates/return.templates.js';
import { buildReturnUrl } from './returnToken.js';
import { shouldStopReminders } from '../entities/booking/return/return.service.js';

/**
 * Overdue Escalation Job
 * Runs every day at 10:00 AM
 * Escalates overdue return statuses and sends escalating notifications.
 */
export const startOverdueEscalationJob = () => {
    // 0 10 * * * = 10:00 AM daily
    cron.schedule('0 10 * * *', async () => {
        console.log('[Cron] Running Overdue Escalation Job...');
        try {
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            // Find bookings that are past rentalEndDate and reminders are NOT stopped
            // Exclude statuses where dress was never in customer's hands
            // (never accepted, cancelled, or already resolved)
            const overdueBookings = await Booking.find({
                rentalEndDate: { $lt: now },
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
                        // Already resolved
                        'ReceivedByLender',
                        'Completed',
                        'Dress Returned',
                        'NonReturned',
                        'IssueReported'
                    ]
                }
            }).populate('customer', 'firstName name email')
                .populate('masterdressId', 'brand dressName colors images');

            console.log(`[Cron] Found ${overdueBookings.length} potentially overdue bookings.`);

            for (const booking of overdueBookings) {
                // Double check stop rules
                if (shouldStopReminders(booking)) continue;

                const endDate = new Date(booking.rentalEndDate);
                endDate.setHours(0, 0, 0, 0);

                const daysOverdue = Math.floor((now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));

                // Determine escalation level and status
                let newStatus = booking.deliveryStatus;
                let template = null;
                let escalationLevel = 0;

                if (daysOverdue >= 30) {
                    newStatus = 'NonReturned';
                    escalationLevel = 5;
                    template = nonReturnedTemplate;
                } else if (daysOverdue >= 15) {
                    newStatus = 'HighRisk';
                    escalationLevel = 4;
                    template = highRiskReturnTemplate;
                } else if (daysOverdue >= 10) {
                    newStatus = 'Escalated';
                    escalationLevel = 3;
                    template = escalatedOverdueTemplate;
                } else if (daysOverdue >= 5) {
                    newStatus = 'Overdue';
                    escalationLevel = 2;
                    template = overdueReminderTemplate;
                } else if (daysOverdue >= 1) {
                    newStatus = 'LateReturn';
                    escalationLevel = 1;
                    template = overdueReminderTemplate;
                }

                // Only update if status or escalation level has changed
                if (newStatus !== booking.deliveryStatus || escalationLevel > booking.overdueEscalationLevel) {
                    const returnUrl = buildReturnUrl(booking.returnToken);
                    const customerName = booking.customer?.firstName || booking.customer?.name || 'Customer';
                    const dressName = booking.masterdressId?.dressName || booking.dressName || 'Your Dress';
                    const brandName = booking.masterdressId?.brand || 'N/A';
                    const dressSize = booking.size || 'N/A';
                    const dressColour = booking.masterdressId?.colors?.[0] || 'N/A';

                    console.log(`[Cron] Escalating booking ${booking._id} to ${newStatus} (${daysOverdue} days overdue)`);

                    // Calculate suggested fees
                    const suggestedLateFee = daysOverdue * 30; // $30 per day overdue suggestion
                    let suggestedReplacementFee = 0;
                    if (newStatus === 'HighRisk' || newStatus === 'NonReturned') {
                        suggestedReplacementFee = booking.totalAmount;
                    }

                    // Update booking
                    await Booking.findByIdAndUpdate(booking._id, {
                        $set: {
                            deliveryStatus: newStatus,
                            overdueEscalationLevel: escalationLevel,
                            lastReminderSentAt: new Date(),
                            suggestedLateFee,
                            suggestedReplacementFee
                        },
                        $push: {
                            statusHistory: {
                                status: newStatus,
                                timestamp: new Date(),
                                reason: `System auto-escalation: ${daysOverdue} days overdue. Suggested late fee: $${suggestedLateFee}`
                            }
                        }
                    });

                    // Send email notification
                    if (booking.customer?.email && template) {
                        try {
                            let html;
                            if (newStatus === 'NonReturned') {
                                html = template(customerName, dressName, brandName, booking._id, returnUrl);
                            } else if (newStatus === 'HighRisk') {
                                html = template(customerName, dressName, brandName, booking._id, returnUrl);
                            } else if (newStatus === 'Escalated') {
                                html = template(customerName, dressName, brandName, booking._id, returnUrl);
                            } else {
                                // Overdue (1-2 and 5 days)
                                html = template(customerName, dressName, brandName, dressSize, dressColour, booking._id, daysOverdue, returnUrl);
                            }

                            await sendEmail({
                                to: booking.customer.email,
                                subject: `URGENT: ${newStatus.toUpperCase()} - Action Required`,
                                html
                            });

                            console.log(`[Cron] Sent ${newStatus} escalation email to ${booking.customer.email}`);
                        } catch (emailErr) {
                            console.error(`[Cron] Error sending escalation email for booking ${booking._id}:`, emailErr);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('[Cron] Overdue Escalation Job error:', err);
        }
    });
};
