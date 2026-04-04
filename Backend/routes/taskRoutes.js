const express = require("express");
const router = express.Router();  
const multer = require("multer"); // Added Multer
const path = require("path");     // Added Path for file extensions
const mongoose = require("mongoose");

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
// ✅ Create Task with MULTIPLE Image Uploads
// Changed 'upload.single' to 'upload.array' (allowing up to 5 images)
router.post("/", authMiddleware, upload.array("taskImages", 5), async (req, res) => {
  try {
    console.log("Endpoint hit! Incoming data:", req.body); 
    console.log("Files received:", req.files); // Notice this is now req.files (plural)

    // Loop through the uploaded files and create an array of their paths
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const task = await Task.create({
      title: req.body.title,
      category: req.body.category, 
      location: req.body.location,
      date: req.body.date,         
      time: req.body.time,         
      description: req.body.description,
<<<<<<< HEAD
      //Save the file path to the database
      taskImage: req.file ? `/uploads/${req.file.filename}` : null,
=======
      // ✅ Save the array of file paths to the database
      taskImages: imagePaths, 
>>>>>>> Developer
      owner: req.userId  
    });

    console.log("Task successfully saved to database with multiple images!"); 

    res.json({
      msg: "Task created successfully",
      task
    });

  } catch (err) {
    console.error("Error saving task:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Feed tasks (exclude current user's tasks AND only show "open" tasks)
router.get("/feed", authMiddleware, async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.userId);
<<<<<<< HEAD
    // .sort({ createdAt: -1 }) puts the newest tasks at the top!
    const tasks = await Task.find().sort({ createdAt: -1 }); 
=======
    
    //  status: "open" TO THE FILTER
    const tasks = await Task.find({ 
      owner: { $ne: ownerId }, 
      status: "open" 
    }).sort({ createdAt: -1 });
    
>>>>>>> Developer
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Feed tasks (exclude current user's tasks AND only show "open" tasks)
router.get("/feed", authMiddleware, async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.userId);
    
    //  status: "open" TO THE FILTER
    const tasks = await Task.find({ 
      owner: { $ne: ownerId }, 
      status: "open" 
    }).sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

//my tasks
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.userId);
    const tasks = await Task.find({ owner: ownerId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
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
// GET SINGLE TASK DETAILS
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    // 1. Find the task by the ID in the URL
    // We also use .populate() just in case your frontend wants to show the owner's name!
    const task = await Task.findById(req.params.id).populate("owner", "name email");

    // 2. If it doesn't exist, tell the frontend
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // 3. Send the exact task data back to the frontend
    res.json(task);

  } catch (err) {
    console.error("Error fetching single task:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
// MARK TASK AS COMPLETED
router.put("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // Make sure only the owner can complete it
    if (task.owner.toString() !== req.userId) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    task.status = "completed";
    await task.save();
    res.json({ msg: "Task marked as completed!", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
module.exports = router;