import express from "express";
import {
  authenticationToken,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import { searchStudentsByRoll } from "../controllers/studentController.js";
const studentrouter = express.Router();

studentrouter.get(
  "/search-by-role",
  authenticationToken,
  authorizeRoles("admin"),
  searchStudentsByRoll,
);
export default studentrouter;
