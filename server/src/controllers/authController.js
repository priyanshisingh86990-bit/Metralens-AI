const User = require("../models/User");

const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      inspectorId,
      password,
    } = req.body;

    if (!name || !email || !inspectorId || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { inspectorId },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or Inspector ID already exists",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      inspectorId: inspectorId.trim(),
      password,
      role: "INSPECTOR",
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        inspectorId: user.inspectorId,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error during signup",
    });
  }
};


const login = async (req, res) => {
  try {
    const {
      name,
      inspectorId,
    } = req.body;

    if (!name || !inspectorId) {
      return res.status(400).json({
        success: false,
        message: "Name and Inspector ID are required",
      });
    }

    const user = await User.findOne({
      inspectorId: inspectorId.trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Inspector account not found. Please sign up first.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    // Verify that the entered name belongs to this Inspector ID
    if (
      user.name.trim().toLowerCase() !==
      name.trim().toLowerCase()
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Name and Inspector ID do not match.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        inspectorId: user.inspectorId,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};


module.exports = {
  signup,
  login,
};