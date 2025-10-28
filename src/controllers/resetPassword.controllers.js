import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

/**
 * 🔐 Reset or Change Password
 * Applies full role-based ERP logic
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  const requester = req.user; // from authenticateJWT middleware

  if (!requester) {
    throw new apiError(401, "Unauthorized: Please login first");
  }

  if (!requester.canLogin) {
    throw new apiError(403, "You are not allowed to reset passwords");
  }

  if (!userId || !newPassword || newPassword.trim() === "") {
    throw new apiError(400, "User ID and new password are required");
  }

  // =========================
  // 🔍 Fetch Target User
  // =========================
  const targetUser = await User.findOne({ userId }).populate("role branch");
  if (!targetUser) {
    throw new apiError(404, "Target user not found");
  }

  const requesterRole = requester.role?.roleName?.toLowerCase();
  const targetRole = targetUser.role?.roleName?.toLowerCase();
  const sameBranch =
    requester.branch?.toString() === targetUser.branch?.toString();

  const isSelf = requester._id.toString() === targetUser._id.toString();

  // =========================
  // 🔒 Role-based Permission Logic
  // =========================
  let canReset = false;

  switch (requesterRole) {
    case "enterprise admin":
      // Enterprise admin can reset any user's password
      canReset = true;
      break;

    case "super admin":
      // Can change own password
      if (isSelf) canReset = true;
      // Can reset same branch "user" role
      else if (sameBranch && targetRole === "user") canReset = true;
      // Can reset admins under their control
      else if (targetRole === "admin") canReset = true;
      break;

    case "admin":
      // Can change own password
      if (isSelf) canReset = true;
      // Can reset same branch “user” role
      else if (sameBranch && targetRole === "user") canReset = true;
      break;

    case "user":
      // User cannot reset anything
      canReset = false;
      break;

    default:
      canReset = false;
  }

  if (!canReset) {
    throw new apiError(403, "You are not allowed to reset this user's password");
  }

  // =========================
  // 🧩 If self-reset, verify old password
  // =========================
  if (isSelf) {
    if (!oldPassword) {
      throw new apiError(400, "Old password is required to change your own password");
    }

    const validOld = await bcrypt.compare(oldPassword, requester.password);
    if (!validOld) {
      throw new apiError(401, "Old password is incorrect");
    }
  }

  // =========================
  // 🔑 Update Password
  // =========================
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  targetUser.password = hashedPassword;
  await targetUser.save();

  // =========================
  // ✅ Response
  // =========================
  return res
    .status(200)
    .json(new apiResponse(200, null, `Password reset successfully for ${targetUser.fullName}`));
});

export { resetPassword };
