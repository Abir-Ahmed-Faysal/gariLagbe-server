import { pool } from "../../config/db";

interface UserResult {
  name: string;
  email: string;
  phone: string;
  role: string;
}

const newUserCreate = async (
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

export default newUserCreate;
