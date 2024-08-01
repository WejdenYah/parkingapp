
import Car from "../models/car.js";
import User from "../models/User.js";


export const getCars = async (req, res, next) => {
  try {
    const cars = await Car.find();
    res.status(200).json({
      success: true,
      data: cars,
    });
  } catch (error) {
    next(error);
  }
};


export const createCar = async (req, res, next) => {
  console.log('req.body', req.body);
  try {
    const car = await Car.create(req.body);
    await car.save();
    const user = await User.findById(req.body.owner);
    user.cars.push(car._id);
    await user.save();


    res.status(201).json({
      success: true,
      data: car,
    });
  } catch (error) {
    console.log('error', error);
    next(error);
  }
};


export const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }
    res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    next(error);
  }
};


export const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }
    res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
