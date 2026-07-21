export interface WishlistItem {
  _id: string
  //eslint-disable-next-line
  [key: string]: any  
}

export const getWishlist = (): WishlistItem[] => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("wishlist")
    return saved ? JSON.parse(saved) : []
  }
  return []
}

export const addWishlist = (item: WishlistItem): void => {
  const wishlist = getWishlist()
  const exists = wishlist.some((p) => p._id === item._id)

  if (!exists) {
    wishlist.push(item)
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }
}

export const removeWishlist = (id: string): void => {
  const wishlist = getWishlist().filter((p) => p._id !== id)
  localStorage.setItem("wishlist", JSON.stringify(wishlist))
}

export const isInWishlist = (id: string): boolean => {
  return getWishlist().some((p) => p._id === id)
}
