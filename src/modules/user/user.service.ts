import { pool } from "../../config/db";

interface UserResult {
  id?: string,
  name: string;
  email: string;
  phone: string;
  role: string;
}


const signUp = async (
  name: string,
  lowerCasedEmail: string,
  hashedPassword: string,
  phone: string,
  role: string
): Promise<UserResult> => {
  const result = await pool.query(
    `
      INSERT INTO users (name, email, password, phone, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, phone, role
    `,
    [name, lowerCasedEmail, hashedPassword, phone, role]
  );

  return result.rows[0];
};


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




export const userServices = { signUp , getAllUserLogic, updateLogic, getSingleUer };
