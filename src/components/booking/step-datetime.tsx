"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay, isPast, isToday } from "date-fns";
import { cn } from "@/lib/design-system";

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM",
];

interface StepDateTimeProps {
  date: string;
  time: string;
  onUpdate: (field: string, value: string) => void;
}

export function StepDateTime({ date, time, onUpdate }: StepDateTimeProps) {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const prevWeek = () => setWeekStart((prev) => addDays(prev, -7));
  const nextWeek = () => setWeekStart((prev) => addDays(prev, 7));

  return (
    <div>
      <h4 className="text-lg font-bold text-primary mb-4">When would you like to visit?</h4>
      <p className="text-sm text-text-muted mb-6">Pick your preferred date and time.</p>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevWeek}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors text-text-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-text">
            {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
          </span>
          <button
            onClick={nextWeek}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors text-text-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {weekDays.map((day) => {
            const isSelected = date === format(day, "yyyy-MM-dd");
            const isDisabled = isPast(day) && !isToday(day);

            return (
              <motion.button
                key={day.toISOString()}
                whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                disabled={isDisabled}
                onClick={() => !isDisabled && onUpdate("date", format(day, "yyyy-MM-dd"))}
                className={cn(
                  "flex flex-col items-center rounded-lg sm:rounded-xl py-2 sm:py-3 px-0.5 sm:px-1 transition-all duration-200",
                  isSelected
                    ? "bg-gradient-premium text-white shadow-premium"
                    : isDisabled
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-muted text-text"
                )}
              >
                <span className="text-[9px] sm:text-[10px] uppercase font-medium">
                  {format(day, "EEE")}
                </span>
                <span className="text-base sm:text-lg font-bold">{format(day, "d")}</span>
                <span className="text-[9px] sm:text-[10px]">{format(day, "MMM")}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {date && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-secondary" />
            <h5 className="text-sm font-semibold text-text">Available Time Slots</h5>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {timeSlots.map((slot) => {
              const isSelected = time === slot;
              return (
                <motion.button
                  key={slot}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpdate("time", slot)}
                  className={cn(
                    "rounded-lg py-2.5 px-2 text-sm font-medium transition-all duration-200",
                    isSelected
                      ? "bg-secondary text-white shadow-premium"
                      : "bg-muted text-text-muted hover:bg-muted/80"
                  )}
                >
                  {slot}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
