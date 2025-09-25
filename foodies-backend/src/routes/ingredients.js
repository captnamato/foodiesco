const express = require('express');
const { getIngredients, getIngredient } = require('../controllers/ingredientController');
const router = express.Router();

router.get('/', getIngredients);
router.get('/:id', getIngredient);

module.exports = router;