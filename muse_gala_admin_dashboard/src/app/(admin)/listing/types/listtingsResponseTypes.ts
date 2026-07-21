// ---- Location Type ----
export interface Location {
  _id: string
  addressLine: string
  postalCode: string
}

// ---- Rental Price ----
export interface RentalPrice {
  fourDays: number
  eightDays: number
  _id: string
}

// ---- Lender (inside dress object) ----
export interface LenderInfo {
  _id: string
  fullName: string
  email: string
}

// ---- Dress Item ----
export interface Dress {
  id: string
  _id: string
  lenderId: string
  dressId: string
  dressName: string
  brand: string
  size: string
  colour: string
  condition: string
  category: string
  locations: Location[]
  media: string[]
  description: string
  rentalPrice: RentalPrice
  material: string
  careInstructions: string
  occasion: string[]
  status: 'pending' | 'active' | 'paused' // guessing enums
  insurance: boolean
  pickupOption: 'Pickup' | 'Local' | 'Delivery' // based on your screenshot + sample
  approvalStatus: 'pending' | 'approved' | 'rejected'
  reasonsForRejection: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

// ---- Pagination ----
export interface DressPagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

// ---- API Response ----
export interface ListingsGetResponse {
  success: boolean
  message: string
  data: Dress[]
  pagination: DressPagination
}
