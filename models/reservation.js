import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  finishDate: { type: Date, required: true },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  park: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Park",
    required: true
  },

  parkingSpot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingSpot",
    required: true
  },

  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },

  paymentMethod: {
    type: String,
    enum: [
      'Cash',
      'Credit and Debit Cards',
      'Bank Transfers',
      'Point-of-Sale (POS) Financing',
      'Prepaid Cards',
      'Bill Pay Services',
      'Automatic Clearing House (ACH) Payments',
      'In-App Purchases',
      'Gift Cards',
      'Barter',
      'Money Orders',
      'Contactless Payments',
      'PayPal and Other Online Payment Platforms',
      'Cryptocurrencies',
      'Mobile Payments',
      'Checks',
      'Electronic Funds Transfer (EFT)'
    ],
    default: 'Cash',
  },

  paymentStatus: {
    type: String,
    enum: ['Success', 'Declined', 'Hold'],
    default: 'Hold',
  },

  reservationStatus: {
    type: String,
    enum: ['Waiting', 'Done', 'Current', 'Canceled'],
    default: 'Current',
  },

  licencePlate: { type: String, trim: true },

  reservationDate: { type: Date, default: Date.now },
  isSubscription: { type: Boolean, default: false } 

});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
