import express, { Request, Response } from "express"
import { initDb } from "./config/db"
const app = express()


initDb()


app.get('/', (req: Request, res: Response) => {
    res.send('gariVara server is running')
})



export default app