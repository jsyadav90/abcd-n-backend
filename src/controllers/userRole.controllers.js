import { UserRole } from "../models/userRole.model.js";

// ✅ Create a new user role
export const createUserRole = async (req, res) => {
  try {
    const { roleName, description, permissions, status } = req.body;
    // const createdBy = req.user?._id; // optional if using auth middleware

    // Check if role already exists
    const existingRole = await UserRole.findOne({ roleName: roleName.toLowerCase() });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    // Create new role
    const newRole = await UserRole.create({
      roleName,
      description,
      permissions,
      status,
      // createdBy,
    });

    res.status(201).json({
      success: true,
      message: "User role created successfully",
      data: newRole,
    });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Get all roles
export const getAllUserRoles = async (req, res) => {
  try {
    const roles = await UserRole.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Get single role
export const getUserRoleById = async (req, res) => {
  try {
    const role = await UserRole.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    res.status(200).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Update a role
export const updateUserRole = async (req, res) => {
  try {
    const updatedRole = await UserRole.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user?._id },
      { new: true }
    );

    if (!updatedRole) return res.status(404).json({ message: "Role not found" });

    res.status(200).json({ success: true, message: "Role updated", data: updatedRole });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Delete a role
export const deleteUserRole = async (req, res) => {
  try {
    const deletedRole = await UserRole.findByIdAndDelete(req.params.id);
    if (!deletedRole) return res.status(404).json({ message: "Role not found" });

    res.status(200).json({ success: true, message: "Role deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
