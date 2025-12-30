// src/schemas/bookingSchema.ts
import { z } from 'zod';

const bookingSchema = z.object({
  destination: z.string().min(2, 'Destination must be at least 2 characters'),
  travelDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, use YYYY-MM-DD'),
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
  attachmentPath: z.string().optional(), // optional, but we ignore it if sent (we set it from upload)
});

export const createBookingSchema = bookingSchema.refine((data) => {
  // Ignore attachmentPath if sent — we use the uploaded one
  return true;
}, {
  message: "attachmentPath is managed by the server",
  path: ["attachmentPath"],
});

export const updateBookingSchema = bookingSchema.partial();