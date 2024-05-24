import { z } from "zod";

export const bookSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  published: z.string().min(4, "Published year is required"),
  description: z.string().min(10, "Description is required"),
  status: z.enum(["Available", "Unavailable"]),
  rented_by: z.string().optional(),
  images: z
    .array(z.any())
    .max(4, "Maximum 4 images are allowed")
    .min(1, "At least one image is required"),
});

export type BookFormData = z.infer<typeof bookSchema>;
