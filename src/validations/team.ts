import { z } from "zod";

export const TeamSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  designation: z.string().min(1, "Designation is required").trim(),
  caption: z.string().min(1, "Caption is required").trim(),
  profileImage: z.string().nullable().optional(),
  order: z.number().optional(),
});
