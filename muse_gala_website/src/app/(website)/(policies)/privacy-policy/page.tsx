// src/app/privacy-policy/page.tsx
import React from 'react'
import PolicyLayout from '@/components/policies/PolicyLayout'

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      description="Muse Gala respects your privacy and is committed to protecting your personal information. This policy outlines how we collect, use, and manage your data when you use our platform."
    >
      <section className="space-y-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">
          Information We Collect
        </h2>
        <p className="text-gray-600">We may collect the following information when you use Muse Gala:</p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>name and contact details (email, phone number)</li>
          <li>account and login information</li>
          <li>payment details (processed securely via third-party providers)</li>
          <li>booking and transaction history</li>
          <li>communication records through the platform</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">
          How We Use Your Information
        </h2>
        <p className="text-gray-600">Your information is used to:</p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>create and manage your User Account</li>
          <li>process bookings and payments</li>
          <li>facilitate communication between users where required</li>
          <li>provide customer support</li>
          <li>improve platform performance and user experience</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">
          Sharing of Information
        </h2>
        <p className="text-gray-600">
          Muse Gala may share limited information where necessary to complete a booking:
        </p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>
            Lenders may receive limited customer details required to fulfil an
            order (e.g. first name and delivery information)
          </li>
          <li>
            Service providers (e.g. payment processors, couriers) may receive
            relevant data to perform their services
          </li>
        </ul>
        <p className="text-gray-600">We do not sell or rent your personal information.</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">
          Data Security
        </h2>
        <p className="text-gray-600">We take reasonable steps to protect your information, including:</p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>secure payment processing</li>
          <li>restricted access to sensitive data</li>
          <li>use of trusted third-party providers</li>
        </ul>
        <p className="text-gray-600">
          However, no system is completely secure, and users share information
          at their own risk.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">
          User Responsibilities
        </h2>
        <p className="text-gray-600">Users are responsible for:</p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>keeping login details secure</li>
          <li>ensuring their information is accurate and up to date</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">
          Access & Updates
        </h2>
        <p className="text-gray-600">You may request to:</p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>access your personal information</li>
          <li>update or correct your details by contacting Muse Gala</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">
          Cookies & Tracking
        </h2>
        <p className="text-gray-600">Muse Gala may use cookies and similar technologies to:</p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>improve website functionality</li>
          <li>analyse usage and performance</li>
          <li>personalise user experience</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">
          Third-Party Services
        </h2>
        <p className="text-gray-600">
          Muse Gala uses third-party services (such as payment providers and
          hosting platforms). These services may collect and process data in
          accordance with their own privacy policies.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">
          Policy Updates
        </h2>
        <p className="text-gray-600">
          Muse Gala may update this Privacy Policy from time to time. Continued
          use of the platform constitutes acceptance of any changes.
        </p>
      </section>

      <section className="space-y-4 border-t pt-4">
        <h2 className="font-light text-lg tracking-[.1em] text-gray-900">Contact</h2>
        <p className="text-gray-600">
          For any privacy-related questions, please contact Muse Gala through
          our official channels.
        </p>
      </section>
    </PolicyLayout>
  )
}
