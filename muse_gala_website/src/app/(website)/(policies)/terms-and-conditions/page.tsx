import React from 'react'

type TermsSectionProps = {
  title: string
  children: React.ReactNode
}

function TermsSection({ title, children }: TermsSectionProps) {
  return (
    <section>
      <h2 className="font-light text-lg tracking-[.1em] text-gray-900 mb-3">
        {title}
      </h2>
      <div className="space-y-3 text-gray-600">{children}</div>
    </section>
  )
}

export default function CustomerTermsConditions() {
  return (
    <div className="min-h-screen container mx-auto px-8 py-12 font-avenir pt-[100px]">
      <div className="text-center space-y-5 mb-12">
        <h1 className="text-3xl tracking-[0.35rem] uppercase font-normal text-gray-900">
          Terms & Conditions — Muse Gala
        </h1>
      </div>

      <div className="space-y-10 text-gray-800 font-avenir leading-[30px] tracking-[.08em] font-light">
        <TermsSection title="Overview">
          <p>
            These Terms & Conditions govern your use of the Muse Gala platform.
            By creating an account or placing a booking, you agree to comply
            with these terms.
          </p>
          <p>
            Muse Gala operates as a platform connecting customers with lenders.
            All bookings, payments, and disputes are managed through Muse Gala
            to ensure a consistent and reliable experience.
          </p>
        </TermsSection>

        <TermsSection title="User Accounts">
          <p>
            A User Account refers to any registered account on Muse Gala,
            including both:
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>Customers (renters)</li>
            <li>Lenders (item providers)</li>
          </ul>
          <p>Users are responsible for:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>maintaining accurate account information</li>
            <li>keeping login details secure</li>
            <li>all activity conducted under their account</li>
          </ul>
        </TermsSection>

        <TermsSection title="Bookings">
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>All bookings are subject to availability and confirmation</li>
            <li>Full payment is required at the time of booking</li>
            <li>
              Once confirmed, bookings are subject to the Refund Policy
            </li>
          </ul>
          <p>Muse Gala reserves the right to:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>cancel or adjust bookings where necessary</li>
            <li>reassign bookings to alternative lenders</li>
          </ul>
        </TermsSection>

        <TermsSection title="Cancellations & Fulfilment">
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>Customer cancellations are governed by the Refund Policy</li>
            <li>
              Lenders do not have a cancellation option and must use “Can’t
              Fulfil” where applicable
            </li>
          </ul>
          <p>If a lender selects “Can’t Fulfil”:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>the booking will be sent to admin for reassignment</li>
            <li>
              if no replacement is found, a refund or alternative resolution
              will be provided
            </li>
          </ul>
        </TermsSection>

        <TermsSection title="Lender Responsibilities">
          <p>Lenders agree to:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>provide accurate descriptions, sizing, and images</li>
            <li>ensure items are clean, wearable, and as described</li>
            <li>fulfil bookings within the required timeframe</li>
            <li>
              provide shipping and tracking details where applicable
            </li>
          </ul>
          <p>Failure to meet these standards may result in:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>reduced visibility</li>
            <li>account restrictions</li>
            <li>removal from the platform</li>
          </ul>
        </TermsSection>

        <TermsSection title="Customer Responsibilities">
          <p>Customers agree to:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>provide accurate information</li>
            <li>treat all rented items with care</li>
            <li>return items on time and in reasonable condition</li>
          </ul>
          <p>Customers must not:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>damage, alter, or misuse items</li>
            <li>attempt to clean or repair items without approval</li>
          </ul>
        </TermsSection>

        <TermsSection title="Damage, Loss & Non-Return">
          <p>
            Customers are responsible for returning items within the agreed
            rental period.
          </p>
          <p>If an item is:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>damaged beyond normal wear</li>
            <li>not returned</li>
            <li>lost or stolen</li>
          </ul>
          <p>The customer may be charged:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>repair costs, or</li>
            <li>full or partial replacement value of the item</li>
          </ul>
          <p>Muse Gala reserves the right to:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>charge the customer’s payment method on file</li>
            <li>take further action where necessary</li>
          </ul>
        </TermsSection>

        <TermsSection title="Payments">
          <p>All payments are processed through the Muse Gala platform</p>
          <p>Fees may include:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>rental price</li>
            <li>platform/service fees</li>
            <li>shipping costs</li>
          </ul>
          <p>Payment processing fees may apply and are non-refundable.</p>
        </TermsSection>

        <TermsSection title="Disputes">
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>All disputes must be handled through Muse Gala.</li>
            <li>
              Direct resolution between customer and lender is not permitted
            </li>
            <li>Muse Gala will review all cases and determine outcomes</li>
            <li>All decisions are final</li>
          </ul>
        </TermsSection>

        <TermsSection title="Platform Control">
          <p>Muse Gala reserves the right to:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>manage and review all bookings</li>
            <li>suspend or remove User Accounts</li>
            <li>enforce platform policies</li>
            <li>update pricing, fees, and functionality</li>
          </ul>
        </TermsSection>

        <TermsSection title="Limitation of Liability">
          <p>Muse Gala is not liable for:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600">
            <li>delays caused by third-party services (e.g. couriers)</li>
            <li>indirect or consequential losses</li>
            <li>circumstances outside of reasonable control</li>
          </ul>
          <p>
            However, Muse Gala will make reasonable efforts to resolve issues
            fairly.
          </p>
        </TermsSection>

        <TermsSection title="Updates to Terms">
          <p>
            Muse Gala may update these Terms & Conditions at any time.
            Continued use of the platform constitutes acceptance of any changes.
          </p>
        </TermsSection>

        <TermsSection title="Final Note">
          <p>
            By using Muse Gala, you agree to these Terms & Conditions and all
            associated policies.
          </p>
        </TermsSection>
      </div>
    </div>
  )
}
