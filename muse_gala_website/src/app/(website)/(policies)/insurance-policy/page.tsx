// src/app/insurance-policy/page.tsx
import React from 'react'
import PolicyLayout from '@/components/policies/PolicyLayout'

export default function InsurancePolicyPage() {
  return (
    <PolicyLayout
      title="Insurance Policy"
      description="Muse Gala offers item protection to support both customers and lenders throughout the rental process. This policy outlines how minor wear, damage, and unexpected issues are handled."
    >
      {/* What Is Covered */}
      <section>
        <h2 className="text-base font-medium mb-6 tracking-wide">What Is Covered</h2>
        <div className="space-y-6 ml-4">
          <p>
            We understand that items are worn for real events and minor wear is
            expected.
          </p>
          <ul className="space-y-2 ml-8 list-disc">
            <li>
              Minor issues such as small stains or light wear are typically
              managed through standard dry cleaning
            </li>
            <li>
              Dry cleaning is organised by the lender as part of their normal
              process
            </li>
            <li>
              This covers minor, accidental damage from a one-time event
            </li>
            <li>All cases are assessed by Muse Gala on an individual basis.</li>
          </ul>
        </div>
      </section>

      {/* What Is Not Covered */}
      <section>
        <h2 className="font-medium mb-6 tracking-wide">What Is Not Covered</h2>
        <div className="space-y-6 ml-4">
          <p>Insurance does not cover:</p>
          <ul className="space-y-2 ml-8 list-disc">
            <li>significant or irreversible damage</li>
            <li>loss, theft, or non-return of the item</li>
            <li>negligence or misuse</li>
            <li>unauthorised cleaning, alterations, or repairs</li>
          </ul>
          <p>In these cases, the customer may be liable for:</p>
          <ul className="space-y-2 ml-8 list-disc">
            <li>repair costs, or</li>
            <li>full or partial replacement value of the item</li>
          </ul>
        </div>
      </section>

      {/* Loss, Theft and Non-Return */}
      <section>
        <h2 className="font-medium mb-6 tracking-wide">Loss, Theft & Non-Return</h2>
        <p className="mb-4 ml-4">If an item is:</p>
        <ul className="space-y-2 ml-8 list-disc">
          <li>not returned</li>
          <li>lost</li>
          <li>stolen</li>
        </ul>
        <p className="mt-4 ml-4">The customer may be charged:</p>
        <ul className="space-y-2 ml-8 list-disc">
          <li>the full replacement value of the item, and/or</li>
          <li>any associated costs</li>
        </ul>
        <p className="mt-4 ml-4">Muse Gala reserves the right to:</p>
        <ul className="space-y-2 ml-8 list-disc">
          <li>charge the customer&apos;s payment method on file</li>
          <li>take further action where necessary</li>
        </ul>
      </section>

      {/* If an issue occurs */}
      <section>
        <h2 className="font-medium mb-6 tracking-wide">If an Issue Occurs</h2>
        <p className="mb-4 ml-4">If an item is damaged during your rental:</p>
        <ul className="space-y-3 ml-8 list-disc">
          <li>Notify Muse Gala as soon as possible</li>
          <li>Do not attempt to clean, repair, or alter the item</li>
          <li>Our team will assess the situation and provide next steps</li>
        </ul>
      </section>

      {/* Assessment process */}
      <section>
        <h2 className="font-medium mb-6 tracking-wide">Assessment Process</h2>
        <p className="mb-4 ml-4">Muse Gala will review:</p>
        <ul className="space-y-3 ml-8 list-disc">
          <li>photo evidence provided</li>
          <li>condition of the item</li>
          <li>severity of the issue</li>
          <li>whether the damage falls under normal wear or misuse</li>
        </ul>
        <p className="mt-4 ml-4">All decisions are made at the discretion of Muse Gala.</p>
      </section>

      {/* Lender protection */}
      <section>
        <h2 className="font-medium mb-6 tracking-wide">Lender Protection</h2>
        <p className="mb-4 ml-4">Muse Gala supports lenders by:</p>
        <ul className="space-y-3 ml-8 list-disc">
          <li>reviewing all claims fairly</li>
          <li>determining responsibility based on evidence</li>
          <li>facilitating appropriate compensation where applicable</li>
        </ul>
      </section>

      {/* Final note */}
      <section>
        <h2 className="font-medium mb-6 tracking-wide">Final Note</h2>
        <p className="ml-4">
          By placing a booking, customers agree to take reasonable care of all
          rented items and comply with the terms outlined in this policy.
        </p>
        <p className="mt-4 ml-4">
          Muse Gala reserves the right to assess all claims and determine
          outcomes in line with platform policies.
        </p>
      </section>
    </PolicyLayout>
  )
}
