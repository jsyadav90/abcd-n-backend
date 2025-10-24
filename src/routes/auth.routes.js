import express from "express";
import { loginUser, refreshToken, logoutUser } from "../controllers/authController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticateJWT } from "../middlewares/authenticateJWT.js";

const router = express.Router();

// Login
router.post("/login", asyncHandler(loginUser));

// Refresh token
router.post("/refresh-token", asyncHandler(refreshToken));

// Logout (requires access token)
router.post("/logout", authenticateJWT, asyncHandler(logoutUser));

export default router;
