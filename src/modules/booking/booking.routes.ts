import express from 'express';
import { hitApi } from '../../utilities/hitApi';
import { bookingController } from './booking.controller';
import verifyUser from '../../middleware/middleware';
import Roles from '../user/auth.constrain';



const router = express.Router()


router.get('/', verifyUser(Roles.admin, Roles.customer), bookingController.getAllBooking)

router.post('/', verifyUser(Roles.admin, Roles.customer), bookingController.newBooking)


router.put('/:bookingId',verifyUser(Roles.admin,Roles.customer) ,bookingController.updateBooking)





export const bookingRoutes = router