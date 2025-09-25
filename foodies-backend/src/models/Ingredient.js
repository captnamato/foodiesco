const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an ingredient name'],
    unique: true,
    trim: true
  },
  image: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ingredient', ingredientSchema);