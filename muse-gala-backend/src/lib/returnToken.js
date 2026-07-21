import { nanoid } from 'nanoid';
import { Booking } from '../entities/booking/booking.model.js';

/**
 * Generate a secure return token for a booking.
 * Token expires 14 days after the booking's rentalEndDate.
 * @param {String} bookingId - The booking ID
 * @returns {Object} { token, expiresAt }
 */
export const generateReturnToken = async (bookingId) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error('Booking not found');

    // Generate a 32-char URL-safe token
    const token = nanoid(32);

    // Expiry: 1 month (30 days) after rental end date
    const expiresAt = new Date(booking.rentalEndDate);
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Store on the booking using direct update to avoid triggering hooks
    await Booking.findByIdAndUpdate(bookingId, {
        $set: {
            returnToken: token,
            returnTokenExpiresAt: expiresAt
        }
    });

    return { token, expiresAt };
};

/**
 * Verify a return token and return the associated booking.
 * @param {String} token - The return token from URL
 * @returns {Object} The booking document (populated)
 */
export const verifyReturnToken = async (token) => {
    const booking = await Booking.findOne({ returnToken: token })
        .populate('customer', 'firstName name email phone')
        .populate('masterdressId', 'dressName brand colors images');

    if (!booking) {
        throw new Error('Invalid or expired return link');
    }

    if (booking.returnTokenExpiresAt && new Date() > booking.returnTokenExpiresAt) {
        throw new Error('This return link has expired. Please contact support.');
    }

    return booking;
};

/**
 * Build the full return URL for a booking.
 * @param {String} token - The return token
 * @returns {String} Full return URL
 */
export const buildReturnUrl = (token) => {
    const baseUrl = process.env.FRONTEND_URL || 'https://musegala.com.au';
    return `${baseUrl}/return/${token}`;
};
