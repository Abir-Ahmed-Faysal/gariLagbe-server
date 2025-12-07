import express from 'express';
import { userController } from './user.controller';
import { hitApi } from '../../utilities/hitApi';

const router = express.Router()


router.post('/', hitApi, userController.createUser)



export const userRoutes = router