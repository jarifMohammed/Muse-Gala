import mongoose from "mongoose";
import Stripe from "stripe";
import sendEmail from "../../lib/sendEmail.js";
import {
  paymentMethodUpdatedCustomerTemplate,
  paymentMethodUpdatedLenderTemplate,
} from "../../lib/emailTemplates/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleSetupIntentCompleted = async (event) => {
  try {
    // Extract SetupIntent object
    const setupIntent = event.data.object;

    const customerId = setupIntent.customer;
    const paymentMethodId = setupIntent.payment_method;

    if (!customerId || !paymentMethodId) {
      console.warn("SetupIntent missing customer or payment method");
      return;
    }

    // Retrieve Stripe customer to get metadata
    const customer = await stripe.customers.retrieve(customerId);
    const userId = customer.metadata?.userId;

    if (!userId) {
      console.warn(`User ID not found in Stripe customer metadata (customerId: ${customerId})`);
      return;
    }

    // Retrieve Mongoose User model
    const User = mongoose.model("User");

    const user = await User.findById(userId);
    if (!user) {
      console.warn(`User not found in DB for userId: ${userId}`);
      return;
    }

    // Save/update Stripe customer ID and default payment method
    user.stripeCustomerId = customerId;
    user.defaultPaymentMethodId = paymentMethodId;
    await user.save();

    console.log(`✅ Saved payment method (${paymentMethodId}) for user ${userId}`);

    // -------------------------------------------------------
    // NOTIFY: Send emails if there is a failed booking
    // -------------------------------------------------------
    try {
      const Booking = mongoose.model("Booking");

      // Find any booking for this user that is currently in a failed payment state
      const failedBooking = await Booking.findOne({
        customer: user._id,
        paymentStatus: { $in: ["Failed", "RetryPending"] },
      }).populate("allocatedLender.lenderId");

      if (failedBooking) {
        const customerName = user.firstName || user.name || "Customer";

        // Email to customer: payment method updated successfully
        if (user.email) {
          await sendEmail({
            to: user.email,
            subject: "Payment Method Updated Successfully",
            html: paymentMethodUpdatedCustomerTemplate(customerName),
          });
        }

        // Email to lender: customer updated their card, please retry
        const lender = await User.findById(failedBooking.allocatedLender?.lenderId);
        if (lender?.email) {
          const lenderName = lender.firstName || lender.name || "Lender";
          await sendEmail({
            to: lender.email,
            subject: "Customer Updated Payment Method — Please Retry",
            html: paymentMethodUpdatedLenderTemplate(
              lenderName,
              customerName,
              failedBooking._id.toString()
            ),
          });
        }

        console.log(`✅ Payment method update emails sent for booking ${failedBooking._id}`);
      }
    } catch (emailErr) {
      console.error("❌ Error sending payment method update emails:", emailErr);
    }

  } catch (err) {
    console.error("❌ Error handling setup_intent.succeeded:", err);
  }
};

