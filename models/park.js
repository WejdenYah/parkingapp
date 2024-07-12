import mongoose from 'mongoose';

const parkSchema = new mongoose.Schema({
  name: String,
  description: String,
 
  
  parkingType: String,
  address: {
      country: String,
    
      city: String,
      street: String,
      areaCode: String
  },
  longitude: Number,
  latitude: Number,
  
  parkingSpots: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingSpot"
  }]
});

const Park = mongoose.model('Park', parkSchema);

export default Park;