import express from 'express';
import { userController } from './user.controller';
import { hitApi } from '../../utilities/hitApi';



const router = express.Router()



router.post('/',  userController.createUser)
router.get('/', userController.getAllUser)
router.get('/:id',  userController.getAllUser)



export const userRoutes = router