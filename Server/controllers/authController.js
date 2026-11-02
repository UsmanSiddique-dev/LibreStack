import User from "../models/User";
import { generate } from "otp-generator";
import sendOtp from "../Utils/sendOTP";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
export async function registerUser(req, res) {
  try {
    const { name, email, phone, password } = req.body;
    if (!email)
      return res.status(400).json({
        message: "Email is required",
      });
    const cleanPhone = phone ? phone.replace(/\D/g, "") : null;
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        message: "phone number must be 10 digits",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          message: "User already exists",
        });
        await User.deleteOne({ email });
      }
    }
    const otp = generate(6, {
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });
    try {
      await sendOtp(email, otp);
    } catch (error) {
      console.error("Error sending OTP:", error);
      return res.status(500).json({
        message: "Failed to send otp please try again",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const studentId = `ST-${uuidv4().slice(0, 8).toUpperCase()}`;
    const user = await User.create({
      name,
      email,
      phone: cleanPhone,
      password: hashedPassword,
      otp,
      otpExpiry,
      studentId,
    });
    res.status(201).json({
      message: "User registered successfully,sent otp to your email",
    });
  } catch (error) {}
  console.error("Error registering  user", error);
  res.status(500).json({
    message: "Error Registering the user ",
    error: error.message,
  });
}
