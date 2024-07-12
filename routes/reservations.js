import express from 'express';
import { createReservation, getReservationByUser, cancelReservation, getReservationById } from '../controllers/reservation.js';

const router = express.Router();

router.post('/', createReservation);

router.get('/user', getReservationByUser);

router.put('/:reservationId/cancel', cancelReservation);

router.get('/:reservationId', getReservationById);

export default router;
