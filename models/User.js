import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  cars: [{
    type: Schema.Types.ObjectId,
    ref: 'Car'
  }]
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;



