import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import parkRoute from "./routes/parks.js";
import reservationRoute from "./routes/reservations.js";
import carRoute from "./routes/cars.js";
import floorRoute from "./routes/floors.js";
import parkingSpotRoutes from "./routes/parkingSpots.js";
import Role from './models/role.js'; 

const app = express();
dotenv.config();
app.use(cors());

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongoDB");
        await createRoles(); 
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
});

// Middleware
app.use(cookieParser());
app.use(express.json());



app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/parks", parkRoute);
app.use("/api/reservations", reservationRoute);
app.use("/api/cars", carRoute);
app.use("/api/floors", floorRoute);
app.use("/api/parkingSpots", parkingSpotRoutes);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

const createRoles = async () => {
    const roles = [
        { name: 'admin' },
        { name: 'proprietaire_parking' },
        { name: 'responsable_parking' },
        { name: 'user'  }
    ];

    try {
        for (const roleData of roles) {
            const existingRole = await Role.findOne({ name: roleData.name });
            if (!existingRole) {
                const role = new Role(roleData);
                await role.save();
            }
        }
        //console.log('Roles created successfully or already exist');
    } catch (error) {
        console.error('Error creating roles:', error);
    }
};

app.listen(8800, () => {
    connect();
    console.log("Connected to backend!");
});
