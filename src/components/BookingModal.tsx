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
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { bookingApi } from '@/lib/api-client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  startTime: z.string().min(1, {
    message: "Start time is required",
  }),
  endTime: z.string().min(1, {
    message: "End time is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface BookingModalProps {
  spot: ParkingSpot;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ spot, isOpen, onClose }: BookingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startTime: "",
      endTime: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!selectedDate || !startTime || !endTime) return;

    setIsLoading(true);
    try {
      await bookingApi.create({
        spotId: spot.id,
        startTime: format(startTime, "yyyy-MM-dd'T'HH:mm:ss"),
        endTime: format(endTime, "yyyy-MM-dd'T'HH:mm:ss"),
        durationHours: Math.abs((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)),
      });
      onClose();
    } catch (error) {
      console.error("Booking failed:", error);
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
                          value={startTime ? format(startTime, "HH:mm") : ""}
                          onChange={(e) => {
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
                        value={endTime ? format(endTime, "HH:mm") : ""}
                        onChange={(e) => {
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
