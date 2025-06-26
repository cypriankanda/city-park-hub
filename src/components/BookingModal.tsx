import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { bookingApi } from '@/lib/api-client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ParkingSpot } from '@/lib/api-client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const formSchema = z.object({
  startTime: z.string().min(1, {
    message: "Start time is required",
  }),
  endTime: z.string().min(1, {
    message: "End time is required",
  }),
}).refine((data) => {
  if (data.startTime && data.endTime) {
    const start = parse(data.startTime, 'HH:mm', new Date());
    const end = parse(data.endTime, 'HH:mm', new Date());
    return end > start;
  }
  return true;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

type FormValues = z.infer<typeof formSchema>;

interface BookingModalProps {
  spot: ParkingSpot;
  isOpen: boolean;
  onClose: () => void;
  localKw: string;
  onSuccess?: () => void;
}

export function BookingModal({ spot, isOpen, onClose, localKw, onSuccess }: BookingModalProps) {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startTime: format(new Date(), "HH:mm"),
      endTime: format(new Date(new Date().getTime() + 2 * 60 * 60 * 1000), "HH:mm"),
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!selectedDate) return;
    setIsLoading(true);
    setError("");
    try {
      // Combine date and time inputs
      const startDateTime = new Date(selectedDate);
      const endDateTime = new Date(selectedDate);
      
      // Set hours and minutes from time inputs
      const [startHour, startMinute] = values.startTime.split(':').map(Number);
      const [endHour, endMinute] = values.endTime.split(':').map(Number);
      
      startDateTime.setHours(startHour, startMinute, 0, 0);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      // Ensure dates are in UTC format
      const startUTC = new Date(Date.UTC(
        startDateTime.getUTCFullYear(),
        startDateTime.getUTCMonth(),
        startDateTime.getUTCDate(),
        startDateTime.getUTCHours(),
        startDateTime.getUTCMinutes(),
        startDateTime.getUTCSeconds()
      ));

      const endUTC = new Date(Date.UTC(
        endDateTime.getUTCFullYear(),
        endDateTime.getUTCMonth(),
        endDateTime.getUTCDate(),
        endDateTime.getUTCHours(),
        endDateTime.getUTCMinutes(),
        endDateTime.getUTCSeconds()
      ));

      const bookingData = {
        parking_space_id: spot.id,
        start_time: startUTC,
        end_time: endUTC,
        duration_hours: Math.round((endUTC.getTime() - startUTC.getTime()) / (60 * 60 * 1000)),
        local_kw: localKw
      };

      console.log('Booking data:', {
        parking_space_id: bookingData.parking_space_id,
        start_time: startUTC.toISOString(),
        end_time: endUTC.toISOString(),
        duration_hours: bookingData.duration_hours,
        local_kw: bookingData.local_kw
      });

      const response = await bookingApi.create(bookingData);
      console.log('Booking response:', response);
      
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      onClose();
      onSuccess?.();
    } catch (error: any) {
      console.error('Booking error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      
      setError(error.message || 'Failed to create booking');
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Parking Spot</DialogTitle>
          <DialogDescription>
            Book a parking spot at {spot.name}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          type="time"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            const time = new Date();
                            time.setHours(parseInt(e.target.value.split(":")[0]));
                            time.setMinutes(parseInt(e.target.value.split(":")[1]));
                            setStartTime(time);
                          }}
                          disabled={!selectedDate}
                        />
                      </FormControl>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="time"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          const time = new Date();
                          time.setHours(parseInt(e.target.value.split(":")[0]));
                          time.setMinutes(parseInt(e.target.value.split(":")[1]));
                          setEndTime(time);
                        }}
                        disabled={!selectedDate || !startTime}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Booking..." : "Book Now"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}