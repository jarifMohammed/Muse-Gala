import { z } from "zod";

export const becomeLenderForm = z.object({
  businessName: z.string().min(5, {
    message: "Business name must be at least 5 characters.",
  }),
  abnNumber: z.string().optional(),
  instagramHandle: z.string().min(5, {
    message: "Instagram must be at least 5 characters.",
  }),
  businessWebsite: z.string().optional(),
  fullName: z.string().min(5, {
    message: "Full name must be at least 5 characters.",
  }),
  email: z.string().min(1, { message: "Email is required." }).email({
    message: "Must be a valid email address.",
  }),
  phoneNumber: z.string().min(5, {
    message: "Phone number must be at least 5 characters.",
  }),
  businessAddress: z.string().min(5, {
    message: "Business address must be at least 5 characters.",
  }),

  numberOfDresses: z.string().optional(),
  reviewStockMethod: z.object({
    website: z.boolean(),
    instagram: z.boolean(),
    keyBrands: z.boolean(),
  }),
  notes: z.string().optional(),
  allowLocalPickup: z.enum(["yes", "no"], {
    required_error: "Please select an option",
  }),
  shipAustraliaWide: z.enum(["yes", "no"], {
    required_error: "Please select an option",
  }),
  allowTryOn: z.enum(["yes", "no"], {
    required_error: "Please select an option",
  }),
  agreedTerms: z.boolean().optional(),
  agreedCurationPolicy: z.boolean().optional(),

  // These fields are now optional
  city: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  postcode: z.string().optional(),
  state: z.string().optional(),
  suburb: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  placeName: z.string().optional(),
});

export type BecomeLenderFormType = z.infer<typeof becomeLenderForm>;
