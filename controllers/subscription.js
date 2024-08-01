import ParkingSpot from "../models/parkingSpot";


export const createSubscription = async (req, res, next) => {
    const { userId, parkingSpotId, startDate, finishDate, subscriptionPrice } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const newSubscription = new Subscription({
            userId,
            parkingSpotId,
            startDate: new Date(startDate),
            finishDate: new Date(finishDate),
            subscriptionPrice
        });

        await newSubscription.save({ session });

        await ParkingSpot.findByIdAndUpdate(
            parkingSpotId,
            { $push: { subscriptions: newSubscription._id } },
            { session }
        );

        await User.findByIdAndUpdate(
            userId,
            { $push: { subscriptions: newSubscription._id } },
            { session }
        );

        const newReservation = new Reservation({
            user: userId,
            park: (await ParkingSpot.findById(parkingSpotId).populate('park')).park._id,
            parkingSpot: parkingSpotId,
            startDate: new Date(startDate),
            finishDate: new Date(finishDate),
            licencePlate: '',
            paymentMethod: 'Subscription',
            totalPrice: subscriptionPrice,
            isSubscription: true
        });

        await newReservation.save({ session });

        await ParkingSpot.findByIdAndUpdate(
            parkingSpotId,
            { $push: { reservations: newReservation._id } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ subscription: newSubscription, reservation: newReservation });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};