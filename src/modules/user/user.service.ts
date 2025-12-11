import { pool } from "../../config/db";




const getAllUserLogic = async () => {
  const result = await pool.query(`
  SELECT id,name, email, phone, role FROM users
  `)
  return result;
}


const getSingleUer = async (userId: string) => {
  try {

    const result = await pool.query(`
  SELECT id,name, email, phone, role FROM users WHERE id=$1
  `, [userId])
    return result;

  } catch (error: any) {

    console.error("Database error (getSingleUser):", error?.message);
    throw new Error("Failed to fetch user");
  }
}


const updateUser = async (vehicleId: string, payload: { [key: string]: any }) => {

  const keys = Object.keys(payload);

  if (keys.length < 1) {
    throw new Error("You must provide update fields");
  }


  const setQuery = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

  const values = Object.values(payload);

  values.push(vehicleId);

  const result = await pool.query(
    `
        UPDATE users 
        SET ${setQuery} 
        WHERE id = $${values.length}
        RETURNING *
        `,
    values
  );


  return result;
};


const deleteUser = async (id: string) => {
  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1`,
      [id]
    );

    return result;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to delete user");
  }
};



const getBookingStatus = async (id: string) => {
  try {
    const result = await pool.query(
      `SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'`,
      [id]
    );

    return result;
  } catch (error: any) {
    console.log(error?.message);
    throw new Error(error?.message || 'Database error fetching booking status');
  }
};




export const userServices = {
  getAllUserLogic,
  updateUser,
  deleteUser,
  getSingleUer,
  getBookingStatus,
};
