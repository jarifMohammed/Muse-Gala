import clsx from 'clsx'
import React from 'react'
import { Card } from './ui/card'

interface PaymentcardProps {
  membershipTier: 'Muse Member' | 'Muse Star' | 'Muse Gold'
}

const Paymentcard: React.FC<PaymentcardProps> = ({ membershipTier }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      <MembershipCard
        title="Muse Member"
        price="$0+"
        benefits={[
          'Free shipping on all orders over $100',
          'Early access to new styles',
          'Style and trend updates',
        ]}
        active={membershipTier === 'Muse Member'}
      />

      <MembershipCard
        title="Muse Star"
        price="$300+"
        benefits={[
          '$20 "Welcome to Silver" voucher',
          'Surprise perks: bonus credits, small gifts',
        ]}
        active={membershipTier === 'Muse Star'}
      />

      <MembershipCard
        title="Muse Gold"
        price="$600+"
        benefits={[
          '$30 "Welcome to Gold" voucher',
          'Free insurance on 1 rental per year',
          'Priority customer support',
        ]}
        active={membershipTier === 'Muse Gold'}
      />
    </div>
  )
}

export default Paymentcard

interface MembershipCardProps {
  title: string
  price: string
  benefits: string[]
  active?: boolean
}

const MembershipCard: React.FC<MembershipCardProps> = ({
  title,
  price,
  benefits,
  active = false,
}) => {
  return (
    <Card
      className={clsx(
        'rounded-sm p-6 flex flex-col items-center text-center font-light h-full transition-all duration-500',
        active
          ? 'border-2 border-[#891D33] shadow-[0_0_12px_rgba(137,29,51,0.3)] scale-[1.02]'
          : 'border border-black hover:border-[#891D33]/60'
      )}
    >
      <h3
        className={clsx(
          'text-cl font-light tracking-widest mb-6',
          active && 'text-[#891D33]'
        )}
      >
        {title}
      </h3>
      <p
        className={clsx(
          'text-2xl font-light tracking-widest mb-6',
          active && 'text-[#891D33]'
        )}
      >
        {price}
      </p>
      <ul className="text-[13px] font-light tracking-widest space-y-3">
        {benefits.map((benefit, idx) => (
          <li key={idx}>{benefit}</li>
        ))}
      </ul>
    </Card>
  )
}
