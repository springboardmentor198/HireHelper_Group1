const mongoose = require("mongoose");

module.exports = mongoose.model("OTP", new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  code: String,
  expiresAt: Date,
}));
