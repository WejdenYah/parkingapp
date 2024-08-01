import express from 'express';
import { createReservation, getReservationByUser, cancelReservation, getReservationById, getAllReservations, getFreeParkingSpots, extendReservationTime, countReservationsByMonth, countReservations } from '../controllers/reservation.js';

const router = express.Router();

router.get('/count', countReservations);
router.get('/monthly-count', countReservationsByMonth);  

router.get('/', getAllReservations);
router.post('/', createReservation);
router.get('/user', getReservationByUser);
router.put('/:reservationId/cancel', cancelReservation);
router.get('/:reservationId', getReservationById);
router.get('/get-free-spots/:parkId', getFreeParkingSpots);
router.post('/extend-time/:reservationId', extendReservationTime);

export default router;
