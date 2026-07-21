export interface CustomerProfile {
  _id: string
  fullName: string
  phoneNumber: string
  email: string
  password: string
  username: string
  dob: string | null
  gender: string
  role: 'CUSTOMER'
  bio: string
  profileImage: string
  multiProfileImage: string[]
  otp: string | null
  otpExpires: string | null
  refreshToken: string
  isActive: boolean
  hasActiveSubscription: boolean
  subscriptionExpireDate: string | null
  agreedTerms: boolean
  agreedCurationPolicy: boolean
  totalBookings: number
  totalRatting: number
  totalListings: number
  totalReveneue: number
  city?: string
  state?: string
  country?: string
  postcode?: string
  suburb?: string
  placeName?: string
  latitude?: number
  longitude?: number
  address?: string
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

export type CustomersGetResponse = {
  status: string
  message: string
  data: {
    data: CustomerProfile[]
    pagination: Pagination
  }
}
