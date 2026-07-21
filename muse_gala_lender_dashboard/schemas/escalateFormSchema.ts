import z from "zod";

export const escalateFormSchema = z.object({
  reason: z.string().min(1, { message: "Reason is required" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  priority: z.enum(['Low', 'Medium', 'High'], {
    errorMap: () => ({ message: "Please select a valid priority" }),
  }),
  evidence: z
    .array(
      z.object({
        filename: z.string().min(1, { message: "Filename is required" }),
        url: z.string().optional(),
      })
    )
    .optional(),
});
