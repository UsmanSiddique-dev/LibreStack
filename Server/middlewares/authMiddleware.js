import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const authenticationToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No Token Provided,authorization denied",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        succuess: false,
        message: "Token is not valid or user no longer exists",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Jwt Auth errror", error);
    res.status(500).json({ message: "Jwt error", error: error.message });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Acces forbidden",
      });
    }
    next();
  };
};
