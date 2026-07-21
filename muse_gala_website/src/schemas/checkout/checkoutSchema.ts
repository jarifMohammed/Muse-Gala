import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Phone must contain only numbers"),
  address: z.string().min(5, "Address is required"),
  idVerification: z.instanceof(File, { message: "ID Verification is required" }),
});

export type CheckoutFormType = z.infer<typeof checkoutSchema>;
