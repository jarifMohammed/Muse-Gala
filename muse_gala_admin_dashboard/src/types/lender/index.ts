type ReviewStockMethod = {
  website: boolean
  instagram: boolean
  keyBrands: boolean
}

export interface LenderProfile {
  file: {
    url: string
    type: string
  }
  subscription: {
    planId: string
  }
  reviewStockMethod: ReviewStockMethod
  location: {
    type: 'Point'
    coordinates: [number, number]
  }
  notificationPreferences: {
    receiveEmailAlertsForNewOrders: boolean
    sendRemindersForReturnDeadlines: boolean
  }
  payoutSettings: {
    bankDetails: {
      accountName: string
      bsb: string
      accountNumber: string
      bankName: string
    }
    preferredMethod: 'Stripe' | 'Manual'
    manualMethod: 'BankTransfer' | 'PayID'
    payIDDetails?: {
      type: 'Mobile' | 'Email' | 'ABN' | 'Organization ID'
      value: string
    }
  }
  _id: string
  fullName: string
  phoneNumber: string
  email: string
  password: string
  username: string
  dob: string | null
  gender: string
  role: 'USER' | 'ADMIN' | 'LENDER' | 'SUPER_ADMIN' | 'APPLICANT'
  bio: string
  profileImage: string
  multiProfileImage: string[]
  otp: string | null
  otpExpires: string | null
  pendingEmail: string | null
  refreshToken: string
  isActive: boolean
  hasActiveSubscription: boolean
  subscriptionExpireDate: string | null
  subscriptionStartDate: string | null
  businessName: string
  abnNumber: string
  businessAddress: string
  instagramHandle: string
  businessWebsite: string
  numberOfDresses: string
  allowTryOn: boolean
  allowLocalPickup: boolean
  shipAustraliaWide: boolean
  agreedTerms: boolean
  agreedCurationPolicy: boolean
  totalbookings: number
  totalRatting: number
  totalListings: number
  totalReveneue: number
  totalSpent: number
  firstBookingDiscountUsed: boolean
  spent300DiscountUsed: boolean
  spent600DiscountUsed: boolean
  city?: string
  state?: string
  country?: string
  postcode?: string
  suburb?: string
  placeName?: string
  latitude?: number
  longitude?: number
  address?: string
  precision?: 'exact' | 'approximate' | 'interpolated'
  stripeCustomerId?: string
  defaultPaymentMethodId?: string
  stripeAccountId?: string | null
  chargesEnabled: boolean
  payoutsEnabled: boolean
  detailsSubmitted: boolean
  stripeOnboardingCompleted: boolean
  kycVerified: boolean
  kycStatus: 'pending' | 'requires_input' | 'verified' | 'failed'
  status: 'pending' | 'approved' | 'rejected'
  applicationSubmittedAt: string
  applicationReviewedAt: string | null
  notes: string
  reason: string
  deactivationReason: string
  deactivationFeedback: string
  deactivated: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export type Pagination = {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export type LendersGetResponse = {
  status: string
  message: string
  data: {
    data: LenderProfile[]
    pagination: Pagination
  }
}
