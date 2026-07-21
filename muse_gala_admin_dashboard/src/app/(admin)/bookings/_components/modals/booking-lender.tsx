import { Booking } from "../bookings-modal";

const BookingLender = ({ bookingDetails }: { bookingDetails: Booking }) => {
  return (
    <div className="mt-5">
      <div className="border border-gray-200 p-5 rounded-lg shadow-sm">
        <h1 className="text-xl mb-4">Lender Details</h1>

        <div className="text-sm space-y-2">
          <h3>Lender ID: {bookingDetails?.allocatedLender?.lenderId?._id || (typeof bookingDetails?.allocatedLender?.lenderId === "string" ? bookingDetails.allocatedLender.lenderId : "N/A")}</h3>
          <h3>Name: {bookingDetails?.allocatedLender?.lenderId?.fullName || 
              (bookingDetails?.allocatedLender?.lenderId?.firstName ? `${bookingDetails.allocatedLender.lenderId.firstName} ${bookingDetails.allocatedLender.lenderId.lastName || ""}` : "N/A")}</h3>
          <h3>Email: {bookingDetails?.allocatedLender?.lenderId?.email || "N/A"}</h3>
          <h3>Dress Name: {bookingDetails?.dressName || "N/A"}</h3>
        </div>
      </div>
    </div>
  );
};

export default BookingLender;
