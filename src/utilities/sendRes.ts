import { Response } from "express"
interface IPayload<T> {
    status: number,
    success: boolean,
    message: string,
    data?: T
}

export const sendRes = <T>(res: Response, payload: IPayload<T>): Response => {
    const { status, success, message, data } = payload
    return res.status(status).json({
        success,
        message,
        data
    })
}