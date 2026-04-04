const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Task = require("../models/Task");
const bcrypt = require("bcryptjs");
// ✅ Multer for Profile Picture Uploads
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Saving to the same uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-profile-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.get("/me",auth,async(req,res)=>{
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

router.get("/notifications",auth,async(req,res)=>{
  const notes = await Notification.find({userId:req.userId});
  res.json(notes);
});

// ✅ Update Profile Route
router.put("/me", auth, upload.single("profilePicture"), async (req, res) => {
  try {
    const { name, email, phone,bio } = req.body;

    // Build an object with the fields the user wants to update
    let updateFields = { name, email, phone,bio };

    // If the user uploaded a new profile picture, add it to the update object
    if (req.file) {
      updateFields.profilePicture = `/uploads/${req.file.filename}`;
    }

    // Find the user and update them in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateFields },
      { returnDocument: 'after' } // ✅ FIXED: Replaced 'new: true' to clear the warning!
    ).select("-password");

    res.json({ 
      msg: "Profile updated successfully!", 
      user: updatedUser 
    });

  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
// CHANGE PASSWORD ROUTE
router.put("/change-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    // 1. Find the user AND explicitly force Mongoose to grab the password
    const user = await User.findById(req.userId).select("+password");

    // 2. 🛡️ SAFETY CHECKS (Prevents the app from crashing!)
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!user.password) {
      return res.status(400).json({ msg: "No password exists for this account. You may have created it before passwords were required." });
    }

    // 3. Check if the old password they typed is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect current password" });
    }

    // 4. Hash the new password for security
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // 5. Save the updated user
    await user.save();

    res.json({ msg: "Password updated successfully!" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
// ✅ DELETE ACCOUNT ROUTE
router.delete("/me", auth, async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Delete all tasks created by this user
    await Task.deleteMany({ owner: userId });

    // 2. Delete all notifications belonging to this user
    await Notification.deleteMany({ userId: userId });

    // 3. Finally, delete the actual user account
    await User.findByIdAndDelete(userId);

    res.json({ msg: "Account and all associated data deleted successfully." });
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
module.exports = router;