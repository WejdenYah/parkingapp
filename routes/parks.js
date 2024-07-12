import express from 'express';
import { getParks, createPark, getParkById, updatePark, deletePark , getParkingLotsNearby, countParks} from '../controllers/park.js';

const router = express.Router();

router.get('/nearby', getParkingLotsNearby);
router.get('/count', countParks); 

router.get('/', getParks);
router.post('/', createPark);
router.get('/:id', getParkById);
router.put('/:id', updatePark);
router.delete('/:id', deletePark);



export default router;
