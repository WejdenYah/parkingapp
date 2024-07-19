import express from 'express';
import { createReservation, getReservationByUser, cancelReservation, getReservationById, getAllReservations } from '../controllers/reservation.js';

const router = express.Router();

router.post('/', createReservation);

router.get('/user', getReservationByUser);

router.get('/', getAllReservations); 

router.put('/:reservationId/cancel', cancelReservation);

router.get('/:reservationId', getReservationById);

export default router;
