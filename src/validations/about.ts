import { z } from "zod";

export const aboutSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),

  caption: z
    .string()
    .trim()
    .min(5, "Caption must be at least 5 characters")
    .max(250, "Caption cannot exceed 250 characters"),

  body: z
    .string()
    .trim()
    .min(20, "Body content must be at least 20 characters")
    .max(10000, "Body content is too long"),
});

export type AboutFormData = z.infer<typeof aboutSchema>;
