import { OrderStatus, orderSchema } from "@/types/order";
import { supabase } from "@/utils/supabase/client";

export const createOrder = async (orderData: {
  user_id: string;
  book_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: OrderStatus;
}) => {
  const validatedOrderData = orderSchema.parse(orderData);

  const { data, error } = await supabase
    .from("orders")
    .insert(validatedOrderData)
    .select();

  if (error) {
    throw error;
  }

  return data;
};

export const updateBookStatus = async (bookId: string, status: string) => {
  const { error } = await supabase
    .from("books")
    .update({ status })
    .eq("id", bookId);

  if (error) {
    throw error;
  }
};
