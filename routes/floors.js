import express from 'express';
import {
  createFloor,
  getAllFloors,
  getFloorById,
  updateFloor,
  deleteFloor,
} from '../controllers/floor.js';

const router = express.Router();

router.post('/', createFloor);
router.get('/', getAllFloors);
router.get('/:id', getFloorById);
router.put('/:id', updateFloor);
router.delete('/:id', deleteFloor);

export default router;
