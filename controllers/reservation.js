import Reservation from "../models/reservation.js";
import ParkingSpot from "../models/parkingSpot.js";


export const createReservation = async (req, res) => {
  const { licencePlate, payementStatus, payementMethod, totalPrice, parkingSpot, parking, user, finishDate, startDate } = req.body

  const newReservation = new Reservation({ licencePlate, payementStatus, payementMethod, totalPrice, parkingSpot, parking, user, finishDate: new Date(finishDate), startDate: new Date(startDate) })
  checkReservationOverlap(newReservation)
      .then((overlap) => {
          if (overlap) {
              res.status(500).json({ error: 'The new reservation overlaps with existing reservations.' })
          } else {
              newReservation
                  .save()
                  .then((reservation) => res.status(201).json(reservation))
                  .catch((error) => res.status(500).json({ error: error.message }));
          }
      })
      .catch((error) => {
          res.status(500).json({ error: error.message })
      });
}

export const getReservationByUser = async (req, res) => {
  const { id } = req.query
  Reservation.find({ user: id }, (error, results) => {
      if (error) {
          res.status(500).json({ error: error.message })       
       } else {
          res.status(200).json(results)
      }
  }).populate(" parkingSpot")
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
