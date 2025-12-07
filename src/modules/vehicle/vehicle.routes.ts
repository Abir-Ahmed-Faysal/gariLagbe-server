import express from 'express';
import { hitApi } from '../../utilities/hitApi';
import { vehicleController } from './vehicle.controller';



const router = express.Router()



router.post('/', hitApi, vehicleController.addNewVehicle)

router.get('/', hitApi, vehicleController.getAllVehicle)

// router.get('/:id', hitApi, vehicleController.getAllUser)



export const vehicleRoutes = router