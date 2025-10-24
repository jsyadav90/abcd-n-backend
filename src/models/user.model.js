import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: function () {
        return this.canLogin === true;
      },
    },
    password: {
      type: String,
      required: function () {
        return this.canLogin === true;
      },
      select: false,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      index: true,
    },
    phoneNo: {
      type: String,
      trim: true,
      match: [/^[0-9+\-()\s]*$/, "Invalid phone number format"],
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "UserRole",
      required: true,
    },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    department: {
      type: String,
      enum: ["admin", "teaching", "non-teaching", "school-office", "other"],
      trim: true,
      lowercase: true,
    },
    designation: {
      type: String,
      trim: true,
      lowercase: true,
    },
    canLogin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    remarks: {
      type: String,
      trim: true,
      lowercase: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    // Audit fields
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    lastLogin: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

//////////////////////////////
// Password Hashing
//////////////////////////////
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//////////////////////////////
// Password Compare Method
//////////////////////////////
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

//////////////////////////////
// Access Token
//////////////////////////////
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      fullName: this.fullName,
      role: this.role,
      branch: this.branch,
    },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

//////////////////////////////
// Refresh Token
//////////////////////////////
userSchema.methods.generateRefreshToken = async function () {
  const token = jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_KEY,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
  this.refreshToken = token;
  await this.save();
  return token;
};

//////////////////////////////
// RBAC Permission Check
//////////////////////////////
userSchema.methods.can = function (module, action) {
  if (!this.role || !this.role.permissions) return false;
  const permission = this.role.permissions.find((p) => p.module === module);
  return permission && permission.actions.includes(action);
};

export const User = mongoose.model("User", userSchema);
