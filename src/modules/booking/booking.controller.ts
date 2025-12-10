import { Request, Response } from "express";
import { sendRes } from "../../utilities/sendRes";
import { bookingServices } from "./booking.service";



export const newBooking = async (req: Request, res: Response) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;

  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    return sendRes(res, { status: 400, success: false, message: 'All fields are required' });
  }

  try {
    const booking = await bookingServices.createBooking(customer_id, vehicle_id, rent_start_date, rent_end_date);
    return sendRes(res, { status: 201, success: true, message: 'Booking created successfully', data: booking });
  } catch (err: any) {
    console.log(err.message);
    return sendRes(res, { status: 500, success: false, message: 'Booking creation failed' });
  }
};

export const getAllBooking = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const role = (req.user as any).role;

  try {
    const bookings = await bookingServices.getAllBookings(userId, role);


    return sendRes(res, { status: 200, success: true, message: role === 'admin' ? 'Bookings retrieved successfully' : 'Your bookings retrieved successfully', data: bookings });
  } catch (err: any) {
    console.log(err.message);
    return sendRes(res, { status: 500, success: false, message: 'Failed to fetch bookings' });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  const bookingId = parseInt(req.params.bookingId as string);
  const { status } = req.body;

  if (!['cancelled', 'returned'].includes(status)) {
    return sendRes(res, { status: 400, success: false, message: 'Invalid status' });
  }

  try {
    const updatedBooking = await bookingServices.updateBookingStatus(bookingId, status);
    const msg = status === 'cancelled' ? 'Booking cancelled successfully' : 'Booking marked as returned. Vehicle is now available';
    return sendRes(res, { status: 200, success: true, message: msg, data: updatedBooking });
  } catch (err: any) {
    console.log(err.message);
    return sendRes(res, { status: 500, success: false, message: 'Failed to update booking' });
  }
};

export const bookingController = {
  newBooking, getAllBooking, updateBooking
}