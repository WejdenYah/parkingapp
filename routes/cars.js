import express from "express";
import {
  getCars,
  createCar,
  getCarById,
  updateCar,
  deleteCar,
} from "../controllers/car.js";

const router = express.Router();

router.get("/", getCars);
router.post("/", createCar);
router.get("/:id", getCarById);
router.put("/:id", updateCar);
router.delete("/:id", deleteCar);

export default router;