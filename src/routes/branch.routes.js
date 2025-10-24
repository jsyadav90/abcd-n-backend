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

const router = express.Router();

// ==============================
// Branch Routes (No Authentication)
// ==============================

// Create a new branch
router.route("/create").post(upload.single("logo"),createBranch);

// Get all branches
router.route("/allbranches").get(getAllBranches);

// Get, Update, Delete a single branch by ID
router
  .route("/:id")
  .get(getBranchById)
  .put(updateBranch)
  .delete(deleteBranch);

// Toggle branch status (active/inactive)
router.route("/:id/toggle-status").patch(toggleBranchStatus);

export default router;





























// import express from "express";
// import {
//   createBranch,
//   getAllBranches,
//   getBranchById,
//   updateBranch,
//   deleteBranch,
//   toggleBranchStatus,
// } from "../controllers/branch.controller.js";
// import { authenticateJWT } from "../middlewares/auth.middleware.js";

// const router = express.Router();

// // ==============================
// // Branch Routes
// // ==============================

// // Create a new branch (only authenticated admins)
// router.route("/").post(authenticateJWT, createBranch);

// // Get all branches (authenticated users)
// router.route("/").get(authenticateJWT, getAllBranches);

// // Get, Update, Delete a single branch by ID
// router
//   .route("/:id")
//   .get(authenticateJWT, getBranchById)
//   .put(authenticateJWT, updateBranch)
//   .delete(authenticateJWT, deleteBranch);

// // Toggle branch status (active/inactive)
// router.route("/:id/toggle-status").patch(authenticateJWT, toggleBranchStatus);

// export default router;
