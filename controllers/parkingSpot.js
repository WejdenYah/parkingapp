import ParkingSpot from '../models/parkingSpot.js';
import Park from '../models/park.js';
import Reservation from '../models/reservation.js';


export const createParkingSpot = async (req, res) => {
    const parkingId = req.query.parkingId;
    const { name, spotType, pricePerHour } = req.body;

    try {
        const newParkingSpot = new ParkingSpot({ name, spotType, pricePerHour });
        const savedParkingSpot = await newParkingSpot.save();

        const updatedPark = await Park.findByIdAndUpdate(
            parkingId,
            { $push: { parkingSpots: savedParkingSpot._id } },
            { new: true, useFindAndModify: false }
        );

        if (!updatedPark) {
            return res.status(404).json({ message: 'Park not found' });
        }

        await savedParkingSpot.populate('reservations').execPopulate();

        res.status(201).json(savedParkingSpot);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const updateParkingSpot = async (req, res) => {
    const { parkingSpotId } = req.query;
    const updateFields = req.body;

    try {
      
        const updatedParkingSpot = await ParkingSpot.findByIdAndUpdate(
            parkingSpotId,
            updateFields,
            { new: true, useFindAndModify: false }
        );

        if (!updatedParkingSpot) {
            return res.status(404).json({ error: 'Parking spot not found' });
        }

        await updatedParkingSpot.populate('reservations').execPopulate();

        res.status(200).json(updatedParkingSpot);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



async function findAvailableParkingSpots (startDate, finishDate, parkingLotId) {
    try {


        const overlappingReservations = await Reservation.find({
            $or: [
                {
                    startDate: { $lt: finishDate },
                    finishDate: { $gt: startDate },
                },
                {
                    startDate: { $gte: startDate, $lt: finishDate },
                },
                {
                    finishDate: { $gt: startDate, $lte: finishDate },
                },
            ],
        })

        const reservedSpotIds = overlappingReservations.map(reservation => reservation.parkingSpot);


        return { occupiedParkingSpots: reservedSpotIds };
    } catch (error) {
        console.error('Error finding available parking spots:', error);
        throw error;
    }
}

 export const getAvailableParkingSpots = async (req, res) => {
    const { startDate, finishDate, parkingLotId } = req.query
   
    findAvailableParkingSpots(startDate, finishDate, parkingLotId)
        .then((availableParkingSpots) => {
            res.status(201).json(availableParkingSpots)
        })
        .catch((error) => {
            res.status(500).json({ error: error.message })
        });
}

export const deleteParkingSpot = async (req, res) => {
    const { parkingSpotId, parkingId } = req.query;

    try {
        // Find and delete the parking spot
        const deletedParkingSpot = await ParkingSpot.findByIdAndDelete(parkingSpotId);
        if (!deletedParkingSpot) {
            return res.status(404).json({ error: 'Parking spot not found' });
        }

        // Update the park to remove the reference to the deleted parking spot
        await Park.findByIdAndUpdate(
            parkingId,
            { $pull: { parkingSpots: parkingSpotId } },
            { new: true, useFindAndModify: false }
        );

        res.status(200).json({ message: 'Parking spot deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



 