import mongoose from 'mongoose';
import User from '../../../auth/auth.model.js';
import { Booking } from '../../../booking/booking.model.js';
// ...existing code...
import Listing from '../../../lender/Listings/listings.model.js';
import MasterDress from './masterDressModel.js';

// get dress from listing
export const getApprovedDresses = async (filters, page, limit, skip) => {
  const query = { isActive: true };
  
  // Search filter
  if (filters.search) {
    query.$or = [
      { dressName: { $regex: filters.search, $options: 'i' } },
      { brand: { $regex: filters.search, $options: 'i' } }
    ];
  }

  // Size filter
  if (filters.size && filters.size !== 'All') {
    query.sizes = {
      $in: Array.isArray(filters.size) ? filters.size : [filters.size]
    };
  }

  // Category filter
  if (filters.category && filters.category !== 'All') {
    query.categories = {
      $in: Array.isArray(filters.category) ? filters.category : [filters.category]
    };
  }

  // Lender filter
  if (filters.lenderId && filters.lenderId !== 'All') {
    query.lenderIds = filters.lenderId;
  }

  // ----------------------
  // GEO / POSTCODE FILTER
  // ----------------------
  if ((filters.latitude && filters.longitude) || filters.postcode) {
    const searchRadius = filters.radius || 50000;
    let localLenderIds = [];
    if (filters.postcode) {
      // Postcode based
      const lenders = await User.find({
        role: 'LENDER',
        postcode: filters.postcode
      }).select('_id');
      localLenderIds = lenders.map((l) => l._id);
    } else if (filters.latitude && filters.longitude && filters.radius) {
      // Geo based
      const lenders = await User.find({
        role: 'LENDER',
        location: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(filters.longitude), parseFloat(filters.latitude)]
            },
            $maxDistance: searchRadius
          }
        }
      }).select('_id');
      localLenderIds = lenders.map((l) => l._id);
    }

    // Only apply if lenders found
    if (localLenderIds.length > 0) {
      query.lenderIds = { $in: localLenderIds };
    } else {
      // No nearby lenders, force zero results
      query.lenderIds = { $in: [] };
    }
  }

  // Price filter
  if (
    (filters.minPrice !== undefined && filters.minPrice !== 'All') ||
    (filters.maxPrice !== undefined && filters.maxPrice !== 'All')
  ) {
    query.basePrice = {};
    if (filters.minPrice !== undefined && filters.minPrice !== 'All') {
      query.basePrice.$gte = parseFloat(filters.minPrice);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== 'All') {
      query.basePrice.$lte = parseFloat(filters.maxPrice);
    }
  }

  const [data, totalItems] = await Promise.all([
    MasterDress
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'lenderIds',
        select: 'fullName phoneNumber businessAddress instagramHandle'
      })
      .lean(),
    MasterDress.countDocuments(query)
  ]);
  
  // ----------------------
  if (totalItems === 0) {
    let reason = 'No dresses found.';

    if (filters.postcode) {
      reason = `No dresses found for postcode "${filters.postcode}".`;
    } else if (filters.latitude && filters.longitude && filters.radius) {
      reason = `No dresses found within ${filters.radius}m of your location.`;
    } else if (filters.category && filters.category !== 'All') {
      reason = `No dresses found in category "${filters.category}".`;
    } else if (filters.size && filters.size !== 'All') {
      reason = `No dresses available in size "${filters.size}".`;
    } else if (filters.lenderId && filters.lenderId !== 'All') {
      reason = `No dresses found for this lender.`;
    } else if (
      (filters.minPrice !== undefined && filters.minPrice !== 'All') ||
      (filters.maxPrice !== undefined && filters.maxPrice !== 'All')
    ) {
      reason = `No dresses found in the selected price range.`;
    } else if (filters.search) {
      reason = `No dresses matched your search "${filters.search}".`;
    }

    return {
      success: false,
      data: [],
      pagination: { totalPages: 0, totalItems: 0, itemsPerPage: limit },
      message: reason
    };
  }
  
  const populatedData = data.map((dress) => ({
    ...dress,
    lenders: dress.lenderIds // Attach populated array to 'lenders' property
  }));

  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: populatedData,
    pagination: {
      totalPages,
      totalItems,
      itemsPerPage: limit
    },
    reason: `${totalItems} dresses found.`
  };
};

