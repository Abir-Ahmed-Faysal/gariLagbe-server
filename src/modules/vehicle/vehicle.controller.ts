import { Request, Response } from "express";
import { sendRes } from "../../utilities/sendRes";
import { vehicleService } from "./vehicle.service";
import { cleanPayload } from "../../utilities/cleaningPayload";
import { JwtPayload } from "jsonwebtoken";



const addNewVehicle = async (req: Request, res: Response) => {
    const { vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status } = req.body;
    console.log(req.body);


    if (!vehicle_name || !type || !registration_number || !
        daily_rent_price || !
        availability_status) {
        return sendRes(res, {
            status: 400,
            success: false,
            message: "Please provide vehicle_name, type, registration_number & availability_status",
            data: null,
        });
    }



    if (!['car', 'bike', 'van', 'SUV'].includes(type)) {
        return sendRes(res, {
            status: 400,
            success: false,
            message: "the type should be'car', 'bike', 'van' or 'SUV' only ",
            data: null,
        });



    }
    if (!["available", "booked"].includes(availability_status)) {
        return sendRes(res, {
            status: 400,
            success: false,
            message: "the availability_status would be only 'available', 'booked'",
            data: null,
        });
    }

    try {
        const result = await vehicleService.addNewVehicle(vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availability_status)




        return sendRes(res, {
            status: 201,
            success: true,
            message: "vehicle created successfully",
            data: result.rows[0],
        });

    } catch (error: any) {
        console.log(error.message);
        if (error.code === "23505") {
            return sendRes(res, {
                status: 409,
                success: false,
                message: "the vehicle registration_number already exists",
                data: null,
            });
        }
        return sendRes(res, {
            status: 500,
            success: false,
            message: "User creation failed due to server error",
            data: null,
        });
    }
};


const getAllVehicle = async (req: Request, res: Response) => {

    try {
        const result = await vehicleService.getAllVehicle()


        if (result.rows.length === 0) {
            return sendRes(res, {
                status: 200,
                success: true,
                message: "No vehicles found",
                data: [],
            });
        }

        return sendRes(res, {
            status: 200,
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows,
        });

    } catch (error: any) {
        return sendRes(res, {
            status: 400,
            success: false,
            message: error?.message || "server error",
            data: null,
        });
    }
}


const singleVehicle = async (req: Request, res: Response) => {


    const { vehicleId } = req.params;


    try {
        const result = await vehicleService.singleVehicle(vehicleId as string);

        if (!result || result.rows.length === 0) {
            return sendRes(res, {
                status: 200,
                success: true,
                message: "No vehicles found",
                data: [],
            });
        }

        return sendRes(res, {
            status: 200,
            success: true,
            message: "Vehicle retrieved successfully",
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
}


const updateVehicle = async (req: Request, res: Response) => {

    const { vehicleId } = req.params

    const decodedUser = req.user as JwtPayload

    if (decodedUser.id.toString() !== vehicleId && decodedUser.role !== 'admin') {
        return sendRes(res, {
            status: 403,
            success: false,
            message: `failed to update`,
            data: null,
        });
    }




    const {
        vehicle_name, type, registration_number,
        daily_rent_price,
        availability_status
    } = req.body



    const rowPayload: { [key: string]: any } = {
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status
    };

    const payload = cleanPayload(rowPayload)


    const allowedTypes = ['car', 'bike', 'van', 'SUV'];
    const allowedStatus = ['available', 'booked'];

    if (payload.type !== undefined && !allowedTypes.includes(payload.type)) {
        return sendRes(res, {
            status: 400,
            success: false,
            message: `Type must be one of ${allowedTypes.join(', ')}`,
            data: null,
        });
    }

    if (payload.daily_rent_price !== undefined && payload.daily_rent_price <= 0) {
        return sendRes(res, {
            status: 400,
            success: false,
            message: 'Daily rent price must be positive',
            data: null,
        });
    }

    if (payload.availability_status !== undefined && !allowedStatus.includes(payload.availability_status)) {
        return sendRes(res, {
            status: 400,
            success: false,
            message: `Availability status must be one of ${allowedStatus.join(', ')}`,
            data: null,
        });
    }




    const result = await vehicleService.updateVehicle(vehicleId!, payload)

    return sendRes(res, {
        status: 200,
        success: true,
        message: `Vehicle updated successfully`,
        data: result.rows[0]
    })
}




const deleteVehicle = async (req: Request, res: Response) => {
    const id = req.params.vehicleId as string

    const getBookingStatus = await vehicleService.getBookingStatus(id)

    console.log(getBookingStatus.rows);
    if (getBookingStatus.rowCount !== 0) {
        return sendRes(res, {
            status: 400,
            success: false,
            message: "Vehicle has already booked",
        });
    }



    const result = await vehicleService.deleteVehicle(id);
    console.log(result.rows);

    if (result.rows.length === 0) {
        return sendRes(res, {
            status: 400,
            success: false,
            message: " already booked or Vehicle not found ",
        });
    }

    return sendRes(res, {
        status: 200,
        success: true,
        message: "Vehicle deleted successfully",
    });
};


export const vehicleController = {
    addNewVehicle, getAllVehicle, singleVehicle, updateVehicle, deleteVehicle
};
