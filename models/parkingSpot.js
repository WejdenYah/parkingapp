import mongoose from "mongoose";


const parkingSpotSchema=new mongoose.Schema({
    name: String,
    spotType:String,
    pricePerHour:Number,

    park: { type: mongoose.Schema.Types.ObjectId, ref: 'Park' },
    reservation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }]
})

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);

export default ParkingSpot;





