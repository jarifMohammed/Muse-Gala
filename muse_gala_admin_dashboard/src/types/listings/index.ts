export type RentalPrice = {
  fourDays: number;
  eightDays: number;
};

export type lenderId = {
  email: string;
  _id: string;
};

export type Listing = {
  _id: string; // comes from transform in toJSON
  lenderId: lenderId; // ObjectId serialized to string
  dressId: string;
  dressName: string;
  brand?: string;
  size:
    | "XXS"
    | "XS"
    | "S"
    | "M"
    | "L"
    | "XL"
    | "XXL"
    | "XXXL"
    | "4XL"
    | "5XL"
    | "Custom";
  status: "available" | "booked" | "not-available";
  colour?: string;
  condition:
    | "Brand New"
    | "Like New"
    | "Gently Used"
    | "Used"
    | "Worn"
    | "Damaged"
    | "Altered"
    | "Vintage";
  category:
    | "Formal"
    | "Casual"
    | "Cocktail"
    | "Bridal"
    | "Party"
    | "Evening Gown"
    | "Ball Gown"
    | "Red Carpet"
    | "Designer"
    | "Haute Couture"
    | "Luxury"
    | "Other";
  media: string[];
  description?: string;
  rentalPrice: RentalPrice;
  material?: string;
  careInstructions?:
    | "Dry Clean Only"
    | "Hand Wash"
    | "Machine Wash"
    | "Delicate Wash"
    | "Other";
  occasion: string[];
  insurance: boolean;
  pickupOption: "Local" | "Australia-wide" | "Both";
  approvalStatus: "pending" | "approved" | "rejected";
  reasonsForRejection?: string;
  isActive: boolean;
  createdAt: string; // ISO string from timestamps
  updatedAt: string; // ISO string from timestamps
};
