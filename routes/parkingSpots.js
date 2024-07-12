import express from 'express';
import { createParkingSpot, updateParkingSpot,  getAvailableParkingSpots, deleteParkingSpot} from '../controllers/parkingSpot.js';

const router = express.Router();

router.post('/', createParkingSpot);
router.put('/', updateParkingSpot);
router.get('/', getAvailableParkingSpots);
router.delete('/', deleteParkingSpot);

export default router;