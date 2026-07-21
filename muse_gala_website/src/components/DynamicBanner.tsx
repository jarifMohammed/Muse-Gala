'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useBannerStore } from '@/zustand/bannerStore'

const FALLBACK_BANNER = '/pages/HeroPhoto.webp'

// Fetch from API
async function getBanner() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/banner`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch banner')
  return res.json()
}

export default function DynamicBanner() {
  const { bannerUrl, setBannerUrl } = useBannerStore()
  const [imgError, setImgError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const { data } = useQuery({
    queryKey: ['homepage-banner'],
    queryFn: getBanner,
    enabled: !bannerUrl, // Only fetch if banner not in store
  })

  //  When API loads for the first time → Save to store
  useEffect(() => {
    if (data?.data && !bannerUrl) {
      const active = data.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((b: any) => b.status === 'active')?.[0]?.image?.[0]?.url

      if (active) setBannerUrl(active)
    }
  }, [data, bannerUrl, setBannerUrl])

  //  Final banner selection
  const finalBanner = imgError || !bannerUrl ? FALLBACK_BANNER : bannerUrl

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh]">
      {/* Loader until image fully loaded */}
      {!loaded && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      )}

      <Image
        src={finalBanner}
        alt="Homepage Banner"
        fill
        priority
        quality={100}
        sizes="100vw"
        onLoad={() => setLoaded(true)}
        onError={() => setImgError(true)}
        style={{ objectPosition: 'center 20%' }}
        className={`object-cover md:!object-[center_30%] transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'
          }`}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-20">
        <Link
          href="/find-near-you/map"
          className="text-white text-sm md:text-base lg:text-lg font-avenir font-light !tracking-[0.5em] hover:opacity-70 transition-opacity uppercase"
        >
          FIND NEAR YOU
        </Link>
      </div>
    </div>
  )
}
