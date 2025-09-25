const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an area name'],
    unique: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Area', areaSchema);