/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

// ---------- GET Plans ----------
const getSubscriptions = async (token: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/subscription/get-all`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch subscription plans')
  }

  return res.json()
}

// ---------- POST Subscription ----------
const createSubscription = async ({
  id,
  token,
}: {
  id: string
  token: string
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/subscription/create-checkout-session/${id}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    }
  )

  if (!res.ok) {
    throw new Error('Failed to create subscription')
  }

  return res.json()
}

// ---------- Skeleton Loader ----------
const PlanSkeleton = () => (
  <div className="border border-gray-200 p-8 flex flex-col h-full animate-pulse">
    <div className="text-center mb-8">
      <div className="h-6 w-3/4 mx-auto bg-gray-200 rounded mb-4"></div>
      <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded mb-8"></div>
      <div className="h-8 w-1/3 mx-auto bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-1/4 mx-auto bg-gray-200 rounded mb-8"></div>
      <div className="h-5 w-1/3 mx-auto bg-gray-200 rounded mb-8"></div>
    </div>
    <div className="flex-grow">
      <ul className="space-y-4 mb-8">
        {Array(3)
          .fill(null)
          .map((_, idx) => (
            <li key={idx} className="flex items-start">
              <div className="h-5 w-5 mr-2 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </li>
          ))}
      </ul>
    </div>
    <div className="mt-auto">
      <div className="h-10 w-full bg-gray-200 rounded"></div>
    </div>
  </div>
)

export default function PricingPlan() {
  const router = useRouter()
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  // --- Get all plans ---
  const { data, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => getSubscriptions(accessToken),
    enabled: true,
  })

  // --- Create subscription ---
  const { mutate, isPending } = useMutation({
    mutationFn: createSubscription,
    onSuccess: (res) => {
      if (res?.status && res?.data?.checkoutUrl) {
        toast.success('Redirecting to payment...', { duration: 1500 })
        //  open checkout in new tab
        window.open(res.data.checkoutUrl, '_blank')
      } else {
        toast.error('Failed to get checkout URL. Please try again.')
      }
    },
    onError: () => {
      toast.error('Something went wrong, please try again.')
    },
  })

  const handleChoosePlan = (planId: string) => {
    if (!accessToken) {
      toast.error('You must be signed in to choose a plan!', {
        position: 'bottom-right',
      })
      setTimeout(() => router.push('/login'), 2000)
      return
    }
    mutate({ id: planId, token: accessToken })
  }



  const plans = data?.data || []

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="brand-header mb-2">
          CHOOSE THE PLAN
        </h2>
        <h3 className="brand-header">
          THAT GROWS WITH YOU
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {isLoading
          ? Array(3)
            .fill(null)
            .map((_, idx) => <PlanSkeleton key={idx} />)
          : plans.map((plan: any) => (
            <div
              key={plan._id}
              className="border border-gray-200 p-8 flex flex-col h-full"
            >
              <div className="text-center mb-8">
                <h3 className="brand-subheader mb-1">{plan.name}</h3>
                <p className="brand-body text-gray-600 mb-8 text-center">
                  {plan.description.split('.')[0]}
                </p>

                <div className="mb-2">
                  <span className="brand-subheader font-bold">
                    {plan.price === 0 ? 'FREE' : `$${plan.price}`}
                  </span>
                </div>
                <p className="brand-body text-center mb-8">
                  {plan.description.includes('PER MONTH')
                    ? 'PER MONTH'
                    : plan.billingCycle}
                </p>

                <div className="brand-body mb-8">
                  {plan.commission}% Commission
                </div>
              </div>

              <div className="flex-grow">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 mr-2">
                        <Check className="h-5 w-5 text-black" />
                      </div>
                      <span className="brand-body text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => handleChoosePlan(plan._id)}
                  disabled={isPending}
                  className="w-full py-3 border-t border-gray-200 brand-button hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Redirecting...' : 'CHOOSE PLAN'}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
