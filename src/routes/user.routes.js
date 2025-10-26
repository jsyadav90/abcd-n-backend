import express from "express";
import { registerUser } from "../controllers/user.controllers.js";
import {authenticateJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = express.Router();

// Only logged-in admins or super admins can create users
router.route("/register").post(upload.none(), registerUser)

export default router;
