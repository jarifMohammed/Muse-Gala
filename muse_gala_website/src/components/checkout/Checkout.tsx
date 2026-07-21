'use client'
import ShopDetails from '@/app/(website)/shop/_component/product-details/shop-details'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React from 'react'
import CheckoutForm from '../checkout-form/CheckoutForm'
// import { useSession } from 'next-auth/react'
// import { useUserStore } from '@/zustand/useUserStore'

const Checkout = () => {
  const params = useParams()
  // const session = useSession()

  const { data: singleProduct = {}, isLoading } = useQuery({
    queryKey: ['single-product'],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/master-dress/${params.id}`
      )
      const data = await res.json()
      return data
    },
  })

  // console.log('single product : ', singleProduct)

  return (
    <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8 mb-8">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
        <div className="lg:flex-1">
          <CheckoutForm />
        </div>

        <div className="lg:w-[40%]">
          <ShopDetails singleProduct={singleProduct} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}

export default Checkout
