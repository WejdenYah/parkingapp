import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/errors.js"
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import Role from "../models/role.js";




// Register
export const register = async (req, res, next) => {
  try {

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const userROLE = await Role.findOne({ name: 'user' })

    const newUser = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: hash,
      role: userROLE.id

    })
    await newUser.save()
    res.status(200).send("User has been created.")
  } catch (err) {
    next(err)
  }
}

//Login 
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate([{ path: 'cars' }, { path: 'role' }])
      .exec();
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) return next(createError(400, "Wrong password or username"));

    const token = jwt.sign({ id: user._id, role: user.role.name }, process.env.JWT);

    const { password, ...otherDetails } = user._doc;



    res.cookie("access_token", token, {
      httpOnly: true,
    }).status(200).json({ ...otherDetails, token });
  } catch (err) {
    console.log('auth login error : ', err);
    next(err);
  }
};

//reset password
export const resetPassword = async (req, res, next) => {
  try {

    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));


    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587, // Use port 587 for non-secure connections or port 465 for secure connections
      secure: false, // Set to true if using port 465
      auth: {
        user: 'apikey', // Your SendGrid API key goes here
        pass: process.env.SENDGRID_API_KEY
        // Your SendGrid API key goes here

      }
    });

    // Define email options
    let mailOptions = {
      from: 'wejden.yah@gmail.com', // Sender address
      to: req.body.email, // Recipient address
      subject: 'Password Reset', // Subject line
      text: '' // Plain text body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return next(error); // Pass error to error handler middleware
      }
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Password reset email sent successfully' });
    });

  } catch (error) {
    next(error)
  }
};


//register proprietere 

export const registerProprietere = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) return next(createError(403, "User exist"));
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const userROLE = await Role.findOne({ name: req.body.role })

    const newUser = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: hash,
      role: userROLE.id

    })
    await newUser.save()
    res.status(200).send(`${req.body.role} has been created`)
  } catch (err) {
    next(err)
  }
}
//login proprietere
export const loginProprietere = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate('role', 'name');

    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) return next(createError(400, "Wrong password or username"));

    const token = jwt.sign({ id: user._id, role: user.role.name }, process.env.JWT);

    const { password, ...otherDetails } = user._doc;

    res.status(200).json({

      user: otherDetails,
      token: token
    });
  } catch (err) {
    next(err);
  }
};