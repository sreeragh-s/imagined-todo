"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays, addWeeks, isSameDay } from 'date-fns';

interface WeekCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function WeekCalendar({ selectedDate, onDateSelect }: WeekCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const previousWeek = () => {
    setCurrentDate(addWeeks(currentDate, -1));
  };

  return (
    <div className="mb-8 bg-background rounded-b-xl max-w-md  p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={previousWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextWeek}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {weekDays.map((day, i) => (
          <div key={i} className="text-sm text-gray-500">
            {day}
          </div>
        ))}
        {dates.map((date, i) => (
          <button
            key={i}
            onClick={() => onDateSelect(date)}
            className={`text-sm py-1 rounded-lg ${
              isSameDay(date, selectedDate)
                ? 'bg-black text-white'
                : isSameDay(date, new Date())
                ? 'bg-gray-200'
                : date < new Date()
                ? 'text-gray-400'
                : ''
            }`}
          >
            {format(date, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
} 