'use client'

import { TrendingProduct } from '@/types/trending-products'
import Image from 'next/image'
import Link from 'next/link'

interface SearchProductCardProps {
    product: TrendingProduct
    onClick?: () => void
}

export const SearchProductCard = ({ product, onClick }: SearchProductCardProps) => {
    return (
        <Link
            href={`/shop/${product.slug || product._id}`}
            onClick={onClick}
            className="flex items-center gap-4 p-2 hover:bg-gray-50 transition-colors group font-avenir"
        >
            <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden bg-gray-100">
                <Image
                    src={product.thumbnail || product.media?.[0] || '/placeholder.svg'}
                    alt={product.dressName}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="flex flex-col gap-0.5 overflow-hidden">
                {product.brand && (
                    <p className="text-[10px] opacity-60 uppercase tracking-widest truncate">
                        {product.brand}
                    </p>
                )}
                <h4 className="text-sm font-avenir uppercase tracking-wider truncate">
                    {product.dressName}
                </h4>
                <p className="text-xs text-gray-500 font-avenir tracking-widest">
                    RENT ${product.basePrice} | RRP ${product.rrpPrice}
                </p>
            </div>
        </Link>
    )
}
