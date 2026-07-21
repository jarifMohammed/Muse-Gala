import React from 'react'

export default function LenderTermsConditions() {
  return (
    <div className="min-h-screen container mx-auto px-8 py-12 pt-[100px] font-avenir">
      {/* Header */}
      <div className="text-center space-y-5 mb-12">
        <h1 className="text-3xl tracking-[0.35rem] uppercase font-normal text-gray-900">
          Lender Terms & Conditions
        </h1>
      </div>

      {/* Content */}
      <div className="space-y-10 text-gray-800 font-avenir leading-[30px] tracking-[.08em] font-light">
        {/* Platform Pricing */}
        <section>
          <h2 className="font-light text-lg tracking-[.1em] text-gray-900 mb-3">
            Platform Pricing
          </h2>
          <p className="text-gray-600 mb-2">
            {`Muse Gala reserves the right to set, display, and adjust customer-facing rental prices independently of lender-submitted pricing. Lender payouts are based solely on the agreed lender price at the time of listing. The difference between the customer-facing price and the lender price constitutes Muse Gala's platform margin and is not subject to negotiation or lender approval. By listing on Muse Gala, lenders acknowledge and accept this pricing structure.`}
          </p>
        </section>

        {/* Lender responsibilities */}
        <section>
          <h2 className="font-light text-lg tracking-[.1em] text-gray-900 mb-3">
            Lender Responsibilities
          </h2>
          <p className="text-gray-600 mb-2">Lenders agree to:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>Provide accurate descriptions, sizing, and images of all items</li>
            <li>Ensure items are clean, wearable, and in good condition</li>
            <li>Fulfil bookings within the required timeframe</li>
            <li>Package items securely for delivery or prepare for pickup</li>
            <li>Maintain up-to-date availability and inventory</li>
          </ul>
        </section>

        {/* Fulfilment requirements */}
        <section>
          <h2 className="font-light text-lg tracking-[.1em] text-gray-900 mb-3">
            Fulfilment Requirements
          </h2>
          <p className="text-gray-600 mb-2">
            Lenders must fulfil all confirmed bookings unless using the
            &quot;Can&apos;t Fulfil&quot; option.
          </p>
          <p className="text-gray-600 mb-2">If a lender is unable to fulfil:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>A reason must be provided</li>
            <li>The booking will be sent to admin for reassignment</li>
          </ul>
          <p className="text-gray-600 mt-4 mb-2">
            Frequent failure to fulfil bookings may result in:
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>reduced visibility</li>
            <li>account restrictions</li>
            <li>removal from the platform</li>
          </ul>
        </section>

        {/* Shipping and handling */}
        <section>
          <h2 className="font-light text-lg tracking-[.1em] text-gray-900 mb-3">
            Shipping & Handling
          </h2>
          <p className="text-gray-600 mb-2">Lenders are responsible for:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>dispatching items on time</li>
            <li>providing accurate courier and tracking details</li>
          </ul>
          <p className="text-gray-600 mt-4 mb-2">Failure to ship on time may impact:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>customer experience</li>
            <li>lender performance status</li>
          </ul>
        </section>

        {/* Item condition */}
        <section>
          <h2 className="font-light text-lg tracking-[.1em] text-gray-900 mb-3">
            Item Condition
          </h2>
          <p className="text-gray-600 mb-2">Items must be provided in ready-to-wear condition.</p>
          <p className="text-gray-600 mb-2">Items must match:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>listing photos</li>
            <li>description provided</li>
          </ul>
          <p className="text-gray-600 mt-4 mb-2">
            Repeated issues with item condition may result in:
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>removal of listings</li>
            <li>account review</li>
          </ul>
        </section>

        {/* Damage and claims */}
        <section>
          <h2 className="font-light text-lg tracking-[.1em] text-gray-900 mb-3">
            Damage & Claims
          </h2>
          <p className="text-gray-600 mb-2">
            Lenders must provide clear evidence when reporting damage.
          </p>
          <p className="text-gray-600 mb-2">Claims must be submitted promptly.</p>
          <p className="text-gray-600 mb-2">Muse Gala will:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>assess all claims</li>
            <li>determine responsibility</li>
            <li>decide on repair, reimbursement, or replacement</li>
          </ul>
        </section>

        {/* Payments */}
        <section>
          <h2 className="font-light text-lg tracking-[.1em] text-gray-900 mb-3">
            Payments to Lenders
          </h2>
          <p className="text-gray-600 mb-2">
            Payouts will be processed after booking completion.
          </p>
          <p className="text-gray-600 mb-2">Muse Gala may hold or adjust payouts in cases of:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>disputes</li>
            <li>damage claims</li>
            <li>incomplete bookings</li>
          </ul>
        </section>

        {/* Platform standards */}
        <section>
          <h2 className="font-light text-lg tracking-[.1em] text-gray-900 mb-3">
            Platform Standards
          </h2>
          <p className="text-gray-600 mb-2">
            Muse Gala maintains a curated platform. Lenders must meet quality
            and service expectations.
          </p>
          <p className="text-gray-600 mb-2">Muse Gala reserves the right to:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>remove listings</li>
            <li>limit visibility</li>
            <li>suspend or remove lender accounts</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
