// lib/api/paymentApi.ts

export const paymentApi = {
  savePaymentInfo: async (token: string, bookingId?: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/savePaymentInfo`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingId ? { bookingId } : {}),
      },
    )

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.message || 'Failed to save payment info')
    }
    return data
  },
}
