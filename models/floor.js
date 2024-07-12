import mongoose from 'mongoose';

const floorSchema = new mongoose.Schema (
    {
park: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Park',
    required: true,
},

floorNumber: {
    type: Number,
    required: true,

},


    });
const Floor = mongoose.model('Floor', floorSchema);
export default Floor;