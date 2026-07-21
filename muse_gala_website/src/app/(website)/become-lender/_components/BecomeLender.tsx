'use client'
import Image from 'next/image'
import Link from 'next/link'
// import PricingPlan from './pricing-plan'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'

const BecomeLender = () => {
  const router = useRouter()

  const handleClick = () => {
    router.push('/become-lender/form')
  }

  return (
    <div className="w-full overflow-x-hidden">
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
          <Image
            src="/pages/BecomeLender1.webp"
            alt="Become a Lender Hero"
            fill
            priority
            quality={100}
            sizes="100vw"
            style={{ objectPosition: 'center 20%' }}
            className="object-cover md:!object-[center_30%]"
          />
          <div className="absolute inset-0 bg-black/20" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-20">
            <h1 className="text-white text-[9px] md:text-sm lg:text-base font-avenir font-light tracking-widest md:!tracking-[0.5em] uppercase mb-10 max-w-2xl mx-auto text-center opacity-90 leading-loose px-6">
              Join a curated network reaching modern renters across Australia
            </h1>
            <Link
              href="/become-lender/form"
              className="text-white text-[10px] md:text-xs font-avenir !tracking-[0.3em] uppercase border-b border-white pb-1 hover:opacity-70 transition-opacity"
            >
              APPLY TO JOIN
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-16 md:py-24 border-b border-gray-100">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 gap-y-12 gap-x-6 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 group-hover:bg-black transition-colors duration-300">
                  <svg className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xs font-avenir tracking-[0.2em] uppercase mb-3 font-medium">
                  Expand Your Reach
                </h3>
                <p className="text-[11px] font-avenir font-light text-gray-500 leading-relaxed max-w-[200px]">
                  Connect with customers beyond your local area through location-based discovery.
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 group-hover:bg-black transition-colors duration-300">
                  <svg className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xs font-avenir tracking-[0.2em] uppercase mb-3 font-medium">
                  Instant Bookings
                </h3>
                <p className="text-[11px] font-avenir font-light text-gray-500 leading-relaxed max-w-[200px]">
                  Real-time availability with automatic confirmations.
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 group-hover:bg-black transition-colors duration-300">
                  <svg className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                  </svg>
                </div>
                <h3 className="text-xs font-avenir tracking-[0.2em] uppercase mb-3 font-medium">
                  Premium Positioning
                </h3>
                <p className="text-[11px] font-avenir font-light text-gray-500 leading-relaxed max-w-[200px]">
                  Featured within a curated, editorial platform.
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 group-hover:bg-black transition-colors duration-300">
                  <svg className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xs font-avenir tracking-[0.2em] uppercase mb-3 font-medium">
                  Effortless Management
                </h3>
                <p className="text-[11px] font-avenir font-light text-gray-500 leading-relaxed max-w-[200px]">
                  Track bookings and receive payouts from one streamlined dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative Image Section */}
        <div className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden">
          <Image
            src="/pages/BecomeLender3.webp"
            alt="Decorative Brand Image"
            fill
            className="object-cover object-center"
            priority
          />
        </div>


        {/* How Partnership Works */}
        <section className="py-16 md:py-24 bg-gray-50/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-avenir tracking-[0.2em] uppercase mb-16 text-center font-bold">
              How Partnership Works
            </h2>
            <div className="mx-auto max-w-2xl space-y-12">
              <div className="flex items-start space-x-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-black text-xs font-avenir">
                  <span>1</span>
                </div>
                <div>
                  <h3 className="text-sm font-avenir tracking-[0.1em] uppercase mb-2 font-medium">Apply</h3>
                  <p className="text-[12px] font-avenir font-light text-gray-600 leading-relaxed">
                    Submit your boutique for review.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-black text-xs font-avenir">
                  <span>2</span>
                </div>
                <div>
                  <h3 className="text-sm font-avenir tracking-[0.1em] uppercase mb-2 font-medium">
                    Upload Your Collection
                  </h3>
                  <p className="text-[12px] font-avenir font-light text-gray-600 leading-relaxed">
                    List your dresses and set availability.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-black text-xs font-avenir">
                  <span>3</span>
                </div>
                <div>
                  <h3 className="text-sm font-avenir tracking-[0.1em] uppercase mb-2 font-medium">
                    Receive Bookings & Payouts
                  </h3>
                  <p className="text-[12px] font-avenir font-light text-gray-600 leading-relaxed">
                    Accept rentals and receive direct payment after each booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="pt-0 pb-4 md:pb-8 bg-white w-full">
          <div className="w-full">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-xl md:text-3xl font-avenir font-bold text-black max-w-3xl leading-relaxed tracking-[0.1em] px-4 mb-4">
                YOUR DASHBOARD
              </h2>
              <p className="text-sm md:text-base font-avenir font-light text-gray-500 max-w-2xl mx-auto mb-16 px-4 leading-relaxed tracking-wide">
                Manage bookings, availability, and payouts from one streamlined dashboard.
              </p>
              <div className="relative w-full aspect-square overflow-hidden border-t border-b border-gray-100">
                <Image
                  src="/pages/lender dash.webp"
                  alt="Lender Dashboard Mockup"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </section>


        {/* Founding Lenders Early Access */}
        <section className="pt-8 pb-16 md:pt-12 md:pb-24 bg-white border-t border-gray-100">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="brand-header mb-2 tracking-[0.2em] uppercase">FOUNDING LENDERS</h2>
              <h3 className="brand-subheader text-gray-500 mb-10 tracking-[0.2em] uppercase">LIMITED EARLY ACCESS</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12 max-w-2xl mx-auto mb-16 text-left">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-4 w-4 bg-black flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                  <span className="text-sm md:text-lg font-avenir font-normal uppercase tracking-wider">Free for 12 Months</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-4 w-4 bg-black flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                  <span className="text-sm md:text-lg font-avenir font-normal uppercase tracking-wider">0% Commission</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-4 w-4 bg-black flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                  <span className="text-sm md:text-lg font-avenir font-normal uppercase tracking-wider">Priority onboarding</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-4 w-4 bg-black flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                  <span className="text-sm md:text-lg font-avenir font-normal uppercase tracking-wider">Founding partner recognition</span>
                </div>
              </div>

              <div className="mt-12">
                <button
                  onClick={handleClick}
                  className="text-black text-xs md:text-sm lg:text-base font-avenir tracking-[0.4em] uppercase border-b border-black pb-1 hover:opacity-70 transition-opacity font-medium"
                >
                  APPLY FOR FOUNDING ACCESS
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Plan Comparison */}
        {/* <section className="pt-12 pb-4 md:pt-16 md:pb-8">
          <div className="container overflow-x-auto">
            <h2 className="brand-subheader mb-10 text-center">
              Plan Comparison
            </h2>

            <div className="min-w-[768px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="">
                    <th className="py-4 text-left text-lg font-normal"></th>
                    <th className="py-4 text-center brand-subheader">
                      Founder&apos;s Collective
                    </th>
                    <th className="py-4 text-center brand-subheader">
                      Signature
                    </th>
                    <th className="py-4 text-center brand-subheader">
                      Vault Society
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="">
                    <td className="py-4 text-left text-[15px] font-medium">
                      Perfect For
                    </td>
                    <td className="py-4 text-center brand-body">
                      Early boutique getting started
                    </td>
                    <td className="py-4 text-center brand-body">
                      Growing to mid-sized boutique
                    </td>
                    <td className="py-4 text-center brand-body">
                      Premium, high-volume boutiques
                    </td>
                  </tr>
                  <tr className="">
                    <td className="py-4 text-left text-[15px] font-medium">
                      Monthly Fee
                    </td>
                    <td className="py-4 text-center brand-body">
                      Free (first 3 months)
                    </td>
                    <td className="py-4 text-center brand-body">$49/month</td>
                    <td className="py-4 text-center brand-body">$129/month</td>
                  </tr>
                  <tr className="">
                    <td className="py-4 text-left text-[15px] font-medium">
                      Commission
                    </td>
                    <td className="py-4 text-center brand-body">0%</td>
                    <td className="py-4 text-center brand-body">10%</td>
                    <td className="py-4 text-center brand-body">5%</td>
                  </tr>
                  <tr className="">
                    <td className="py-4 text-left text-[15px] font-medium">
                      Return Shipping
                    </td>
                    <td className="py-4 text-center brand-body">✕</td>
                    <td className="py-4 text-center brand-body">✕</td>
                    <td className="py-4 text-center brand-body">
                      Covered by Muse Gala
                    </td>
                  </tr>
                  <tr className="">
                    <td className="py-4 text-left text-[15px] font-medium">
                      Events
                    </td>
                    <td className="py-4 text-center brand-body">✕</td>
                    <td className="py-4 text-center brand-body">
                      Invite Based
                    </td>
                    <td className="py-4 text-center brand-body">
                      Guaranteed Invite
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section> */}
        {/* Final CTA Section */}
        <section className="pt-4 pb-20 md:pt-8 md:pb-32 border-t border-gray-100">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-xl md:text-3xl font-avenir tracking-[0.3em] uppercase mb-8 font-bold">
              BECOME A LENDER
            </h2>
            <p className="text-sm md:text-base font-avenir font-light text-gray-500 max-w-2xl mx-auto mb-12 px-4 leading-relaxed tracking-wide">
              We partner with lenders that value presentation, quality, and seamless service.
            </p>
            <Link
              href="/become-lender/form"
              className="inline-block text-black text-xs md:text-sm font-avenir tracking-[0.4em] uppercase border-b border-black pb-1 hover:opacity-50 transition-opacity"
            >
              Enquire Now
            </Link>
          </div>
        </section>

      </main>
    </div>
  )
}

export default BecomeLender
