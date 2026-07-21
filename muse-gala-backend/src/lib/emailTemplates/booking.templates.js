// Local Pickup: Ready for Pickup
export const readyForPickupTemplate = (
  userName,
  brandName,
  dressName,
  colour,
  dressSize,
  pickupLocation,
  pickupTime
) =>
  baseEmailTemplate({
    title: 'Your dress is ready for pickup',

    content: `
      <p>Hi ${userName},</p>
      <p>Pickup details are below:</p>
      <h3>Pickup Details</h3>
      ${createInfoBox({
      'Brand': brandName,
      'Dress': dressName,
      'Colour': colour,
      'Size': dressSize,
      'Pickup Location': pickupLocation || 'N/A',
      'Pickup Time': pickupTime || 'N/A',
    })}
      <p>Enjoy your event!</p>
      <p>— Muse Gala</p>
    `,
  });

// Local Pickup: Dress Picked Up
export const pickedUpByCustomerTemplate = (
  userName,
  brandName,
  dressName,
  colour,
  dressSize,
  pickupLocation,
  pickupTime
) =>
  baseEmailTemplate({
    title: 'Dress Picked Up',

    content: `
      <p>Hi ${userName},</p>
      <p>You have successfully picked up your dress.</p>
      <h3>Pickup Details</h3>
      ${createInfoBox({
      'Brand': brandName,
      'Dress': dressName,
      'Colour': colour,
      'Size': dressSize,
      'Pickup Location': pickupLocation || 'N/A',
      'Pickup Time': pickupTime || 'N/A',
    })}
      <p>Enjoy your event!</p>
      <p>— Muse Gala</p>
    `,
  });
// ✅ Booking Email Templates
import { baseEmailTemplate, createInfoBox, createStatusBadge } from './baseTemplate.js';

export const bookingCreatedTemplate = (
  userName,
  brandName,
  dressName,
  colour,
  dressSize,
  deliveryMethod,
  rentalDays,
  totalAmount
) =>
  baseEmailTemplate({
    title: 'Your booking is being reviewed',

    content: `
      <p>Hi ${userName},</p>
      <p>Your booking has been received.<br>The lender is reviewing availability and will confirm shortly.</p>
      <h3>Booking details</h3>
      ${createInfoBox({
      'Brand': brandName,
      'Dress': dressName,
      'Colour': colour,
      'Size': dressSize,
      'Delivery method': deliveryMethod,
      'Rental duration': `${rentalDays} days`,
      'Total': `$${totalAmount}`,
    })}
      <p>We’ll be in touch as soon as there’s an update.</p>
      <p>We’ll send you a return link before your due date to confirm return.</p>
      <p>— Muse Gala</p>
    `,
  });

export const adminNewBookingTemplate = (
  brandName,
  dressName,
  colour,
  dressSize,
  deliveryMethod,
  rentalDays,
  totalAmount
) =>
  baseEmailTemplate({
    title: 'New Booking Created',

    content: `
      <p>Hi Admin,</p>
      <p>A new booking has been placed on the platform.</p>
      <h3>Booking details</h3>
      ${createInfoBox({
      'Brand': brandName,
      'Dress': dressName,
      'Colour': colour,
      'Size': dressSize,
      'Delivery method': deliveryMethod,
      'Rental duration': `${rentalDays} days`,
      'Total': `$${totalAmount}`,
    })}
      <p>The lender has been notified and is reviewing availability.</p>
      <p>— Muse Gala System</p>
    `,
  });

export const lenderNewBookingTemplate = (
  userName,
  brandName,
  dressName,
  colour,
  dressSize,
  deliveryMethod,
  rentalDays
) =>
  baseEmailTemplate({
    title: 'You have a new booking request!',

    content: `
      <p>Hi ${userName},</p>
      <p>Great news! You have received a new booking request for your dress.</p>
      <h3>Booking details</h3>
      ${createInfoBox({
      'Brand': brandName,
      'Dress': dressName,
      'Colour': colour,
      'Size': dressSize,
      'Delivery method': deliveryMethod,
      'Rental duration': `${rentalDays} days`,
    })}
      <p>Please log in to your dashboard to review and accept the booking.</p>
      <p>— Muse Gala</p>
    `,
  });

