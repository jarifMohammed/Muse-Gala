'use client'

import { ProductCard } from '@/components/product/product-card'
import { Product } from '@/types/product'
import { useFilterStore } from '@/zustand/filterStore'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'

const AllProduct = () => {
  const {
    search,
    size,
    minPrice,
    maxPrice,
    fourDayRental,
    eightDayRental,
    shipping,
    localPickup,
    brand,
    page,
    nextPage,
    setPage,
  } = useFilterStore()

  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<{
    itemsPerPage: number
    totalItems: number
    totalPages: number
  } | null>(null)

  const queryClient = useQueryClient()

  // ✅ Reset page & products when filters change
  useEffect(() => {
    setPage(1)
    setProducts([])
  }, [
    search,
    size,
    minPrice,
    maxPrice,
    fourDayRental,
    eightDayRental,
    shipping,
    localPickup,
    brand,
    setPage,
  ])

  // ✅ Build query safely (backend aligned)
  const buildQuery = useCallback((currentPage: number) => {
    const params = new URLSearchParams()

    // 🔒 Only fetch active master dresses on public shop page
    params.append('isActive', 'true')

    if (search) params.append('search', search)
    if (brand) params.append('brand', brand)
    if (size) params.append('size', size)
    if (minPrice) params.append('minPrice', minPrice)
    if (maxPrice) params.append('maxPrice', maxPrice)
    if (fourDayRental) params.append('fourDaysSelected', 'true')
    if (eightDayRental) params.append('eightDaysSelected', 'true')

    // 🔥 IMPORTANT: backend logic
    if (shipping) params.append('shipping', 'true')
    if (localPickup) params.append('localPickup', 'true')

    params.append('page', String(currentPage))

    return params.toString()
  }, [
    search,
    size,
    minPrice,
    maxPrice,
    fourDayRental,
    eightDayRental,
    shipping,
    localPickup,
    brand,
  ])

  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [
      'all-products',
      search,
      size,
      minPrice,
      maxPrice,
      fourDayRental,
      eightDayRental,
      shipping,
      localPickup,
      brand,
      page,
    ],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/v1/admin/master-dresses?${buildQuery(page)}`
      )
      return res.json()
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  // ✅ Sync fetched data
  useEffect(() => {
    if (!data?.data) return

    setPagination({
      itemsPerPage: data.pagination.itemsPerPage,
      totalItems: data.pagination.totalItems,
      totalPages: data.pagination.totalPages,
    })

    setProducts((prev) => {
      if (page === 1) return data.data

      const existingIds = new Set(prev.map((p) => p._id))
      const uniqueNew = data.data.filter(
        (p: Product) => !existingIds.has(p._id)
      )

      return [...prev, ...uniqueNew]
    })
  }, [data, page])

  // ✅ Prefetch next page
  useEffect(() => {
    if (!pagination) return
    if (page >= pagination.totalPages) return

    queryClient.prefetchQuery({
      queryKey: [
        'all-products',
        search,
        size,
        minPrice,
        maxPrice,
        fourDayRental,
        shipping,
        localPickup,
        brand,
        page + 1,
      ],
      queryFn: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL
          }/api/v1/admin/master-dresses?${buildQuery(page + 1)}`
        )
        return res.json()
      },
    })
  }, [
    pagination,
    page,
    queryClient,
    search,
    size,
    minPrice,
    maxPrice,
    fourDayRental,
    shipping,
    localPickup,
    brand,
    buildQuery,
  ])

  return (
    <div>
      {/* ✅ Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
        {isLoading && page === 1
          ? Array.from({ length: 16 }).map((_, index) => (
            <div key={index} className="flex flex-col h-full animate-pulse">
              <div className="overflow-hidden mb-2 md:mb-4 aspect-[2/3] w-full bg-gray-200 rounded-md" />
              <div className="text-center space-y-2 mt-auto">
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ))
          : products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>

      {/* ✅ No Products */}
      {isSuccess && products.length === 0 && (
        <div className="text-center min-h-[calc(100vh-400px)] flex flex-col items-center justify-center">
          <Image
            src="/no-product.webp"
            alt="no-product.png"
            width={1000}
            height={1000}
            className="h-[300px] w-[300px] mx-auto"
          />
          <h1 className="uppercase font-avenir text-xl tracking-[15px]">
            No Product Available
          </h1>
        </div>
      )}

      {/* ✅ Pagination */}
      {pagination && products.length > 0 && (
        <div className="text-center mt-8 md:mt-12 lg:mt-16">
          <p className="text-gray-600 mb-4 font-avenir">
            Showing {products.length} of {pagination.totalItems} dresses near
            you
          </p>

          {page < pagination.totalPages && (
            <button
              onClick={nextPage}
              disabled={isFetching}
              className="inline-block border-b border-black font-light px-6 py-2 text-[14px] uppercase tracking-widest hover:bg-black hover:text-white transition-all font-avenir"
            >
              {isFetching ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      )}

      {/* ✅ Loader for next page */}
      {isFetching && page > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-150"></div>
            <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-300"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllProduct
