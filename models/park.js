import mongoose from 'mongoose';


export const floorSchema = new mongoose.Schema({
  level: { type: Number, required: true },
  parkingSpots: [{ type: mongoose.Schema.Types.ObjectId, ref: "ParkingSpot" }]
});

export const Floor = mongoose.model('Floor', floorSchema);


const parkSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Added required: trues
  description: { type: String, required: true },  // Added required: true
  parkingType: { type: String, required: true },  // Added required: true
  address: {
    country: { type: String, required: true },  // Added required: true
    city: { type: String, required: true },  // Added required: true
    street: { type: String, required: true },  // Added required: true
    areaCode: { type: String, required: true }  // Added required: true
  },
  longitude: { type: Number, required: true },  // Added required: true
  latitude: { type: Number, required: true },  // Added required: true
  pricePerHour: { type: Number, required: true, min: 0 },  // Added required: true and min: 0
  startTime: { type: String, required: true },  // Added required: true
  endTime: { type: String, required: true },  // Added required: true
  parkingSpots: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingSpot"
  }],
  floors: [floorSchema]

});

const Park = mongoose.model('Park', parkSchema);

export default Park;
