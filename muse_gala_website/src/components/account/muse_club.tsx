'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserStore } from '@/zustand/useUserStore'
import { getAvailableMuseReward } from '@/utils/museRewards'
import Paymentcard from '../payment_card'

const MuseClub = () => {
  const { user } = useUserStore()
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const [animatedProgress, setAnimatedProgress] = useState(0)

  // ✅ Fetch current user data
  const {
    data: userRes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/v1/user/${user?.id}`, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      })
      if (!res.ok) throw new Error('Failed to fetch user data')
      return res.json()
    },
    enabled: !!user?.id && !!user?.accessToken,
  })

  const currentUser = userRes?.data
  const totalSpent = currentUser?.totalSpent || 0
  const availableReward = getAvailableMuseReward(currentUser)

  // ✅ Determine membership tier
  const membershipTier =
    totalSpent >= 600
      ? 'Muse Gold'
      : totalSpent >= 300
      ? 'Muse Star'
      : 'Muse Member'

  const progressValue = Math.min((totalSpent / 600) * 100, 100)

  // Tiered remaining logic
  const remainingToStar = totalSpent < 300 ? 300 - totalSpent : 0
  const remainingToGold = totalSpent >= 300 && totalSpent < 600 ? 600 - totalSpent : 0

  // ✅ Smooth animation
  useEffect(() => {
    let start = 0
    const duration = 1000
    const stepTime = 10
    const totalSteps = duration / stepTime
    const increment = progressValue / totalSteps

    const timer = setInterval(() => {
      start += increment
      if (start >= progressValue) {
        setAnimatedProgress(progressValue)
        clearInterval(timer)
      } else {
        setAnimatedProgress(start)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [progressValue])

  // ✅ Skeleton loader
  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (isError || !currentUser) {
    return (
      <p className="text-center text-red-500 py-10">Failed to load user data</p>
    )
  }

  return (
    <div className="w-full">
      <section>
        {/* Title */}
        <div className="mb-12">
          <h2 className="text-xl tracking-widest font-light border-black border-b-[1px] pb-5 mb-4 sm:mb-6">
            Muse Club
          </h2>
        </div>

        {/* Spend Info */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <p className="sm:text-lg md:text-2xl font-light tracking-[.2rem]">
            Your Annual Spend: ${totalSpent.toFixed(2)}
          </p>
          {remainingToStar > 0 ? (
            // Below Muse Star
            <p className="text-xl md:text-[24px] font-light tracking-[.2rem]">
              ${remainingToStar.toFixed(2)} more to reach Muse Star
            </p>
          ) : remainingToGold > 0 ? (
            // At Muse Star, working toward Gold
            <div className="flex flex-col gap-1">
              <p className="text-xl md:text-[24px] font-light tracking-[.2rem] text-[#891D33]">
                You&apos;re at Muse Star!
              </p>
              <p className="text-xl md:text-[24px] font-light tracking-[.2rem]">
                ${remainingToGold.toFixed(2)} more to reach Muse Gold
              </p>
            </div>
          ) : (
            // At Muse Gold
            <p className="text-xl md:text-[24px] font-light tracking-[.2rem] text-[#891D33]">
              You are at Muse Gold
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-10 rounded-lg">
          <div className="relative w-full h-2 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-2 rounded transition-all duration-500 ease-in-out"
              style={{
                width: `${animatedProgress}%`,
                backgroundColor:
                  animatedProgress > 0 ? '#891D33' : 'transparent',
              }}
            ></div>
          </div>

          {/* Tier Labels */}
          <div className="flex justify-between text-[14px] text-gray-700 mt-10 md:mt-16">
            {[
              { label: '$0 Member', key: 'Muse Member' },
              { label: '$300 Star', key: 'Muse Star' },
              { label: '$600 Gold', key: 'Muse Gold' },
            ].map((tier) => (
              <span
                key={tier.key}
                className={`font-light tracking-wider px-4 py-1 rounded-md transition-all duration-300 ${
                  membershipTier === tier.key
                    ? 'border border-[#891D33] text-[#891D33] bg-[#891D33]/5'
                    : ''
                }`}
              >
                {tier.label}
              </span>
            ))}
          </div>
        </div>

        {availableReward && (
          <div className="mb-10 border border-[#891D33]/40 bg-[#891D33]/5 p-5">
            <p className="text-sm md:text-base font-light tracking-[.18rem] text-[#891D33]">
              {availableReward.title}
            </p>
            <p className="mt-2 text-xs md:text-sm font-light tracking-widest text-gray-700">
              {availableReward.description}
            </p>
          </div>
        )}

        {/* Membership Cards */}
        <Paymentcard membershipTier={membershipTier} />
      </section>
    </div>
  )
}

export default MuseClub
