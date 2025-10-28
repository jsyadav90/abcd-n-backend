import mongoose, { Schema } from "mongoose";

const userRoleSchema = new Schema(
  {
    roleName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
     level: { type: Number, required: true }, // 1=Enterprise, 2=Super, 3=Admin, 4=User, 5=Custom
     
    // Define system-level permissions or access modules
    permissions: [
      {
        module: {
          type: String, // e.g. "inventory", "users", "finance"
          // required: true,
          lowercase: true,
          trim: true,
          actions: [
            {
              type: [String], // e.g. "view", "create", "edit", "delete", "export"
              lowercase: true,
              trim: true,
            },
          ],
        },
      },
    ],

    status: {
      type: Boolean,
      default: true, // true = active role
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// 📈 Useful index for queries
userRoleSchema.index({ roleName: 1 });

// 🧩 Virtual field for better display
// userRoleSchema.virtual("displayLabel").get(function () {
//   return this.roleName.charAt(0).toUpperCase() + this.roleName.slice(1);
// });

export const UserRole = mongoose.model("UserRole", userRoleSchema);
