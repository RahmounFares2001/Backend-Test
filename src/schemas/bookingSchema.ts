import { z } from 'zod';

const bookingSchema = z.object({
  destination: z.string().min(2),
  travelDate: z.string().date(), // "2025-12-30"
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
});

export const createBookingSchema = bookingSchema;
export const updateBookingSchema = bookingSchema.partial();