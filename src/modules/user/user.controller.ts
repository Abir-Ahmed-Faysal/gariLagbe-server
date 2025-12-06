import { Request, Response } from "express";
import { sendRes } from "../../utilities/sendRes";
import {pool} from "../../config/db";
import bcrypt from "bcryptjs";

const createUser = async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;


  if (!name || !email || !password || !phone) {
    return sendRes(res, {
      status: 400,
      success: false,
      message: "Please provide name, email, password & phone number",
      data: null,
    });
  }

  const lowerCasedEmail = email.toLowerCase();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (name, email, password, phone)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, phone, created_at, updated_at
      `,
      [name, lowerCasedEmail, hashedPassword, phone]
    );

    return sendRes(res, {
      status: 201,
      success: true,
      message: "User created successfully",
      data: result.rows[0],
    });

  } catch (error: any) {
    console.log(error.message);
    return sendRes(res, {
      status: 500,
      success: false,
      message: "User creation failed due to server error",
      data: null,
    });
  }
};

export const userController = {
  createUser,
};
