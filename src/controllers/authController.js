import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponce.js";

/**
 * Login user
 */
const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new apiError(400, "Username and password are required");
    }

    const user = await User.findOne({ username }).select("+password").populate("role").populate("branch");

    if (!user || !user.canLogin) {
      throw new apiError(401, "Invalid credentials or login not allowed");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new apiError(401, "Invalid credentials");
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json(
      new apiResponse(200, { accessToken, refreshToken }, "Login successful")
    );

  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new apiError(400, "Refresh token is required");
    }

    // Find user with this refresh token
    const user = await User.findOne({ refreshToken }).select("+refreshToken").populate("role").populate("branch");
    if (!user) {
      throw new apiError(403, "Invalid refresh token");
    }

    // Verify refresh token
    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    } catch (err) {
      user.refreshToken = null;
      await user.save();
      throw new apiError(403, "Expired or invalid refresh token");
    }

    // Generate new access token
    const accessToken = user.generateAccessToken();

    return res.status(200).json(
      new apiResponse(200, { accessToken }, "Access token refreshed")
    );

  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 */
const logoutUser = async (req, res, next) => {
  try {
    const user = req.user;
    user.refreshToken = null; // remove refresh token from DB
    await user.save();

    return res.status(200).json(
      new apiResponse(200, null, "Logged out successfully")
    );
  } catch (error) {
    next(error);
  }
};

export { loginUser, refreshToken, logoutUser };
