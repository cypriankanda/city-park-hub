// src/lib/mock-api.ts
// Very small mock helpers used when VITE_USE_MOCK === 'true'

export interface MockBooking {
  message: string;
  booking: {
    id: number;
    parking_spot_id: number;
    start_time: string;
    end_time: string;
    duration_hours: number;
    status: string;
  };
}

export async function mockCreateBooking(): Promise<MockBooking> {
  const now = Date.now();
  return {
    message: 'Booking created successfully (mock)',
    booking: {
      id: now,
      parking_spot_id: 1,
      start_time: new Date(now).toISOString(),
      end_time: new Date(now + 60 * 60 * 1000).toISOString(),
      duration_hours: 1,
      status: 'active',
    },
  };
}
