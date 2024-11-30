import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOtp } from "../utils/auth.utils.js";
import { userOtp } from "../models/userOtp.model.js";
import { sendEmail } from "../utils/email.js";
import { genToken } from "../utils/tokens.js";
export const register = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    const userExists = await User.findOne({ email });
    console.log(userExists);

    if (userExists) {
      return res
        .status(400)
        .json({ message: "user with the same email is already exists !" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    const otp = generateOtp();
    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-profile?otp=${otp}&email=${email}`;
    await userOtp.create({
      userId: user._id,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await sendEmail(email, "email verification ", "otp-verification", {
      name,
      otp,
      verificationUrl,
    });
    res.status(200).json({
      message: "Registered successfully ! Please go and check your email ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error ",
      error: error.message,
    });
  }
};

export const verifyProfile = async (req, res) => {
  try {
    const { email, otp } = req.query;
    if (!email || !otp) {
      return res.status(404).json({
        message: "Otp or email not found !",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "user not found !",
      });
    }
    const Otp = await userOtp.findOne({ userId: user._id });

    if (!Otp) {
      return res.status(404).json({
        message: "user OTP not found !",
      });
    }
    const currentTime = new Date();
    if (currentTime > userOtp.expiresAt) {
      return res.status(404).json({
        message: "user OTP not found !",
      });
    }
    if (otp === Otp.otp) {
      user.isActive = true;
      await user.save();
      await userOtp.deleteOne({ _id: Otp._id });

      return res.status(200).json({
        message: "Porfile is active now ! ",
      });
    }
    res.status(400).json({
      message: "incorrect OTP !  ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error ",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrPassword, password } = req.body;
    if (!emailOrPassword || !password) {
      return res.status(400).json({
        message: "Email/phone number and  password is missing ",
      });
    }
    const user = await User.findOne({ $or:[{email:emailOrPassword},{phoneNumber:emailOrPassword}] });
    if (!user) {
      return res.status(400).json({
        message: "Please signup first ! ",
      });
    }

    const loggedin = await bcrypt.compare(password, user.password);
    if (loggedin) {
      const token = await genToken({ userId: user._id, role: user.role });
      return res.status(200).json({ message: "Login successful!", token });
    }

    res.status(401).json({
      message: "Incorrect password ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error ",
      error: error.message,
    });
  }
};



  