import express, { Request, Response } from "express"
import { initDb } from "./config/db"
import { userRoutes } from "./modules/user/user.routes"
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes"
import { bookingRoutes } from "./modules/booking/booking.routes"
import { authRoute } from "./modules/auth/auth.routes"
const app = express()
app.use(express.json())


initDb()


app.get('/', (req: Request, res: Response) => {
    res.send('gari-bhara server is running')
})




app.use('/app/v1/auth',authRoute)

app.use('/app/v1/users', userRoutes)

app.use('/app/v1/vehicles', vehicleRoutes)

app.use('/app/v1/bookings', bookingRoutes)



app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});




export default app;