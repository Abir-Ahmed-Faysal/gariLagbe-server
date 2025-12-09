import { pool } from "../../config/db";

// Auto-return expired bookings
export const autoReturnExpiredBookings = async () => {
  const expiredBookings = await pool.query(`
    SELECT id, vehicle_id
    FROM bookings
    WHERE status = 'active' AND rent_end_date < NOW()
  `);

  for (const booking of expiredBookings.rows) {
    await pool.query(
      `UPDATE bookings SET status = 'returned' WHERE id = $1`,
      [booking.id]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );
  }

  return expiredBookings.rows.length;
};

// Create new booking
const createBooking = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string
) => {
  
  const vehicle = await pool.query(
    `SELECT daily_rent_price FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );
  
  
  const dailyPrice = vehicle.rows[0].daily_rent_price;
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
  const total_price = dailyPrice * dayCount;



  // Insert booking
  const bookingResult = await pool.query(
    `INSERT INTO bookings 
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  // Update vehicle status to booked
  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  // Return booking with nested vehicle info
  const bookingWithVehicle = await pool.query(
    `SELECT b.*, json_build_object(
        'vehicle_name', v.vehicle_name,
        'daily_rent_price', v.daily_rent_price
      ) AS vehicle
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.id = $1`,
    [bookingResult.rows[0].id]
  );

  return bookingWithVehicle.rows[0];
};

// Update booking status (cancel/return)
const updateBookingStatus = async (bookingId: number, status: 'cancelled' | 'returned') => {
  // Update booking
  const booking = await pool.query(
    `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
    [status, bookingId]
  );

  // Update vehicle availability if cancelled or returned
  if (status === 'cancelled' || status === 'returned') {
    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.rows[0].vehicle_id]
    );
  }

  // Return updated booking with vehicle info
  const updatedBooking = await pool.query(
    `SELECT b.*, json_build_object(
        'availability_status', v.availability_status
      ) AS vehicle
     FROM bookings b
     JOIN vehicles v ON b.vehicle_id = v.id
     WHERE b.id = $1`,
    [bookingId]
  );

  return updatedBooking.rows[0];
};

// Get all bookings (auto-return logic included)
 const getAllBookings = async (userId: number, role: 'admin' | 'customer') => {
  await autoReturnExpiredBookings();

  let query = '';
  let params: any[] = [];

  if (role === 'admin') {
    query = `
      SELECT b.*, 
        json_build_object('name', u.name, 'email', u.email) AS customer,
        json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) AS vehicle
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.rent_start_date DESC
    `;
  } else {
    query = `
      SELECT b.*, 
        json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number, 'type', v.type) AS vehicle
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.rent_start_date DESC
    `;
    params = [userId];
  }

  const result = await pool.query(query, params);
  return result.rows;
};




export const  bookingServices={
  getAllBookings,updateBookingStatus,autoReturnExpiredBookings,createBooking,
}