interface Customer {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface StatusHistory {
  _id: string;
  status: string;
  timestamp: string;
  updatedBy: string;
}

export interface Booking {
  _id: string;
  customer: Customer;
  dressId: string;
  dressName: string;
  totalAmount: number;
  rentalStartDate: string;
  rentalEndDate: string;
  rentalDurationDays: number;
  deliveryMethod: string;
  paymentStatus: string;
  deliveryStatus: string;
  payoutStatus?: string;
  size?: string;
  color?: string;
  brand?: string;
  shippingAddress?: string | {
    street?: string;
    city?: string;
    state?: string;
    postcode?: string;
    address?: string;
  };
  pickupLocation?: string;
  isManualBooking?: boolean;
  statusHistory: StatusHistory[];
  allocatedLender: {
    lenderId: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BookingsResponse {
  data: Booking[];
  pagination: PaginationInfo;
}
