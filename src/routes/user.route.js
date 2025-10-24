import express from "express";
import { createUser } from "../controllers/createUser.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// Only logged-in admins or super admins can create users
router.post("/create", authenticateJWT, asyncHandler(createUser));

export default router;
