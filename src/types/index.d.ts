import { JwtPayload } from "jsonwebtoken";

global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}