// updating the approval status and creating master dress to show in the main site
export const adminUpdateDress = async (listingId, adminData = {}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const listing = await Listing.findById(listingId).session(session);
    if (!listing) throw new Error('Listing not found');

    let masterDress = null;
    const isNowApproved = adminData.approvalStatus === 'approved' && listing.approvalStatus !== 'approved';

    // 2️⃣ Update listing fields dynamically so MasterDress inherits the latest fields
    Object.assign(listing, adminData);

    // 1️⃣ If status is being changed to "approved" and not already approved
    if (isNowApproved) {
      listing.approvalStatus = 'approved';
      listing.isActive = true;

      // Check for existing MasterDress with potentially new admin-edited name
      masterDress = await MasterDress.findOne({
        dressName: listing.dressName
      }).session(session);

      if (!masterDress) {
        // Create new MasterDress
        masterDress = new MasterDress({
          dressName: listing.dressName,
          brand: listing.brand || '',
          listingIds: [listing._id.toString()],
          lenderIds: [listing.lenderId],
          sizes: Array.isArray(listing.size) ? listing.size : [listing.size],
          colors: Array.isArray(listing.colour) ? listing.colour : (listing.colour ? [listing.colour] : []),
          categories: Array.isArray(listing.category) ? listing.category : (listing.category ? [listing.category] : []),
          occasions: listing.occasion || [],
          media: listing.media || [],
          thumbnail: listing.media?.[0] || null,
          pickupOption: listing.pickupOption,
          isActive: false,
          basePrice: adminData.basePrice ?? null,
          insuranceFee: adminData.insuranceFee ?? null,
          rrpPrice: adminData.rrpPrice ?? null,
          shippingDetails: {
            isLocalPickup:
              listing.pickupOption === 'Local' ||
              listing.pickupOption === 'Both',
            isShippingAvailable:
              listing.pickupOption === 'Australia-wide' ||
              listing.pickupOption === 'Both',
            insuranceFee: adminData.insuranceFee ?? null,
            flexibilityNotes: adminData.flexibilityNotes ?? ''
          }
        });
      } else {
        // Merge into existing MasterDress
        masterDress.listingIds = Array.from(
          new Set([...masterDress.listingIds, listing._id.toString()])
        );
        masterDress.lenderIds = Array.from(
          new Set([...masterDress.lenderIds, listing.lenderId])
        );
        masterDress.sizes = Array.from(
          new Set([
            ...masterDress.sizes,
            ...(Array.isArray(listing.size) ? listing.size : [listing.size])
          ])
        );

        // Always update brand to the latest lender's selected brand
        if (listing.brand) masterDress.brand = listing.brand;

        // Merge colors without duplicates
        if (listing.colour) {
          const incomingColours = Array.isArray(listing.colour) ? listing.colour : [listing.colour];
          masterDress.colors = Array.from(
            new Set([...masterDress.colors, ...incomingColours])
          );
        }

        // Merge categories without duplicates
        if (listing.category) {
          const incomingCategories = Array.isArray(listing.category) ? listing.category : [listing.category];
          masterDress.categories = Array.from(
            new Set([...(masterDress.categories || []), ...incomingCategories])
          );
        }
        if (listing.occasion && listing.occasion.length)
          masterDress.occasions = Array.from(
            new Set([...masterDress.occasions, ...listing.occasion])
          );
        if (listing.media && listing.media.length)
          masterDress.media = Array.from(
            new Set([...masterDress.media, ...listing.media])
          );

        // Admin fields
        if (adminData.basePrice !== undefined)
          masterDress.basePrice = adminData.basePrice;
        if (adminData.insuranceFee !== undefined)
          masterDress.shippingDetails.insuranceFee = adminData.insuranceFee;
        if (adminData.flexibilityNotes)
          masterDress.shippingDetails.flexibilityNotes =
            adminData.flexibilityNotes;
        if (adminData.thumbnail) masterDress.thumbnail = adminData.thumbnail;

        // Ensure isActive is false during merging as per requirement
        masterDress.isActive = false;
      }

      await masterDress.save({ session });
    }

    await listing.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { listing, masterDress };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const getApprovalStats = async () => {
  // Total listings
  const totalListings = await Listing.countDocuments();

  // Total approved
  const totalApproved = await Listing.countDocuments({
    approvalStatus: 'approved'
  });

  // Total pending
  const totalPending = await Listing.countDocuments({
    approvalStatus: 'pending'
  });

  return { totalListings, totalApproved, totalPending };
};

export const getDressById = async (listing) => {
  // 1. Find dress
  const dress = await listing
    .findById(listing)
    .populate({
      path: 'lenderId',
      select: 'firstName fullName lastName  email'
    })
    .lean();

  if (!dress) {
    return { success: false, message: 'Dress not found' };
  }

  // 2. Get all bookings for this dress
  const bookings = await Booking.find({ listing: listing }).lean();

  // 3. Extract booked date ranges
  const bookedRanges = bookings.map((b) => {
    const start = new Date(b.rentalStartDate);
    const end = new Date(b.rentalEndDate);

    let range = [];
    let current = new Date(start);

    while (current <= end) {
      range.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return range;
  });

  // 4. Add booking info into dress response
  return {
    success: true,
    data: {
      ...dress,
      bookings: bookings.map((b) => ({
        rentalStartDate: b.rentalStartDate,
        rentalEndDate: b.rentalEndDate,
        rentalDurationDays: b.rentalDurationDays
      })),
      bookedDates: bookedRanges
    }
  };
};

// update master dress fields

export const updateMasterDress = async (masterDressId, updateData = {}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const masterDress = await MasterDress.findOne({ masterDressId }).session(session);
    if (!masterDress) throw new Error("MasterDress not found");

    // ✅ Merge new fields
    Object.assign(masterDress, updateData);

    // ✅ Ensure thumbnail exists
    if (!masterDress.thumbnail && masterDress.media?.length > 0) {
      masterDress.thumbnail = masterDress.media[0];
    }

    await masterDress.save({ session });
    await session.commitTransaction();
    session.endSession();

    return masterDress;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};



// get all master dress

export const getAllMasterDresses = async (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10; // default 10
  const skip = (page - 1) * limit;

  // Only active master dresses
  const filter = {};

  // Optional search filter
  if (query.search) {
    filter.$or = [
      { dressName: { $regex: query.search, $options: 'i' } },
      { slug: { $regex: query.search, $options: 'i' } },
      { brand: { $regex: query.search, $options: 'i' } }
    ];
  }

  // Brand Name filter
  if (query.brandName || query.brand) {
    filter.brand = { $regex: query.brandName || query.brand, $options: 'i' };
  }

  // Price range filtering (basePrice is ROOT level)
  if (query.minPrice || query.maxPrice) {
    filter.basePrice = {};

    if (query.minPrice) {
      filter.basePrice.$gte = Number(query.minPrice);
    }
    if (query.maxPrice) {
      filter.basePrice.$lte = Number(query.maxPrice);
    }
  }

  // Size filter (sizes = string array)
  if (query.size) {
    filter.sizes = { $in: [query.size] };
  }


  // 🏠 Local pickup filter (independent)
  if (query.localPickup !== undefined) {
    filter['shippingDetails.isLocalPickup'] =
      query.localPickup === 'true';
  }

  // 🚚 Shipping filter (independent)
  if (query.shipping !== undefined) {
    filter['shippingDetails.isShippingAvailable'] =
      query.shipping === 'true';
  }

  // 🔄 Flexible isActive filter
  if (query.isActive !== undefined) {
    if (query.isActive !== 'All') {
      filter.isActive = query.isActive === 'true';
    } else {
      delete filter.isActive; // Show all if "All" is selected
    }
  }

  const [data, totalItems] = await Promise.all([
    MasterDress.find(filter)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'lenderIds',
        select: 'fullName phoneNumber businessAddress instagramHandle'
      })
      .lean(),
    MasterDress.countDocuments(filter)
  ]);

  // const totalItems = await MasterDress.countDocuments(filter);
  const populatedData = data.map((dress) => ({
    ...dress,
    lenders: dress.lenderIds 
  }));

  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: populatedData,
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems,
      totalPages,
    },
  };
};

