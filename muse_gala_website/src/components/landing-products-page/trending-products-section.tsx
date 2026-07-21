'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { TrendingProduct } from '@/types/trending-products'

import { ProductCard } from '@/components/product/product-card'
import { Product } from '@/types/product'

type TrendingApiResponse = {
  status: boolean
  message: string
  data: TrendingProduct[]
}

const TrendingNow = () => {
  const { data, isLoading } = useQuery<TrendingApiResponse>({
    queryKey: ['trending-now'],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/master-dresses?limit=6`,
      )
      return res.json()
    },
    staleTime: 1000 * 60 * 5,
  })

  const products = data?.data ?? []

  return (
    <section className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8">
      {/* 🔹 Header */}
      <div className="text-center mb-12 space-y-5">
        <h2 className="uppercase tracking-[12px] text-lg md:text-xl lg:text-2xl font-light font-avenir">
          Trending Now
        </h2>

        <Link
          href="/shop"
          className="inline-block mt-3 text-sm uppercase tracking-widest border-b border-black pb-1 hover:opacity-70 transition font-avenir font-light"
        >
          Explore the Edit
        </Link>
      </div>

      {/* 🔹 Responsive Grid / Mobile Carousel */}
      <div className="flex justify-center">
        <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory sm:snap-none grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full scrollbar-hide pb-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[80vw] sm:w-auto snap-center flex flex-col h-full animate-pulse">
                <div className="overflow-hidden mb-4 aspect-[3/5] w-full bg-gray-200" />
                <div className="text-center space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            ))
            : products.map(product => (
              <div key={product._id} className="flex-shrink-0 w-[80vw] sm:w-auto snap-center">
                <ProductCard product={product as unknown as Product} />
              </div>
            ))}

          {/* 🔹 Explore More Button (Mobile Only) */}
          <div className="sm:hidden flex-shrink-0 w-[80vw] snap-center flex items-center justify-center p-4">
            <Link
              href="/shop"
              className="w-full aspect-[3/5] flex flex-col items-center justify-center rounded-none hover:border-black transition-colors space-y-4"
            >
              <span className="text-sm font-light tracking-[0.2rem] uppercase text-center px-4 font-avenir">
                Explore the Edit
              </span>
              <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrendingNow
