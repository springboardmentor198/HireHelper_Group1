const router = require("express").Router();
const Request = require("../models/Request");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

console.log("requestRoutes loaded");


// ACCEPT REQUEST 
router.put("/accept/:requestId", authMiddleware, async (req,res)=>{
  try {
    // 1. Find the request
    const request = await Request.findById(req.params.requestId);
    if(!request) return res.status(404).json({ msg:"Request not found" });

    // 2. Find the task attached to the request
    const task = await Task.findById(request.taskId);
    if(!task) return res.status(404).json({ msg:"Task not found" });

    // 3. Make sure the IDs are strings so they can be compared properly
    const myKey = String(req.userId);
    const houseLock = String(task.owner);
    // 4. Check if they match
    if (myKey !== houseLock) {
      console.log("MATCH FAILED! You are not logged in as the task creator.");
      return res.status(403).json({ msg:"Not allowed" });
    }

    // 5. IF THEY MATCH, update the database!
    console.log("MATCH SUCCESS! Updating database...");
    
    request.status = "accepted";
    await request.save(); // This saves it to MongoDB

    task.status = "assigned";
    await task.save();    // This saves it to MongoDB

    console.log(" DATABASE UPDATED SUCCESSFULLY!");
    res.json({ msg:"Request accepted", request });

  } catch(err){
    console.log("SERVER ERROR:", err);
    res.status(500).json({ msg:"Server error" });
  }
});
// ✅ REJECT REQUEST
router.put("/reject/:requestId", authMiddleware, async (req, res) => {
  try {
    // 1. Find the request
    const request = await Request.findById(req.params.requestId);
    if (!request) return res.status(404).json({ msg: "Request not found" });

    // 2. Find the task attached to the request
    const task = await Task.findById(request.taskId);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // 3. Security Check: Convert both to strings just like we did for Accept
    if (String(task.owner) !== String(req.userId)) {
      return res.status(403).json({ msg: "Not allowed: You are not the task owner" });
    }

    // 4. Update the status
    request.status = "rejected";
    await request.save();

    // Note: We don't change the Task status here because the task is still "open" 
    // for other helpers to apply to!

    res.json({ msg: "Request rejected successfully", request });

  } catch (err) {
    console.log(" REJECT ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// VIEW MY REQUESTS
router.get("/my", authMiddleware, async (req,res)=>{
  const requests = await Request.find({ helperId: req.userId });
  res.json(requests);
});


// Request to help with a task
router.post("/:taskId", authMiddleware, async (req,res)=>{
  try {

    const existing = await Request.findOne({
      taskId: req.params.taskId,
      helperId: req.userId
    });

    if(existing){
      return res.json({ msg:"Already requested" });
    }

    const request = await Request.create({
      taskId: req.params.taskId,
      helperId: req.userId,
      message: req.body.message
    });

    res.json({ msg:"Request sent", request });

  } catch(err){
    console.log(err);
    res.status(500).json({ msg:"Server error" });
  }
});

module.exports = router;