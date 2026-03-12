const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const Notification = require("../models/Notification");

router.get("/me",auth,async(req,res)=>{
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

router.get("/notifications",auth,async(req,res)=>{
  const notes = await Notification.find({userId:req.userId});
  res.json(notes);
});

module.exports = router;
