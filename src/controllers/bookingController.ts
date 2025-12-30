import type { Request, Response } from "express";
import prisma from "../config/prisma.js";


// Get bookings
export const getBookings = async (req: Request, res: Response) => {
  try {
    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter 
    const filter: any = {};
    if (req.query.destination) {
      filter.destination = { contains: req.query.destination as string };
    }
    if (req.query.status) {
      filter.status = req.query.status as string;
    }

    // Sort 
    let sort: any = { createdAt: 'desc' };
    if (req.query.sort) {
      sort = {};
      const fields = (req.query.sort as string).split(',');
      fields.forEach((field: string) => {
        if (field.startsWith('-')) {
          sort[field.slice(1)] = 'desc';
        } else {
          sort[field] = 'asc';
        }
      });
    }

    // get bookings
    const bookings = await prisma.booking.findMany({
      where: filter,
      orderBy: sort,
      skip,
      take: limit,
    });

    const total = await prisma.booking.count({ where: filter });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// get booking by id
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // check if its not a num
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

    // get booking
    const booking = await prisma.booking.findUnique({ where: { id } });

    // if there is no booking
    if (!booking) return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// create booking
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { destination, travelDate, status } = req.body;


    // create booking
    const booking = await prisma.booking.create({
      data: {
        destination,
        travelDate: new Date(travelDate),
        status: status || 'pending',
        attachmentPath: req.filePath || null, // filePath from upload middlware
      },
    });

    res.status(201).json({
      success: true,
      message: 'Booking created',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create' });
  }
};


// update booking
export const updateBooking = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    // check if id is valid
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

    // get what data would be updated
    const data: any = {};
    if (req.body.destination) data.destination = req.body.destination;
    if (req.body.travelDate) data.travelDate = new Date(req.body.travelDate);
    if (req.body.status) data.status = req.body.status;
    if (req.filePath) data.attachmentPath = req.filePath;

    // update booking
    const booking = await prisma.booking.update({
      where: { id },
      data,
    });

    res.json({
      success: true,
      message: 'Booking updated',
      data: booking,
    });
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Not found' });
    res.status(500).json({ success: false, message: 'Failed to update' });
  }
};


// delete booking
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    // check if id is valid
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

    // delete booking
    await prisma.booking.delete({ where: { id } });

    res.json({ success: true, message: 'Booking deleted' });
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Not found' });
    res.status(500).json({ success: false, message: 'Failed to delete' });
  }
};