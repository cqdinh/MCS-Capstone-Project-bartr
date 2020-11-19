const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const ItemSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  display_name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Unsold",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = Item = mongoose.model("items", ItemSchema);
