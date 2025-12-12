import { Response } from "express"
interface IPayload<T, X> {
    status: number,
    success: boolean,
    message: string,
    data?: T,
    errors?: X
}

export const sendRes = <T, X>(res: Response, payload: IPayload<T, X>): Response => {
    const { status, success, message, data, errors } = payload
    return res.status(status).json({
        success,
        message,
        data,
        errors
    })
}