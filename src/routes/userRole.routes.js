import express from "express";
import {upload} from "../middlewares/multer.middleware.js"
import {
  createUserRole,
  getAllUserRoles,
  getUserRoleById,
  updateUserRole,
  deleteUserRole,
} from "../controllers/userRole.controllers.js";

const router = express.Router();

router.route("/create").post(upload.none(),createUserRole).get(getAllUserRoles);
router
  .route("/:id")
  .get(getUserRoleById)
  .put(updateUserRole)
  .delete(deleteUserRole);

export default router;
