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
        const price = weeks * book.price_per_week;
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

      const validatedOrderData = orderSchema.parse(orderData);

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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <div className="flex-grow max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
        {/* Book Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-700 text-lg">{book.author}</p>
          <p className="text-sm text-gray-500 mt-2">
            Haftalik ijara narxi:{" "}
            <span className="font-semibold">{book.price_per_week} KRW</span>
          </p>
        </div>

        {/* Date Picker */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-600">
            Ijara muddatini tanlang
          </h3>
          <DatePickerWithRange onDateChange={handleDateChange} />
        </div>

        {/* Total Price */}
        <div className="mt-8 text-center">
          {totalPrice !== null ? (
            <h2 className="text-xl font-semibold">
              Umumiy to&apos;lov:{" "}
              <span className="text-green-600">{totalPrice} KRW</span>
            </h2>
          ) : (
            <h2 className="text-lg text-gray-500">
              Narxlar tanlangan muddatga ko&apos;ra belgilanadi.
            </h2>
          )}
        </div>
      </div>

      {/* Fallback Button */}
      {!telegramUserId && (
        <div className="sticky bottom-0 bg-white p-4 border-t">
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
