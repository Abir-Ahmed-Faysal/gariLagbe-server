import express from 'express';
import { hitApi } from '../../utilities/hitApi';
import { vehicleController } from './vehicle.controller';
import verifyUser from '../../middleware/middleware';
import Roles from '../user/auth.constrain';



const router = express.Router()


router.get('/', vehicleController.getAllVehicle)

router.get('/:vehicleId', vehicleController.singleVehicle)

router.post('/', verifyUser(Roles.admin), vehicleController.addNewVehicle)

router.put('/:vehicleId', verifyUser(Roles.admin), vehicleController.updateVehicle)

router.delete('/:vehicleId', verifyUser(Roles.admin), vehicleController.deleteVehicle)


export const vehicleRoutes = router