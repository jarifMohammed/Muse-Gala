import React from 'react'
import { Metadata } from 'next'
import ProductDetails from '../_component/product-details/product-details'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/master-dress/${slug}`)
    const json = await res.json()
    const product = json?.data

    if (!product) {
      return { title: 'Product Not Found' }
    }

    const title = `${product.dressName} | Muse Gala`
    const description = product.content?.description || `Rent ${product.dressName} on Muse Gala`
    const image = product.thumbnail || (product.media && product.media[0]) || ''

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: image ? [image] : [],
      },
    }
  } catch {
    return {
      title: 'Muse Gala',
    }
  }
}

const Page = () => {
  return (
    <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8 pb-24 pt-[80px] md:pt-[110px]">
      <ProductDetails />
    </div>
  )
}

export default Page
