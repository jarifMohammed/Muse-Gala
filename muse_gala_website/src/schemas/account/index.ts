import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email").toLowerCase(),
  phoneNumber: z.string().min(10, "Phone must be at least 10 digits"),

});

export type ProfileFormSchemaValues = z.infer<typeof profileSchema>;
