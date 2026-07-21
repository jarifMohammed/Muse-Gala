import mongoose from 'mongoose';
import logger from '../../../core/config/logger.js';
import { Booking } from '../booking.model.js';
import { generateReturnToken, verifyReturnToken, buildReturnUrl } from '../../../lib/returnToken.js';
import { sendEmail } from '../../../lib/resendEmial.js';
import {
    returnReminderTemplate,
    returnConfirmedTemplate,
    lenderReturnNotificationTemplate
} from '../../../lib/emailTemplates/return.templates.js';

// Import Socket.IO instance for real-time updates
let ioInstance = null;
const getIO = async () => {
    if (!ioInstance) {
        const { io } = await import('../../../app.js');
        ioInstance = io;
    }
    return ioInstance;
};

/**
 * Emit return status update to all relevant rooms
 */
const emitReturnStatusUpdate = async (booking, status) => {
    try {
        const io = await getIO();
        const payload = {
            bookingId: booking._id,
            status,
            updatedAt: new Date()
        };

        // Notify customer
        if (booking.customer) {
            const customerId = booking.customer._id || booking.customer;
            io.to(`user-${customerId}`).emit('returnStatusUpdate', payload);
        }

        // Notify lender
        if (booking.allocatedLender?.lenderId) {
            io.to(`user-${booking.allocatedLender.lenderId}`).emit('returnStatusUpdate', payload);
        }

        // Notify all admins (find admin users and emit to their rooms)
        const User = mongoose.model('User');
        const admins = await User.find({ role: { $in: ['ADMIN', 'SUPER_ADMIN'] } }, '_id').lean();
        for (const admin of admins) {
            io.to(`user-${admin._id}`).emit('returnStatusUpdate', payload);
        }
    } catch (err) {
        console.error('[ReturnFlow] Socket.IO emission error:', err);
    }
};

/**
 * Push a status change to statusHistory
 */
const pushStatusHistory = (booking, status, updatedBy = null, reason = '') => {
    booking.statusHistory.push({
        status,
        timestamp: new Date(),
        updatedBy,
        reason
    });
};


// ─────────────────────────────────────────────────────
// LENDER STATUS TRIGGERS
// ─────────────────────────────────────────────────────

/**
 * Called when lender sets status to "Return Due".
 * Generates return token, sends return link email, updates status.
 */
