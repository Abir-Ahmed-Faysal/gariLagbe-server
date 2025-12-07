import { Request, Response } from "express";
import { sendRes } from "../../utilities/sendRes";
import bcrypt from "bcryptjs";
import { userServices } from "./user.service";



const createUser = async (req: Request, res: Response) => {
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

        const result = await userServices.newUserCreate(name, lowerCasedEmail, hashedPassword, phone, role)

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
};



const getAllUser = async (req: Request, res: Response) => {

    try {
        const result = await userServices.getAllUserLogic()

        return sendRes(res, {
            status: 200,
            success: true,
            message: "User fetch successfully",
            data: result?.rows,
        });

    } catch (error) {
        return sendRes(res, {
            status: 500,
            success: false,
            message: "users failed to fetch",
            data: null
        });
    }
}



const getSingleUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await userServices.getSingleUer(id!);

        if (!result || result.rows.length === 0) {
            return sendRes(res, {
                status: 404,
                success: false,
                message: "User not found",
                data: null,
            });
        }

        return sendRes(res, {
            status: 200,
            success: true,
            message: "User fetched successfully",
            data: result.rows[0], 
        });

    } catch (error: any) {
        console.log("Error fetching user:", error.message);

        return sendRes(res, {
            status: 500,
            success: false,
            message: "Failed to fetch user",
            data: null,
        });
    }
};



const updateUser = async (req: Request, res: Response) => {

    // const result =





}



const deleteUser = async (req: Request, res: Response) => {

    // const result =





}




export const userController = {
    createUser, getAllUser, updateUser, getSingleUser, deleteUser
};
