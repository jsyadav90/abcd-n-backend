import mongoose from "mongoose";
import { UserRole } from "../models/userRole.model.js"; // adjust path if needed
import dotenv from "dotenv";

const roles = [
  // 🏢 ENTERPRISE ADMIN
  {
    roleName: "enterprise admin",
    description: "Full control over the entire ERP system and all tenants.",
    permissions: [
      { module: "users", actions: ["view", "create", "edit", "delete"] },
      { module: "roles", actions: ["view", "create", "edit", "delete"] },
      { module: "inventory", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "accessories", actions: ["view", "create", "edit", "delete"] },
      { module: "peripherals", actions: ["view", "create", "edit", "delete"] },
      { module: "upgrade", actions: ["view", "create", "edit", "delete"] },
      { module: "issue", actions: ["view", "create", "edit", "delete"] },
      { module: "departments", actions: ["view", "create", "edit", "delete"] },
      { module: "branches", actions: ["view", "create", "edit", "delete"] },
      { module: "reports", actions: ["view", "export"] },
      { module: "settings", actions: ["view", "edit"] },
    ],
  },

  // 🧑‍💼 SUPER ADMIN
  {
    roleName: "super admin",
    description: "Full access to manage the organization's ERP modules and users.",
    permissions: [
      { module: "users", actions: ["view", "create", "edit", "delete"] },
      { module: "roles", actions: ["view", "assign"] },
      { module: "inventory", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "accessories", actions: ["view", "create", "edit", "delete"] },
      { module: "peripherals", actions: ["view", "create", "edit", "delete"] },
      { module: "upgrade", actions: ["view", "create", "edit", "delete"] },
      { module: "issue", actions: ["view", "create", "edit", "delete"] },
      { module: "departments", actions: ["view", "create", "edit", "delete"] },
      { module: "reports", actions: ["view", "export"] },
      { module: "settings", actions: ["view", "edit"] },
    ],
  },

  // 👨‍🔧 ADMIN
  {
    roleName: "admin",
    description: "Manages department-level data, users, and assets without access to system-level settings.",
    permissions: [
      { module: "users", actions: ["view", "create", "edit"] },
      { module: "inventory", actions: ["view", "create", "edit", "assign"] },
      { module: "accessories", actions: ["view", "create", "edit", "assign"] },
      { module: "peripherals", actions: ["view", "create", "edit", "assign"] },
      { module: "upgrade", actions: ["view", "create", "edit"] },
      { module: "issue", actions: ["view", "create", "edit"] },
      { module: "departments", actions: ["view"] },
      { module: "reports", actions: ["view"] },
    ],
    restrictedModules: ["roles", "branches", "settings", "enterprise", "system_logs"],
  },

  // 👥 USER (Non-login)
  {
    roleName: "user",
    description: "Non-login user used for record and data mapping.",
    permissions: [],
  },
];

const seedUserRoles = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    for (const role of roles) {
      const existing = await UserRole.findOne({ roleName: role.roleName });
      if (existing) {
        console.log(`⚠️ Role already exists: ${role.roleName}`);
      } else {
        await UserRole.create(role);
        console.log(`✅ Role created: ${role.roleName}`);
      }
    }

    console.log("🎉 User roles seeding completed.");
  } catch (error) {
    console.error("❌ Error seeding roles:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
};

// Run seeder
seedUserRoles();
