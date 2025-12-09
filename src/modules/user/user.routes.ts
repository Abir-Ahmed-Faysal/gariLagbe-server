import express from 'express';
import { userController } from './user.controller';
import verifyUser from '../../middleware/middleware';
import Roles from './auth.constrain';
import { hitApi } from '../../utilities/hitApi';



const router = express.Router()


 router.get('/',hitApi, verifyUser(Roles.admin), userController.getAllUser)
router.get('/:userId',verifyUser(Roles.admin,Roles.user), userController.getSingleUser)



export const userRoutes = router