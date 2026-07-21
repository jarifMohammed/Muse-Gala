/**
 * Email Templates Index
 * Centralized exports for all email templates in Muse Gala
 */

// Base template and utilities
export {
  baseEmailTemplate,
  createInfoBox,
  createStatusBadge,
  adminNotificationTemplate,
} from './baseTemplate.js';

// Application templates
export {
  newApplicationAdminTemplate,
  applicationReceivedTemplate,
  applicationApprovedTemplate,
  applicationApprovedAdminTemplate,
  applicationRejectedTemplate,
} from './application.templates.js';

// Booking templates
export {
  bookingCreatedTemplate,
  adminNewBookingTemplate,
  lenderNewBookingTemplate,
  bookingConfirmedTemplate,
  bookingRejectedTemplate,
  paymentFailedTemplate,
  paymentMethodUpdatedCustomerTemplate,
  paymentMethodUpdatedLenderTemplate,
  shipmentPreparingTemplate,
  labelReadyTemplate,
  shippedToCustomerTemplate,
  dressDeliveredTemplate,
  returnInitiatedTemplate,
  shippedToLenderTemplate,
  bookingCompletedTemplate,
  bookingCancelledTemplate,
} from './booking.templates.js';

// Dispute templates
export {
  disputeCreatedTemplate,
  disputeUnderReviewTemplate,
  disputeMoreInfoNeededTemplate,
  disputeEscalatedTemplate,
  disputeResolvedTemplate,
  refundProcessedTemplate,
  disputeResponseTemplate,
  disputeClosedTemplate,
} from './dispute.templates.js';

// KYC templates
export {
  kycVerifiedTemplate,
  kycRequiresInputTemplate,
  kycProcessingTemplate,
  kycFailedTemplate,
  kycInitiatedTemplate,
} from './kyc.templates.js';

// Payout templates
export {
  payoutRequestCreatedTemplate,
  payoutRequestReceivedTemplate,
  payoutTransferredTemplate,
  payoutFailedTemplate,
} from './payout.templates.js';

// Promo code templates
export { promoCodeTemplate } from './promoCode.template.js';

// Subscription templates
export {
  subscriptionActivatedTemplate,
  subscriptionPaymentConfirmationTemplate,
  subscriptionPaymentFailedTemplate,
  subscriptionCheckoutExpiredTemplate,
  subscriptionRefundedTemplate,
  subscriptionExpiringTemplate,
} from './subscription.templates.js';
