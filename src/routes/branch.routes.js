import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  toggleBranchStatus,
} from "../controllers/branch.controllers.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { isEnterpriseAdmin } from "../middlewares/enterpriseAdmin.middleware.js";

const router = express.Router();

// ✅ Create a new branch (requires login + admin)
router
  .route("/create")
  .post(authenticateJWT, isEnterpriseAdmin, upload.single("logo"), createBranch);

// ✅ View all branches (public)
router.route("/allbranches").get(getAllBranches);

// ✅ Get, Update, Delete single branch
router
  .route("/:id")
  .get(getBranchById)
  .put(authenticateJWT, isEnterpriseAdmin, updateBranch)
  .delete(authenticateJWT, isEnterpriseAdmin, deleteBranch);

// ✅ Toggle branch status (admin only)
router
  .route("/:id/toggle-status")
  .patch(authenticateJWT, isEnterpriseAdmin, toggleBranchStatus);

export default router;
