// import { asyncHandler } from "../utils/asyncHandler.js";
// import { User } from "../models/user.model.js";
// import { UserRole } from "../models/userRole.model.js";
// import { Branch } from "../models/branch.model.js";
// import { apiError } from "../utils/apiError.js";
// import { apiResponse } from "../utils/apiResponse.js";

// const allowedRolesToRegister = ["enterprise admin", "super admin", "admin"];

// const registerUser = asyncHandler(async (req, res) => {
//   const admin = await User.findById(req.user._id)
//     .populate("role", "roleName")
//     .populate("branch", "branchName");

//   if (!admin) throw new apiError(401, "Admin not found or invalid");

//   const adminBranchId = admin.branch?._id || admin.branch || null;
//   if (!adminBranchId) throw new apiError(400, "Admin does not have any branch assigned");

//   const adminRoleName = admin.role?.roleName?.toLowerCase();
//   if (!allowedRolesToRegister.includes(adminRoleName)) {
//     throw new apiError(403, `Role '${adminRoleName}' cannot create users`);
//   }

//   const { fullName, username, password, email, phoneNo, department, designation, role, branch } = req.body;

//   if (!fullName) throw new apiError(400, "Full name is required");
//   if (!role) throw new apiError(400, "Role is required");

//   // ✅ Find role by name
//   const roleDoc = await UserRole.findOne({ roleName: role.toLowerCase() });
//   if (!roleDoc) throw new apiError(400, "Invalid role selected");

//   // ✅ Find branch by name (optional, fallback to admin branch)
//   let branchDoc = adminBranchId; // default
//   if (branch) {
//     const branchFound = await Branch.findOne({ branchName: branch.toLowerCase() });
//     if (!branchFound) throw new apiError(400, "Invalid branch selected");
//     branchDoc = branchFound._id;
//   }

//   // ✅ Check if username/email exists
//   const existingUser = await User.findOne({
//     $or: [{ username: username?.toLowerCase() }, { email: email?.toLowerCase() }],
//   });
//   if (existingUser) throw new apiError(400, "Username or email already exists");

//   // ✅ Create user
//   const newUser = await User.create({
//     fullName: fullName.toLowerCase(),
//     username: username?.toLowerCase(),
//     password,
//     email: email?.toLowerCase(),
//     phoneNo,
//     department: department?.toLowerCase(),
//     designation: designation?.toLowerCase(),
//     role: roleDoc._id,
//     branch: branchDoc,
//     canLogin: roleDoc.roleName.toLowerCase() !== "user",
//     createdBy: admin._id,
//   });

//   await newUser.populate([
//     { path: "role", select: "roleName" },
//     { path: "branch", select: "branchName" },
//   ]);

//   let tokens = null;
//   if (newUser.canLogin) {
//     tokens = {
//       accessToken: newUser.generateAccessToken(),
//       refreshToken: await newUser.generateRefreshToken(),
//     };
//   }

//   return res.status(201).json(
//     new apiResponse(
//       201,
//       {
//         id: newUser._id,
//         fullName: newUser.fullName,
//         username: newUser.username,
//         email: newUser.email,
//         phoneNo: newUser.phoneNo,
//         department: newUser.department,
//         designation: newUser.designation,
//         role: newUser.role?.roleName || "N/A",
//         branch: newUser.branch?.branchName || "N/A",
//         canLogin: newUser.canLogin,
//         isActive: newUser.isActive,
//         tokens,
//       },
//       "User created successfully"
//     )
//   );
// });

// export { registerUser };



import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { UserRole } from "../models/userRole.model.js";
import { Branch } from "../models/branch.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import bcrypt from "bcrypt";

const registerUser = asyncHandler(async (req, res) => {
  const {
    userId,
    fullName,
    username,
    password,
    email,
    phoneNo,
    role,
    branch,
    department,
    designation,
    canLogin = true,
    isActive = true,
    remarks,
  } = req.body;

  if (!fullName || !username || !password) {
    throw new apiError(400, "Full name, username, and password are required");
  }

  // Check if username/email already exists
  const existingUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email?.toLowerCase() }],
  });
  if (existingUser) throw new apiError(400, "Username or email already exists");

  // Optional: Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user
  const newUser = await User.create({
    userId,
    fullName: fullName.toLowerCase(),
    username: username.toLowerCase(),
    password: hashedPassword,
    email: email?.toLowerCase(),
    phoneNo,
    department: department?.toLowerCase(),
    designation: designation?.toLowerCase(),
    role,   // just string
    branch, // just string
    canLogin,
    isActive,
    remarks,
  });

  // Populate role and branch if you want (optional)
  await newUser.populate([
    { path: "role", select: "roleName" },
    { path: "branch", select: "branchName" },
  ]);

  // Generate tokens if user can login
  let tokens = null;
  if (newUser.canLogin) {
    tokens = {
      accessToken: newUser.generateAccessToken(),
      refreshToken: await newUser.generateRefreshToken(),
    };
  }

  return res.status(201).json(
    new apiResponse(
      201,
      {
        id: newUser._id,
        userId: newUser.userId,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        phoneNo: newUser.phoneNo,
        department: newUser.department,
        designation: newUser.designation,
        role: newUser.role,
        branch: newUser.branch,
        canLogin: newUser.canLogin,
        isActive: newUser.isActive,
        remarks: newUser.remarks,
        tokens,
      },
      "User created successfully"
    )
  );
});

export { registerUser };
