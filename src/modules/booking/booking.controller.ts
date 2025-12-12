import { Request, Response } from "express";
import { sendRes } from "../../utilities/sendRes";
import { bookingServices } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";



export const newBooking = async (req: Request, res: Response) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;



  const decodedUser = req.user as JwtPayload
  if (decodedUser.id.toString() !== customer_id.toString() && decodedUser.role !== 'admin') {

    return sendRes(res, {
      status: 400,
      success: false,
      message: `bad response`,
      errors:"failed to add a booking due to wrong customer id",
    });
  }

  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    return sendRes(res, { status: 400, success: false, message: 'bad request',errors:"all field are required " });
  }

  try {
    const booking = await bookingServices.createBooking(customer_id, vehicle_id, rent_start_date, rent_end_date);
    return sendRes(res, { status: 201, success: true, message: 'Booking created successfully', data: booking });
  } catch (err: any) {
    console.log(err.message);
    return sendRes(res, { status: 500, success: false, message: 'Booking creation failed',errors:"server error" });
  }
};

export const getAllBooking = async (req: Request, res: Response) => {
  const decodedUser = req.user as JwtPayload
  const userId = decodedUser.id
  const role = decodedUser.role;

  try {
    const bookings = await bookingServices.getAllBookings(userId, role);


    return sendRes(res, { status: 200, success: true, message: role === 'admin' ? 'Bookings retrieved successfully' : 'Your bookings retrieved successfully', data: bookings });
  } catch (err: any) {
    console.log(err.message);
    return sendRes(res, { status: 500, success: false, message: 'Failed to fetch bookings',errors:'server error' });
  }
};




export const updateBooking = async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId as string;
  const decodedUser = req.user as JwtPayload;
  const { status } = req.body;
  if(!status){

return sendRes(res, {
      status: 400,
      success: false,
      message: "your status is missing",
      errors: "the status must be included"
    });

  }


  const bookingResult = await bookingServices.getSingleBooking(bookingId);
  const booking = bookingResult.rows[0];
  
  if (!booking) {
    return sendRes(res, {
      status: 400,
      success: false,
      message: "no Booking found",
      errors: "the booking  data not exist on the database",
    });
  }


  if (["cancelled", "returned"].includes(booking.status)) {

    return sendRes(res, {
      status: 403,
      success: false,
      message: "This booking already stopped",
      errors: "the booking not available",
    });
  }


  const isOwner = decodedUser.id == booking.customer_id;
  const isAdmin = decodedUser.role === "admin";

  if (!isAdmin && !isOwner) {
    return sendRes(res, {
      status: 403,
      success: false,
      message: "You are not allowed to update this booking",
      errors: "you must have to registered",
    });
  }

  if (isOwner && !isAdmin && status !== "cancelled") {
    return sendRes(res, {
      status: 403,
      success: false,
      message: "Customers can only cancel bookings",
      errors: "customer can only cancel the booking",
    });
  }


  if (isAdmin && status !== "returned") {
    return sendRes(res, {
      status: 403,
      success: false,
      message: "Admin can only mark bookings as returned",
      errors:"admin can only change booking status as returned",
    });
  }


  if (!["cancelled", "returned"].includes(status)) {
    return sendRes(res, {
      status: 400,
      success: false,
      message: "Invalid status",
      errors:"the booking status must be only 'cancelled' or 'returned'"
    });
  }

  try {
    const updatedBooking = await bookingServices.updateBookingStatus(
      bookingId,
      status
    );

    const msg =
      status === "cancelled"
        ? "Booking cancelled successfully"
        : "Booking marked as returned. Vehicle is now available";

    return sendRes(res, {
      status: 200,
      success: true,
      message: msg,
      data: updatedBooking,
    });
  } catch (err: any) {
    console.log(err.message);
    return sendRes(res, {
      status: 500,
      success: false,
      message: "Failed to update booking",
      errors:"server error"
    });
  }
};


export const bookingController = {
  newBooking, getAllBooking, updateBooking
}