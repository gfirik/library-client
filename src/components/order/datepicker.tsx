"use client";

import * as React from "react";
import { format, addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange: (range: DateRange | undefined) => void;
}

const DatePickerWithRange: React.FC<DatePickerWithRangeProps> = ({
  className,
  onDateChange,
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), 1),
    to: addDays(new Date(), 7),
  });

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const days = Math.ceil(
        (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (days >= 7) {
        setDate(range);
        onDateChange(range);
      }
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
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
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            disabled={(date) => date < addDays(new Date(), 1)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerWithRange;
