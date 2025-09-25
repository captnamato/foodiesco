const Ingredient = require('../models/Ingredient');

const getIngredients = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.find({}).sort({ name: 1 });
    res.status(200).json({ success: true, count: ingredients.length, data: ingredients });
  } catch (error) {
    next(error);
  }
};

const getIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ success: false, error: 'Ingredient not found' });
    }
    res.status(200).json({ success: true, data: ingredient });
  } catch (error) {
    next(error);
  }
};

module.exports = { getIngredients, getIngredient };