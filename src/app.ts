import express, { Request, Response } from "express"
import { initDb } from "./config/db"
import { userRoutes } from "./modules/user/user.routes"
const app = express()
app.use(express.json())


initDb()


app.use('/app/v1/user', userRoutes)


app.get('/', (req: Request, res: Response) => {
    res.send('gariVara server is running')
})



export default app