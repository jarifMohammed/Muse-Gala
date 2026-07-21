import React from 'react'

export default function Page() {
  return (
    <div className="min-h-screen container mx-auto px-8 py-12 pt-[100px] font-avenir">
      {/* Header */}
      <div className="text-center space-y-5 mb-12">
        <h1 className="text-3xl tracking-[0.35rem] uppercase font-normal text-gray-900">
          Refund Policy
        </h1>
      </div>

      {/* Content */}
      <div className="space-y-10 text-gray-800 font-avenir leading-[30px] tracking-[.08em] font-light">
        {/* Overview */}
        <section className="space-y-4">
          <h2 className="text-lg font-light tracking-[.1em]">Overview</h2>
          <p className="text-gray-600">
            At Muse Gala, we are committed to providing a seamless and reliable
            rental experience. We understand that plans can change, and this
            policy outlines how cancellations, refunds, and booking issues are
            handled across the platform.
          </p>
          <p className="text-gray-600">
            All bookings are subject to availability, and in some cases, may
            involve third-party lenders. Muse Gala manages all transactions and
            support to ensure a consistent and fair experience for both
            customers and lenders.
          </p>
        </section>

        {/* Customer Cancellations */}
        <section className="space-y-4">
          <h2 className="text-lg font-light tracking-[.1em]">
            Customer Cancellations
          </h2>

          <div>
            <h3 className="font-normal mb-2">More than 14 days before your rental start date</h3>
            <p className="text-gray-600 ml-6">
              You may cancel your booking. A partial refund will be issued,
              excluding any platform, payment processing, or service-related
              fees.
            </p>
          </div>

          <div>
            <h3 className="font-normal mb-2">Within 14 days of your rental start date</h3>
            <p className="text-gray-600 ml-6">
              Cancellations are not guaranteed. Requests must be submitted to
              our team and will be reviewed on a case-by-case basis.
            </p>
            <p className="text-gray-600 ml-6 mt-2">
              We encourage customers to review booking details carefully before
              confirming their order.
            </p>
          </div>
        </section>

        {/* If booking cannot be fulfilled */}
        <section className="space-y-4">
          <h2 className="text-lg font-light tracking-[.1em]">
            If your booking cannot be fulfilled
          </h2>
          <p className="text-gray-600 ml-6">
            In the rare event that a lender is unable to fulfil your booking
            (for example, due to damage or availability issues):
          </p>
          <ul className="list-disc ml-12 text-gray-600 space-y-2">
            <li>
              Muse Gala will first attempt to source the same or a similar item
              from another lender.
            </li>
            <li>If a suitable replacement is not available, you will receive:</li>
          </ul>
          <ul className="list-disc ml-16 text-gray-600 space-y-2">
            <li>a full refund, or</li>
            <li>an alternative solution offered by our team.</li>
          </ul>
        </section>

        {/* Delivery and timing issues */}
        <section className="space-y-4">
          <h2 className="text-lg font-light tracking-[.1em]">
            Delivery & Timing issues
          </h2>
          <p className="text-gray-600 ml-6">If your item:</p>
          <ul className="list-disc ml-12 text-gray-600 space-y-2">
            <li>does not arrive within the expected timeframe, or</li>
            <li>is significantly delayed.</li>
          </ul>
          <p className="text-gray-600 ml-6">
            Eligibility for a refund will be based on courier tracking and
            delivery confirmation.
          </p>
          <p className="text-gray-600 ml-6">You may be eligible for:</p>
          <ul className="list-disc ml-12 text-gray-600 space-y-2">
            <li>a full refund, or</li>
            <li>another resolution determined by Muse Gala.</li>
          </ul>
          <p className="text-gray-600 ml-6">
            Customers must notify Muse Gala as soon as possible. All claims are
            subject to verification using courier tracking data and delivery
            records.
          </p>
        </section>

        {/* Refund Processing */}
        <section className="space-y-4">
          <h2 className="text-lg font-light tracking-[.1em]">
            Refund Processing
          </h2>
          <ul className="list-disc ml-12 text-gray-600 space-y-2">
            <li>Refunds will be issued to your original payment method.</li>
            <li>
              Processing times may vary depending on your payment provider.
            </li>
          </ul>
        </section>

        {/* Non-Refundable Fees */}
        <section className="space-y-4">
          <h2 className="text-lg font-light tracking-[.1em]">
            Non-Refundable Fees
          </h2>
          <p className="text-gray-600 ml-6">The following are generally non-refundable:</p>
          <ul className="list-disc ml-12 text-gray-600 space-y-2">
            <li>Platform/service fees</li>
            <li>Payment processing fees</li>
            <li>Shipping costs (once fulfilled)</li>
          </ul>
        </section>

        {/* Disputes and support */}
        <section className="space-y-4">
          <h2 className="text-lg font-light tracking-[.1em]">
            Disputes & Support
          </h2>
          <p className="text-gray-600 ml-6">
            If there are any issues with your order, customers must contact
            Muse Gala directly.
          </p>
          <p className="text-gray-600 ml-6">
            We do not facilitate direct dispute handling between customers and
            lenders. All cases are reviewed and resolved by the Muse Gala team
            to ensure fairness, consistency, and quality control.
          </p>
        </section>

        {/* Policy enforcement */}
        <section className="space-y-4">
          <h2 className="text-lg font-light tracking-[.1em]">
            Policy Enforcement
          </h2>
          <p className="text-gray-600 ml-6">Muse Gala reserves the right to:</p>
          <ul className="list-disc ml-12 text-gray-600 space-y-2">
            <li>Review all cancellation and refund requests</li>
            <li>Determine appropriate outcomes based on the situation</li>
            <li>Update this policy where required</li>
          </ul>
        </section>

        {/* Final note */}
        <section className="space-y-4 border-t pt-4">
          <h2 className="text-lg font-light tracking-[.1em]">Final Note</h2>
          <p className="text-gray-600">
            By placing a booking through Muse Gala, you agree to the terms
            outlined in this Refund Policy.
          </p>
        </section>
      </div>
    </div>
  )
}
