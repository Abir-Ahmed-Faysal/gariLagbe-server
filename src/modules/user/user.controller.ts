import { Request, Response } from "express";
import { sendRes } from "../../utilities/sendRes";
import bcrypt from "bcryptjs";
import { userServices } from "./user.service";







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
    const { userId  } = req.params;

    try {
        const result = await userServices.getSingleUer(userId!);

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




export const userController = { getAllUser, updateUser, getSingleUser, deleteUser
};
