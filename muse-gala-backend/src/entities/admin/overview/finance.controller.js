import mongoose from "mongoose";
import payOutModel from "../../lender/payOut/payOut.model.js";
import Payment from "../../Payment/Booking/payment.model.js";
const Booking = mongoose.model("Booking");
const User = mongoose.model("User");

export const getBookingFinanceStatsController = async (req, res) => {
  try {
    const monthlyStats = await payOutModel.aggregate([
      // 1️⃣ Add revenue & yearMonth
      {
        $addFields: {
          revenue: {
            $cond: [
              { $eq: ["$status", "paid"] },
              {
                $add: [
                  { $subtract: ["$bookingAmount", "$lenderPrice"] },
                  {
                    $multiply: [
                      "$lenderPrice",
                      { $divide: ["$commission", 100] }
                    ]
                  }
                ]
              },
              0
            ]
          },
          yearMonth: {
            $dateToString: { format: "%Y-%m", date: "$requestedAt" }
          }
        }
      },

      // 2️⃣ Group by month
      {
        $group: {
          _id: "$yearMonth",
          monthlyRevenue: { $sum: "$revenue" },

          totalBookingAmountAll: { $sum: "$bookingAmount" },
          totalOrdersAll: { $sum: 1 },

          totalPaidOrders: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] }
          },

          totalProfit: { $sum: "$revenue" }
        }
      },

      { $sort: { _id: 1 } }
    ]);

    // 3️⃣ Monthly MoM + global accumulators
    let prevRevenue = null;

    let globalRevenue = 0;
    let globalBookingAmount = 0;
    let globalOrders = 0;
    let globalPaidOrders = 0;

    const monthly = monthlyStats.map((m) => {
      const momChange =
        prevRevenue !== null && prevRevenue > 0
          ? ((m.monthlyRevenue - prevRevenue) / prevRevenue) * 100
          : null;

      prevRevenue = m.monthlyRevenue;

      globalRevenue += m.monthlyRevenue;
      globalBookingAmount += m.totalBookingAmountAll;
      globalOrders += m.totalOrdersAll;
      globalPaidOrders += m.totalPaidOrders;

      return {
        month: m._id,
        revenue: m.monthlyRevenue,
        momChange
      };
    });

    // 4️⃣ Global KPIs (top cards)
    const summary = {
      totalBookingRevenue: globalRevenue,

      averageOrderValue: globalOrders
        ? globalBookingAmount / globalOrders
        : 0,

      averageProfitPerOrder: globalPaidOrders
        ? globalRevenue / globalPaidOrders
        : 0,

      momChange:
        monthly.length >= 2 &&
        monthly[monthly.length - 2].revenue > 0
          ? (
              ((monthly[monthly.length - 1].revenue -
                monthly[monthly.length - 2].revenue) /
                monthly[monthly.length - 2].revenue) *
              100
            )
          : null
    };

    return res.status(200).json({
      status: true,
      message: "Booking statistics retrieved successfully",
      summary,
      monthly
    });
  } catch (err) {
    console.error("❌ Error getting booking stats:", err);
    return res.status(500).json({
      status: false,
      message: "Server Error",
      error: err.message
    });
  }
};





