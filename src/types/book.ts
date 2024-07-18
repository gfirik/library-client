import { z } from "zod";

export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  published: z.string().min(4, "Published year is required"),
  description: z.string().min(10, "Description is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  status: z.enum(["Available", "Rented", "Pending"]),
  rented_by: z.string().optional(),
  images: z
    .array(z.any())
    .max(4, "Maximum 4 images are allowed")
    .min(1, "At least one image is required"),
  price_per_week: z
    .number()
    .min(0, "Price per week is required and must be a positive number"),
});

export type BookFormData = z.infer<typeof bookSchema>;

export const categories = [
  "badiiy",
  "tarix",
  "islom",
  "siyosat",
  "biznes",
  "rivojlanish",
  "boshqa",
];
