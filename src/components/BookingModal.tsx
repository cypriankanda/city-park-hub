import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parse } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { bookingApi } from '@/lib/api-client';
import { mockCreateBooking } from '@/lib/mock-api';
import { ParkingSpot } from '@/lib/api-client';
import { toast } from 'sonner';

const formSchema = z.object({
  startTime: z.string().min(1, {
    message: "Start time is required",
  }),
  endTime: z.string().min(1, {
    message: "End time is required",
  }),
}).refine((data) => {
  const start = parse(data.startTime, 'HH:mm', new Date());
  const end = parse(data.endTime, 'HH:mm', new Date());
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"]
});

type FormValues = z.infer<typeof formSchema>;

interface BookingModalProps {
  spot: ParkingSpot;
  isOpen: boolean;
  onClose: () => void;
  localKw?: string;
  onSuccess?: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  spot,
  isOpen,
  onClose,
  localKw,
  onSuccess
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>(format(new Date(), 'HH:mm'));
  const [endTime, setEndTime] = useState<string>(format(new Date(new Date().getTime() + 2 * 60 * 60 * 1000), 'HH:mm'));

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startTime: format(new Date(), 'HH:mm'),
      endTime: format(new Date(new Date().getTime() + 2 * 60 * 60 * 1000), 'HH:mm')
    }
  });

  const useMock = import.meta.env.VITE_USE_MOCK === 'true';
  const onSubmit = async (data: FormValues) => {
    try {
      // If selectedDate exists, use it as the base date
      const baseDate = selectedDate || new Date();
      
      // Get hours and minutes from form values
      const [startHour, startMinute] = data.startTime.split(':').map(Number);
      const [endHour, endMinute] = data.endTime.split(':').map(Number);

      // Create date objects with the selected date and form times
      const startDateTime = new Date(baseDate);
      const endDateTime = new Date(baseDate);
      
      startDateTime.setHours(startHour, startMinute, 0, 0);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      // Calculate duration in hours
      const durationHours = Math.round((endDateTime.getTime() - startDateTime.getTime()) / (60 * 60 * 1000));

      const bookingData = {
        parking_space_id: spot.id,
        start_time: startDateTime.toISOString().replace('T', ' ').substring(0, 19),
        end_time: endDateTime.toISOString().replace('T', ' ').substring(0, 19),
        duration_hours: durationHours,
        local_kw: localKw || 'NAIROBI'
      };

      setIsLoading(true);
      if (useMock) {
        await mockCreateBooking();
      } else {
        await bookingApi.create(bookingData, "NAIROBI");
      }
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      onClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Booking error:', error);
      
      // Extract error details if available
      let errorMessage = 'Failed to create booking';
      
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          const errorDetails = error.response.data.detail.map((err: any) => {
            if (typeof err === 'string') return err;
            if (err.loc && err.msg) return `${err.loc.join('.')}: ${err.msg}`;
            if (err.type && err.msg) return `${err.type}: ${err.msg}`;
            if (err.msg) return err.msg;
            if (err.detail) return err.detail;
            if (err.error) return err.error;
            return 'Unknown error';
          });
          errorMessage = errorDetails.join(', ');
        } else if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Parking Space</DialogTitle>
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
                  <FormControl>
                    <Input
                      type="time"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setStartTime(e.target.value);
                      }}
                    />
                  </FormControl>
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
                  <FormControl>
                    <Input
                      type="time"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setEndTime(e.target.value);
                      }}
                      disabled={!selectedDate || !startTime}
                    />
                  </FormControl>
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
};

export { BookingModal };