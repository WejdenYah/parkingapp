import Reservation from "../models/reservation.js";
import ParkingSpot from "../models/parkingSpot.js";
import Park, { Floor } from "../models/park.js";
import mongoose, { model } from "mongoose";


export const createReservation = async (req, res) => {
  // const { licencePlate, payementStatus, payementMethod, totalPrice, parkingSpot, parking, user, finishDate, startDate } = req.body

  // const newReservation = new Reservation({
  //   licencePlate,
  //   payementStatus,
  //   payementMethod,
  //   totalPrice,
  //   parkingSpot,
  //   parking,
  //   user,
  //   finishDate: new Date(finishDate),
  //   startDate: new Date(startDate)
  // })
  // checkReservationOverlap(newReservation)
  //   .then((overlap) => {
  //     if (overlap) {
  //       res.status(500).json({ error: 'The new reservation overlaps with existing reservations.' })
  //     } else {
  //       newReservation
  //         .save()
  //         .then((reservation) => res.status(201).json(reservation))
  //         .catch((error) => res.status(500).json({ error: error.message }));
  //     }
  //   })
  //   .catch((error) => {
  //     res.status(500).json({ error: error.message })
  //   });


  try {
    const { userId, parkId, parkingSpotId, startDate, finishDate, licencePlate, paymentMethod, totalPrice } = req.body;
    const reservation = await createReservationHandler(userId, parkId, parkingSpotId, new Date(startDate), new Date(finishDate), licencePlate, paymentMethod, totalPrice);
    res.status(201).json(reservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: error.message });
  }
}

export const getReservationByUser = async (req, res) => {
  const { id , isSubscription = false } = req.query


  try {
    const reservations = await Reservation.find({ user: id , isSubscription: isSubscription })
      .populate('park')
      .populate('parkingSpot')
      .populate('user');

    if (!reservations.length) {
      return res.status(404).json({ message: 'No reservations found for this user' });
    }

    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: error.message });
  }
}

export const getReservationById = async (req, res) => {
  const { reservationId } = req.params;
  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function checkReservationOverlap(newReservation) {
  try {
    const overlappingReservations = await Reservation.find({
      parkingSpot: newReservation.parkingSpot,
      reservationStatus: { $ne: 'Canceled' },
      $or: [
        {
          startDate: { $lt: newReservation.finishDate },
          finishDate: { $gt: newReservation.startDate },
        },
        {
          startDate: { $gte: newReservation.startDate, $lt: newReservation.finishDate },
        },
        {
          finishDate: { $gt: newReservation.startDate, $lte: newReservation.finishDate },
        }
      ]
    });

    if (overlappingReservations.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking reservation overlap:', error);
    throw error;
  }
}

export const cancelReservation = async (req, res) => {
  const { reservationId } = req.params;
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(reservationId, { reservationStatus: "Canceled" }, { new: true });
    if (updatedReservation) {
      res.status(200).json({ message: "Reservation canceled successfully", updatedReservation });
    } else {
      res.status(404).json({ message: "Reservation not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error canceling reservation", error: error.message });
    console.error('Error canceling reservation:', error);
  }
}

export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("parkingSpot");
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const checkAvailableParkingSpots = async (parkId, startTime, endTime) => {
  try {
    const park = await Park.findById(parkId).populate('floors.parkingSpots');

    if (!park) {
      throw new Error('Park not found');
    }

    const availableSpots = [];

    for (const floor of park.floors) {
      for (const spotId of floor.parkingSpots) {
        const spot = await ParkingSpot.findById(spotId)
          .populate('reservations')
          .populate('subscriptions');

        let isAvailable = true;

        spot.reservations.forEach(reservation => {
          if (
            (startTime < reservation.finishDate && endTime > reservation.startDate) ||
            (reservation.startDate <= startTime && reservation.finishDate >= endTime)
          ) {
            isAvailable = false;
          }
        });

        spot.subscriptions.forEach(subscription => {
          if (
            (startTime < subscription.endDate && endTime > subscription.startDate) ||
            (subscription.startDate <= startTime && subscription.endDate >= endTime)
          ) {
            isAvailable = false;
          }
        });

        availableSpots.push({
          spot,
          floorLevel: floor.level,
          empty: isAvailable
        });
      }
    }

    return availableSpots;
  } catch (error) {
    console.error("Error checking parking spots:", error);
    throw error;
  }
};

export const getFreeParkingSpots = async (req, res) => {
  try {
    const { parkId } = req.params;
    const { startTime, endTime } = req.query;

    const availableSpots = await checkAvailableParkingSpots(parkId, new Date(startTime), new Date(endTime));
    res.status(200).json(availableSpots);
  } catch (error) {
    console.log("Error getting free parking spots:", error);
    res.status(500).json({ error: error.message });
  }
};

 export const extendReservationTime = async (req, res) => {
  const { reservationId } = req.params;
  const { newFinishDate } = req.body;

  try {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    reservation.finishDate = new Date(newFinishDate);
    await reservation.save();

    res.status(200).json({ message: 'Reservation time extended successfully', reservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createReservationHandler = async (userId, parkId, parkingSpotId, startDate, finishDate, licencePlate, paymentMethod, totalPrice) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newReservation = new Reservation({
      user: userId,
      park: parkId,
      parkingSpot: parkingSpotId,
      startDate,
      finishDate,
      licencePlate,
      paymentMethod,
      totalPrice
    });

    await newReservation.save({ session });

    await ParkingSpot.findByIdAndUpdate(
      parkingSpotId,
      { $push: { reservations: newReservation._id } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();



    const parkingSpot = await ParkingSpot.findById(parkingSpotId).populate('park');
    const floor = parkingSpot.park.floors.find(floor => floor.parkingSpots.includes(parkingSpotId));
    return {
      reservation: newReservation,
      parkingSpot: parkingSpot,
      floor: floor
    };
  } catch (error) {
    console.error("Error creating reservation:", error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const countReservations = async (req, res) => {
  try {
    const count = await Reservation.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting reservations:", error);
    res.status(500).json({ error: error.message });
  }
};


export const countReservationsByMonth = async (req, res) => {
  try {
    const reservationsByMonth = await Reservation.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$reservationDate" },
            month: { $month: "$reservationDate" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);
    res.status(200).json(reservationsByMonth);
  } catch (error) {
    console.error("Error counting reservations by month:", error);
    res.status(500).json({ error: error.message });
  }
};