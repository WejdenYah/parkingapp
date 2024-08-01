import express from 'express';
import { createReservation, getReservationByUser, cancelReservation, getReservationById, getAllReservations } from '../controllers/reservation.js';

const router = express.Router();

router.post('/', createReservation);

router.get('/user', getReservationByUser);

router.get('/', getAllReservations); 

router.put('/:reservationId/cancel', cancelReservation);

router.get('/:reservationId', getReservationById);

export default router;




// api to create subscription 
// feha user w parking w parking spot w date men wa9teh lwa9teh w elprix houwa 3ibara 3la price * 8 hours * 30 days

// api feha get subscriptions by userId