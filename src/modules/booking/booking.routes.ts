import express from 'express';
import { hitApi } from '../../utilities/hitApi';
import { bookingController } from './booking.controller';



const router = express.Router()



router.get('/', bookingController.getAllBooking)
router.post('/',  bookingController.newBooking)
router.put('/',  bookingController.updateBooking)


// router.get('/', userController.getAllUser)
// router.get('/:id',  userController.getAllUser)



export const bookingRoutes = router