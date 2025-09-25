const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  instructions: {
    type: String,
    required: [true, 'Please add instructions'],
    maxlength: [5000, 'Instructions cannot be more than 5000 characters']
  },
  image: {
    type: String,
    required: false
  },
  cookingTime: {
    type: Number,
    required: false,
    min: [1, 'Cooking time must be at least 1 minute']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area',
    required: true
  },
  ingredients: [{
    ingredient: {
      type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String
      required: true
    },
    name: {
      type: String, // For simple ingredient names
      required: false
    },
    measure: {
      type: String,
      required: [true, 'Please add ingredient measure']
    }
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  favoritedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for popularity (based on favorites count)
recipeSchema.virtual('popularity').get(function() {
  return this.favoritedBy.length;
});

// Index for search performance
recipeSchema.index({ title: 'text', description: 'text' });
recipeSchema.index({ category: 1 });
recipeSchema.index({ area: 1 });
recipeSchema.index({ author: 1 });

module.exports = mongoose.model('Recipe', recipeSchema);