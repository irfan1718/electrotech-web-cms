import { z } from "zod";

export const CareerSchema = z.object({
  title: z.string().min(1, "Job title is required").trim(),
  location: z.string().min(1, "Location is required").trim(),
  caption: z.string().min(1, "Caption is required").trim(),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["open", "closed"]).optional(),
});
