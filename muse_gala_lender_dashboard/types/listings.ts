export interface Dress {
  id: string
  name: string
  brand: string
  price: string
  numericPrice: number
  size: string
  color: string
  condition: string
  status: boolean
  image: string
  description: string
  materials: string
  careInstructions: string
  category: string
  dateAdded: string
  lastUpdated: string
  deliveryMethod: "Pickup" | "Shipping" | "Both"
  tags: string[]
  pickupAddresses?: string[]
  rentalPeriods: {
    days: number
    price: number
  }[]
}

export type DressFormData = Omit<Dress, "id" | "dateAdded" | "lastUpdated" | "numericPrice"> & {
  id?: string
}

export interface ConditionReport {
  date: string
  report: string
}

export interface AuditLogEntry {
  date: string
  action: string
}

export interface Booking {
  id: string
  dressId: string
  customer: string
  customerId: string
  date: string
  deliveryType: "Pickup" | "Shipping"
}