export const bookingConfirmedTemplate = (
  userName,
  brandName,
  dressName,
  colour,
  dressSize,
  deliveryMethod,
  startDate,
  endDate,
  totalAmount,
  bookingId
) =>
  baseEmailTemplate({
    title: 'Order Accepted by Lender',

    content: `
      <p>Hi ${userName},</p>
      <p>Good news — your order has been accepted by the lender! Your dress is now reserved for your rental period.</p>
      <h3>Rental Details:</h3>
      ${createInfoBox({
      'Brand': brandName,
      'Style': dressName,
      'Size': dressSize,
      'Colour': colour,
      'Booking ID': bookingId || 'N/A',
      'Rental Dates': `${startDate} to ${endDate}`,
      'Total Paid': `$${totalAmount}`,
    })}
      <p>We’ll notify you as soon as your dress is shipped or ready for pickup. If you have any questions, our team is here to help.</p>
      <p>Enjoy your special occasion!</p>
      <p>— Muse Gala</p>
    `,
  });

export const labelReadyTemplate = (
  userName,
  brandName,
  dressName,
  colour,
  dressSize,
  trackingInfo
) =>
  baseEmailTemplate({
    title: 'Your dress will be dispatched shortly',

    content: `
      <p>Hi ${userName},</p>
      <p>Your shipping label has been created.</p>
      <h3>Dress details</h3>
      ${createInfoBox({
      'Brand': brandName,
      'Dress': dressName,
      'Colour': colour,
      'Size': dressSize,
      'Shipping Info': trackingInfo,
    })}
      <p>Your dress will be dispatched shortly. Tracking will follow.</p>
      <p>— Muse Gala</p>
    `,
  });

export const shippedToCustomerTemplate = (
  userName,
  brandName,
  dressName,
  colour,
  dressSize,
  trackingNumber,
  shippingMethod
) =>
  baseEmailTemplate({
    title: 'Your dress is on its way',

    content: `
      <p>Hi ${userName},</p>
      <p>Your dress has been dispatched.</p>
      <h3>Dress details</h3>
      ${createInfoBox({
      'Brand': brandName,
      'Dress': dressName,
      'Colour': colour,
      'Size': dressSize,
      'Shipping Method': shippingMethod || 'N/A',
      'Tracking Number': trackingNumber || 'N/A',
    })}
      <p>Track your delivery <a href="${process.env.FRONTEND_URL || 'https://musegala.com.au'}/account/chats">here</a>.</p>
      <p>— Muse Gala</p>
    `,
  });

export const dressDeliveredTemplate = (
  userName,
  brandName,
  dressName,
  colour,
  dressSize,
  returnDeadline
) =>
  baseEmailTemplate({
    title: 'Your dress has arrived',

    content: `
      <p>Hi ${userName},</p>
      <p>Your dress has arrived.</p>
      <p>We hope it’s everything you were looking for. If anything isn’t quite right, please let us know as soon as possible.</p>
      <h3>Dress details</h3>
      ${createInfoBox({
      'Brand': brandName,
      'Dress': dressName,
      'Colour': colour,
      'Size': dressSize,
      'Return Deadline': returnDeadline,
    })}
      <p>— Muse Gala</p>
    `,
  });

export const returnInitiatedTemplate = (
  userName,
  dressName,
  returnDeadline
) =>
  baseEmailTemplate({
    title: 'RETURN PROCESS INITIATED',

    content: `
      <p>Hello ${userName},</p>
      <p>Your return request has been initiated. Here are the next steps:</p>
      ${createInfoBox({
      'Dress': dressName,
      'Return Deadline': returnDeadline,
      'Status': 'Return Initiated',
    })}
      <p>Please package the dress securely and prepare it for return. A prepaid shipping label will be provided for you to print and use.</p>
    `,
  });

export const shippedToLenderTemplate = (
  userName,
  dressName,
  trackingNumber,
  estimatedDelivery
) =>
  baseEmailTemplate({
    title: 'DRESS RETURN SHIPPED',

    content: `
      <p>Hello ${userName},</p>
      <p>Your dress has been shipped back to the lender. Thank you for renting with us!</p>
      ${createInfoBox({
      'Dress': dressName,
      'Tracking Number': trackingNumber,
      'Estimated Delivery': estimatedDelivery,
      'Status': 'Shipped to Lender',
    })}
      <p>Once the lender confirms receipt and inspection, your refund will be processed (if applicable).</p>
    `,
  });

