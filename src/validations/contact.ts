import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().min(3, "Name is required").trim(),
  email: z.string().email("Invalid email address"),
  phone: z.string().nullable().optional(),
  subject: z.string().min(3, "Subject is required").trim(),
  message: z.string().min(5, "Message is required"),
});
