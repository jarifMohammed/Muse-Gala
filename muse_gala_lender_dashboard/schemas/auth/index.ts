import { z } from "zod";

// Define form schema with Zod
export const loginformSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginformSchema>;
