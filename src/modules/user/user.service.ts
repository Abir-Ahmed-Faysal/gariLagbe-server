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


const updateLogic = async () => {
}




export const userServices = {getAllUserLogic,  updateLogic, getSingleUer };
