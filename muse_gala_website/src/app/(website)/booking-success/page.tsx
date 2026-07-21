'use client'

import Link from 'next/link'
import { useShoppingStore } from '@/zustand/shopingStore'
import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const { bookingSummary, clearBookingSummary, clearPromoCode } =
    useShoppingStore()
  // const router = useRouter()

  const formatCurrency = (value?: number) => `$${Number(value ?? 0).toFixed(2)}`

  useEffect(() => {
    clearPromoCode()
  }, [clearPromoCode])

  // Redirect if no booking summary
  // useEffect(() => {
  //   if (!bookingSummary) {
  //     // router.push('/shop')
  //   }
  // }, [bookingSummary, router])

  // if (!bookingSummary) {
  //   return null // or a loading spinner
  // }

  console.log('summary of mine', bookingSummary)

  return (
    <div className="flex flex-col items-center justify-center pt-24 md:pt-32 lg:pt-40 font-avenir">
      <div className="text-center mt-4 px-4">
        <h1 className="text-3xl md:text-5xl font-avenir tracking-[10px] uppercase">
          Thank you for your booking
        </h1>
        <p className="font-avenir tracking-[4px] mt-5 opacity-75 text-sm md:text-base">
          Your rental has been confirmed. You&apos;ll receive an email shortly
          with full details.
        </p>

        <div className="mt-16 space-y-2 max-w-2xl mx-auto">
          <h1 className="font-avenir uppercase opacity-75 tracking-[2px] mb-5 text-lg">
            Booking Summary
          </h1>
          <p className="font-avenir text-sm uppercase opacity-75 tracking-[2px]">
            Order ID:{' '}
            <span className="font-semibold">{bookingSummary?.orderId}</span>
          </p>
          <p className="font-avenir text-sm uppercase opacity-75 tracking-[2px]">
            Dress:{' '}
            <span className="font-semibold">{bookingSummary?.dressName}</span>
          </p>
          <p className="font-avenir text-sm uppercase opacity-75 tracking-[2px]">
            Size: <span className="font-semibold">{bookingSummary?.size}</span>
          </p>
          <p className="font-avenir text-sm uppercase opacity-75 tracking-[2px]">
            Rental Period:{' '}
            <span className="font-semibold">
              {bookingSummary?.rentalStartDate} -{' '}
              {bookingSummary?.rentalEndDate}
            </span>
          </p>
          <p className="font-avenir text-sm uppercase opacity-75 tracking-[2px]">
            Delivery Method:{' '}
            <span className="font-semibold">
              {bookingSummary?.deliveryMethod}
            </span>
          </p>
          <p className="font-avenir text-sm uppercase opacity-75 tracking-[2px]">
            Total Paid:{' '}
            <span className="font-semibold">
              {formatCurrency(bookingSummary?.totalPaid)}
            </span>
          </p>
        </div>

        <div className="mt-10 max-w-lg mx-auto text-left">
          <h2 className="font-avenir uppercase opacity-75 tracking-[2px] mb-5 text-lg text-center">
            Price Breakdown
          </h2>

          <div className="space-y-3 text-sm uppercase tracking-[2px]">
            <div className="flex items-center justify-between gap-6 opacity-75">
              <span>
                Rental Fee{' '}
                {bookingSummary?.rentalDurationDays
                  ? `(${bookingSummary.rentalDurationDays} days)`
                  : ''}
              </span>
              <span>{formatCurrency(bookingSummary?.rentalFee)}</span>
            </div>

            <div className="flex items-center justify-between gap-6 opacity-75">
              <span>Care &amp; Protection</span>
              <span>{formatCurrency(bookingSummary?.careProtectionFee)}</span>
            </div>

            <div className="flex items-center justify-between gap-6 opacity-75">
              <span>{bookingSummary?.deliveryMethod}</span>
              <span>
                {bookingSummary?.deliveryMethod === 'Local Pickup'
                  ? 'Free'
                  : formatCurrency(bookingSummary?.shippingCost)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-6 border-t border-black/20 pt-3 opacity-75">
              <span>Subtotal</span>
              <span>{formatCurrency(bookingSummary?.subtotal)}</span>
            </div>

            <div className="flex items-center justify-between gap-6 opacity-75">
              <span>Promo Applied</span>
              <span>{bookingSummary?.isPromoApplied ? 'Yes' : 'No'}</span>
            </div>

            {bookingSummary?.promoCode && (
              <div className="flex items-center justify-between gap-6 text-green-700">
                <span>Promo Code</span>
                <span>{bookingSummary.promoCode}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-6 opacity-75">
              <span>Loyalty Discount</span>
              <span>
                {bookingSummary?.isLoyaltyDiscountApplied ? 'Yes' : 'No'}
              </span>
            </div>

            {bookingSummary?.loyaltyRewardTitle && (
              <div className="flex items-center justify-between gap-6 text-green-700">
                <span>{bookingSummary.loyaltyRewardTitle}</span>
                <span>-{formatCurrency(bookingSummary.discountAmount)}</span>
              </div>
            )}

            {bookingSummary?.discountLabel &&
              !bookingSummary.loyaltyRewardTitle && (
                <div className="flex items-center justify-between gap-6 text-green-700">
                  <span>{bookingSummary.discountLabel}</span>
                  <span>
                    -{formatCurrency(bookingSummary.discountAmount)}
                  </span>
                </div>
              )}

            <div className="flex items-center justify-between gap-6 border-t border-black pt-3 font-semibold opacity-75">
              <span>Total Paid</span>
              <span>{formatCurrency(bookingSummary?.totalPaid)}</span>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Link href="/shop">
            <button
              onClick={() => clearBookingSummary()}
              className="font-avenir opacity-75 border-b border-black pb-1 uppercase tracking-widest hover:opacity-100 transition-opacity"
            >
              BROWSE
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
