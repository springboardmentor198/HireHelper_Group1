const mongoose = require("mongoose");

module.exports = mongoose.model("Notification", new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  message: String,
  isRead: { type: Boolean, default:false }
},{timestamps:true}));
