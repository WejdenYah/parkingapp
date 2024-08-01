import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    parkingId: {
        type: String,
        required: true,

    },
    startDate: {
        type: Date,
        required: true,
    },
    finishDate: {
        type: Date,
        required: true,
    },
    subscriptionStatus: {
        type: String,
        required: true,
        default: "Active",
    },
    subscriptionPrice: {
        type: Number,
        required: true,
    }

});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;