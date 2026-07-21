'use client'

import { motion } from 'framer-motion'
import { Product } from '@/types/product'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Ensure thumbnail shows first, followed by media images (if any), removing duplicates
  const images = useMemo(() => {
    const allImgs = [
      product?.thumbnail,
      ...(product?.media || [])
    ].filter(Boolean) as string[]

    // Remove duplicates while preserving order
    const uniqueImgs = Array.from(new Set(allImgs))

    if (uniqueImgs.length === 0) {
      return [{ src: '/placeholder.svg', alt: 'Product image' }]
    }

    return uniqueImgs.map(url => ({ src: url, alt: product.dressName }))
  }, [product])

  useEffect(() => {
    if (!isHovered || images.length <= 1) {
      setCurrentImageIndex(0)
      return
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 500)

    return () => clearInterval(interval)
  }, [isHovered, images.length])

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    setTimeout(() => setCurrentImageIndex(0), 150)
  }

  return (
    <div className="flex flex-col h-full">
      <Link
        href={`/shop/${product._id}`}
        className="group flex flex-col flex-grow"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="overflow-hidden mb-4 aspect-[3/5] w-full relative">
          <Image
            src={images[currentImageIndex]?.src}
            alt={images[currentImageIndex]?.alt}
            fill
            className="object-cover object-top origin-top transition-all duration-500 ease-in-out group-hover:scale-110"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={isMobile ? { opacity: 1 } : { opacity: 0 }}
            whileHover={{ opacity: 1 }}
            viewport={{ amount: 0.7 }}
            className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 ease-in-out"
          >
            <button
              className="w-full bg-white py-2 rounded-none hover:bg-gray-200 transition duration-300 text-black text-[14px] uppercase font-avenir"
            >
              Book Now
            </button>
          </motion.div>
        </div>

        <div className="text-center space-y-1 mt-auto">
          {product.brand && (
            <p className="text-[11px] opacity-70 uppercase tracking-widest font-avenir">
              {product.brand}
            </p>
          )}
          <h3 className="text-[14px] font-light tracking-[0.1rem] transition-colors duration-300 group-hover:text-gray-700 font-avenir">
            {product.dressName}
          </h3>
          <p className="text-[12px] tracking-[.1rem] font-light transition-colors duration-300 group-hover:text-gray-600 font-avenir">
            RENT ${product?.basePrice} | RRP ${product?.rrpPrice}
          </p>
        </div>
      </Link>
    </div>
  )
}
