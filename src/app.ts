import express, { request, Request, response, Response } from "express"
import { initDb } from "./config/db"
import { userRoutes } from "./modules/user/user.routes"
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes"
const app = express()
app.use(express.json())


initDb()


app.use('/app/v1/user', userRoutes)


app.use('/app/v1/vehicles', vehicleRoutes)



app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});



app.get('/', (req: Request, res: Response) => {
    res.send('gari-bhara server is running')
})



export default app;