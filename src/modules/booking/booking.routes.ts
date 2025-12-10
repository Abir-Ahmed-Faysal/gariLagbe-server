import express from 'express';
import { hitApi } from '../../utilities/hitApi';
import { bookingController } from './booking.controller';
import verifyUser from '../../middleware/middleware';
import Roles from '../user/auth.constrain';



const router = express.Router()


router.get('/', bookingController.getAllBooking)

router.post('/', verifyUser(Roles.admin, Roles.user), bookingController.newBooking)

router.put('/', bookingController.updateBooking)


// router.get('/', userController.getAllUser)
// router.get('/:id',  userController.getAllUser)



export const bookingRoutes = router