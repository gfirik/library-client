import { z } from "zod";
import { addDays } from "date-fns";

export const orderFormSchema = z.object({
  startDate: z
    .date({
      required_error: "Start date is required.",
    })
    .refine((date) => date > new Date(), {
      message: "Start date should be at least tomorrow.",
    }),
  endDate: z
    .date({
      required_error: "End date is required.",
    })
    .refine((date) => date > addDays(new Date(), 1), {
      message: "End date should be at least one day after start date.",
    }),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;