export const bookingCompletedTemplate = (
  userName,
  dressName,
  rentalDays,
  refundAmount,
  refundStatus
) =>
  baseEmailTemplate({
    title: 'BOOKING COMPLETED',

    content: `
      <p>Hello ${userName},</p>
      <p>Thank you for choosing Muse Gala! Your booking has been completed successfully.</p>
      <div style="margin: 20px 0;">
        ${createStatusBadge('Completed ✓', 'success')}
      </div>
      ${createInfoBox({
      'Dress': dressName,
      'Rental Duration': `${rentalDays} days`,
      ...(refundAmount ? { 'Refund Amount': `$${refundAmount}` } : {}),
      'Refund Status': refundStatus,
    })}
      <p>We hope you had a wonderful experience. Please consider leaving a review to help other customers.</p>
      <p>We can't wait to see you again for your next special occasion!</p>
    `,
    buttonText: 'LEAVE A REVIEW',
    buttonUrl: process.env.FRONTEND_URL || 'https://musegala.com.au',
  });

export const bookingCancelledTemplate = (
  userName,
  brandName,
  dressName,
  colour,
  dressSize
) =>
  baseEmailTemplate({
    title: 'BOOKING CANCELLED',

    content: `
      <p>Hi ${userName},</p>
      <p>Your booking has been cancelled.</p>
      <h3>Booking details</h3>
      ${createInfoBox({
      'Brand': brandName,
      'Dress': dressName,
      'Colour': colour,
      'Size': dressSize,
    })}
      <p>— Muse Gala</p>
    `,
  });

export const bookingRejectedTemplate = (
  userName,
  brandName,
  dressName,
  colour,
  dressSize,
  deliveryMethod
) =>
  baseEmailTemplate({
    title: 'Update on your booking',

    content: `
      <p>Hi ${userName},</p>
      <p>Unfortunately, this booking couldn’t be confirmed.</p>
      <h3>Booking details</h3>
      ${createInfoBox({
      'Brand': brandName,
      'Dress': dressName,
      'Colour': colour,
      'Size': dressSize,
      'Delivery method': deliveryMethod,
    })}
      <p>Availability can change quickly. If you’d like help finding an alternative or have questions about this booking, our team is happy to assist.</p>
      <p>No charges have been made.</p>
      <p>— Muse Gala</p>
    `,
  });

export const paymentFailedTemplate = (userName, dressName, amount, error) =>
  baseEmailTemplate({
    title: 'PAYMENT FAILED',
    content: `
      <p>Hi ${userName},</p>
      <p>We were unable to process payment for your booking of <strong>${dressName}</strong>.</p>
      ${createInfoBox({
      'Amount': `$${amount}`,
      'Issue': error,
    })}
      <p>Please update your payment method from the "My Account" page to keep your booking.</p>
      <p>— Muse Gala</p>
    `,
    buttonText: 'Update Payment Method',
    buttonUrl: `${process.env.FRONTEND_URL || 'https://musegala.com.au'}/account`,
  });

export const paymentMethodUpdatedCustomerTemplate = (userName) =>
  baseEmailTemplate({
    title: 'PAYMENT METHOD UPDATED',
    content: `
      <p>Hi ${userName},</p>
      <p>Your payment method has been updated successfully.</p>
      <p>The lender has been notified to retry processing your booking.</p>
      <p>— Muse Gala</p>
    `,
  });

export const paymentMethodUpdatedLenderTemplate = (lenderName, customerName, bookingId) =>
  baseEmailTemplate({
    title: 'CUSTOMER UPDATED PAYMENT METHOD',
    content: `
      <p>Hi ${lenderName},</p>
      <p>The customer (${customerName}) has successfully updated their payment method for Booking ID: ${bookingId}.</p>
      <p>You can now log into your dashboard and click "Retry Payment" to process this booking.</p>
      <p>— Muse Gala</p>
    `,
    buttonText: 'Retry Payment',
    buttonUrl: `${process.env.LENDER_FRONTEND_URL || 'https://lender.musegala.com.au'}/bookings/${bookingId}`,
  });

export const shipmentPreparingTemplate = (userName, dressName, estimatedShipDate) =>
  baseEmailTemplate({
    title: 'PREPARING YOUR SHIPMENT',

    content: `
      <p>Hi ${userName},</p>
      <p>We’re getting your dress <strong>${dressName}</strong> ready for shipment.</p>
      ${createInfoBox({
      'Estimated ship date': estimatedShipDate,
    })}
      <p>We’ll notify you once it’s on the way.</p>
      <p>— Muse Gala</p>
    `,
  });

export const paymentMethodUpdatedGeneralTemplate = (userName) =>
  baseEmailTemplate({
    title: 'PAYMENT METHOD UPDATED',
    content: `
      <p>Hi ${userName},</p>
      <p>Your payment method has been updated successfully.</p>
      <p>You can now use this payment method for your future bookings.</p>
      <p>— Muse Gala</p>
    `,
  });

