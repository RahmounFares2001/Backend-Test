import { Router } from 'express';
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../controllers/bookingController.js';
import secureUpload from '../middlewares/upload.js';

// import { rateLimiter } from '../middlewares/rateLimiter';
// import { validate } from '../middlewares/validate';
// import { createBookingSchema, updateBookingSchema } from '../schemas/bookingSchema';

const router = Router();


// GET all bookings
router.get('/', getBookings);

// GET one booking by ID
router.get('/:id', getBookingById);

// CREATE booking, rate limited, upload, validation
router.post(
  '/',
//   rateLimiter,           
  secureUpload,          
//   validate(createBookingSchema),
  createBooking
);

// UPDATE booking - rate limited + optional upload + validation
router.put(
  '/:id',
//   rateLimiter,
  secureUpload,         
//   validate(updateBookingSchema),
  updateBooking
);

// DELETE booking
router.delete('/:id', deleteBooking);

export default router;