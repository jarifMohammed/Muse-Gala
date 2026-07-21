'use client'

import { useEffect, useState } from 'react'
import WishlistCard, { WishlistItem } from './wishlist_card'

const YourWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('wishlist')
    if (stored) {
      setWishlist(JSON.parse(stored))
    }
  }, [])

  const handleRemove = (id: string) => {
    const updated = wishlist.filter((item) => item._id !== id)
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
  }

  return (
    <div className="mb-12">
      <section>
        <div className="mb-11">
          <h2 className="text-xl md:text-2xl tracking-widest font-light mb-6 border-black border-b-[1px] pb-5 md:pb-8">
            Your Wishlist
          </h2>
        </div>

        {wishlist.length === 0 ? (
          <p className="text-gray-400 text-center text-xl">
            Your wishlist is empty.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-[30px]">
            {wishlist.map((item) => (
              <WishlistCard
                key={item._id}
                item={item}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default YourWishlist
