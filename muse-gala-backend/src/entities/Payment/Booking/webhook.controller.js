import mongoose from 'mongoose';
import { sendEmail } from '../../../lib/resendEmial.js';
import User from '../../auth/auth.model.js';
import { Booking } from '../../booking/booking.model.js';
import { ChatRoom } from '../../message/chatRoom.model.js';
import Payment from './payment.model.js';
import { refundProcessedTemplate } from '../../../lib/emailTemplates/dispute.templates.js';
import { bookingCreatedTemplate, adminNewBookingTemplate, lenderNewBookingTemplate, paymentMethodUpdatedGeneralTemplate } from '../../../lib/emailTemplates/booking.templates.js';

/**
 * Handle Stripe webhook events for booking payments
 */

export const handleBookingPaymentEvents = async (event) => {
  try {
    switch (event.type) {
      // Payment completed successfully via checkout
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { paymentId, bookingId } = session.metadata;

        if (paymentId) {
          const payment = await Payment.findById(paymentId);
          if (payment && payment.status !== 'Paid') {
            payment.status = 'Paid';
            payment.stripe.paymentIntentId = session.payment_intent;
            await payment.save();
          }
        }

        if (!bookingId) {
          if (session.mode === 'setup') {
            const userId = session.metadata?.userId;
            if (userId) {
              try {
                const user = await User.findById(userId);
                if (user && user.email) {
                  await sendEmail({
                    to: user.email,
                    subject: 'Payment Method Updated',
                    html: paymentMethodUpdatedGeneralTemplate(user.firstName || user.name || 'User')
                  });
                  console.log(`📧 General payment update email sent to ${user.email}`);
                }
              } catch (emailErr) {
                console.error('Error sending payment update email:', emailErr);
              }
            }
          }
          break;
        }

        // Update Booking if it's a direct payment
        const updateData = {};
        if (session.mode === 'payment') {
          updateData.paymentStatus = 'Paid';
        }

        const booking = await Booking.findByIdAndUpdate(
          bookingId,
          updateData,
          { new: true }
        ).populate(['customer', 'lender', 'masterdressId']);

        if (!booking) {
          console.warn(`Booking not found: ${bookingId}`);
          break;
        }

        console.log(
          `Checkout session completed (${session.mode}): Booking ${bookingId}`
        );

        console.log(
          `Checkout session completed: Payment ${paymentId}, Booking ${bookingId}`
        );

        const customerId = booking.customer?._id || booking.customer;
        const lenderId =
          booking.allocatedLender?.lenderId || booking.lender?._id || booking.lender;

        // Mark loyalty discount as used if no promo code was applied
        if (customerId) {
          try {
            const promoCodeUsageModel = (await import('../../booking/promoCodeUsage.model.js')).default;
            const promoUsage = await promoCodeUsageModel.findOne({ bookingId: booking._id });
            
            if (!promoUsage) {
              const userToUpdate = await User.findById(customerId);
              if (userToUpdate) {
                const userTotalSpent = Number(userToUpdate.totalSpent ?? 0);
                let changed = false;
                
                if (userTotalSpent >= 600 && userToUpdate.spent600DiscountUsed === false) {
                  userToUpdate.spent600DiscountUsed = true;
                  changed = true;
                } else if (userTotalSpent >= 300 && userToUpdate.spent300DiscountUsed === false) {
                  userToUpdate.spent300DiscountUsed = true;
                  changed = true;
                } else if (userToUpdate.firstBookingDiscountUsed === false) {
                  userToUpdate.firstBookingDiscountUsed = true;
                  changed = true;
                }
                
                if (changed) {
                  await userToUpdate.save();
                  console.log(`Marked loyalty discount as used for user ${customerId}`);
                }
              }
            }
          } catch (err) {
            console.error('Error updating loyalty discount usage:', err);
          }
        }

        if (!customerId || !lenderId) {
          console.warn(
            `Skipping ChatRoom creation for booking ${bookingId}: missing customer or lender`
          );
        } else {
          // Create ChatRoom if not exists, include both customer and allocated lender
          let chatRoom = await ChatRoom.findOne({ bookingId });
          if (!chatRoom) {
            chatRoom = await ChatRoom.create({
              bookingId,
              participants: [customerId, lenderId],
              createdBy: customerId
            });
            console.log(
              `ChatRoom created for booking ${bookingId} with participants [${customerId}, ${lenderId}]`
            );
          } else {
            // ensure both are in participants even if room already exists
            await ChatRoom.findByIdAndUpdate(
              chatRoom._id,
              {
                $addToSet: {
                  participants: {
                    $each: [customerId, lenderId]
                  }
                }
              },
              { new: true }
            );
            console.log(
              `ChatRoom already exists, ensured participants [${customerId}, ${lenderId}]`
            );
          }
        }

        // Send email alerts to admins who opted in (Only for actual payments)
        if (paymentId) {
          const adminsToNotify = await User.find({
            role: 'ADMIN',
            'notificationPreferences.receiveEmailAlertsForNewOrders': {
              $exists: true,
              $eq: true
            }
          }).select('email lastName notificationPreferences');

          if (adminsToNotify.length > 0) {
            const subject = '📦 New Order Received';

            const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <div style="background-color: #4CAF50; color: white; padding: 16px; text-align: center;">
            <h2 style="margin: 0;">New Order Notification</h2>
          </div>

          <!-- Body -->
          <div style="padding: 20px; color: #333; line-height: 1.6;">
            <p style="font-size: 16px;">Hello Admin,</p>
            <p style="font-size: 15px;">A new order has been placed and payment completed successfully. 🎉</p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Booking ID</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${bookingId}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Customer Name</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${booking?.customer?.lastName || 'Unknown'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Customer Email</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${booking?.customer?.email || 'Unknown'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Payment ID</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${paymentId}</td>
              </tr>
            </table>
          </div>

          <!-- Footer -->
          <div style="background-color: #f4f4f4; padding: 12px; text-align: center; font-size: 12px; color: #666;">
            <p style="margin: 0;">This is an automated notification. Please do not reply.</p>
          </div>
        </div>
        `;

            // Send email to each admin
            await Promise.all(
              adminsToNotify.map((admin) =>
                sendEmail({ to: admin.email, subject, html })
              )
            );

            console.log(
              `📧 Email sent to ${adminsToNotify.length} admin(s) about new order`
            );
          }
        }

        // Send "Pending Lender Approval" confirmation email to customer and lender
        try {
          if (booking.customer?.email) {
            await sendEmail({
              to: booking.customer.email,
              subject: 'Booking Confirmation - Pending Lender Approval',
              html: bookingCreatedTemplate(
                booking.customer.firstName || booking.customer.name || 'Customer',
                booking.masterdressId?.brand || 'N/A',
                booking.masterdressId?.dressName || 'N/A',
                booking.color || booking.masterdressId?.colors?.[0] || 'N/A',
                booking.size || 'N/A',
                booking.deliveryMethod || 'N/A',
                booking.rentalDurationDays?.toString() || 'N/A',
                booking.totalAmount?.toFixed(2) || '0.00'
              )
            });
          }

          if (booking.lender?.email) {
            await sendEmail({
              to: booking.lender.email,
              subject: 'New Booking Request for Your Dress',
              html: lenderNewBookingTemplate(
                booking.lender.firstName || booking.lender.name || 'Lender',
                booking.masterdressId?.brand || 'N/A',
                booking.masterdressId?.dressName || 'N/A',
                booking.color || booking.masterdressId?.colors?.[0] || 'N/A',
                booking.size || 'N/A',
                booking.deliveryMethod || 'N/A',
                booking.rentalDurationDays?.toString() || 'N/A'
              )
            });
          }

          // Notify Admin
          try {
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@topocreates.com';
            await sendEmail({
              to: adminEmail,
              subject: `[Admin Notification] New Booking Request - ID: ${bookingId}`,
              html: adminNewBookingTemplate(
                booking.masterdressId?.brand || 'N/A',
                booking.masterdressId?.dressName || 'N/A',
                booking.color || booking.masterdressId?.colors?.[0] || 'N/A',
                booking.size || 'N/A',
                booking.deliveryMethod || 'N/A',
                booking.rentalDurationDays?.toString() || 'N/A',
                booking.totalAmount?.toFixed(2) || '0.00'
              )
            });
          } catch (adminEmailError) {
            console.error('Error sending admin copy booking confirmation email in webhook:', adminEmailError);
          }

          console.log(`📧 Booking confirmation emails sent for booking ${bookingId}`);
        } catch (emailError) {
          console.error('Error sending booking confirmation emails in webhook:', emailError);
        }

        break;
      }

      // Extra safety: payment intent succeeded
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const payment = await Payment.findOne({
          'stripe.paymentIntentId': paymentIntent.id
        });
        if (!payment) return;

        if (payment.status !== 'Paid') {
          payment.status = 'Paid';
          await payment.save();
          console.log(`✅ PaymentIntent succeeded: Payment ${payment._id}`);
        }
        break;
      }

      // Payment failed
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const payment = await Payment.findOne({
          'stripe.paymentIntentId': paymentIntent.id
        });
        if (!payment) return;

        payment.status = 'Failed';
        await payment.save();

        const booking = await Booking.findById(payment.bookingId);
        if (booking) booking.paymentStatus = 'Failed';
        await booking.save();

        console.warn(`❌ Payment failed: Payment ${payment._id}`);
        break;
      }

      // Checkout session expired
      case 'checkout.session.expired': {
        const session = event.data.object;
        const { paymentId, bookingId } = session.metadata;

        const payment = await Payment.findById(paymentId);
        if (!payment) return;
        if (payment.status !== 'Pending') return;

        payment.status = 'Expired';
        await payment.save();

        const booking = await Booking.findById(bookingId);
        if (booking) booking.paymentStatus = 'Expired';
        await booking.save();

        console.log(
          `⚠️ Checkout session expired: Payment ${paymentId}, Booking ${bookingId}`
        );
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`❌ Error handling Stripe event ${event.type}:`, err);
  }
};

// Payment/Booking/refund.handler.js

export const handleBookingRefundEvents = async (
  event,
  processedByUserId = null,
  refundAmountInput = null
) => {
  try {
    // 1️⃣ Safe extraction of the charge object
    const charge = event?.data?.object;
    if (!charge) {
      console.warn('⚠️ Stripe refund event missing data.object');
      return;
    }

    // 2️⃣ Find booking using the Payment Intent ID
    const booking = await Booking.findOne({
      stripePaymentIntentId: charge.payment_intent
    });
    if (!booking) {
      console.warn(
        `Booking not found for PaymentIntent ${charge.payment_intent}`
      );
      return;
    }

    // 3️⃣ Determine refund amount
    const refundedAmount =
      refundAmountInput != null
        ? refundAmountInput
        : charge.amount_refunded / 100 || booking.totalAmount;

    const totalAmount = booking.totalAmount || 0;
    const refundType = refundedAmount >= totalAmount ? 'Full' : 'Partial';

    // 4️⃣ Prepare refund record
    const stripeRefundId =
      charge.refunds?.data?.[0]?.id || charge.id || 'unknown';

    const refundRecord = {
      refundType,
      amount: refundedAmount,
      reason: charge.reason || 'Not specified',
      stripeRefundId,
      processedAt: new Date(),
      processedBy: processedByUserId
        ? new mongoose.Types.ObjectId(processedByUserId)
        : null,
      status: 'Completed'
    };

    booking.refundDetails.push(refundRecord);

    // 5️⃣ Update booking paymentStatus
    booking.paymentStatus =
      refundType === 'Full' ? 'Refunded' : 'PartiallyRefunded';

    // 6️⃣ Update lenderPrice based on original booking.lenderPrice
    if (refundType === 'Partial') {
      booking.lenderPrice = Math.max(
        (booking.lenderPrice || booking.allocatedLender?.price || 0) -
        refundedAmount,
        0
      );
    } else {
      booking.lenderPrice = 0; // Full refund
    }

    await booking.save();

    console.log(
      `✅ Booking ${booking._id} refund processed: ${refundedAmount} AUD, paymentStatus: ${booking.paymentStatus}, lenderPrice: ${booking.lenderPrice}`
    );

    // 7️⃣ Send email to customer
    try {
      // Re-populate to ensure we have all data after save (or we could have populated earlier)
      const populatedBooking = await Booking.findById(booking._id)
        .populate('customer')
        .populate('masterdressId');

      if (populatedBooking?.customer?.email) {
        const customer = populatedBooking.customer;
        const dress = populatedBooking.masterdressId;

        await sendEmail({
          to: customer.email,
          subject: 'Refund processed',
          html: refundProcessedTemplate(
            customer.firstName || customer.name || 'User',
            populatedBooking._id.toString(),
            refundedAmount.toFixed(2),
            dress?.brand,
            dress?.dressName,
            dress?.colors?.[0],
            populatedBooking.size
          )
        });
        console.log(`📧 Refund email sent to ${customer.email}`);
      }
    } catch (emailError) {
      console.error('Error sending refund processed email:', emailError);
    }
  } catch (err) {
    console.error('❌ Error handling booking refund event:', err.message);
  }
};

// export const handleBookingPaymentEvents = async (event) => {
//   try {
//     switch (event.type) {
//       // Payment completed successfully via checkout
//       case "checkout.session.completed": {
//         const session = event.data.object;
//         const { paymentId, bookingId } = session.metadata;

//         const payment = await Payment.findById(paymentId);
//         if (!payment) return console.warn(`Payment not found: ${paymentId}`);
//         if (payment.status === "Paid") return; // already handled

//         // Update Payment
//         payment.status = "Paid";
//         payment.stripe.paymentIntentId = session.payment_intent;
//         await payment.save();

//         // Update Booking
//         const booking = await Booking.findById(bookingId);
//         if (booking) booking.paymentStatus = "Paid";
//         await booking.save();

//         console.log(`✅ Checkout session completed: Payment ${paymentId}, Booking ${bookingId}`);
//         break;
//       }

//       // Extra safety: payment intent succeeded
//       case "payment_intent.succeeded": {
//         const paymentIntent = event.data.object;
//         const payment = await Payment.findOne({ "stripe.paymentIntentId": paymentIntent.id });
//         if (!payment) return;

//         if (payment.status !== "Paid") {
//           payment.status = "Paid";
//           await payment.save();
//           console.log(`✅ PaymentIntent succeeded: Payment ${payment._id}`);
//         }
//         break;
//       }

//       // Payment failed
//       case "payment_intent.payment_failed": {
//         const paymentIntent = event.data.object;
//         const payment = await Payment.findOne({ "stripe.paymentIntentId": paymentIntent.id });
//         if (!payment) return;

//         payment.status = "Failed";
//         await payment.save();

//         const booking = await Booking.findById(payment.bookingId);
//         if (booking) booking.paymentStatus = "Failed";
//         await booking.save();

//         console.warn(`❌ Payment failed: Payment ${payment._id}`);
//         break;
//       }

//       // Checkout session expired
//       case "checkout.session.expired": {
//         const session = event.data.object;
//         const { paymentId, bookingId } = session.metadata;

//         const payment = await Payment.findById(paymentId);
//         if (!payment) return;
//         if (payment.status !== "Pending") return; // already handled

//         payment.status = "Expired";
//         await payment.save();

//         const booking = await Booking.findById(bookingId);
//         if (booking) booking.paymentStatus = "Expired";
//         await booking.save();

//         console.log(`⚠️ Checkout session expired: Payment ${paymentId}, Booking ${bookingId}`);
//         break;
//       }

//       // Refund happened
//       case "charge.refunded": {
//         const charge = event.data.object;
//         const payment = await Payment.findOne({ "stripe.paymentIntentId": charge.payment_intent });
//         if (!payment) return;

//         payment.status = "Refunded";
//         payment.refundDetails.push({
//           refundId: charge.refunds.data[0]?.id || "unknown",
//           amount: charge.amount_refunded / 100,
//         });
//         await payment.save();

//         const booking = await Booking.findById(payment.bookingId);
//         if (booking) booking.paymentStatus = "Refunded";
//         await booking.save();

//         console.log(`🔄 Payment refunded: Payment ${payment._id}`);
//         break;
//       }

//       default:
//         console.log(`ℹ️ Unhandled event type: ${event.type}`);
//     }
//   } catch (err) {
//     console.error(`❌ Error handling Stripe event ${event.type}:`, err);
//   }
// };
