import { apiError } from "../utils/apiError.js";

/**
 * ✅ Middleware: Allow only Enterprise Admins
 */
export const isEnterpriseAdmin = (req, res, next) => {
  try {
    console.log("🛡️ Running isEnterpriseAdmin...");

    const user = req.user; // from authenticateJWT

    if (!user) {
      throw new apiError(401, "Unauthorized: Please login first");
    }

    // ✅ if populated: user.role.roleName
    const roleName =
      typeof user.role === "object" ? user.role.roleName : user.role;

    if (!roleName || roleName.toLowerCase() !== "enterprise-admin") {
      throw new apiError(
        403,
        "Access denied: Only Enterprise Admins are allowed"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
