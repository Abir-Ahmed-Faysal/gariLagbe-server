import { Request, Response } from "express";
import { sendRes } from "../../utilities/sendRes";


// const booking = async (req: Request, res: Response) => {
//     const { name, email, password, phone, role } = req.body;
//     //{
//     //   "vechicle name": "John Doe",
//     //   "email": "john.doe@example.com",
//     //   "password": "securePassword123",
//     //   "phone": "01712345678",
//     //   "role": "customer"
//     // }


//     if () {
//         return sendRes(res, {
//             status: 400,
//             success: false,
//             message: "Please provide name, email, password & phone number",
//             data: null,
//         });
//     }
//     if (!["admin", "customer"].includes(role)) {
//         return sendRes(res, {
//             status: 400,
//             success: false,
//             message: "the role would be only 'customer' or 'admin'",
//             data: null,
//         });
//     }


//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const result = await newUserCreate(name, lowerCasedEmail, hashedPassword, phone, role)

//         return sendRes(res, {
//             status: 201,
//             success: true,
//             message: "User created successfully",
//             data: result.rows[0],
//         });

//     } catch (error: any) {
//         console.log(error.message);
//         return sendRes(res, {
//             status: 500,
//             success: false,
//             message: "User creation failed due to server error",
//             data: null,
//         });
//     }
// };

// export const bookingController = {
//     createUser: booking,
// };
