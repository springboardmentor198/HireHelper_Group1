const router = require("express").Router();
const Request = require("../models/Request");
const Task = require("../models/Task");
const Notification = require("../models/Notification");
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

    //  Re-added the missing code to find the other helpers who applied
    const otherRequests = await Request.find({ 
      taskId: task._id, 
      _id: { $ne: request._id } 
    });

    // Automatically reject all OTHER pending requests for this task
    await Request.updateMany(
      { taskId: task._id, _id: { $ne: request._id } }, // Find requests for this task that are NOT the accepted one
      { $set: { status: "rejected" } } // Change their status to rejected
    );

    //  WRAPPED IN TRY/CATCH TO FIND THE SILENT BUG
    try {
      if (otherRequests.length > 0) {
        const rejectionNotifications = otherRequests.map(otherReq => ({
          userId: otherReq.helperId,
          message: `Sorry to say, someone else was hired for the task: "${task.title}".`,
          taskId: task._id,
          requestId: otherReq._id
        }));
        await Notification.insertMany(rejectionNotifications);
      }

      await Notification.create({
        userId: request.helperId, 
        message: `Great news! Your request to help with "${task.title}" was accepted.`,
        taskId: task._id,
        requestId: request._id
      });
      console.log(" Notifications created successfully!");
    } catch (notifErr) {
      console.log("🚨 ERROR CREATING NOTIFICATIONS:", notifErr);
    }

    res.json({ msg:"Request accepted", request });

  } catch(err){
    console.log("SERVER ERROR:", err);
    res.status(500).json({ msg:"Server error" });
  }
});

// REJECT REQUEST
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
    // Notify the helper that they were rejected
    await Notification.create({
      userId: request.helperId,
      message: `Your request to help with "${task.title}" was declined.`,
      taskId: task._id,
      requestId: request._id
    });
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
  try {
    const requests = await Request.find({ helperId: req.userId })
      //  pulls the Location and the Owner's Name!
      .populate({
        path: "taskId",
        select: "title location owner", 
        populate: { path: "owner", select: "name" } 
      });
      
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// VIEW REQUESTS RECEIVED FOR MY TASKS
router.get("/received", authMiddleware, async (req, res) => {
  try {

    // 1. Find tasks owned by this user
    const myTasks = await Task.find({ owner: req.userId });

    const taskIds = myTasks.map(task => task._id);

    // 2. Find requests for those tasks
    const requests = await Request.find({
      taskId: { $in: taskIds }
    })
    .populate("helperId", "name email")
    .populate("taskId", "title");

    res.json(requests);

  } catch (err) {
    console.log("RECEIVED REQUESTS ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

//  Request to help with a task (SEND REQUEST)
router.post("/:taskId", authMiddleware, async (req,res)=>{
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ msg: "Task not found" });

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

    console.log("=== DEBUGGING NOTIFICATION ===");
    console.log("1. Task Title:", task.title);
    console.log("2. Task Owner ID:", task.owner);
    console.log("3. Helper ID:", req.userId);

    // Notify the Task Owner
    const notif = await Notification.create({
      userId: task.owner, 
      message: `You have a new request to help with your task: "${task.title}"`,
      taskId: task._id,
      requestId: request._id
    });

    console.log("4. Notification created successfully:", notif._id);
    console.log("==============================");

    res.json({ msg:"Request sent", request });

  } catch(err){
    console.log("🚨 ERROR IN POST REQUEST:", err);
    res.status(500).json({ msg:"Server error" });
  }
});

module.exports = router;