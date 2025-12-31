import { z } from 'zod';

const bookingSchema = z.object({
  destination: z.string().min(2, 'Destination must be at least 2 characters'),
  travelDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, use YYYY-MM-DD'),
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
  attachmentPath: z.string().optional(), // optional
});

export const createBookingSchema = bookingSchema.omit({
  attachmentPath: true,
});

export const updateBookingSchema = bookingSchema
  .omit({ attachmentPath: true })
  .partial();