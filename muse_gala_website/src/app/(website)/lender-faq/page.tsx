import React from 'react'

export default function LenderFAQ() {
  return (
    <div className="min-h-screen container mx-auto px-8 py-12 font-avenir pt-[100px]">
      {/* Header */}
      <div className="text-center space-y-5 mb-12">
        <h1 className="text-3xl tracking-[0.35rem] uppercase font-normal text-gray-900">
          Lender FAQ
        </h1>
        <p className="mt-3 text-gray-600 text-sm md:text-base max-w-2xl mx-auto font-light font-avenir tracking-[.1em]">
          Muse Gala connects your pieces with customers looking to rent for
          upcoming events. We handle the platform, bookings, and customer
          experience while you fulfil the order.
        </p>
      </div>

      {/* FAQ List */}
      <div className="space-y-10 text-gray-800 font-avenir leading-[30px] tracking-[.08em] font-light">
        <ul className="list-decimal ml-6 space-y-8">
          <li>
            <span className="font-light text-lg tracking-[.1em] font-avenir">
              How does Muse Gala work for lenders?
            </span>
            <p className="ml-6 mt-2 text-gray-600">
              Muse Gala connects your pieces with customers looking to rent for
              upcoming events. We handle the platform, bookings, and customer
              experience - you simply fulfil the order.
            </p>
          </li>

          <li>
            <span className="font-light text-lg tracking-[.1em]">
              How do I get paid?
            </span>
            <p className="ml-6 mt-2 text-gray-600">
              Once a booking is completed, your payout will be processed
              through the platform. Payouts may be adjusted in the case of
              disputes or unresolved issues.
            </p>
          </li>

          <li>
            <span className="font-light text-lg tracking-[.1em] font-avenir">
              What happens if I can&apos;t fulfil a booking?
            </span>
            <p className="ml-6 mt-2 text-gray-600">
              If you&apos;re unable to fulfil a booking, you must select
              &quot;Can&apos;t Fulfil&quot; and provide a reason. Frequent inability
              to fulfil bookings may impact your account.
            </p>
          </li>

          <li>
            <span className="font-light text-lg tracking-[.1em]">
              What if the item is damaged?
            </span>
            <p className="ml-6 mt-2 text-gray-600">If an item is returned damaged:</p>
            <ul className="list-disc ml-6 mt-2 text-gray-600 space-y-2">
              <li>Submit photo evidence through the platform</li>
              <li>Muse Gala will assess the damage</li>
              <li>If applicable, the customer may be charged for:</li>
            </ul>
            <ul className="list-disc ml-10 text-gray-600 space-y-2">
              <li>repair costs, or</li>
              <li>replacement value</li>
            </ul>
          </li>

          <li>
            <span className="font-light text-lg tracking-[.1em]">
              What if my item is lost or not returned?
            </span>
            <p className="ml-6 mt-2 text-gray-600">
              If an item is not returned, lost, or suspected to be stolen,
              Muse Gala will conduct a full investigation, including reviewing:
            </p>
            <ul className="list-disc ml-6 text-gray-600 space-y-2">
              <li>tracking information</li>
              <li>communication records</li>
              <li>booking details</li>
            </ul>
            <p className="ml-6 mt-2 text-gray-600">
              The customer may be charged the full replacement value of the
              item. Where necessary, further action may be taken, including
              escalation of the matter and involvement of relevant authorities.
              Muse Gala takes non-return and theft seriously to protect all
              lenders on the platform.
            </p>
          </li>

          <li>
            <span className="font-light text-lg tracking-[.1em]">
              Do I need to handle customer communication?
            </span>
            <p className="ml-6 mt-2 text-gray-600">
              Muse Gala manages the customer experience. All disputes and
              issues are handled by the platform.
            </p>
          </li>

          <li>
            <span className="font-light text-lg tracking-[.1em]">
              How do I ship items?
            </span>
            <p className="ml-6 mt-2 text-gray-600">If the booking is for delivery:</p>
            <ul className="list-disc ml-6 text-gray-600 space-y-2">
              <li>You will be required to dispatch the item on time</li>
              <li>Provide courier and tracking details</li>
            </ul>
          </li>

          <li>
            <span className="font-light text-lg tracking-[.1em]">
              Can I choose my rental prices?
            </span>
            <p className="ml-6 mt-2 text-gray-600">
              Yes, you can choose your rental prices. Pricing displayed on the
              platform is set in line with Muse Gala guidelines to ensure
              consistency and a seamless customer experience across all
              listings.
            </p>
          </li>

          <li>
            <span className="font-light text-lg tracking-[.1em]">
              How do I list a dress?
            </span>
            <p className="ml-6 mt-2 text-gray-600">
              You can submit your item through the platform for approval. All
              listings are reviewed before going live.
            </p>
          </li>

          <li>
            <span className="font-light text-lg tracking-[.1em]">
              What happens if I don&apos;t meet expectations?
            </span>
            <p className="ml-6 mt-2 text-gray-600">
              Muse Gala maintains a curated platform. Accounts that
              consistently fail to fulfil bookings, provide poor item quality,
              or do not meet standards may be restricted or removed from the
              platform.
            </p>
          </li>

          <li>
            <span className="font-light text-lg tracking-[.1em]">
              Final Note
            </span>
            <ul className="list-disc ml-6 mt-2 text-gray-600 space-y-2">
              <li>
                By listing with Muse Gala, you agree to maintain item quality,
                fulfil bookings reliably, and comply with platform policies.
              </li>
              <li>
                Muse Gala reserves the right to review account performance and
                apply restrictions where necessary.
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
}
