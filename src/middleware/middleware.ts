import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { secret } from "../modules/auth/auth.service";
import { pool } from "../config/db";


const verifyUser = (...roles: ('admin' | 'customer')[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers?.authorization;
        

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access Denied!",
            });
        }

        const token= authHeader.split(" ")[1];

        if (!token) {
            throw new Error("You are not authorized");
        }
        const decoded = jwt.verify(token, secret) as JwtPayload;
        const user = await pool.query(
            `
      SELECT * FROM users WHERE email=$1
      `,
            [decoded.email]
        );
        if (user.rows.length === 0) {
            throw new Error("User not found!");
        }
        req.user = decoded;
        if (roles.length && !roles.includes(req.user?.role)) {
            res.status(400).json({ success: true, message: "you are not authorized" })

        }
        console.log(req.user);
        next();
    };
};

export default verifyUser;