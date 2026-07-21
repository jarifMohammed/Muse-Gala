export interface mainListing {
  _id: string
  masterDressId?: string
  dressName: string
  sizes: string[]
  colors: string[]
  lenderIds: string[]
  isActive: boolean
  brand?: string
  thumbnail?: string
  media?: string[]
  pickupOption?: 'Local' | 'Australia-wide' | 'Both'
  basePrice?: number
  insuranceFee?: number
  rrpPrice?: number
  occasions?: string[]
  shippingDetails?: {
    isLocalPickup: boolean
    isShippingAvailable: boolean
    insuranceFee?: number
    flexibilityNotes?: string
  }
  approvalStatus?: 'pending' | 'approved' | 'rejected'
  createdAt?: string
  updatedAt?: string
  lenders?: Array<{
    _id: string;
    fullName: string;
    phoneNumber: string;
    businessAddress: string;
    instagramHandle: string;
  }>
}
