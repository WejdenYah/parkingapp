import mongoose from "mongoose";

const parkingSpotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  spotType: { type: String, required: true },
  pricePerHour: { type: Number, required: true, min: 0 },
  park: { type: mongoose.Schema.Types.ObjectId, ref: 'Park', required: true },
  floor: { type: mongoose.Schema.Types.ObjectId, ref: 'Park.floors', required: true },
  reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
  subscriptions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  }]
});

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);

export default ParkingSpot;
