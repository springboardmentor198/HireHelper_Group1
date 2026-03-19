const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");

// ✅ Make sure these two lines are here!
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// =============================
// 1. REGISTER USER
// =============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOtp();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    await user.save();

    await sendEmail(
      email,
      "Verify Your Account",
      `Your registration OTP is ${otp}`
    );

    res.status(201).json({
      msg: "Registration successful. OTP sent to email.",
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ msg: "Server error during registration" });
  }
});


// =============================
// 2. LOGIN USER
// =============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid password" });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendEmail(
      email,
      "Your Login OTP Code",
      `Your OTP is ${otp}`
    );

    res.json({ msg: "OTP sent to email" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});


// =============================
// 3. FORGOT PASSWORD
// =============================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendEmail(
      email,
      "Reset Your Password",
      `Your password reset OTP is ${otp}`
    );

    res.json({ msg: "Password reset OTP sent to email" });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});


// =============================
// 4. VERIFY OTP
// =============================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ msg: "OTP verified", token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});


// =============================
// 5. RESET PASSWORD
// =============================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: "Password updated successfully" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});
// =============================
// 6. GOOGLE LOGIN
// =============================
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    // 1. Securely verify the ID token with the official Google Library
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    // 2. Extract the user's secure data
    const payload = ticket.getPayload();
    const { email, name } = payload;

    if (!email) {
      return res.status(400).json({ msg: "Failed to get email from Google" });
    }

    // 3. Check if this user exists in your database
    let user = await User.findOne({ email });

    if (!user) {
      // 4. Create a new user automatically!
      user = new User({
        name,
        email,
        isVerified: true 
      });
      await user.save();
    }

    // 5. Generate your standard HireHelper JWT
    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ msg: "Google login successful", token: jwtToken });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ msg: "Google login failed" });
  }
});

module.exports = router;