import express from 'express';
import { userController } from './user.controller';
import verifyUser from '../../middleware/middleware';
import Roles from './auth.constrain';
import { hitApi } from '../../utilities/hitApi';



const router = express.Router()


router.get('/', verifyUser(Roles.admin), userController.getAllUser)

router.get('/:userId', verifyUser(Roles.admin, Roles.customer), userController.getSingleUser)

router.put('/:userId', verifyUser(Roles.admin, Roles.customer), userController.updateUser)

router.delete('/:userId', verifyUser(Roles.admin), userController.deleteUser)



export const userRoutes = router