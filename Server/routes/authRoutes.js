import {Router} from "express"
import { completeProfile, getProfile, getUsers, loginUser, registerAdmin, registerUser, updateProfile, verifyOtp } from "../controllers/authController";
import { authenticationToken, authorizeRoles } from "../middlewares/authMiddleware";


const authRouter= Router()

authRouter.post("/register",registerUser)
authRouter.post("/verify-otp",verifyOtp)
authRouter.post("/complete-profile",completeProfile)
authRouter.post("/login",loginUser)
authRouter.post("/register-admin",registerAdmin)


// protected Routes

authRouter.get("/me",authenticationToken,getProfile);
authRouter.put("update-profile",authenticationToken,updateProfile)
authRouter.get("/users",authenticationToken,authorizeRoles("admin"),getUsers)
export default authRouter;