export const handleReturnDueStatus = async (bookingId) => {
    const booking = await Booking.findById(bookingId)
        .populate('customer', 'firstName name email')
        .populate('masterdressId', 'dressName brand colors images');

    if (!booking) throw new Error('Booking not found');

    // Always generate/regenerate return token to update expiry date
    await generateReturnToken(bookingId);

    // Re-fetch to get the updated token from DB
    const updatedBooking = await Booking.findById(bookingId)
        .populate('customer', 'firstName name email')
        .populate('masterdressId', 'dressName brand colors images')
        .populate('allocatedLender.lenderId', 'returnAddress businessAddress location');

    const customerName = updatedBooking.customer?.firstName || updatedBooking.customer?.name || 'Customer';
    const dressName = updatedBooking.masterdressId?.dressName || updatedBooking.dressName || 'Your Dress';
    const brandName = updatedBooking.masterdressId?.brand || 'N/A';
    const dressSize = updatedBooking.size || 'N/A';
    const dressColour = updatedBooking.masterdressId?.colors?.[0] || 'N/A';
    const returnAddress = updatedBooking.allocatedLender?.lenderId?.returnAddress || updatedBooking.allocatedLender?.lenderId?.businessAddress || 'Please contact lender for return address';

    const dueDate = new Date(updatedBooking.rentalEndDate).toLocaleDateString('en-AU', {
        timeZone: 'Australia/Sydney',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    logger.info(`SERVICE: handleReturnDueStatus called for ${bookingId}`);

    console.log(`[ReturnFlow] Processing Return Due for booking ${bookingId}. Customer: ${updatedBooking.customer?.email}, Dress: ${dressName}`);

    if (!updatedBooking.returnToken) {
        logger.error(`SERVICE: Token generation FAILED for ${bookingId}`);
        console.error(`[ReturnFlow] Token generation FAILED for booking ${bookingId}`);
        throw new Error('Failed to generate return token. Please try again or contact support.');
    }

    const returnUrl = buildReturnUrl(updatedBooking.returnToken);
    console.log(`[ReturnFlow] Generated return URL: ${returnUrl}`);
    logger.info(`SERVICE: Generated URL ${returnUrl}`);
    if (booking.customer?.email) {
        try {
            console.log(`[ReturnFlow] Sending return link email to ${booking.customer.email} for booking ${bookingId}`);
            await sendEmail({
                to: booking.customer.email,
                subject: 'Return Your Dress - Action Required',
                html: returnReminderTemplate(
                    customerName,
                    dressName,
                    brandName,
                    dressSize,
                    dressColour,
                    booking._id,
                    dueDate,
                    returnUrl,
                    'initial',
                    returnAddress
                )
            });
            console.log(`[ReturnFlow] Email sent successfully for booking ${bookingId}`);
        } catch (emailErr) {
            console.error('[ReturnFlow] Error sending return link email:', emailErr);
        }
    } else {
        console.warn(`[ReturnFlow] Cannot send email for booking ${bookingId}: Customer email missing`);
    }

    // Update status to ReturnLinkSent (using direct update to avoid triggering post-save again)
    await Booking.findByIdAndUpdate(bookingId, {
        $set: {
            deliveryStatus: 'ReturnLinkSent',
            lastReminderSentAt: new Date(),
            reminderCount: 1
        },
        $push: {
            statusHistory: {
                status: 'ReturnLinkSent',
                timestamp: new Date(),
                reason: 'Return link sent to customer (lender marked Return Due)'
            }
        }
    });

    await emitReturnStatusUpdate(booking, 'ReturnLinkSent');

    console.log(`[ReturnFlow] Return link sent for booking ${bookingId}`);
};

/**
 * Called when lender sets status to "Dress Returned".
 * Stops all reminders, marks as ReceivedByLender.
 */
export const handleDressReturnedStatus = async (bookingId) => {
    const booking = await Booking.findById(bookingId)
        .populate('customer', 'firstName name email')
        .populate('masterdressId', 'dressName brand');

    if (!booking) throw new Error('Booking not found');

    // Update booking using direct update to avoid triggering post-save again
    await Booking.findByIdAndUpdate(bookingId, {
        $set: {
            deliveryStatus: 'ReceivedByLender',
            returnRemindersStopped: true,
            lenderReceivedAt: new Date()
        },
        $push: {
            statusHistory: {
                status: 'ReceivedByLender',
                timestamp: new Date(),
                reason: 'Lender confirmed dress received (marked Dress Returned)'
            }
        }
    });

    // Send confirmation email to customer
    const customerName = booking.customer?.firstName || booking.customer?.name || 'Customer';
    const dressName = booking.masterdressId?.dressName || booking.dressName || 'Your Dress';
    const brandName = booking.masterdressId?.brand || 'N/A';

    if (booking.customer?.email) {
        try {
            await sendEmail({
                to: booking.customer.email,
                subject: 'Return Completed - Dress Received',
                html: returnConfirmedTemplate(customerName, dressName, brandName, booking._id, 'ReceivedByLender')
            });
        } catch (emailErr) {
            console.error('[ReturnFlow] Error sending return confirmed email:', emailErr);
        }
    }

    await emitReturnStatusUpdate(booking, 'ReceivedByLender');

    console.log(`[ReturnFlow] Dress returned confirmed for booking ${bookingId}`);
};


// ─────────────────────────────────────────────────────
// PUBLIC CUSTOMER ENDPOINTS (NO AUTH)
// ─────────────────────────────────────────────────────

/**
 * Get return page data using the secure token (no auth needed).
 */
export const getReturnPageData = async (token) => {
    const booking = await verifyReturnToken(token);

    const dueDate = new Date(booking.rentalEndDate).toLocaleDateString('en-AU', {
        timeZone: 'Australia/Sydney',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return {
        bookingId: booking._id,
        dressName: booking.masterdressId?.dressName || booking.dressName || 'Your Dress',
        dressImage: booking.masterdressId?.images?.[0] || null,
        dressBrand: booking.masterdressId?.brand || null,
        returnDueDate: dueDate,
        rentalEndDate: booking.rentalEndDate,
        currentStatus: booking.deliveryStatus,
        returnMethod: booking.returnMethod || null,
        returnTrackingNumber: booking.returnTrackingNumber || null,
        returnConfirmedAt: booking.returnConfirmedAt || null,
        customerName: booking.customer?.firstName || booking.customer?.name || 'Customer',
        // Express shipping instruction text
        expressShippingInstruction: 'Please lodge your parcel in a yellow Australia Post Express Post box or at the post office counter. Enter your tracking number below once lodged.',
        // Available return methods
        returnMethods: [
            { value: 'LocalDropOff', label: 'Local Drop-Off' },
            { value: 'ExpressShipping', label: 'Express Shipping' }
        ]
    };
};

/**
 * Submit a return via the secure token (no auth needed).
 */
export const submitReturn = async (token, { returnMethod, trackingNumber, returnNotes, receiptPhoto }) => {
    const booking = await verifyReturnToken(token);

    // Validate return method
    if (!returnMethod || !['LocalDropOff', 'ExpressShipping'].includes(returnMethod)) {
        throw new Error('Please select a valid return method');
    }

    // Validate tracking number for express shipping
    if (returnMethod === 'ExpressShipping' && !trackingNumber) {
        throw new Error('Tracking number is required for express shipping');
    }

    // Determine new status
    let newStatus;
    if (returnMethod === 'ExpressShipping') {
        newStatus = 'InTransit';
    } else {
        newStatus = 'DroppedOff';
    }

    // Update booking using direct update to avoid post-save hook re-trigger
    const updateData = {
        deliveryStatus: newStatus,
        returnMethod,
        returnNotes: returnNotes || '',
        returnConfirmedAt: new Date(),
        returnRemindersStopped: true
    };

    if (returnMethod === 'ExpressShipping') {
        updateData.returnTrackingNumber = trackingNumber;
        if (receiptPhoto) updateData.returnReceiptPhoto = receiptPhoto;
    } else {
        updateData.returnDroppedOffAt = new Date();
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
        booking._id,
        {
            $set: updateData,
            $push: {
                statusHistory: {
                    status: newStatus,
                    timestamp: new Date(),
                    reason: returnMethod === 'ExpressShipping'
                        ? `Customer shipped via Express Post (tracking: ${trackingNumber})`
                        : 'Customer confirmed local drop-off'
                }
            }
        },
        { new: true }
    );

    // Notify lender that return is incoming
    const User = mongoose.model('User');
    const lender = await User.findById(booking.allocatedLender?.lenderId);
    const dressName = booking.masterdressId?.dressName || booking.dressName || 'Your Dress';

    if (lender?.email) {
        try {
            await sendEmail({
                to: lender.email,
                subject: 'Return Incoming - Customer Has Shipped/Dropped Off',
                html: lenderReturnNotificationTemplate(
                    lender.firstName || lender.name || 'Lender',
                    dressName,
                    returnMethod,
                    trackingNumber || null,
                    returnNotes || '',
                    receiptPhoto || null
                )
            });
        } catch (emailErr) {
            console.error('[ReturnFlow] Error sending lender notification:', emailErr);
        }
    }

    // Send confirmation email to customer
    const customerName = booking.customer?.firstName || booking.customer?.name || 'Customer';
    const brandName = booking.masterdressId?.brand || 'N/A';

    if (booking.customer?.email) {
        try {
            await sendEmail({
                to: booking.customer.email,
                subject: 'Return Confirmed',
                html: returnConfirmedTemplate(customerName, dressName, brandName, booking._id, newStatus)
            });
        } catch (emailErr) {
            console.error('[ReturnFlow] Error sending customer confirmation email:', emailErr);
        }
    }

    await emitReturnStatusUpdate(updatedBooking, newStatus);

    return {
        status: newStatus,
        message: returnMethod === 'ExpressShipping'
            ? 'Return confirmed! Your parcel is being tracked.'
            : 'Drop-off confirmed! The lender will verify receipt.',
        returnMethod,
        trackingNumber: trackingNumber || null,
        confirmedAt: updateData.returnConfirmedAt
    };
};

/**
 * Generate a return link for a booking (admin/on-demand)
 */
export const generateReturnLink = async (bookingId) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error('Booking not found');

    let token = booking.returnToken;
    if (!token) {
        const result = await generateReturnToken(bookingId);
        token = result.token;
    }

    return {
        returnUrl: buildReturnUrl(token),
        token,
        expiresAt: booking.returnTokenExpiresAt
    };
};


// ─────────────────────────────────────────────────────
// LENDER ACTIONS (AUTHENTICATED)
// ─────────────────────────────────────────────────────

/**
 * Lender reports an issue with a returned item
 */
export const lenderReportIssue = async (bookingId, lenderId, { issueType, issueNotes }) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error('Booking not found');

    // Verify lender owns this booking
    if (booking.allocatedLender?.lenderId?.toString() !== lenderId.toString()) {
        throw new Error('Unauthorized: Not the allocated lender for this booking');
    }

    if (!issueType) throw new Error('Issue type is required');

    await Booking.findByIdAndUpdate(bookingId, {
        $set: {
            deliveryStatus: 'IssueReported',
            lenderIssueType: issueType,
            lenderIssueNotes: issueNotes || ''
        },
        $push: {
            statusHistory: {
                status: 'IssueReported',
                timestamp: new Date(),
                updatedBy: lenderId,
                reason: `Lender reported issue: ${issueType}${issueNotes ? ' - ' + issueNotes : ''}`
            }
        }
    });

    const updatedBooking = await Booking.findById(bookingId);
    await emitReturnStatusUpdate(updatedBooking, 'IssueReported');

    return { status: 'IssueReported', issueType, issueNotes };
};


// ─────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────

/**
 * Get all returns requiring admin attention (flagged returns)
 */
export const getReturnsRequiringAttention = async ({ page = 1, limit = 20 }) => {
    const now = new Date();

    // Find bookings that need attention:
    // 1. Due date passed + not confirmed
    // 2. Shipping selected but tracking missing
    // 3. "InTransit" for 5+ days with no lender confirmation
    // 4. Lender reported issue
    // 5. Any overdue/escalated status
    const flagStatuses = [
        'ReturnLinkSent',
        'LateReturn',
        'Overdue',
        'Escalated',
        'HighRisk',
        'NonReturned',
        'IssueReported',
        'InTransit',
        'DroppedOff',
        'AwaitingLenderConfirmation'
    ];

    const filter = {
        $or: [
            // Flagged statuses
            { deliveryStatus: { $in: flagStatuses } },
            // Return Due but past the rental end date
            {
                deliveryStatus: 'Return Due',
                rentalEndDate: { $lt: now }
            }
        ]
    };

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
        Booking.find(filter)
            .populate('customer', 'firstName name email phone')
            .populate('allocatedLender.lenderId', 'firstName name email')
            .populate('masterdressId', 'dressName brand images')
            .sort({ rentalEndDate: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Booking.countDocuments(filter)
    ]);

    // Compute days overdue and flags for each booking
    const results = bookings.map(b => {
        const dueDate = new Date(b.rentalEndDate);
        const daysOverdue = Math.max(0, Math.floor((now - dueDate) / (1000 * 60 * 60 * 24)));

        // Determine flag reasons
        const flags = [];
        if (daysOverdue > 0 && !b.returnConfirmedAt) flags.push('Overdue - not confirmed');
        if (b.returnMethod === 'ExpressShipping' && !b.returnTrackingNumber) flags.push('Shipping selected but no tracking');
        if (b.deliveryStatus === 'InTransit' && daysOverdue > 5) flags.push('In transit too long');
        if (b.deliveryStatus === 'IssueReported') flags.push(`Issue: ${b.lenderIssueType || 'Unknown'}`);
        if (b.deliveryStatus === 'Escalated') flags.push('Escalated overdue');
        if (b.deliveryStatus === 'HighRisk') flags.push('High risk return');
        if (b.deliveryStatus === 'NonReturned') flags.push('Non-returned');

        return {
            bookingId: b._id,
            customerName: b.customer?.firstName || b.customer?.name || 'N/A',
            customerEmail: b.customer?.email || 'N/A',
            customerPhone: b.customer?.phone || 'N/A',
            lenderName: b.allocatedLender?.lenderId?.firstName || b.allocatedLender?.lenderId?.name || 'N/A',
            lenderEmail: b.allocatedLender?.lenderId?.email || 'N/A',
            dressName: b.masterdressId?.dressName || b.dressName || 'N/A',
            returnDueDate: dueDate,
            daysOverdue,
            returnMethod: b.returnMethod || 'Not selected',
            trackingNumber: b.returnTrackingNumber || null,
            currentStatus: b.deliveryStatus,
            customerNotes: b.returnNotes || b.customerNotes || '',
            flags,
            suggestedLateFee: b.suggestedLateFee || 0,
            suggestedReplacementFee: b.suggestedReplacementFee || 0,
            lateFeeApproved: b.lateFeeApproved || false,
            receiptPhoto: b.returnReceiptPhoto || null,
            overdueEscalationLevel: b.overdueEscalationLevel || 0
        };
    });

    return {
        data: results,
        pagination: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

/**
 * Get overdue summary statistics
 */
export const getOverdueSummary = async () => {
    const now = new Date();

    const [lateReturn, overdue, escalated, highRisk, nonReturned, issueReported] = await Promise.all([
        Booking.countDocuments({ deliveryStatus: 'LateReturn' }),
        Booking.countDocuments({ deliveryStatus: 'Overdue' }),
        Booking.countDocuments({ deliveryStatus: 'Escalated' }),
        Booking.countDocuments({ deliveryStatus: 'HighRisk' }),
        Booking.countDocuments({ deliveryStatus: 'NonReturned' }),
        Booking.countDocuments({ deliveryStatus: 'IssueReported' })
    ]);

    return {
        lateReturn,
        overdue,
        escalated,
        highRisk,
        nonReturned,
        issueReported,
        totalRequiringAttention: lateReturn + overdue + escalated + highRisk + nonReturned + issueReported
    };
};

/**
 * Admin approves a charge (late fee, damage fee, replacement cost).
 * Does NOT auto-charge — records the approval for manual processing.
 */
export const adminApproveCharge = async (bookingId, { feeType, amount, adminNotes }, adminId) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error('Booking not found');

    const updateData = {
        lateFeeApproved: true,
        lateFeeChargedAt: new Date(),
        adminNotes: adminNotes || booking.adminNotes
    };

    if (feeType === 'lateFee') {
        updateData.suggestedLateFee = amount;
    } else if (feeType === 'replacementFee') {
        updateData.suggestedReplacementFee = amount;
    }

    await Booking.findByIdAndUpdate(bookingId, {
        $set: updateData,
        $push: {
            statusHistory: {
                status: booking.deliveryStatus,
                timestamp: new Date(),
                updatedBy: adminId,
                reason: `Admin approved ${feeType}: $${amount}${adminNotes ? ' - ' + adminNotes : ''}`
            }
        }
    });

    return {
        bookingId,
        feeType,
        amount,
        approvedAt: updateData.lateFeeChargedAt,
        message: `${feeType} of $${amount} approved for manual processing`
    };
};

/**
 * Check if reminders should be stopped for a booking
 */
export const shouldStopReminders = (booking) => {
    return (
        booking.returnRemindersStopped === true ||
        booking.returnConfirmedAt != null ||
        booking.returnTrackingNumber != null ||
        booking.lenderReceivedAt != null ||
        booking.deliveryStatus === 'ReceivedByLender' ||
        booking.deliveryStatus === 'Completed' ||
        booking.deliveryStatus === 'Dress Returned'
    );
};
