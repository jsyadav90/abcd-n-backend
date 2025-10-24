import {asyncHandler} from "../utils/asyncHandler.js"


const registerUser = asyncHandler(async (req,res)=>{
    res.status(200).json({
        massage : "OK"
    })
})

export {registerUser}








/**
 * Create a new user
 * Only accessible by admins or higher roles
 */
// const createUser = async (req, res, next) => {
//   try {
//     const admin = req.user; // from auth middleware
//     if (!admin.branch) {
//       throw new apiError(400, "Admin branch not found");
//     }

//     // Check if admin has permission to create users
//     if (!admin.can("users", "create")) {
//       throw new apiError(403, "You do not have permission to create users");
//     }

//     const { fullName, username, password, email, phoneNo, department, designation, roleId } = req.body;

//     // Check if username or email already exists
//     const existingUser = await User.findOne({
//       $or: [{ username }, { email }]
//     });
//     if (existingUser) {
//       throw new apiError(400, "Username or email already exists");
//     }

//     // Find role object
//     const role = await UserRole.findById(roleId);
//     if (!role) throw new apiError(400, "Invalid role selected");

//     // Create user
//     const newUser = await User.create({
//       fullName,
//       username,
//       password,
//       email,
//       phoneNo,
//       department,
//       designation,
//       role: role._id,
//       branch: admin.branch, // auto-assign branch
//       canLogin: role.roleName !== "user", // non-login roles cannot login
//       createdBy: admin._id
//     });

//     // Generate tokens only if the user can login
//     let tokens = null;
//     if (newUser.canLogin) {
//       tokens = {
//         accessToken: newUser.generateAccessToken(),
//         refreshToken: await newUser.generateRefreshToken()
//       };
//     }

//     return res.status(201).json(
//       new apiResponse(201, {
//         id: newUser._id,
//         fullName: newUser.fullName,
//         username: newUser.username,
//         email: newUser.email,
//         phoneNo: newUser.phoneNo,
//         department: newUser.department,
//         designation: newUser.designation,
//         role: role.roleName,
//         branch: admin.branch,
//         canLogin: newUser.canLogin,
//         isActive: newUser.isActive,
//         tokens
//       }, "User created successfully")
//     );
//   } catch (error) {
//     next(error);
//   }
// };

// export { createUser };
