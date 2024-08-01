import Park from '../models/park.js';
import { haversineDistance } from '../utils/calcDistance.js';
const createPark = async (req, res) => {
  const { name, description, longitude, latitude, parkingType, address } = req.body;

  try {
    const newPark = new Park({
      name,
      description,
      longitude,
      latitude,
      parkingType,
      address,

    });

    const savedPark = await newPark.save();
    res.status(201).json(savedPark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getParks = async (req, res, next) => {
  try {
    const parks = await Park.find();
    const userCoords = [req.query.longitude, req.query.latitude]; 
    const parksWithDistance = parks.map(park => {
      const parkCoords = [park.longitude, park.latitude];
      const distance = haversineDistance(userCoords, parkCoords);
      return {
        ...park.toObject(),
        distance
      };
    });
    res.status(200).json(parksWithDistance);
  } catch (error) {
    next(error);
  }
};


const countParks = async (req, res, next) => {
  try {
    const count = await Park.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};

const getParkById = async (req, res, next) => {
  try {
    const park = await Park.findById(req.params.id);
    if (!park) {
      return res.status(404).json({ message: 'Park not found' });
    }
    res.status(200).json(park);
  } catch (error) {
    next(error);
  }
};

const updatePark = async (req, res) => {
  try {
    const parkId = req.params.id;
    const updateFields = req.body;

    // Find the park by ID and update it with the provided fields
    const updatedPark = await Park.findByIdAndUpdate(parkId, updateFields, { new: true });

    // Check if the park was found and updated
    if (updatedPark) {
      res.status(200).json({ message: 'Park updated successfully', park: updatedPark });
    } else {
      res.status(404).json({ message: 'Park not found' });
    }
  } catch (error) {
    console.error('Error updating park:', error);
    res.status(500).json({ error: error.message });
  }
};


const deletePark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPark = await Park.findByIdAndDelete(id);
    if (!deletedPark) {
      return res.status(404).json({ message: 'Park not found' });
    }
    res.status(200).json({ message: 'Park deleted successfully' });
  } catch (error) {
    next(error);
  }
};

async function findParkingLotsNearby(longitude, latitude, radiusInKilometers) {
  longitude = parseFloat(longitude);
  latitude = parseFloat(latitude);
  try {
    const nearbyParkingLots = await Park.find({
      $and: [
        { longitude: { $gte: longitude - (radiusInKilometers / 111.32) } },
        { longitude: { $lte: longitude + (radiusInKilometers / 111.32) } },
        { latitude: { $gte: latitude - (radiusInKilometers / (111.32 * Math.cos(latitude * (Math.PI / 180)))) } },
        { latitude: { $lte: latitude + (radiusInKilometers / (111.32 * Math.cos(latitude * (Math.PI / 180)))) } },
      ],
    }).populate("parkingSpots");

    return nearbyParkingLots;
  } catch (error) {
    console.error('Error finding parking lots nearby:', error);
    throw error;
  }
}





export const getParkingLotsNearby = async (req, res) => {
  const { searchLongitude, searchLatitude, radiusInKilometers } = req.query
  console.log(searchLongitude)
  console.log(searchLatitude)
  console.log(radiusInKilometers)
  findParkingLotsNearby(searchLongitude, searchLatitude, radiusInKilometers)
    .then((nearbyParkingLots) => {
      res.status(201).json(nearbyParkingLots)
    })
    .catch((error) => {
      res.status(500).json({ error: error.message })
    });

}





export { getParks, createPark, getParkById, updatePark, deletePark, countParks };
