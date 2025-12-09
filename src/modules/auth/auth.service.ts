import bcrypt from "bcryptjs";
import jwt, { sign } from "jsonwebtoken";
import { pool } from "../../config/db";
import config from "../../config";

export const secret = config.secret as string


const signUp = async (
  name: string,
  lowerCasedEmail: string,
  hashedPassword: string,
  phone: string,
  role: string
) => {
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



const loginUserIntoDB = async (email: string, payloadPassword: string) => {
    const user = await pool.query(
        `
        SELECT * FROM users WHERE email=$1
        `,
        [email]
    );


    if (user.rows.length === 0) {
        throw new Error("User not found!");
    }
    const matchPassword = await bcrypt.compare(payloadPassword, user.rows[0].password);

    if (!matchPassword) {
        throw new Error("Invalid Credentials!");
    }
    const jwtPayload = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
    };

    const token = jwt.sign(jwtPayload, secret, { expiresIn: "7d" });
    const {password,...rest}= user.rows[0]

    return { token, user: rest };
};




export const authServices = {
    loginUserIntoDB,signUp 
};