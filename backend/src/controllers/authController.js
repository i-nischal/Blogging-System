import User from "../models/User.js";
import UpgradeRequest from "../models/UpgradeRequest.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { generateToken, cookieOptions } from "../utils/generateToken.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json(ApiResponse.error("User already exists"));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || "reader", // Default to reader
  });

  if (user) {
    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie("token", token, cookieOptions);

    res.status(201).json(
      ApiResponse.created("User registered successfully", {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    );
  } else {
    res.status(400).json(ApiResponse.error("Invalid user data"));
  }
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);

    // Set cookie
    res.cookie("token", token, cookieOptions);

    res.json(
      ApiResponse.success("Login successful", {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    );
  } else {
    res.status(401).json(ApiResponse.unauthorized("Invalid email or password"));
  }
});

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = asyncHandler(async (req, res) => {
  // Clear the token cookie
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), // Expire immediately
  });

  res.json(ApiResponse.success("Logged out successfully"));
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  res.json(ApiResponse.success("User retrieved", req.user));
});

/**
 * @desc    Request writer role upgrade
 * @route   POST /api/auth/upgrade-request
 * @access  Private
 */
export const requestUpgrade = asyncHandler(async (req, res) => {
  const { message } = req.body;

  // Check if user already has a pending request
  const existingRequest = await UpgradeRequest.findOne({
    user: req.user._id,
    status: "pending",
  });

  if (existingRequest) {
    return res
      .status(400)
      .json(ApiResponse.error("You already have a pending upgrade request"));
  }

  // Create upgrade request
  const upgradeRequest = await UpgradeRequest.create({
    user: req.user._id,
    message,
  });

  res
    .status(201)
    .json(ApiResponse.created("Upgrade request submitted", upgradeRequest));
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json(
      ApiResponse.success("Profile updated", {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      })
    );
  } else {
    res.status(404).json(ApiResponse.notFound("User not found"));
  }
});

/**
 * @desc    Get user public profile
 * @route   GET /api/auth/profile/:userId
 * @access  Public
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select(
    "name email role createdAt"
  );

  if (!user) {
    return res.status(404).json(ApiResponse.notFound("User not found"));
  }

  // Get user's published blogs count
  const publishedBlogsCount = await Blog.countDocuments({
    author: user._id,
    status: "published",
  });

  // Get user's total likes received
  const totalLikesReceived = await Blog.aggregate([
    { $match: { author: user._id, status: "published" } },
    { $group: { _id: null, total: { $sum: "$likeCount" } } },
  ]);

  const profile = {
    ...user.toObject(),
    publishedBlogsCount,
    totalLikesReceived: totalLikesReceived[0]?.total || 0,
  };

  res.json(ApiResponse.success("User profile retrieved", profile));
});

/**
 * @desc    Become a writer (permanent upgrade)
 * @route   POST /api/auth/become-writer
 * @access  Private (Reader only)
 */
export const becomeWriter = asyncHandler(async (req, res) => {
  if (req.user.role === "writer") {
    return res.status(400).json(ApiResponse.error("You are already a writer"));
  }

  // Permanent upgrade to writer
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { role: "writer" },
    { new: true }
  ).select("-password");

  res.json(
    ApiResponse.success("Congratulations! You are now a writer", {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  );
});
