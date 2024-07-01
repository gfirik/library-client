"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";
import DatePickerWithRange from "@/components/order/datepicker";

interface OrderDetailsClientProps {
  book: {
    id: string;
    title: string;
    author: string;
    price_per_week: number;
  };
}

const OrderDetailsClient: React.FC<OrderDetailsClientProps> = ({ book }) => {
  const { toast } = useToast();
  const [totalPrice, setTotalPrice] = React.useState<number | null>(null);

  const handleDateChange = (dateRange: DateRange | undefined) => {
    if (dateRange?.from && dateRange?.to) {
      const days = Math.ceil(
        (dateRange.to.getTime() - dateRange.from.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const weeks = Math.ceil(days / 7);
      const price = weeks * book.price_per_week;
      setTotalPrice(price);
    } else {
      setTotalPrice(null);
    }
  };

  const handleSubmit = () => {
    if (totalPrice !== null) {
      toast({
        title: "Order details",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify({ price: totalPrice }, null, 2)}
            </code>
          </pre>
        ),
      });
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white p-4 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-2xl font-bold text-center">{book.title}</h1>
        <p className="text-lg font-semibold text-center">{book.author}</p>
        <p className="text-sm text-center mb-3 text-gray-500">
          Price per week: {book.price_per_week} KRW
        </p>
        <DatePickerWithRange className="mb-4" onDateChange={handleDateChange} />
        <Button className="w-full" onClick={handleSubmit}>
          Calculate Price
        </Button>
        {totalPrice !== null && (
          <div className="text-center">
            <h2 className="text-lg font-semibold mt-4">
              Total Price: {totalPrice} KRW
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsClient;
