interface Customer {
  _id: string;
}

interface Listing {
  lenderId: string;
}

interface Status {
  _id: string;
  status: string;
}

interface Booking {
  id: string;
  customer: Customer;
  listing: Listing;
  dressId: string;
  createdAt: string;
  totalAmount: number;
  statusHistory: Status[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalData: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BookingsResponse {
  bookings: Booking[];
  paginationInfo: PaginationInfo;
}