export const lenderPayoutStats = async (req, res) => {
  try {
    // ==============================
    // 1️⃣ Parse query params
    // ==============================
    const { search, fromDate, toDate, status, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);

    // ==============================
    // 2️⃣ Build query filters
    // ==============================
    const query = {};

    // Date filter
    if (fromDate || toDate) {
      query.requestedAt = {};
      if (fromDate) query.requestedAt.$gte = new Date(fromDate);
      if (toDate) query.requestedAt.$lte = new Date(toDate);
    }

    // Status filter
    if (status && ["paid", "pending"].includes(status.toLowerCase())) {
      query.status = status.toLowerCase();
    }

    // Search by lenderId, name, or email
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      }).select("_id");

      const lenderIds = users.map((u) => u._id.toString());
      query.$or = [
        { lenderId: { $in: lenderIds } },
        { lenderId: { $regex: search, $options: "i" } } // direct ID search
      ];
    }

    // ==============================
    // 3️⃣ Fetch payouts with lender info
    // ==============================
    const payouts = await payOutModel
      .find(query)
      .populate("lenderId", "firstName lastName email")
      .sort({ requestedAt: -1 });

    // ==============================
    // 4️⃣ Calculate per-lender stats
    // ==============================
    const perLenderMap = {};

    payouts.forEach((p) => {
      const lenderId = p.lenderId._id.toString();

      if (!perLenderMap[lenderId]) {
        perLenderMap[lenderId] = {
          _id: lenderId,
          name: p.lenderId.firstName,
          email: p.lenderId.email,
          totalRevenue: 0,
          totalPaid: 0,
          pendingPayout: 0,
          avgPayout: 0,
          totalRequests: 0
        };
      }

      const revenue = (p.bookingAmount - p.lenderPrice) + (p.adminsProfit || 0);
      perLenderMap[lenderId].totalRevenue += revenue;

      if (p.status === "paid") perLenderMap[lenderId].totalPaid += p.requestedAmount;
      if (p.status === "pending") perLenderMap[lenderId].pendingPayout += p.requestedAmount;

      perLenderMap[lenderId].avgPayout += p.requestedAmount;
      perLenderMap[lenderId].totalRequests += 1;
    });

    const perLender = Object.values(perLenderMap).map((lender) => {
      lender.avgPayout = lender.totalRequests ? lender.avgPayout / lender.totalRequests : 0;
      return lender;
    });

    // ==============================
    // 5️⃣ Apply sorting and pagination
    // ==============================
    perLender.sort((a, b) => b.totalRevenue - a.totalRevenue);
    const totalCount = perLender.length;
    const paginated = perLender.slice((pageNum - 1) * pageSize, pageNum * pageSize);

    // ==============================
    // 6️⃣ Calculate global stats
    // ==============================
    const globalStats = {
      totalRevenue: 0,
      totalPaid: 0,
      totalPending: 0,
      avgPayout: 0
    };

    if (payouts.length) {
      payouts.forEach((p) => {
        const revenue = (p.bookingAmount - p.lenderPrice) + (p.adminsProfit || 0);
        globalStats.totalRevenue += revenue;
        if (p.status === "paid") globalStats.totalPaid += p.requestedAmount;
        if (p.status === "pending") globalStats.totalPending += p.requestedAmount;
        globalStats.avgPayout += p.requestedAmount;
      });
      globalStats.avgPayout = payouts.length ? globalStats.avgPayout / payouts.length : 0;
    }

    // ==============================
    // 7️⃣ Return structured response
    // ==============================
    return res.status(200).json({
      success: true,
      totalCount,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / pageSize),
      itemsPerPage: pageSize,
      perLender: paginated,
      global: globalStats
    });

  } catch (error) {
    console.error("❌ Error fetching lender payout stats:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};





export const subscriptionAnalytics = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const dateFilter = {};
    if (fromDate) dateFilter.$gte = new Date(fromDate);
    if (toDate) dateFilter.$lte = new Date(toDate);

    const query = { type: "subscription" }; // Filter by type as per your JSON
    if (fromDate || toDate) query.createdAt = dateFilter;

    // Fetch payments and deeply populate the plan inside the customer object
    const subscriptions = await Payment.find(query)
      .populate({
        path: "customerId",
        populate: {
          path: "subscription.planId",
          model: "SubscriptionPlan",
          select: "name price durationDays",
        },
      })
      .sort({ createdAt: -1 });

    const newSignUps = [];
    const churnedUsers = [];
    const activeSubscribers = [];
    let totalMRR = 0;
    const mrrTrendMap = {};

    subscriptions.forEach((sub) => {
      const customer = sub.customerId;
      
      // Use fullName from JSON, fallback to first/last if needed
      const name = customer?.fullName || 
                   `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim() || 
                   "Unknown User";

      const paidAmount = Number(sub.amount) || 0;

      // MRR logic
      const yearMonth = sub.createdAt.toISOString().slice(0, 7);
      if (!mrrTrendMap[yearMonth]) mrrTrendMap[yearMonth] = 0;
      
      if (sub.status === "Paid") {
        mrrTrendMap[yearMonth] += paidAmount;
        totalMRR += paidAmount;
      }

      // Map subscription info from the Customer/User model
      const subStart = customer?.subscriptionStartDate || sub.createdAt;
      const subEnd = customer?.subscriptionExpireDate || null;
      const planName = customer?.subscription?.planId?.name || "N/A";

      const subData = {
        _id: sub._id,
        customerId: customer?._id,
        name,
        planName,
        subscriptionStart: subStart,
        subscriptionEnd: subEnd,
        amount: paidAmount,
        status: sub.status,
      };

      // Categorize based on Payment Status
      if (sub.status === "Paid") newSignUps.push(subData);
      if (sub.status === "Cancelled") churnedUsers.push(subData);
      
      // Use User's 'hasActiveSubscription' flag or Payment status for active list
      if (sub.status === "Paid" || customer?.hasActiveSubscription) {
          activeSubscribers.push(subData);
      }
    });

    const mrrTrend = Object.keys(mrrTrendMap)
      .sort()
      .map((month) => ({
        month,
        mrr: mrrTrendMap[month],
      }));

    return res.status(200).json({
      success: true,
      totalMRR,
      totalNewSignUps: newSignUps.length,
      totalActiveSubscribers: activeSubscribers.length,
      totalCancelledSubscribers: churnedUsers.length,
      mrrTrend,
      newSignUps,
      churnedUsers,
      activeSubscribers,
    });
  } catch (err) {
    console.error("❌ Error fetching subscription analytics:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};


/**
 * Refund Analytics API
 * Returns analytics for bookings with RefundPending, Refunded, or PartiallyRefunded status
 */
export const refundAnalytics = async (req, res) => {
  try {
    const { fromDate, toDate, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);

    // Build date filter
    const dateFilter = {};
    if (fromDate) dateFilter.$gte = new Date(fromDate);
    if (toDate) dateFilter.$lte = new Date(toDate);

    // Query for refund-related payment statuses
    const query = {
      paymentStatus: { $in: ['RefundPending', 'Refunded', 'PartiallyRefunded'] }
    };
    if (fromDate || toDate) query.createdAt = dateFilter;

    // ==============================
    // 1️⃣ Aggregate Summary Stats
    // ==============================
    const summaryAggregation = await Booking.aggregate([
      { $match: query },
      { $unwind: { path: '$refundDetails', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          totalRefundedBookings: { $addToSet: '$_id' },
          totalRefundAmount: { $sum: { $ifNull: ['$refundDetails.amount', 0] } },
          avgRefundAmount: { $avg: { $ifNull: ['$refundDetails.amount', 0] } },
          refundCount: { $sum: { $cond: [{ $gt: ['$refundDetails.amount', 0] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          totalRefundedBookings: { $size: '$totalRefundedBookings' },
          totalRefundAmount: 1,
          avgRefundAmount: 1,
          refundCount: 1
        }
      }
    ]);

    // ==============================
    // 2️⃣ Refunds by Status
    // ==============================
    const byStatus = await Booking.aggregate([
      { $match: query },
      { $unwind: { path: '$refundDetails', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$paymentStatus',
          count: { $addToSet: '$_id' },
          totalAmount: { $sum: { $ifNull: ['$refundDetails.amount', 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: { $size: '$count' },
          totalAmount: 1
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // ==============================
    // 3️⃣ Refunds by Reason
    // ==============================
    const byReason = await Booking.aggregate([
      { $match: query },
      { $unwind: '$refundDetails' },
      {
        $group: {
          _id: { $ifNull: ['$refundDetails.reason', 'No Reason Specified'] },
          count: { $sum: 1 },
          totalAmount: { $sum: '$refundDetails.amount' }
        }
      },
      {
        $project: {
          _id: 0,
          reason: '$_id',
          count: 1,
          totalAmount: 1
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // ==============================
    // 4️⃣ Refunds by Type
    // ==============================
    const byType = await Booking.aggregate([
      { $match: query },
      { $unwind: '$refundDetails' },
      {
        $group: {
          _id: { $ifNull: ['$refundDetails.refundType', 'Unspecified'] },
          count: { $sum: 1 },
          totalAmount: { $sum: '$refundDetails.amount' }
        }
      },
      {
        $project: {
          _id: 0,
          refundType: '$_id',
          count: 1,
          totalAmount: 1
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // ==============================
    // 5️⃣ Monthly Trend
    // ==============================
    const monthlyTrend = await Booking.aggregate([
      { $match: query },
      { $unwind: '$refundDetails' },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$refundDetails.processedAt' }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$refundDetails.amount' }
        }
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          count: 1,
          totalAmount: 1
        }
      },
      { $sort: { month: 1 } }
    ]);

    // ==============================
    // 6️⃣ Detailed Refund List (Paginated)
    // ==============================
    const skip = (pageNum - 1) * pageSize;

    const [refundedBookings, totalCount] = await Promise.all([
      Booking.find(query)
        .populate('customer', 'firstName lastName email')
        .populate('masterdressId', 'dressName brand')
        .populate('refundDetails.processedBy', 'firstName lastName')
        .select('customer masterdressId dressName paymentStatus totalAmount refundDetails createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Booking.countDocuments(query)
    ]);

    // Format the detailed list
    const detailedList = refundedBookings.map(booking => {
      const totalRefunded = booking.refundDetails?.reduce((sum, r) => sum + (r.amount || 0), 0) || 0;
      
      return {
        bookingId: booking._id,
        customerName: `${booking.customer?.firstName || ''} ${booking.customer?.lastName || ''}`.trim() || 'N/A',
        customerEmail: booking.customer?.email || 'N/A',
        dressName: booking.masterdressId?.dressName || booking.dressName || 'N/A',
        brand: booking.masterdressId?.brand || 'N/A',
        originalAmount: booking.totalAmount || 0,
        paymentStatus: booking.paymentStatus,
        totalRefunded,
        refundDetails: booking.refundDetails?.map(r => ({
          refundType: r.refundType || 'Unspecified',
          amount: r.amount || 0,
          reason: r.reason || 'No reason',
          status: r.status || 'N/A',
          processedAt: r.processedAt,
          processedBy: r.processedBy ? `${r.processedBy.firstName || ''} ${r.processedBy.lastName || ''}`.trim() : 'System',
          stripeRefundId: r.stripeRefundId || null
        })) || [],
        bookingDate: booking.createdAt
      };
    });

    // ==============================
    // 7️⃣ Return Response
    // ==============================
    const summary = summaryAggregation[0] || {
      totalRefundedBookings: 0,
      totalRefundAmount: 0,
      avgRefundAmount: 0,
      refundCount: 0
    };

    return res.status(200).json({
      success: true,
      message: 'Refund analytics fetched successfully',
      summary: {
        totalRefundedBookings: summary.totalRefundedBookings,
        totalRefundAmount: summary.totalRefundAmount,
        avgRefundAmount: Math.round(summary.avgRefundAmount * 100) / 100,
        totalRefundTransactions: summary.refundCount
      },
      byStatus,
      byReason,
      byType,
      monthlyTrend,
      refunds: {
        data: detailedList,
        pagination: {
          currentPage: pageNum,
          itemsPerPage: pageSize,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / pageSize)
        }
      }
    });
  } catch (err) {
    console.error('❌ Error fetching refund analytics:', err);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};