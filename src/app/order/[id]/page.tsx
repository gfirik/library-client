import { FC } from "react";
import { notFound } from "next/navigation";
import { fetchBookByIdForOrder } from "@/utils/book/fetchBookByIdForOrder";
import OrderDetailsClient from "../orderclient";

interface OrderDetailsPageProps {
  params: { id: string };
}

const OrderDetailsPage: FC<OrderDetailsPageProps> = async ({ params }) => {
  const { id } = params;
  const book = await fetchBookByIdForOrder(id);

  if (!book) {
    notFound();
  }

  return <OrderDetailsClient book={book} />;
};

export default OrderDetailsPage;
