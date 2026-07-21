'use client'

import React from 'react'
import ShoppinghMap from '../shopping-map'
import { useLocationStore } from '@/zustand/useLocationStore'
import { useShoppingStore } from '@/zustand/shopingStore'
import { usePathname } from 'next/navigation'

interface DeliveryOptionProps {
  masterDressId: string
}

const DeliveryOption = ({ masterDressId }: DeliveryOptionProps) => {
  const { deliveryOption, setDeliveryOption } = useShoppingStore()
  const { setLocation, setLenders, setLoading, latitude, longitude } = useLocationStore()
  const pathName = usePathname()
  const isCheckoutPage =
    pathName?.startsWith('/shop/checkout') && !pathName.includes('/confirmation')

  React.useEffect(() => {
    // Trigger location/lender fetch whenever pickup is selected
    if (deliveryOption === 'pickup') {
      handleLocalPickup()
    } else {
      // Clear lenders when switching back to shipping
      setLenders([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryOption])

  const fetchNearbyLenders = async (lat: number, lng: number) => {
    setLoading(true)
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/lenders/nearby/${masterDressId}?latitude=${lat}&longitude=${lng}`
      console.log('📍 Fetching Nearby Lenders:', url)

      const res = await fetch(url)
      const result = await res.json()

      if (result.success) {
        console.log('📍 Lenders Data Fetched:', result.data)
        setLenders(result.data)
      } else {
        setLenders([])
      }
    } catch (error) {
      console.error('Nearby API Error:', error)
      setLenders([])
    } finally {
      setLoading(false)
    }
  }

  const handleLocalPickup = () => {
    // If we already have coordinates, just refresh the lenders list
    if (latitude && longitude) {
      fetchNearbyLenders(latitude, longitude)
      return
    }

    console.log('📍 Requesting Geolocation...')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        console.log('📍 Geolocation success:', pos.coords)
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude

        setLocation(lat, lng)
        fetchNearbyLenders(lat, lng)
      },
      (error) => {
        console.error('📍 Geolocation error:', error)
        // No longer forcing fallback to shipping. 
        // This allows the user to see the error or re-try without the UI jumping.
      },
      { timeout: 10000 }
    )
  }

  return (
    <div className="font-avenir uppercase mt-10">
      <h1 className="opacity-75 tracking-widest border-b border-black pb-1">
        Delivery Option
      </h1>

      {isCheckoutPage ? (
        <div className="pt-5 tracking-widest opacity-75 text-sm">
          {deliveryOption === 'shipping' ? 'Shipping' : 'Local Pickup'}
        </div>
      ) : (
        <>
      {/* Option Buttons */}
      <div className="mt-8 opacity-75 flex items-center gap-5">
        {/* SHIPPING BTN */}
        <button
          onClick={() => setDeliveryOption('shipping')}
          className={`w-1/2 pb-2 uppercase tracking-widest ${deliveryOption === 'shipping'
            ? 'border-b-2 border-black'
            : 'border-b-2 border-white'
            }`}
        >
          Shipping
        </button>

        {/* LOCAL PICKUP BTN */}
        <button
          onClick={() => setDeliveryOption('pickup')}
          className={`w-1/2 pb-2 uppercase tracking-widest ${deliveryOption === 'pickup'
            ? 'border-b-2 border-black'
            : 'border-b-2 border-white'
            }`}
        >
          Local Pickup
        </button>
      </div>

      {/* Description / Map */}
      <div>
        {deliveryOption === 'shipping' ? (
          <div className="pt-5 md:pt-10" />
        ) : (
          <div className="pt-5 w-full">
            <ShoppinghMap />
          </div>
        )}
      </div>
        </>
      )}
    </div>
  )
}

export default DeliveryOption
