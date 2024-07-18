"use client";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange: (range: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  onDateChange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = useState<DateRange | undefined>();

  const handleSelect = (selectedDate: DateRange | undefined) => {
    if (selectedDate?.from) {
      const from = selectedDate.from;
      let to = selectedDate.to;

      // Ensure the end date is at least 7 days after the start date
      if (!to || to < addDays(from, 7)) {
        to = addDays(from, 7);
      }

      const newRange = { from, to };
      setDate(newRange);
      onDateChange(newRange);
    } else {
      setDate(undefined);
      onDateChange(undefined);
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full max-w-2xl justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Muddatni belgilash</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from || new Date()}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(day) => day < addDays(new Date(), 1)}
            fromDate={addDays(new Date(), 1)}
            toDate={addDays(new Date(), 60)} // Allow selection up to 60 days
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
