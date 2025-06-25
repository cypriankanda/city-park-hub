// import { useState } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { CalendarIcon } from "lucide-react";
// import { format } from "date-fns";
// import { Calendar } from "@/components/ui/calendar";
// import { cn } from "@/lib/utils";
// import { bookingApi } from '@/lib/api-client';
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";

// const formSchema = z.object({
//   startTime: z.string().min(1, {
//     message: "Start time is required",
//   }),
//   endTime: z.string().min(1, {
//     message: "End time is required",
//   }),
// });

// type FormValues = z.infer<typeof formSchema>;

// interface BookingModalProps {
//   spot: ParkingSpot;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function BookingModal({ spot, isOpen, onClose }: BookingModalProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<Date>();
//   const [startTime, setStartTime] = useState<Date>();
//   const [endTime, setEndTime] = useState<Date>();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       startTime: "",
//       endTime: "",
//     },
//   });

//   const onSubmit = async (values: FormValues) => {
//     if (!selectedDate || !startTime || !endTime) return;

//     setIsLoading(true);
//     try {
//       await bookingApi.create({
//         spotId: spot.id,
//         startTime: format(startTime, "yyyy-MM-dd'T'HH:mm:ss"),
//         endTime: format(endTime, "yyyy-MM-dd'T'HH:mm:ss"),
//         durationHours: Math.abs((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)),
//       });
//       onClose();
//     } catch (error) {
//       console.error("Booking failed:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Book Parking Spot</DialogTitle>
//           <DialogDescription>
//             Book a parking spot at {spot.name}
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="startTime"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Start Time</FormLabel>
//                   <div className="flex flex-col gap-2">
//                     <div className="flex items-center gap-2">
//                       <CalendarIcon className="h-4 w-4 text-gray-400" />
//                       <Calendar
//                         mode="single"
//                         selected={selectedDate}
//                         onSelect={setSelectedDate}
//                         disabled={(date) => date < new Date()}
//                         className="rounded-md border"
//                       />
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <FormControl>
//                         <Input
//                           type="time"
//                           value={startTime ? format(startTime, "HH:mm") : ""}
//                           onChange={(e) => {
//                             const time = new Date();
//                             time.setHours(parseInt(e.target.value.split(":")[0]));
//                             time.setMinutes(parseInt(e.target.value.split(":")[1]));
//                             setStartTime(time);
//                           }}
//                           disabled={!selectedDate}
//                         />
//                       </FormControl>
//                     </div>
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="endTime"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>End Time</FormLabel>
//                   <div className="flex items-center gap-2">
//                     <FormControl>
//                       <Input
//                         type="time"
//                         value={endTime ? format(endTime, "HH:mm") : ""}
//                         onChange={(e) => {
//                           const time = new Date();
//                           time.setHours(parseInt(e.target.value.split(":")[0]));
//                           time.setMinutes(parseInt(e.target.value.split(":")[1]));
//                           setEndTime(time);
//                         }}
//                         disabled={!selectedDate || !startTime}
//                       />
//                     </FormControl>
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <div className="flex justify-end space-x-2">
//               <Button variant="outline" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isLoading}>
//                 {isLoading ? "Booking..." : "Book Now"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
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
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { bookingApi } from '@/lib/api-client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from '@tanstack/react-query';

const formSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
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

interface ParkingSpot {
  id: number;
  name: string;
}

interface BookingModalProps {
  spot: ParkingSpot;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ spot, isOpen, onClose }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [error, setError] = useState<string>("");
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startTime: "",
      endTime: "",
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!selectedDate) {
        throw new Error("Please select a date");
      }

      // Combine selected date with time inputs
      const startDateTime = new Date(selectedDate);
      const [startHour, startMinute] = values.startTime.split(':').map(Number);
      startDateTime.setHours(startHour, startMinute, 0, 0);

      const endDateTime = new Date(selectedDate);
      const [endHour, endMinute] = values.endTime.split(':').map(Number);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      // Calculate duration in hours
      const durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);

      if (durationHours <= 0) {
        throw new Error("End time must be after start time");
      }

      // Call API with correct field names matching your FastAPI endpoint
      return bookingApi.create({
        parking_space_id: spot.id,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        duration_hours: durationHours,
        local_kw: 'NAIROBI' // Add the required local_kw parameter
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setError("");
      form.reset();
      setSelectedDate(undefined);
      setDuration(0);
      onClose();
    },
    onError: (error: any) => {
      let errorMessage = 'Failed to create booking';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
  });

  const onSubmit = (values: FormValues) => {
    setError("");
    createBookingMutation.mutate(values);
  };

  const handleClose = () => {
    setError("");
    form.reset();
    setSelectedDate(undefined);
    onClose();
  };

  // Calculate duration for display
  const calculateDuration = () => {
    const startTime = form.watch('startTime');
    const endTime = form.watch('endTime');
    
    if (startTime && endTime && selectedDate) {
      const start = new Date(selectedDate);
      const [startHour, startMinute] = startTime.split(':').map(Number);
      start.setHours(startHour, startMinute);
      
      const end = new Date(selectedDate);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      end.setHours(endHour, endMinute);
      
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return hours > 0 ? hours : 0;
    }
    return 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Parking Spot</DialogTitle>
          <DialogDescription>
            Reserve your parking spot at {spot.name}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Date</label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  className="rounded-md border"
                />
              </div>
              {selectedDate && (
                <p className="text-sm text-gray-600 text-center">
                  Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </p>
              )}
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        disabled={!selectedDate}
                        className="w-full"
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
                        {...field}
                        disabled={!selectedDate || !form.watch('startTime')}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Duration Display */}
            {calculateDuration() > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Duration:</strong> {calculateDuration().toFixed(1)} hours
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleClose} type="button">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createBookingMutation.isPending || !selectedDate}
                className="min-w-[100px]"
              >
                {createBookingMutation.isPending ? "Booking..." : "Book Now"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}