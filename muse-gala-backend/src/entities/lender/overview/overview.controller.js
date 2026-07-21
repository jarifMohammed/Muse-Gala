import { generateResponse } from "../../../lib/responseFormate.js";
import { getLenderOverviewService, getRentalCalendarService } from "./overview.service.js";


export const getLenderOverview = async (req, res) => {
  try {
    const lenderId = req.user._id;
    const { period = "monthly" } = req.query;

    const data = await getLenderOverviewService(lenderId, period);

    return generateResponse(res, 200, true, "Lender overview fetched", data);
  } catch (err) {
    console.error("Overview Error:", err);
    return generateResponse(res, 500, false, err.message);
  }
};


export const getRentalCalendar = async (req, res) => {
  try {
    const lenderId = req.user._id;
    let { masterDressId, startDate, endDate } = req.query;

    const now = new Date();

    // Default: current month range if not provided
    if (!startDate) {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    }
    if (!endDate) {
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
    }

    const data = await getRentalCalendarService({
      lenderId,
      masterDressId,
      startDate,
      endDate,
    });

    return generateResponse(res, 200, true, "Calendar data fetched", data);

  } catch (error) {
    console.log(error);
    return generateResponse(res, 500, false, "Server error", error.message);
  }
};



