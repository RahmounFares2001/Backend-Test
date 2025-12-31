import { Router } from 'express';
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../controllers/bookingController.js';
import secureUpload from '../middlewares/upload.js';

import { rateLimiter } from '../middlewares/rateLimiter.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createBookingSchema, updateBookingSchema } from '../schemas/bookingSchema.js';

const router = Router();


// GET all bookings
router.get('/', getBookings);

// GET one booking by ID
router.get('/:id', getBookingById);

// CREATE booking, rate limited, upload, validation
router.post(
  '/',
  rateLimiter,           
  secureUpload,          
  validateBody(createBookingSchema),
  createBooking
);

// UPDATE booking - rate limited + optional upload + validation
router.put(
  '/:id',
  rateLimiter,
  secureUpload,         
  validateBody(updateBookingSchema),
  updateBooking
);

// DELETE booking
router.delete('/:id', deleteBooking);

export default router;