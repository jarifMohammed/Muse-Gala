/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useShoppingStore } from '@/zustand/shopingStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useUserStore } from '@/zustand/useUserStore'
import { useLocationStore } from '@/zustand/useLocationStore'
import { bookingApi } from '@/lib/bookingApiService'
import { paymentApi } from '@/lib/paymentApi'
import { Loader2, ShieldCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { calculate8DayRentalPrice } from '@/utils/rentalPrice'
import { getAvailableMuseReward } from '@/utils/museRewards'

interface KycApiRes {
  status: boolean
  message: {
    url: string
    message: string
  }
}

interface KycStatusApiRes {
  success?: boolean
  statusCode?: number
  status?: boolean
  message?:
    | string
    | {
        status: 'verified' | 'pending' | 'requires_input' | 'failed' | 'not_started'
        verified: boolean
      }
  data?: {
    status: 'verified' | 'pending' | 'requires_input' | 'failed' | 'not_started'
    verified: boolean
  }
}

interface ShippingDetails {
  isLocalPickup?: boolean
  isShippingAvailable?: boolean
}

interface ProductData {
  _id?: string
  masterDressId?: string
  dressName?: string
  basePrice?: number
  insuranceFee?: number
  shippingDetails?: ShippingDetails
  sizes?: string[]
  colors?: string[]
}

interface ShopDetailsProps {
  singleProduct: {
    data?: ProductData
  }
}

const PriceBreakDown = ({ singleProduct }: ShopDetailsProps) => {
  const {
    rent,
    isConfirm,
    setIsConfirm,
    startDate,
    endDate,
    deliveryOption,
    selectedSize,
    selectedColor,
    fullName,
    email,
    phone,
    address,
    setBookingSummary,
    currentBookingId,
    setCurrentBookingId,
    promoCode,
    setPromoCode,
    appliedPromo,
    setAppliedPromo,
    promoProductId,
    setPromoProductId,
    clearPromoCode,
  } = useShoppingStore()

  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const router = useRouter()
  const pathName = usePathname()
  const queryClient = useQueryClient()

  const data = singleProduct?.data

  const { user, setUser } = useUserStore()
  const automaticReward = useMemo(
    () => getAvailableMuseReward(user),
    [user],
  )

  const { lenders } = useLocationStore()

  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [showKycSection, setShowKycSection] = useState(false)
  const [kycCountdown, setKycCountdown] = useState(0)
  const [isKycPolling, setIsKycPolling] = useState(false)
  const [kycProgress, setKycProgress] = useState('')
  const [latestKycStatus, setLatestKycStatus] = useState('')
  const [hasLocalKycApproval, setHasLocalKycApproval] = useState(false)
  const [isKycContinuing, setIsKycContinuing] = useState(false)
  const hasOpenedKycRef = useRef(false)
  const hasAutoSubmittedRentRef = useRef(false)
  const lastHandledKycStatusRef = useRef('')
  const hasLocalKycApprovalRef = useRef(false)
  const kycContinueTimerRef = useRef<number | null>(null)
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const isKycVerified =
    hasLocalKycApproval ||
    (user?.kycVerified === true &&
      user?.kycStatus?.toLowerCase() === 'verified')

  const {
    refetch: fetchKyc,
    isFetching: isFetchingKyc,
  } = useQuery<KycApiRes>({
    queryKey: ['kyc-check-inline'],
    queryFn: async () => {
      const currentPath = window.location.pathname;
      const res = await fetch(`${baseUrl}/api/v1/user/kyc/verify?returnUrl=${encodeURIComponent(currentPath)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error('ID verification failed')
      return res.json()
    },
    enabled: false,
  })

  const {
    data: kycStatusRes,
    refetch: refetchKycStatus,
    error: kycStatusError,
  } = useQuery<KycStatusApiRes>({
    queryKey: ['kyc-status-inline', user?.id],
    queryFn: async () => {
      const statusUrl = `${baseUrl}/api/v1/user/kyc/status/${user?.id}`
      console.log('KYC status polling request:', {
        url: statusUrl,
        userId: user?.id,
        hasToken: !!token,
      })

      const res = await fetch(statusUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('KYC status polling failed:', {
          status: res.status,
          statusText: res.statusText,
          body: errorText,
        })
        throw new Error('Failed to check ID verification status')
      }

      const data = await res.json()
      console.log('KYC status polling backend response:', {
        checkedAt: new Date().toISOString(),
        response: data,
      })
      return data
    },
    enabled: isKycPolling && !!user?.id && !!token,
    refetchInterval: isKycPolling ? 5000 : false,
    refetchOnWindowFocus: true,
    retry: false,
  })

  useEffect(() => {
    if (!isKycPolling || kycCountdown <= 0) return

    const timer = window.setInterval(() => {
      setKycCountdown(current => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isKycPolling, kycCountdown])

  useEffect(() => {
    if (!isKycPolling || kycCountdown !== 0) return
    setKycProgress('Still waiting for approval')
    setKycCountdown(60)
  }, [isKycPolling, kycCountdown])

  useEffect(() => {
    if (!isKycPolling) return

    const handleFocus = () => {
      refetchKycStatus()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isKycPolling, refetchKycStatus])

  useEffect(() => {
    if (!kycStatusError) return
    console.error('KYC status polling error:', kycStatusError)
  }, [kycStatusError])

  useEffect(() => {
    return () => {
      if (kycContinueTimerRef.current) {
        window.clearTimeout(kycContinueTimerRef.current)
      }
    }
  }, [])

  // PRICE CALCULATION
  const basePrice = Number(data?.basePrice ?? 0)
  const displayPrice = rent === '8' ? calculate8DayRentalPrice(basePrice) : basePrice

  const insurance = Number(data?.insuranceFee ?? 0)
  const shippingAvailable = data?.shippingDetails?.isShippingAvailable
  const localPickup = data?.shippingDetails?.isLocalPickup

  const shippingCost =
    deliveryOption === 'shipping' && shippingAvailable ? 14.95 : 0

  // Calculate subtotal first
  const subtotal = displayPrice + insurance + shippingCost

  // Calculate discount based on type
  let promoDiscount = 0
  if (!automaticReward && appliedPromo) {
    if (appliedPromo.discountType.toUpperCase() === 'FLAT') {
      // Flat discount - direct amount
      promoDiscount = Number(appliedPromo.discountValue)
    } else if (appliedPromo.discountType === 'PERCENTAGE') {
      // Percentage discount - calculate from subtotal
      promoDiscount = (subtotal * Number(appliedPromo.discountValue)) / 100
    }
  }

  const automaticDiscount = automaticReward
    ? Math.min(subtotal, automaticReward.amount)
    : 0
  const discount = automaticReward ? automaticDiscount : promoDiscount

  console.log('discount and promocode', appliedPromo, discount)

  // Final total - ensure it doesn't go below 0
  const total = Math.max(0, subtotal - discount)

  useEffect(() => {
    if (automaticReward && (appliedPromo || promoCode)) {
      clearPromoCode()
    }
  }, [automaticReward, appliedPromo, promoCode, clearPromoCode])

  useEffect(() => {
    if (!data?._id) return

    if ((promoCode || appliedPromo) && promoProductId !== data._id) {
      clearPromoCode()
    }
  }, [data?._id, promoCode, appliedPromo, promoProductId, clearPromoCode])

  // FORMAT DATES FOR API
  const formatDate = (date: Date | null) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // FORMAT DATES FOR DISPLAY
  const formatDisplayDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // VALIDATE PROMO CODE
  const handleApplyPromo = async () => {
    if (automaticReward) {
      toast.error("Promo codes can't be combined with your automatic reward", {
        position: 'bottom-right',
      })
      return
    }

    if (!token) {
      toast.error('Please login to apply promo code')
      return
    }

    if (!promoCode.trim()) {
      toast.error('Please enter a promo code')
      return
    }

    setIsApplyingPromo(true)

    try {
      const response = await bookingApi.validatePromoCode(
        { promoCode: promoCode.trim() },
        token,
      )

      if (response.status && response.data) {
        setPromoProductId(data?._id ?? null)
        setAppliedPromo(response.data)
        toast.success(response.message || 'Promo code applied successfully!', {
          position: 'bottom-right',
        })
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid promo code', {
        position: 'bottom-right',
      })
      clearPromoCode()
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const resetKycFlow = () => {
    if (kycContinueTimerRef.current) {
      window.clearTimeout(kycContinueTimerRef.current)
      kycContinueTimerRef.current = null
    }

    setIsKycPolling(false)
    setIsKycContinuing(false)
    setKycCountdown(0)
    setKycProgress('')
    setLatestKycStatus('')
    lastHandledKycStatusRef.current = ''
  }

  const getKycStatusPayload = (response?: KycStatusApiRes) => {
    if (!response) return null

    if (response.data?.status) {
      return response.data
    }

    if (typeof response.message === 'object' && response.message?.status) {
      return response.message
    }

    return null
  }

  const validateRentNowFields = () => {
    if (!startDate || !endDate) {
      toast.error('Please select rental dates!')
      return false
    }

    if (!selectedSize) {
      toast.error('Please select a size!')
      return false
    }

    if (deliveryOption === 'pickup' && lenders.length === 0) {
      toast.error('No nearby lenders found. Please choose shipping instead.')
      return false
    }

    return true
  }

  const startKycVerification = async () => {
    if (!user || !token || isFetchingKyc) return

    if (hasLocalKycApprovalRef.current || isKycVerified) {
      return
    }

    hasOpenedKycRef.current = false
    hasAutoSubmittedRentRef.current = false
    lastHandledKycStatusRef.current = ''
    queryClient.removeQueries({ queryKey: ['kyc-check-inline'] })
    setShowKycSection(false)
    setKycCountdown(60)
    setIsKycPolling(true)
    setKycProgress('Opening verification')
    setLatestKycStatus('pending')

    try {
      const verificationResult = await fetchKyc()
      if (verificationResult.error) throw verificationResult.error
      const verificationUrl = verificationResult.data?.message?.url

      if (verificationUrl && !hasOpenedKycRef.current) {
        hasOpenedKycRef.current = true
        window.open(verificationUrl, '_blank')
      }

      setKycProgress('Checking status')
      refetchKycStatus()
    } catch (error: any) {
      resetKycFlow()
      setShowKycSection(true)
      toast.error(error.message || 'ID verification failed', {
        position: 'bottom-right',
      })
    }
  }

  // CREATE BOOKING (for Rent Now button - shop page)
  const createBookingForRentNow = useMutation({
    mutationFn: async () => {
      const bookingData: any = {
        masterdressId: data?._id,
        rentalStartDate: formatDate(startDate),
        rentalEndDate: formatDate(endDate),
        rentalDurationDays: rent === '4' ? 4 : 8,
        size: selectedSize,
        color: selectedColor,
        deliveryMethod: deliveryOption === 'shipping' ? 'Shipping' : 'Pickup',
      }

      // Add promo code if applied
      if (!automaticReward && appliedPromo) {
        bookingData.promoCode = appliedPromo.code
      }

      // Add pickup-specific fields
      if (deliveryOption === 'pickup' && lenders.length > 0) {
        bookingData.tryOnRequested = true
        bookingData.selectedLender = [
          {
            _id: lenders[0]._id,
            email: lenders[0].email,
            location: {
              type: lenders[0].location.type,
              coordinates: lenders[0].location.coordinates,
            },
            distance: lenders[0].distance,
          },
        ]
      }

      return await bookingApi.createBooking(bookingData, token!)
    },
    onSuccess: res => {
      const bookingId = res?.data?.id

      if (!bookingId) {
        toast.error('No booking ID returned')
        return
      }

      setCurrentBookingId(bookingId)

      setTimeout(() => {
        router.push(`/shop/checkout/${data?._id}`)
      }, 1000)
    },
    onError: (err: any) => {
      hasAutoSubmittedRentRef.current = false
      setIsKycContinuing(false)
      toast.error(err.message || 'Booking failed', { position: 'bottom-right' })
    },
  })

  const submitRentNowBooking = useCallback(() => {
    if (hasAutoSubmittedRentRef.current || createBookingForRentNow.isPending) {
      return
    }

    // Prevent double booking if we already generated a booking ID for this active session
    if (currentBookingId) {
      router.push(`/shop/checkout/${data?._id}`)
      return
    }

    hasAutoSubmittedRentRef.current = true
    createBookingForRentNow.mutate()
  }, [createBookingForRentNow, currentBookingId, router, data?._id])

  useEffect(() => {
    const kycPayload = getKycStatusPayload(kycStatusRes)
    const kycStatus = kycPayload?.status
    const verified = kycPayload?.verified === true

    if (!kycStatus) return

    console.log('KYC status polling normalized result:', {
      checkedAt: new Date().toISOString(),
      status: kycStatus,
      verified,
      rawResponse: kycStatusRes,
    })

    setLatestKycStatus(kycStatus.replace('_', ' '))

    if (kycStatus !== 'pending') {
      const statusKey = `${kycStatus}:${verified}`
      if (lastHandledKycStatusRef.current === statusKey) return
      lastHandledKycStatusRef.current = statusKey
    }

    if (verified && kycStatus === 'verified') {
      if (hasAutoSubmittedRentRef.current) return

      hasLocalKycApprovalRef.current = true
      setHasLocalKycApproval(true)

      if (user) {
        setUser({
          ...user,
          kycVerified: true,
          kycStatus: 'verified',
        })

        queryClient.setQueryData(['user', user.id], (oldData: any) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              kycVerified: true,
              kycStatus: 'verified',
            },
          }
        })
      }

      setIsKycPolling(false)
      setIsKycContinuing(true)
      setKycCountdown(0)
      setKycProgress('Verified, syncing status')
      toast.success('ID verified. Continuing your rental.', {
        position: 'bottom-right',
      })

      kycContinueTimerRef.current = window.setTimeout(() => {
        setKycProgress('Verified, continuing')
        submitRentNowBooking()
      }, 2500)

      return
    }

    if (kycStatus === 'pending') {
      setKycProgress(
        kycCountdown > 0 ? 'Waiting for approval' : 'Still waiting for approval',
      )
      return
    }

    setIsKycPolling(false)
    setKycCountdown(0)

    if (kycStatus === 'requires_input') {
      setKycProgress('More information required')
      toast.error('Please complete the remaining verification steps.', {
        position: 'bottom-right',
      })
      return
    }

    if (kycStatus === 'failed') {
      setKycProgress('Verification failed')
      toast.error('ID verification failed. Please try again.', {
        position: 'bottom-right',
      })
      return
    }

    setKycProgress('Verification not started')
  }, [
    kycCountdown,
    kycStatusRes,
    queryClient,
    setUser,
    submitRentNowBooking,
    user,
  ])

  // UPDATE BOOKING (for Confirm & Pay button - checkout page)
  const updateBookingForPayment = useMutation({
    mutationFn: async () => {
      if (!currentBookingId) {
        throw new Error('No booking ID found. Please create a booking first.')
      }

      const updateData: any = {
        rentalStartDate: formatDate(startDate),
        rentalEndDate: formatDate(endDate),
        rentalDurationDays: rent === '4' ? 4 : 8,
        size: selectedSize,
        color: selectedColor,
        deliveryMethod: deliveryOption === 'shipping' ? 'Shipping' : 'Pickup',
        address: address,
        phone: phone,
      }

      // Add promo code if applied
      if (!automaticReward && appliedPromo) {
        updateData.promoCode = appliedPromo.code
      }

      // Add pickup-specific fields
      if (deliveryOption === 'pickup' && lenders.length > 0) {
        updateData.tryOnRequested = true
        updateData.selectedLender = [
          {
            _id: lenders[0]._id,
            email: lenders[0].email,
            location: {
              type: lenders[0].location.type,
              coordinates: lenders[0].location.coordinates,
            },
            distance: lenders[0].distance,
          },
        ]
      }

      return await bookingApi.updateBooking(
        currentBookingId,
        updateData,
        token!,
      )
    },
    onSuccess: () => {
      setBookingSummary({
        orderId: currentBookingId || 'N/A',
        dressName: data?.dressName || 'N/A',
        rentalStartDate: formatDisplayDate(startDate),
        rentalEndDate: formatDisplayDate(endDate),
        deliveryMethod:
          deliveryOption === 'shipping' ? 'Shipping' : 'Local Pickup',
        totalPaid: total,
        size: selectedSize || 'N/A',
        rentalDurationDays: rent === '4' ? 4 : 8,
        rentalFee: displayPrice,
        careProtectionFee: insurance,
        shippingCost,
        subtotal,
        discountAmount: discount,
        discountLabel: automaticReward
          ? `Muse Club Reward ($${automaticReward.amount})`
          : appliedPromo
            ? `Promo Code (${appliedPromo.code})`
            : null,
        promoCode: !automaticReward ? appliedPromo?.code ?? null : null,
        isPromoApplied: !automaticReward && !!appliedPromo && discount > 0,
        loyaltyRewardTitle: automaticReward?.title ?? null,
        isLoyaltyDiscountApplied: !!automaticReward && discount > 0,
      })

      createCheckout.mutate()
    },
    onError: (err: any) => {
      const errorMessage = err.message || 'Failed to update booking'
      if (errorMessage.toLowerCase().includes('not found')) {
        setCurrentBookingId(null)
        toast.error('Session expired. Please click Rent Now again to start fresh.', {
          position: 'bottom-right',
        })
        setTimeout(() => router.push(`/shop/${data?._id}`), 2000)
      } else {
        toast.error(errorMessage, {
          position: 'bottom-right',
        })
      }
    },
  })

  // SAVE PAYMENT INFO (redirect to card info page)
  const createCheckout = useMutation({
    mutationFn: async () => {
      return await paymentApi.savePaymentInfo(token!, currentBookingId || undefined)
    },
    onSuccess: res => {
      const url = res?.data?.url
      if (url) {
        window.location.href = url
      } else {
        toast.error('Payment setup failed, try again later')
      }
    },
    onError: (err: any) => {
      toast.error(err.message || 'Payment setup failed', {
        position: 'bottom-right',
      })
    },
  })

  // HANDLERS
  const handleCheckout = () => {
    if (!token) {
      toast.error('You must be signed in to continue!')
      setTimeout(() => router.push('/signin'), 2000)
      return
    }

    if (user && !isKycVerified) {
      setShowKycSection(true)
      return
    }

    if (!fullName || !email || !phone || !address) {
      toast.error('Please complete all required fields!')
      return
    }

    if (!startDate || !endDate) {
      toast.error('Please select rental dates!')
      return
    }

    if (!selectedSize) {
      toast.error('Please select a size!')
      return
    }

    if (deliveryOption === 'pickup' && lenders.length === 0) {
      toast.error('No nearby lenders found. Please choose shipping instead.')
      return
    }

    setIsConfirm(true)
  }

  const handleConfirmPay = () => {
    if (updateBookingForPayment.isPending || createCheckout.isPending) return

    if (!currentBookingId) {
      toast.error('No booking ID found. Please try again.')
      return
    }
    updateBookingForPayment.mutate()
  }

  const handleRentNow = () => {
    if (!token) {
      toast.error('Please login to continue.', {
        position: 'bottom-right',
      })

      setTimeout(() => {
        router.push('/login')
      }, 1000)

      return
    }

    if (!validateRentNowFields()) return

    if (user && !isKycVerified) {
      setShowKycSection(true)
      toast.error('Please complete ID verification before renting.', {
        position: 'bottom-right',
      })
      return
    }

    submitRentNowBooking()
  }

  const isRentNowWaitingForKyc = isKycPolling || isKycContinuing
  const rentNowButtonLabel = createBookingForRentNow.isPending
    ? 'Processing'
    : isRentNowWaitingForKyc
      ? isKycContinuing
        ? kycProgress || 'Verified, syncing status'
        : `${kycProgress || 'Checking status'} ${kycCountdown}s`
      : 'Rent Now'

  // UI
  return (
    <div className="font-avenir uppercase mt-10">
      <h1 className="opacity-75 tracking-widest border-b border-black pb-1">
        Subtotal
      </h1>

      <div className="mt-4">
        <div className="space-y-3 text-sm border-b border-black pb-2">
          <div className="flex items-center justify-between opacity-75 tracking-widest">
            <span>
              Rental Fee {rent === '8' ? '(8 days)' : '(4 days)'}
            </span>
            <span>${displayPrice.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between opacity-75 tracking-widest">
            <span>Care &amp; Protection</span>
            <span>${insurance}</span>
          </div>

          {deliveryOption === 'shipping' && shippingAvailable && (
            <div className="flex items-center justify-between opacity-75 tracking-widest">
              <span>Shipping</span>
              <span>${shippingCost}</span>
            </div>
          )}

          {deliveryOption === 'pickup' && localPickup && (
            <div className="flex items-center justify-between opacity-75 tracking-widest">
              <span>Pickup</span>
              <span>Free</span>
            </div>
          )}

          {(automaticReward || appliedPromo) && discount > 0 && (
            <div className="flex items-center justify-between tracking-widest text-green-600">
              <span className="uppercase text-xs">
                {automaticReward
                  ? `Muse Club Reward ($${automaticReward.amount})`
                  : `Discount (${appliedPromo?.code})`}
              </span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between opacity-75 tracking-widest font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* PROMO CODE INPUT */}
        <div className="mt-6">
          <label className="block text-sm tracking-widest opacity-75 mb-2">
            Promo Code
          </label>
          {automaticReward && (
            <div className="mb-3 border border-[#891D33]/30 bg-[#891D33]/5 p-3">
              <p className="text-xs tracking-widest text-[#891D33]">
                {automaticReward.title}
              </p>
              <p className="mt-1 text-[11px] normal-case tracking-wide text-gray-600">
                {automaticReward.description}
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={e => {
                setPromoProductId(data?._id ?? null)
                setPromoCode(e.target.value)
              }}
              disabled={!!automaticReward || !!appliedPromo || isApplyingPromo}
              className="flex-1 bg-transparent  tracking-widest text-sm focus:ring-1 focus:ring-black h-10 font-avenir"
            />
            {appliedPromo ? (
              <button
                onClick={clearPromoCode}
                className="px-4 py-2 border border-red-700 text-red-700 rounded-sm text-sm tracking-widest uppercase hover:bg-red-50 transition-colors font-avenir"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={handleApplyPromo}
                disabled={isApplyingPromo || !promoCode.trim()}
                className="px-4 py-2 border border-black text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-avenir"
              >
                {isApplyingPromo ? 'Applying...' : 'Apply'}
              </button>
            )}
          </div>
        </div>


      </div>

      <div className="mt-10">
        {pathName?.startsWith('/shop/checkout') &&
          !pathName.includes('/confirmation') ? (
          <div>
            {isConfirm ? (
              <button
                onClick={handleConfirmPay}
                disabled={
                  updateBookingForPayment.isPending || createCheckout.isPending
                }
                className="bg-black text-white hover:bg-black/80 uppercase tracking-widest text-sm h-12 w-full transition-colors disabled:opacity-50 font-avenir rounded-none"
              >
                {updateBookingForPayment.isPending || createCheckout.isPending
                  ? 'Processing'
                  : 'Confirm & Pay'}
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                className="bg-black text-white hover:bg-black/80 uppercase tracking-widest text-sm h-12 w-full transition-colors font-avenir rounded-none"
              >
                Confirm & Pay
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleRentNow}
            disabled={createBookingForRentNow.isPending || isRentNowWaitingForKyc}
            className="bg-black text-white hover:bg-black/80 uppercase tracking-widest text-sm h-12 w-full transition-colors disabled:opacity-50 font-avenir rounded-none"
          >
            {rentNowButtonLabel}
          </button>
        )}
      </div>

      {showKycSection && user && isKycVerified === false && !isKycPolling && !isKycContinuing && (
        <div className="mt-8 p-6 border border-black/10 bg-gray-50/50 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 relative">
          <button
            onClick={() => {
              setShowKycSection(false)
              resetKycFlow()
            }}
            className="absolute right-4 top-4 opacity-40 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 mt-0.5 text-black/60" />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold tracking-wider uppercase">ID Verification Required</h3>
              <p className="text-xs normal-case opacity-70 leading-relaxed font-light">
                Almost there. Before you rent, we just need a quick ID verification to ensure a safe community.
              </p>
              {(kycProgress || latestKycStatus) && (
                <p className="text-xs normal-case opacity-70 leading-relaxed font-light">
                  {kycProgress || 'Checking status'}
                  {latestKycStatus ? ` - ${latestKycStatus}` : ''}
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={startKycVerification}
            disabled={isFetchingKyc}
            className="w-full bg-black text-white hover:bg-black/90 uppercase tracking-widest text-xs h-12 rounded-none transition-all"
          >
            {isFetchingKyc ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Opening verification
              </>
            ) : (
              'Verify Now'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default PriceBreakDown
