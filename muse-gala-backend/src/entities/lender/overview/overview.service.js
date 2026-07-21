import MasterDress from "../../admin/Lisitngs/ReviewandMain Site Listing/masterDressModel.js";
import { Booking } from "../../booking/booking.model.js";
import Payment from "../../Payment/Booking/payment.model.js";



// Helper → Get date range based on weekly, monthly, yearly
const getDateRange = (period) => {
  const now = new Date();
  let start;

  switch (period) {
    case "weekly":
      start = new Date(now.setDate(now.getDate() - 7));
      break;

    case "yearly":
      start = new Date(now.setFullYear(now.getFullYear() - 1));
      break;

    case "monthly":
    default:
      start = new Date(now.setMonth(now.getMonth() - 1));
      break;
  }

  return { start: new Date(start), end: new Date() };
};

export const getLenderOverviewService = async (lenderId, period) => {
  const { start, end } = getDateRange(period);

  // -----------------------------
  // 1️⃣ TOTAL RENTALS (Completed)
  // -----------------------------
  const totalRentals = await Booking.countDocuments({
    "allocatedLender.lenderId": lenderId,
    createdAt: { $gte: start, $lte: end },
    paymentStatus: "Paid",
  });

  // -----------------------------
  // 2️⃣ TOTAL REVENUE
  // -----------------------------
  const revenue = await Payment.aggregate([
    {
      $match: {
        lenderId,
        status: "Paid",
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    },
  ]);

  const totalRevenue = revenue.length ? revenue[0].totalRevenue : 0;

  // -----------------------------
  // 3️⃣ ACTIVE BOOKINGS (running now)
  // -----------------------------
  const activeBookings = await Booking.countDocuments({
    "allocatedLender.lenderId": lenderId,
    paymentStatus: "Paid",
    rentalStartDate: { $lte: new Date() },
    rentalEndDate: { $gte: new Date() },
  });

  // -----------------------------
  // 4️⃣ LIVE LISTINGS (active dresses)
  //    Find all master dresses where lenderIds includes lender
  // -----------------------------
  const liveListings = await MasterDress.find({
    lenderIds: lenderId,
    isActive: true,
  }).lean();

  // -----------------------------
  // 5️⃣ UPCOMING BOOKINGS (future rentals)
  // -----------------------------
  const upcomingOrders = await Booking.find({
    "allocatedLender.lenderId": lenderId,
    paymentStatus: "Paid",
    rentalStartDate: { $gt: new Date() },
  })
    .populate("customer", "firstName lastName email")
    .populate("masterdressId", "masterDressId dressName media thumbnail")
    .lean();



  return {
    filtersApplied: period,
    totalRevenue,
    totalRentals,
    activeBookings,
    liveListingsCount: liveListings.length,
    liveListings,
    upcomingOrdersCount: upcomingOrders.length,
    upcomingOrders,
  };
};



export const getRentalCalendarService = async ({ lenderId, masterDressId, startDate, endDate }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const filter = {
    "allocatedLender.lenderId": lenderId,  // ← scoped to logged-in lender
    $or: [
      {
        rentalStartDate: { $lte: end },
        rentalEndDate: { $gte: start }
      }
    ]
  };

  if (masterDressId) {
    filter.masterdressId = masterDressId;
  }

  const bookings = await Booking.find(filter)
    .populate("customer", "firstName lastName email")
    .populate("masterdressId", "dressName")
    .lean();

  const events = bookings.map(b => ({
    bookingId: b._id,
    rentalStartDate: b.rentalStartDate,
    rentalEndDate: b.rentalEndDate,
    dressName: b.masterdressId?.dressName || "Unknown",
    customer: (b.customer?.firstName + " " + b.customer?.lastName).trim() || "Unknown",
    paymentStatus: b.paymentStatus,
    deliveryStatus: b.deliveryStatus,
  }));

  return {
    startDate,
    endDate,
    totalEvents: events.length,
    events
  };
};


