"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DatePickerWithRange } from "@/components/order/datepicker";
import { useTelegram } from "@/context/telegram";
import { DateRange } from "react-day-picker";

interface OrderDetailsClientProps {
  book: {
    id: string;
    title: string;
    author: string;
    price_per_week: number;
  };
}

const OrderDetailsClient: React.FC<OrderDetailsClientProps> = ({ book }) => {
  const { username } = useTelegram();
  const { toast } = useToast();
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleDateChange = (range: DateRange | undefined) => {
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
  };

  const handleOrder = useCallback(() => {
    if (!dateRange || !totalPrice) {
      toast({
        title: "Invalid Order",
        description: "Please select a valid date range.",
        variant: "destructive",
      });
      return;
    }

    if (username) {
      const tg = (window as any).Telegram.WebApp;
      tg.showConfirm(
        `"${book.title}" kitobi uchun umumiy ${totalPrice} KRW'lik ijara buyurtmasini tasdiqlaysizmi?`,
        (confirmed: boolean) => {
          if (confirmed) {
            tg.close();
          }
        }
      );
    } else {
      toast({
        title: "Order via Telegram",
        description: "Please use the Telegram app to place your order.",
      });
    }
  }, [book, dateRange, totalPrice, username, toast]);

  useEffect(() => {
    if (username) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      const mainButton = tg.MainButton;

      mainButton.setText("Tasdiqlash");
      mainButton.setParams({
        color: "#040303",
      });

      if (!dateRange || !totalPrice) {
        mainButton.hide();
      } else {
        mainButton.show();
      }

      mainButton.onClick(handleOrder);

      return () => {
        mainButton.offClick(handleOrder);
      };
    }
  }, [username, handleOrder, dateRange, totalPrice]);

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white p-4 min-h-screen flex flex-col">
      <div className="flex-grow w-full max-w-md mx-auto space-y-4">
        <h1 className="text-gray-600">Buyurtma tafsilotlari:</h1>
        <h1 className="text-2xl font-bold">{book.title}</h1>
        <p className="text-lg font-semibold">{book.author}</p>
        <p className="text-sm mb-3 text-gray-600">
          Haftalik ijara narxi: {book.price_per_week} KRW
        </p>
        <DatePickerWithRange className="mb-4" onDateChange={handleDateChange} />
        {totalPrice !== null && (
          <div className="text-center">
            <h2 className="text-lg font-semibold mt-4">
              Umumiy narx: {totalPrice} KRW
            </h2>
          </div>
        )}
      </div>
      {!username && (
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button
            className="w-full"
            onClick={handleOrder}
            disabled={!dateRange || !totalPrice}
          >
            Tasdiqlash
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsClient;
