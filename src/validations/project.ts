import { z } from "zod";

export const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  slug: z.string().optional(),
  caption: z.string().min(1, "Caption is required").trim(),
  body: z.string().min(1, "Body is required"),
  thumbnail: z.string().nullable().optional(),
  images: z.array(z.string()).max(4, "Maximum 4 images").optional(),
  detailBody: z.string().nullable().optional(),
  status: z.enum(["published", "draft"]).optional(),
  projectStatus: z.enum(["awarded", "in-progress", "completed"]).optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
