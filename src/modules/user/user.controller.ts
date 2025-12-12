import { Request, Response } from "express";
import { sendRes } from "../../utilities/sendRes";
import { userServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";
import { cleanPayload } from "../../utilities/cleaningPayload";



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
    const { userId } = req.params;
    const loggedInUser = req.user as JwtPayload;

    if (loggedInUser.id !== userId && !["admin", "customer"].includes(loggedInUser.role)) {
        return res.status(403).json({
            success: false,
            message: "access denied",
            errors: "the user role must be admin or customer only or user did not match"
        });
    }

    try {
        const result = await userServices.getSingleUer(userId as string);

        if (!result || result.rows.length === 0) {
            return sendRes(res, {
                status: 404,
                success: false,
                message: "User not found",
                errors: "the user did not find",
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
            errors: "server error",
        });
    }
};




const updateUser = async (req: Request, res: Response) => {

    const { userId } = req.params

    const decodedUser = req.user as JwtPayload

    if (decodedUser.id.toString() !== userId && decodedUser.role !== 'admin') {
        return sendRes(res, {
            status: 403,
            success: false,
            message: `access denied`,
            errors: "failed to update",
        });
    }



    const {
        name,
        email,
        phone,
        role
    } = req.body




    const rowPayload: { [key: string]: any } = {
        name,
        email,
        phone,
        role
    };


    const payload = cleanPayload(rowPayload)


    const allowedRole = ['admin', 'customer'];

    if (payload.email) {
        payload.email = payload.email.toLowerCase();
    }

    if (payload.type !== undefined && !allowedRole.includes(payload.role)) {
        return sendRes(res, {
            status: 400,
            success: false,
            message: `Type must be one of ${allowedRole.join(', ')}`,
            errors: " the user role must be admin or customer only",
        });
    }





    const result = await userServices.updateUser(userId!, payload)






    return sendRes(res, {
        status: 200,
        success: true,
        message: `user updated successfully`,
        data: result.rows[0]
    })
}




const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.userId as string;


    const bookingResult = await userServices.getBookingStatus(id);


    if (bookingResult.rowCount !== 0) {
        return sendRes(res, {
            status: 400,
            success: false,
            message: "The user has active bookings",
            errors: "the user has actively booking due to the booking result not found"
        });
    }

    const result = await userServices.deleteUser(id);

    if (result.rowCount === 0) {
        return sendRes(res, {
            status: 404,
            success: false,
            message: "Invalid user not found",
            errors: "the  user not found on the db"
        });
    }

    return sendRes(res, {
        status: 200,
        success: true,
        message: "User deleted successfully",
    });
};




export const userController = {
    getAllUser,
    updateUser,
    deleteUser,
    getSingleUser
};
