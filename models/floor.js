import mongoose from 'mongoose';

const oldfloorSchema = new mongoose.Schema(
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
const oldFloor = mongoose.model('oldFloor', oldfloorSchema);
export default oldFloor;