"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WellnessCheckFormProps {
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  scheduleTime: string;
  frequency: string;
  notes: string;
}

interface FormErrors {
  scheduleTime?: string;
  frequency?: string;
  notes?: string;
}

export function WellnessCheckForm({
  userId,
  onSuccess,
  onCancel,
}: WellnessCheckFormProps) {
  const [formData, setFormData] = useState<FormData>({
    scheduleTime: "",
    frequency: "daily",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.scheduleTime) {
      newErrors.scheduleTime = "Time is required";
    }
    if (!formData.frequency) {
      newErrors.frequency = "Frequency is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/wellness-checks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          scheduleTime: formData.scheduleTime,
          frequency: formData.frequency,
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule wellness check");
      }

      toast({
        title: "Success",
        description: "Wellness check scheduled successfully",
      });

      onSuccess?.();
    } catch (error) {
      console.error("Error scheduling wellness check:", error);
      toast({
        title: "Error",
        description: "Failed to schedule wellness check. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <TimePicker
          label="Time of Day"
          value={formData.scheduleTime}
          onChange={(time) =>
            setFormData((prev) => ({ ...prev, scheduleTime: time }))
          }
          placeholder="Select time"
          error={errors.scheduleTime}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="frequency">Frequency</Label>
        <Select
          value={formData.frequency}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, frequency: value }))
          }
        >
          <SelectTrigger id="frequency">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        {errors.frequency && (
          <p className="text-sm text-red-500">{errors.frequency}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any additional notes or instructions"
          value={formData.notes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scheduling...
            </>
          ) : (
            "Schedule Check"
          )}
        </Button>
      </div>
    </form>
  );
}
