export interface MuseRewardUser {
  totalSpent?: number
  firstBookingDiscountUsed?: boolean
  spent300DiscountUsed?: boolean
  spent600DiscountUsed?: boolean
}

export interface MuseReward {
  key: 'first-booking' | 'spent-300' | 'spent-600'
  amount: number
  title: string
  description: string
}

export const getAvailableMuseReward = (
  user?: MuseRewardUser | null,
): MuseReward | null => {
  if (!user) return null

  const totalSpent = Number(user.totalSpent ?? 0)

  if (totalSpent >= 600 && user.spent600DiscountUsed === false) {
    return {
      key: 'spent-600',
      amount: 30,
      title: "You've unlocked $30 off after spending $600 with Muse Gala.",
      description:
        "This automatic reward will be applied at checkout. Promo codes can't be combined with this offer.",
    }
  }

  if (totalSpent >= 300 && user.spent300DiscountUsed === false) {
    return {
      key: 'spent-300',
      amount: 20,
      title: "You've unlocked $20 off after spending $300 with Muse Gala.",
      description:
        "This automatic reward will be applied at checkout. Promo codes can't be combined with this offer.",
    }
  }

  if (user.firstBookingDiscountUsed === false) {
    return {
      key: 'first-booking',
      amount: 10,
      title: "You're eligible for $10 off your first booking.",
      description:
        "This automatic discount will be applied at checkout. Promo codes can't be combined with this offer.",
    }
  }

  return null
}
