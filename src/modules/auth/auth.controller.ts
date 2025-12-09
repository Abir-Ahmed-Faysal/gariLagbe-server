import { Request, Response } from "express";
import { authServices } from "./auth.service";
import { sendRes } from "../../utilities/sendRes";
import bcrypt from "bcryptjs";



const signup = async (req: Request, res: Response) => {


    const { name, email, password, phone, role } = req.body;



    if (!name || !email || !password || !phone || !role) {
        return sendRes(res, {
            status: 400,
            success: false,
            message: "Please provide name, email, password & phone number",
            data: null,
        });
    }
    if (!["admin", "customer"].includes(role)) {
        return sendRes(res, {
            status: 400,
            success: false,
            message: "the role would be only 'customer' or 'admin'",
            data: null,
        });
    }

    const lowerCasedEmail = email.toLowerCase();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await authServices.signUp(name, lowerCasedEmail, hashedPassword, phone, role)

        return sendRes(res, {
            status: 201,
            success: true,
            message: "User registered successfully",
            data: result,
        });

    } catch (error: any) {
        console.log(error);

        if (error.code === "23505") {
            return sendRes(res, {
                status: 409,
                success: false,
                message: "Email already exists",
                data: null,
            });
        }

        return sendRes(res, {
            status: 500,
            success: false,
            message: error ? error?.message : "User creation failed due to server error",
            data: null,
        });

    }




}




const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await authServices.loginUserIntoDB(req.body.email, req.body.password)
        return res.status(201).json({
            success: true,
            message: "User created",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: true,
            message: error.message,
        });
    }
}







export const authController = {
    loginUser, signup
}