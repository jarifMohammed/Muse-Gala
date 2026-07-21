import { Booking } from "../bookings-modal";

const BookingCustomer = ({ bookingDetails }: { bookingDetails?: Booking }) => {
  return (
    <div className="mt-5">
      <div className="border border-gray-200 p-5 rounded-lg shadow-sm">
        <h1 className="text-xl mb-4">Customer Details</h1>

        <div className="text-sm space-y-2">
          <h3>Customer ID: {bookingDetails?.customer?._id}</h3>
          <h3>
            Name: {bookingDetails?.customer?.firstName}{" "}
            {bookingDetails?.customer?.lastName}
          </h3>
          <h3>Email: {bookingDetails?.customer?.email}</h3>
          <h3>Dress Name: {bookingDetails?.dressName}</h3>
        </div>
      </div>
    </div>
  );
};

export default BookingCustomer;
