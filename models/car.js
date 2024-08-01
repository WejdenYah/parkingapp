import mongoose, { Schema } from "mongoose";

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,

    },
    matricule: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }


});

const Car = mongoose.model('Car', carSchema);
export default Car;