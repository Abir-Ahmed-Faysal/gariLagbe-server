import { NextFunction, Request, Response } from "express";

export const hitApi = (req: Request, res: Response, next: NextFunction) => {
    console.log('hit the api',"method is:",req.method,req.body);
    next()
}