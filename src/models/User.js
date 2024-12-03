const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  telegramId: { type: String, unique: true },
  username: { type: String },
  joinedChannel: { type: Boolean, default: false },
  spinsLeft: { type: Number, default: 3 },
  totalEarnings: { type: Number, default: 0 },
  referrals: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
