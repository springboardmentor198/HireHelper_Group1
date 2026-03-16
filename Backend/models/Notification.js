const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  message: {
    type: String,
    required: true
  },

  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  },

  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request"
  },

  isRead: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);