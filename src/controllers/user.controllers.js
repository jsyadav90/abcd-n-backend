import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const {
    userId,
    fullName,
    branch,
    role,
    canLogin,
    username,
    password,
    phoneNo,
    email,
    department,
    designation,
    isActive,
    remarks,
  } = req.body;

  // ===============================
  // 🧩 Basic Required Field Checks
  // ===============================
  if (!userId || userId.trim() === "") {
    throw new apiError(400, "User ID is required");
  }

  if (!fullName || fullName.trim() === "") {
    throw new apiError(400, "Full Name is required");
  }

  if (canLogin === true) {
    if (!username || username.trim() === "") {
      throw new apiError(400, "Username is required when login is allowed");
    }
    if (!password || password.trim() === "") {
      throw new apiError(400, "Password is required when login is allowed");
    }
  }

  // ===============================
  // 🔍 Duplicate Checks (only if provided)
  // ===============================
  if (email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new apiError(409, "User with this Email already exists");
    }
  }

  if (canLogin && username) {
    const existingUsername = await User.findOne({
      username: username.toLowerCase(),
    });
    if (existingUsername) {
      throw new apiError(409, "User with this Username already exists");
    }
  }

  if (phoneNo) {
    const existingPhone = await User.findOne({ phoneNo });
    if (existingPhone) {
      throw new apiError(409, "User with this Phone No already exists");
    }
  }

  // ===============================
  // 🏗️ Prepare User Data
  // ===============================
  const userData = {
    userId,
    fullName,
    branch,
    role,
    canLogin: !!canLogin,
    password,
    phoneNo,
    email,
    department,
    designation,
    isActive,
    remarks,
  };

  // Only include username if login is allowed
  if (canLogin && username) {
    userData.username = username.toLowerCase();
  }

  // ===============================
  // 💾 Create User
  // ===============================
  const user = await User.create(userData);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering a user");
  }

  // ===============================
  // ✅ Send Response
  // ===============================
  return res
    .status(201)
    .json(new apiResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };
