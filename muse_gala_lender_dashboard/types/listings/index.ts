import { z } from "zod";

export const rentalPriceSchema = z.object({
  fourDays: z
    .number({ required_error: "4-day price is required" })
    .min(0, { message: "Price must be positive" }),
  eightDays: z
    .number({ required_error: "8-day price is required" })
    .min(0, { message: "Price must be positive" }),
});

export const listingSchema = z.object({
  dressName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(120, { message: "Name must be at most 120 characters." }),
  brand: z
    .string()
    .min(2, { message: "Brand must be at least 2 characters." })
    .max(80, { message: "Brand must be at most 80 characters." }),
  size: z
    .array(
      z.enum(["XXS", "XS", "S", "M", "L", "XL", "Custom"])
    )
    .nonempty({ message: "Please select at least one size." }),
  colour: z
    .array(z.string().min(1))
    .nonempty({ message: "Please add at least one colour." }),
  condition: z.enum(
    [
      "Brand New",
      "Like New",
      "Gently Used",
      "Used",
      "Worn",
      "Damaged",
      "Altered",
      "Vintage",
    ],
    { required_error: "Please select a condition." }
  ),
  category: z
    .array(
      z.enum([
        "Formal",
        "Casual",
        "Cocktail",
        "Bridal",
        "Party",
        "Evening Gown",
        "Ball Gown",
        "Red Carpet",
        "Designer",
        "Haute Couture",
        "Luxury",
        "Other",
      ])
    )
    .nonempty({ message: "Please select at least one category." }),
  description: z
    .string()
    .max(1000, { message: "Description must be at most 1000 characters." })
    .optional(),
  material: z
    .string()
    .max(120, { message: "Material must be at most 120 characters." })
    .optional(),

  rentalPrice: rentalPriceSchema,
  media: z
    .array(z.string().url({ message: "Each media item must be a valid URL." }))
    .nonempty({ message: "At least one media file is required." }),
  pickupOption: z.enum(["Local-Pickup", "Australia-wide", "Both"], {
    required_error: "Pickup option is required",
  }),
});

export type ListingFormValues = z.infer<typeof listingSchema>;

// Backend Response Schema

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
  size: ("XXS" | "XS" | "S" | "M" | "L" | "XL" | "Custom")[];
  status: "available" | "booked" | "not-available";
  colour: string[];
  condition:
  | "Brand New"
  | "Like New"
  | "Gently Used"
  | "Used"
  | "Worn"
  | "Damaged"
  | "Altered"
  | "Vintage";
  category: ("Formal" | "Casual" | "Cocktail" | "Bridal" | "Party" | "Evening Gown" | "Ball Gown" | "Red Carpet" | "Designer" | "Haute Couture" | "Luxury" | "Other")[];
  media: string[];
  description?: string;
  rentalPrice: RentalPrice;
  material?: string;

  occasion: string[];
  insurance: boolean;
  pickupOption: "Local-Pickup" | "Australia-wide" | "Both";
  approvalStatus: "pending" | "approved" | "rejected";
  reasonsForRejection?: string;
  isActive: boolean;
  createdAt: string; // ISO string from timestamps
  updatedAt: string; // ISO string from timestamps
};
