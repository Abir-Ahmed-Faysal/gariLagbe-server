import express, { Request, Response } from "express"
import { initDb } from "./config/db"
import { userController } from "./modules/user/user.controller"
const app = express()


initDb()


app.use('/app/v1/user',userController.createUser)


app.get('/', (req: Request, res: Response) => {
    res.send('gariVara server is running')
})



export default app