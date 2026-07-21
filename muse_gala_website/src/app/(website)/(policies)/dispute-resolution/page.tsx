// src/app/dispute-resolution/page.tsx
import React from 'react'
import PolicyLayout from '@/components/policies/PolicyLayout'

export default function DisputeResolutionPage() {
  return (
    <PolicyLayout
      title="Dispute Resolution"
      description="Muse Gala is committed to ensuring a fair and consistent experience for all users on the platform. All disputes are managed directly by the Muse Gala team to maintain quality, transparency, and trust."
    >
      <p className="text-gray-600">
        For the purpose of this policy, a User Account refers to any
        registered account on Muse Gala, including both customers (renters)
        and lenders (item providers).
      </p>

      <section className="space-y-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">
          How to Raise a Dispute
        </h2>
        <p className="text-gray-600">If there is an issue with a booking, item, or transaction:</p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>The issue must be reported to Muse Gala as soon as possible</li>
          <li>
            All communication should be made through the platform or official
            contact channels
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">
          Dispute Types May Include
        </h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>Item not as described</li>
          <li>Item not received</li>
          <li>Late returns</li>
          <li>Damage to item</li>
          <li>Failure to fulfil booking</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">
          Review Process
        </h2>
        <p className="text-gray-600">Once a dispute is raised:</p>
        <p className="text-gray-600">Muse Gala will review all relevant information, including:</p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>booking details</li>
          <li>communication records</li>
          <li>courier tracking data</li>
          <li>supporting evidence (photos, timestamps, etc.)</li>
        </ul>
        <p className="text-gray-600">
          Both customer and lender may be contacted for additional information.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">
          Damage to Items
        </h2>
        <p className="text-gray-600">
          If an item is returned damaged, Muse Gala will assess the extent of
          the damage based on provided evidence.
        </p>
        <p className="text-gray-600">Damage may include:</p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>stains</li>
          <li>tears or fabric damage</li>
          <li>missing components</li>
          <li>
            any condition that makes the item unwearable or significantly
            altered
          </li>
        </ul>

        <h3 className="font-normal text-gray-900">Assessment Process:</h3>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>Lender must provide photo evidence of the damage</li>
          <li>Muse Gala will review:</li>
        </ul>
        <ul className="list-disc ml-10 space-y-2 text-gray-600">
          <li>before and after condition (if available)</li>
          <li>severity of the damage</li>
          <li>whether it falls under normal wear or misuse</li>
        </ul>

        <h3 className="font-normal text-gray-900">Outcome:</h3>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>
            If damage is considered minor and within normal wear, no additional
            charges may apply
          </li>
          <li>
            If damage is considered beyond normal wear, the customer may be
            charged:
          </li>
        </ul>
        <ul className="list-disc ml-10 space-y-2 text-gray-600">
          <li>repair costs, or</li>
          <li>full or partial replacement value of the item</li>
        </ul>

        <h3 className="font-normal text-gray-900">Important:</h3>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>Customers must not attempt to clean or repair the item themselves</li>
          <li>All damage assessments and decisions are made by Muse Gala</li>
          <li>
            Muse Gala reserves the right to charge the customer&apos;s payment
            method on file where applicable
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">
          Resolution Outcomes
        </h2>
        <p className="text-gray-600">Based on the review, Muse Gala may:</p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>issue a refund (full or partial)</li>
          <li>approve a charge for damages, loss, or non-return</li>
          <li>reassign or adjust a booking</li>
          <li>take action against a User Account where necessary</li>
        </ul>
        <p className="text-gray-600">All decisions are made at the discretion of Muse Gala.</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">
          Important Notes
        </h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>Direct dispute handling between customer and lender is not permitted</li>
          <li>All disputes must go through Muse Gala admin</li>
          <li>Failure to cooperate may impact future use of the platform</li>
        </ul>
      </section>

      <section className="space-y-4 border-t pt-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">
          Final Decision
        </h2>
        <p className="text-gray-600">Muse Gala reserves the right to:</p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>make final decisions on all disputes</li>
          <li>determine appropriate outcomes based on available evidence</li>
          <li>enforce actions in line with platform policies</li>
        </ul>
      </section>
    </PolicyLayout>
  )
}
