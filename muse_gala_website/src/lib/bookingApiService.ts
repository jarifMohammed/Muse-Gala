// lib/api/bookingApi.ts

interface CreateBookingPayload {
  masterdressId: string
  rentalStartDate: string
  rentalEndDate: string
  rentalDurationDays: number
  size: string
  deliveryMethod: 'Shipping' | 'Pickup'
  tryOnRequested?: boolean
  selectedLender?: Array<{
    _id: string
    email: string
    location: {
      type: string
      coordinates: number[]
    }
    distance: number
  }>
  promoCode?: string
}

interface UpdateBookingPayload
  extends Omit<CreateBookingPayload, 'masterdressId'> {
  address: string
  phone: string
}

interface PromoCodePayload {
  promoCode: string
}

interface PromoCodeResponse {
  status: boolean
  message: string
  data: {
    id: string
    code: string
    discountType: 'FLAT' | 'PERCENTAGE'
    discountValue: number
    expiresAt: string
  }
}

export const bookingApi = {
  createBooking: async (payload: CreateBookingPayload, token: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/bookings/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    )

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.message || 'Failed to create booking')
    }
    return data
  },

  updateBooking: async (
    bookingId: string,
    payload: UpdateBookingPayload,
    token: string,
  ) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/bookings/${bookingId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    )

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.message || 'Failed to update booking')
    }
    return data
  },

  validatePromoCode: async (
    payload: PromoCodePayload,
    token: string,
  ): Promise<PromoCodeResponse> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/bookings/promo-validate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    )

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.message || 'Invalid promo code')
    }
    return data
  },
}