// get master dress by id

export const getMasterDressById = async (id) => {
  // Try finding by _id first
  let masterDress = await MasterDress.findById(id)
    .populate({
      path: 'lenderIds',
      select: 'fullName phoneNumber businessAddress instagramHandle'
    })
    .lean();

  // If not found, try masterDressId
  if (!masterDress) {
    masterDress = await MasterDress.findOne({ masterDressId: id })
      .populate({
        path: 'lenderIds',
        select: 'fullName phoneNumber businessAddress instagramHandle'
      })
      .lean();
  }

  if (!masterDress) {
    throw new Error('Master Dress not found');
  }

  return {
    ...masterDress,
    lenders: masterDress.lenderIds
  };
};

export const getNearestLendersByDressIdService = async (
  dressId,
  userLatitude,
  userLongitude,
  radius = 50000 // 50km
) => {
  if (!mongoose.Types.ObjectId.isValid(dressId)) {
    throw new Error('Invalid dress ID');
  }

  // Fetch dress document
  const dress = await MasterDress.findById(dressId).select('lenderIds');
  if (!dress || !dress.lenderIds || dress.lenderIds.length === 0) {
    throw new Error('No lenders associated with this dress');
  }

  // Find lenders within 50km radius and sort by distance
  const nearestLenders = await User.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(userLongitude), parseFloat(userLatitude)]
        },
        distanceField: 'distance',
        maxDistance: radius, // 50km in meters
        spherical: true,
        query: {
          _id: { $in: dress.lenderIds },
          role: 'LENDER'
        }
      }
    },
    {
      $sort: { distance: 1 }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        distance: 1,
        location: 1
      }
    }
  ]);

  // If no nearby lenders found, return all lenders globally with the dress
  if (!nearestLenders || nearestLenders.length === 0) {
    // Find all lenders globally who have the dress
    const globalLenders = await User.find({
      _id: { $in: dress.lenderIds },
      role: 'LENDER'
    }).select('_id name email location');
    return globalLenders;
  }

  return nearestLenders;
};

