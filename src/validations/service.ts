import { z } from "zod";

export const ServiceSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  slug: z.string().optional(),
  caption: z.string().min(1, "Caption is required").trim(),
  body: z.string().min(1, "Body is required"),
  thumbnail: z.string().nullable().optional(),
  detailBody: z.string().nullable().optional(),
  order: z.number().optional(),
});
