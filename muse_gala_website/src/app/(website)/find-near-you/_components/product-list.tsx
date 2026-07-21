'use client'

import {
  ApiProduct,
  ProductCardData,
  normalizeProducts,
} from '../utility/normalizeProducts'
import ProductCard from './product-card'

interface ProductListProps {
  products?: ApiProduct[] | null
}

export default function ProductList({ products }: ProductListProps) {
  const normalizedProducts: ProductCardData[] = normalizeProducts(products)

  return (
    <section className="container mx-auto px-4">
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-20 xl:gap-24 items-center">
        {normalizedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      <p className="text-sm text-center mt-6 md:mt-16 uppercase">
        Showing {normalizedProducts.length} of {normalizedProducts.length}{' '}
        dresses near you
      </p>
    </section>
  )
}
