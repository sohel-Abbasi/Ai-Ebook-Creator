import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper :-> to Generate jwt

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc Register new user
// @route POST/api/auth/register
// @access public

const registerUser = async (req, res) => {
  try {
    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "please fill all fields" });
    }
    // check if user exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // create user
    const user = await User.create({ name, email, password });

    if (user) {
      return res.status(201).json({
        message: "user created successfully",
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: "invalid user data" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "server error", success: false, error: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
// @access public

const loginUser = async (req, res) => {
  try {
    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user by email and include password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return user data and token
    return res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPro: user.isPro,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "server error", success: false, error: error.message });
  }
};

// @desc GET current logged-in user
// @route GET /api/auth/profile
// @access Private

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isPro: user.isPro,
    });
  } catch (error) {
    res.status(500).json({ message: "server error", success: false });
  }
};

// @desc Update user profile
// @route PUT /api/auth/me
// @access Private

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
      });
    } else {
      res.status(404).json({ message: "user not found", success: false });
    }
  } catch (error) {
    res.status(500).json({ message: "server error", success: false });
  }
};

export { registerUser, loginUser, updateUserProfile, getProfile };
