const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  },

  helperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  message: String,

  status: {
    type: String,
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);
