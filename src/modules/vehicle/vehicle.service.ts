import { pool } from "../../config/db"


const addNewVehicle = async (vehicle_name: string,
    type: string,
    registration_number: string,
    daily_rent_price: string,
    availability_status: string) => {


    const result = await pool.query(`INSERT INTO vehicles(vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status) VALUES($1,$2,$3,$4,$5)
            
          RETURNING id,
vehicle_name,
type,
registration_number,
daily_rent_price,
availability_status`, [vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status])
    return result
}



const getAllVehicle = async () => {
    try {

    } catch (error: any) {
        console.log("the database error due to : ", error?.message);
        throw new Error
    }
    const result = await pool.query(`
    SELECT id, vehicle_name, type,registration_number ,daily_rent_price availability_status FROM vehicles
    `)
    return result
}



export const vehicleService = {
    getAllVehicle, addNewVehicle
}