import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";

/**
 * Middleware to authenticate JWT
 */
const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new apiError(401, "Access token missing");
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    } catch (err) {
      throw new apiError(401, "Invalid or expired access token");
    }

    // Fetch user from DB
    const user = await User.findById(decoded.id)
      .populate("role")    // populate role for permissions
      .populate("branch"); // populate branch details

    if (!user || !user.isActive) {
      throw new apiError(401, "User not found or inactive");
    }

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export { authenticateJWT };
