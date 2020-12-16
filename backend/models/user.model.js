const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  display_name: {
    type: String,
    required: true,
  },
  location: {
    type: pointSchema,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  items: [mongoose.ObjectId],
  curr_trades: [mongoose.ObjectId],
  past_trades: [mongoose.ObjectId],
  profilePicture: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
