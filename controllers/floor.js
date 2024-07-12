import Floor from '../models/floor.js';

const createFloor = async (req, res, next) => {
  try {
    const { park, floorNumber, vacant } = req.body;
    const newFloor = new Floor({ park, floorNumber, vacant });
    await newFloor.save();
    res.status(201).json(newFloor);
  } catch (error) {
    next(error);
  }
};

const getAllFloors = async (req, res, next) => {
  try {
    const floors = await Floor.find();
    res.status(200).json(floors);
  } catch (error) {
    next(error);
  }
};


const getFloorById = async (req, res, next) => {
  try {
    const floor = await Floor.findById(req.params.id);
    if (!floor) {
      return res.status(404).json({ message: 'Floor not found' });
    }
    res.status(200).json(floor);
  } catch (error) {
    next(error);
  }
};


const updateFloor = async (req, res, next) => {
  try {
    const { park, floorNumber, vacant } = req.body;
    const updatedFloor = await Floor.findByIdAndUpdate(
      req.params.id,
      { park, floorNumber, vacant },
      { new: true }
    );
    if (!updatedFloor) {
      return res.status(404).json({ message: 'Floor not found' });
    }
    res.status(200).json(updatedFloor);
  } catch (error) {
    next(error);
  }
};

const deleteFloor = async (req, res, next) => {
  try {
    const deletedFloor = await Floor.findByIdAndDelete(req.params.id);
    if (!deletedFloor) {
      return res.status(404).json({ message: 'Floor not found' });
    }
    res.status(200).json({ message: 'Floor deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export { createFloor, getAllFloors, getFloorById, updateFloor, deleteFloor };
