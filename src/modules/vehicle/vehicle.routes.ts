import express from 'express';
import { hitApi } from '../../utilities/hitApi';
import { vehicleController } from './vehicle.controller';
import verifyUser from '../../middleware/middleware';
import Roles from '../user/auth.constrain';



const router = express.Router()



router.post('/', verifyUser(Roles.admin), vehicleController.addNewVehicle)

router.get('/',  vehicleController.getAllVehicle)

 router.get('/:vehicleId',  vehicleController.singleVehicle)



export const vehicleRoutes = router