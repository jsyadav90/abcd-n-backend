import express from "express";
import {authenticateJWT} from "../middlewares/auth.middleware.js";
import { resetPassword } from "../controllers/resetPassword.controllers.js";

const router = express.Router();

router.post("/reset-password", authenticateJWT, resetPassword);

export default router;
