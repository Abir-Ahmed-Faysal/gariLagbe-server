import { pool } from "../../config/db";


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

  const bookingResult = await pool.query(
    `INSERT INTO bookings 
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  const bookingWithVehicle = await pool.query(
    `SELECT b.id,
        b.customer_id,
        b.vehicle_id,
        TO_CHAR(b.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
        TO_CHAR(b.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
        b.total_price,
        b.status, 
        json_build_object(
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


const updateBookingStatus = async (
  bookingId: string,
  status: "cancelled" | "returned"
) => {
  let finalStatus = status;


  const updatedBooking = await pool.query(
    `UPDATE bookings 
     SET status = $1 
     WHERE id = $2 
     RETURNING *`,
    [finalStatus, bookingId]
  );

  if (updatedBooking.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = updatedBooking.rows[0];


  if (status === "returned") {
    await pool.query(
      `UPDATE vehicles 
       SET availability_status = 'available' 
       WHERE id = $1`,
      [booking.vehicle_id]
    );
  }





  const result = await pool.query(
    `SELECT b.id,
b.customer_id,
b.vehicle_id,
TO_CHAR(b.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
TO_CHAR(b.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
b.total_price,
b.status, 
      json_build_object(
        'availability_status', v.availability_status
      ) AS vehicle
     FROM bookings b
     JOIN vehicles v ON b.vehicle_id = v.id
     WHERE b.id = $1`,
    [bookingId]
  );

  return result.rows[0];
};



const getAllBookings = async (userId: number, role: 'admin' | 'customer') => {
  await autoReturnExpiredBookings();

  let query = '';
  let params: any[] = [];

  if (role === 'admin') {
    query = `
  SELECT 
    b.id,
    b.customer_id,
    b.vehicle_id,
    b.total_price,
    b.status,
    b.rent_start_date::date AS rent_start_date,
    b.rent_end_date::date AS rent_end_date,
    json_build_object('name', u.name, 'email', u.email) AS customer,
    json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) AS vehicle
  FROM bookings b
  JOIN users u ON b.customer_id = u.id
  JOIN vehicles v ON b.vehicle_id = v.id
  ORDER BY b.rent_start_date DESC
`;
  } else {
    query = `
  SELECT 
    b.id,
    b.customer_id,
    b.vehicle_id,
    b.total_price,
    b.status,
    b.rent_start_date::date AS rent_start_date,
    b.rent_end_date::date AS rent_end_date,
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



const getSingleBooking = async (bookingId: string) => {


  try {
    const result = await pool.query(`
    SELECT customer_id,status FROM bookings
      WHERE id=$1`, [bookingId])

    return result

  } catch (error: any) {
    console.log(error?.message);
    throw new Error(error?.message || "database error")
  }
}


export const bookingServices = {
  getAllBookings, updateBookingStatus, autoReturnExpiredBookings, createBooking,
  getSingleBooking
}