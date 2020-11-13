const mongoose = require('mongoose')

const tradeSchema = new mongoose.Schema({
    init_timestamp: {
      type: Date,
      required: true
    },
    complete_timestamp: {
      type: Date,
      required: false
    },
    status: {
      type: String,
      required: true
    },
    user1_id: {
      type: mongoose.ObjectId,
      required: true
    },
    user2_id: {
      type: mongoose.ObjectId,
      required: false
    },
    user1_items: [mongoose.ObjectId],
    user2_items: [mongoose.ObjectId]
  });

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;