export const getApprovedMarkersService = async (filters) => {
  const query = { isActive: true };
  
  if (filters.search) {
    query.$or = [
      { dressName: { $regex: filters.search, $options: 'i' } },
      { brand: { $regex: filters.search, $options: 'i' } }
    ];
  }

  if (filters.size && filters.size !== 'All') {
    query.sizes = {
      $in: Array.isArray(filters.size) ? filters.size : [filters.size]
    };
  }

  if (filters.category && filters.category !== 'All') {
    query.categories = {
      $in: Array.isArray(filters.category) ? filters.category : [filters.category]
    };
  }

  if (filters.lenderId && filters.lenderId !== 'All') {
    query.lenderIds = typeof filters.lenderId === 'string' ? new mongoose.Types.ObjectId(filters.lenderId) : filters.lenderId;
  }

  if ((filters.latitude && filters.longitude) || filters.postcode) {
    const searchRadius = filters.radius ? parseFloat(filters.radius) : 50000;
    let localLenderIds = [];
    if (filters.postcode) {
      const lenders = await User.find({ role: 'LENDER', postcode: filters.postcode }).select('_id');
      localLenderIds = lenders.map((l) => l._id);
    } else if (filters.latitude && filters.longitude) {
      const lenders = await User.find({
        role: 'LENDER',
        location: {
          $nearSphere: {
            $geometry: { type: 'Point', coordinates: [parseFloat(filters.longitude), parseFloat(filters.latitude)] },
            $maxDistance: searchRadius
          }
        }
      }).select('_id');
      localLenderIds = lenders.map((l) => l._id);
    }

    if (localLenderIds.length > 0) {
      query.lenderIds = { $in: localLenderIds };
    } else {
      query.lenderIds = { $in: [] };
    }
  }

  if (
    (filters.minPrice !== undefined && filters.minPrice !== 'All') ||
    (filters.maxPrice !== undefined && filters.maxPrice !== 'All')
  ) {
    query.basePrice = {};
    if (filters.minPrice !== undefined && filters.minPrice !== 'All') query.basePrice.$gte = parseFloat(filters.minPrice);
    if (filters.maxPrice !== undefined && filters.maxPrice !== 'All') query.basePrice.$lte = parseFloat(filters.maxPrice);
  }

  const pipeline = [
    { $match: query },
    { $unwind: '$lenderIds' },
    {
      $group: {
        _id: '$lenderIds',
        masterDressCount: { $sum: 1 },
        products: {
          $push: {
            id: '$_id',
            name: '$dressName',
            sizes: '$sizes',
            image: { $ifNull: ['$thumbnail', { $arrayElemAt: ['$media', 0] }] },
            brand: '$brand',
            basePrice: '$basePrice'
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'lender'
      }
    },
    { $unwind: '$lender' },
    {
      $project: {
        _id: 0,
        lenderId: '$_id',
        latitude: '$lender.latitude',
        longitude: '$lender.longitude',
        lenderName: { $concat: ['$lender.firstName', ' ', '$lender.lastName'] },
        masterDressCount: 1,
        products: 1
      }
    }
  ];

  const markers = await MasterDress.aggregate(pipeline);
  return markers;
};
