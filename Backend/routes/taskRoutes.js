const express = require("express");
const router = express.Router();  
const multer = require("multer"); // Added Multer
const path = require("path");     // Added Path for file extensions

const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

// 🛠️ MULTER STORAGE CONFIGURATION
// This tells Multer where to save the files and how to name them
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure you create this folder in your backend root!
  },
  filename: (req, file, cb) => {
    // Saves as: timestamp-originalname (e.g., 1709461234567-sofa.jpg)
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Create Task with Image Upload
// Added 'upload.single("taskImage")' middleware
router.post("/", authMiddleware, upload.single("taskImage"), async (req, res) => {
  try {
    // 1. Verify the data actually arrived at the server
    console.log(" Endpoint hit! Incoming data:", req.body); 
    console.log(" File received:", req.file); // Log the file details

    const task = await Task.create({
      title: req.body.title,
      category: req.body.category, 
      location: req.body.location,
      date: req.body.date,         
      time: req.body.time,         
      description: req.body.description,
      // ✅ Save the file path to the database
      taskImage: req.file ? `/uploads/${req.file.filename}` : null,
      owner: req.userId  
    });

    // 2. Verify Mongoose successfully created the object
    console.log(" Task successfully saved to database:", task); 

    res.json({
      msg: "Task created successfully",
      task
    });

  } catch (err) {
    console.error(" Error saving task:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get ALL tasks for the Feed
router.get("/", authMiddleware, async (req, res) => {
  try {
    // .sort({ createdAt: -1 }) puts the newest tasks at the top!
    const tasks = await Task.find().sort({ createdAt: -1 }); 
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

//my tasks
router.get("/my", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ owner: req.userId });
  res.json(tasks);
});

//delete task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task)
      return res.status(404).json({ msg: "Task not found" });

    //  Correct ownership check
    if (task.owner.toString() !== req.userId)
      return res.status(401).json({ msg: "Not authorized" });

    await Task.findByIdAndDelete(req.params.id);

    res.json({ msg: "Task deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;