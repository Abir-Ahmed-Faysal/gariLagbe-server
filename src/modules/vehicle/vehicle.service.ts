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


const singleVehicle = async (vehicleId: string) => {
    try {
        const result = await pool.query(`
            SELECT id,
vehicle_name,
type,
registration_number,
daily_rent_price,
availability_status FROM vehicles
            `)




        return result;

    } catch (error: any) {
        console.log(error);
        throw new Error(error?.message || "database error")
    }
}


const updateVehicle = async (vehicleId: string, payload: { [key: string]: any }) => {

    const keys = Object.keys(payload);

    if (keys.length < 1) {
        throw new Error("You must provide update fields");
    }


    const setQuery = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

    const values = Object.values(payload);

    values.push(vehicleId);

    const result = await pool.query(
        `
        UPDATE vehicles 
        SET ${setQuery} 
        WHERE id = $${values.length}
        RETURNING *
        `,
        values
    );


    return result;
};


const deleteVehicle = async (id: string) => {
    try {

        const result = await pool.query(`
    DELETE FROM vehicles
    WHERE id = $1 AND availability_status = 'available'
    RETURNING *
  `, [id]);
        return result;
    } catch (error) {
        throw new Error
    }
}


export const vehicleService = {
    getAllVehicle, addNewVehicle, singleVehicle, updateVehicle, deleteVehicle
}