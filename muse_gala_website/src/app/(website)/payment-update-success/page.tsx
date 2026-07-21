'use client'

import Link from 'next/link'

export default function PaymentUpdateSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center pt-24 md:pt-32 lg:pt-40 font-avenir">
      <div className="text-center mt-4 px-4">
        <h1 className="text-3xl md:text-5xl font-avenir tracking-[10px] uppercase">
          Thank you!
        </h1>
        <p className="font-avenir tracking-[4px] mt-5 opacity-75 text-sm md:text-base">
          Your payment method has been successfully updated.
        </p>

        <div className="mt-16">
          <Link href="/account">
            <button
              className="font-avenir opacity-75 border-b border-black pb-1 uppercase tracking-widest hover:opacity-100 transition-opacity"
            >
              RETURN TO ACCOUNT
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
