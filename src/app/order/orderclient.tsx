"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DatePickerWithRange } from "@/components/order/datepicker";
import { useTelegram } from "@/context/telegram";
import { DateRange } from "react-day-picker";
import { createOrder, updateBookStatus } from "@/utils/order/createOrder";
import { orderSchema, OrderStatus } from "@/types/order";
import { fetchUserByTelegramId } from "@/utils/order/fetchUserByTelegramId";
import NoTelegramUserId from "@/components/order/notelegramuserid";

interface OrderDetailsClientProps {
  book: {
    id: string;
    title: string;
    author: string;
    price_per_week: number;
  };
}

const OrderDetailsClient: React.FC<OrderDetailsClientProps> = ({ book }) => {
  const { telegramUserId } = useTelegram();
  const { toast } = useToast();
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleDateChange = useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range);
      if (range?.from && range?.to) {
        const days = Math.ceil(
          (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)
        );
        const weeks = Math.ceil(days / 7);
        console.log("Days:", days, "Weeks:", weeks);
        console.log("Price per week:", book.price_per_week);
        const price = weeks * book.price_per_week;
        console.log("Calculated price:", price);
        setTotalPrice(price);
      } else {
        setTotalPrice(null);
      }
    },
    [book.price_per_week]
  );

  const submitOrder = useCallback(async () => {
    if (!dateRange?.from || !dateRange?.to || !totalPrice || !telegramUserId) {
      toast({
        title: "Invalid Order",
        description:
          "Please select a valid date range and ensure you're logged in via Telegram.",
        variant: "destructive",
      });
      return;
    }

    try {
      const userData = await fetchUserByTelegramId(telegramUserId.toString());
      const userUuid = userData.id;

      const orderData = {
        user_id: userUuid,
        book_id: book.id,
        start_date: dateRange.from.toISOString(),
        end_date: dateRange.to.toISOString(),
        total_price: totalPrice,
        status: "pending_payment" as OrderStatus,
      };

      console.log("Order Data:", orderData);

      // Validate order data with Zod
      const validatedOrderData = orderSchema.parse(orderData);
      console.log("Validated Order Data:", validatedOrderData);

      await createOrder(validatedOrderData);
      await updateBookStatus(book.id, "Pending");

      toast({
        title: "Order Placed",
        description:
          "Your order has been successfully submitted. Please wait for payment instructions.",
      });

      const tg = (window as any).Telegram.WebApp;
      tg.close();
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Order Failed",
        description: `Error message: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  }, [book.id, dateRange, totalPrice, telegramUserId, toast]);

  const handleOrder = useCallback(() => {
    if (!dateRange || !totalPrice || !telegramUserId) {
      toast({
        title: "Invalid Order",
        description:
          "Please select a valid date range and ensure you're logged in via Telegram.",
        variant: "destructive",
      });
      return;
    }

    const tg = (window as any).Telegram.WebApp;
    tg.showConfirm(
      `"${book.title}" kitobi uchun umumiy ${totalPrice} KRW'lik ijara buyurtmasini tasdiqlaysizmi?`,
      (confirmed: boolean) => {
        if (confirmed) {
          submitOrder();
        }
      }
    );
  }, [book.title, dateRange, totalPrice, telegramUserId, toast, submitOrder]);

  useEffect(() => {
    if (telegramUserId) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      const mainButton = tg.MainButton;

      mainButton.setText("Tasdiqlash");
      mainButton.setParams({
        color: "#040303",
      });

      mainButton.show();

      if (!dateRange || !totalPrice) {
        mainButton.disable();
      } else {
        mainButton.enable();
      }

      mainButton.onClick(handleOrder);

      return () => {
        mainButton.offClick(handleOrder);
        mainButton.hide();
      };
    }
  }, [telegramUserId, handleOrder, dateRange, totalPrice]);

  if (!telegramUserId) {
    return <NoTelegramUserId />;
  }

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white p-4 min-h-screen flex flex-col">
      <div className="flex-grow w-full max-w-md mx-auto">
        <h3 className="text-gray-600">Buyurtma tafsilotlari:</h3>
        <h1 className="text-3xl font-bold mt-12">{book.title}</h1>
        <p className="text-lg font-semibold mt-4">{book.author}</p>
        <p className="text-sm mb-3 text-gray-600 mt-4">
          Haftalik ijara narxi: {book.price_per_week} KRW
        </p>
        <DatePickerWithRange className="mt-4" onDateChange={handleDateChange} />
        {totalPrice !== null ? (
          <div>
            <h2 className="text-lg font-semibold mt-8">
              Umumiy to&apos;lov narxi: {totalPrice} KRW
            </h2>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mt-8">
              Narxlar tanlangan muddatga ko&apos;ra belgilanadi.
            </h2>
          </div>
        )}
      </div>
      {!telegramUserId && (
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button
            className="w-full"
            onClick={handleOrder}
            disabled={!dateRange || totalPrice === null}
          >
            Tasdiqlash
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsClient;
