const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model('Item', ItemSchema);