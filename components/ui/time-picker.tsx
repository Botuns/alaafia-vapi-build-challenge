"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
}

export function TimePicker({
  value,
  onChange,
  label,
  placeholder = "Select time",
  error,
  className,
}: TimePickerProps) {
  const [time, setTime] = React.useState(value);

  // Convert 24h time to 12h format
  const formatTime = (time24: string) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Convert 12h time to 24h format
  const parseTime = (time12: string) => {
    if (!time12) return "";
    const [time, period] = time12.split(" ");
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    onChange(formatTime(newTime));
  };

  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start text-left font-normal ${
              !value && "text-muted-foreground"
            }`}
          >
            <Clock className="mr-2 h-4 w-4" />
            {value || placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-2">
            <Input
              type="time"
              value={parseTime(value)}
              onChange={handleTimeChange}
              className="w-full"
            />
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
