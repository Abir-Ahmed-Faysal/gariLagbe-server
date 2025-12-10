import { Request, Response } from "express";
import { sendRes } from "../../utilities/sendRes";
import { vehicleService } from "./vehicle.service";


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
            message: "User created successfully",
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



const singleVehicle=async(req:Request,res:Response)=>{


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









export const vehicleController = {
    addNewVehicle, getAllVehicle,singleVehicle,
};
