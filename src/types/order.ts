import { z } from "zod";

export const orderSchema = z.object({
  user_id: z.string().uuid(),
  book_id: z.string().uuid(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  total_price: z.number().positive(),
  status: z.enum([
    "pending_payment",
    "payment_submitted",
    "confirmed",
    "rejected",
    "rented",
    "returned",
  ]),
  payment_screenshot: z.string().url().optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;

export type OrderStatus = z.infer<typeof orderSchema.shape.status>;
