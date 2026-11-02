import User from "../models/User";
import { generate } from "otp-generator";
import sendOtp from "../Utils/sendOTP";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken"
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

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({
        message: "email is Required ",
      });
    const user = User.findOne({ email });
    if (!user)
      return res.status(400).json({
        message: "User not Found",
      });
    if (user.otp !== otp || new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({
        message: "Invalid or expire OTP",
      });
    }
    Object.assign(user, {
      isVerified: true,
      otp: null,
      otpExpiry: null,
    });
    await user.save();
    res.status(200).json({
      message: "User verified successfully",
    });
  } catch (error) {
    console.error("Error verifying user", error);
    res.status(500).json({
      message: "Error verifying the user",
      error: error.message,
    });
  }
}

export async function completeProfile(req, res) {
  try {
    const { email, department, stream, semester, year, rollNo } = req.body;
     if (!email)
      return res.status(400).json({
        message: "email is Required ",
      });
    const user = User.findOne({ email });
      if (!user)
        return res.status(400).json({
          message: "User not Found",
        });
      if (!user.isVerified) return  res.status(400).json({
        message:"User not Verified"
      })
      Object.assign(user,{
        department,stream,semester,year,rollNo,isProfileComplete:true
      })
      await user.save()
      res.status(200).json({
        message:"Profile completed successfully"
      })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      message:"error completing the profile",
      error:error.message
    })
  }
}
export async function loginUser(req,res) {
  try {
    const {email,password}=req.body
    if(!email || !password){
      return res.status(400).json({
        success:false,
        message:"Email and Password are Required"
      })
    }
    const user=await User.findOne({email})
    if(!user){
      return res.status(400).json({
        success:false,
        message:"User not found"
      })
    }
    if(!user.isverified){
      return res.status(400).json({
        success:false,
        message:"please verify your email before logging in"
      })
    }
    if(!(bcrypt.compare(password,user.password))){
      return res.status(400).json({
        success:false,
        message:"Invalid Credentials"
      })
    }
    const token= jwt.sign({
      id:user._id,
      role:user.role
    },process.env.JWT_SECRET,{
      expiresIn:  "7d"
    })
    const {password :_,...userResponse}=user.toObject()
    res.status(200).json({
      success:true,
      token,
      user:userResponse
    })




  } catch (error) {
    console.error(error)
     res.status(500).json({
      success: false, 
      message:"login failed",
      error:error.message
     })   
  }
  
}