const express = require('express');
const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getPopularRecipes,
  addToFavorites,
  removeFromFavorites
} = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getRecipes);
router.get('/popular', getPopularRecipes);
router.get('/:id', getRecipe);
router.post('/', protect, upload.single('image'), createRecipe);
router.put('/:id', protect, upload.single('image'), updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.put('/:id/favorite', protect, addToFavorites);
router.delete('/:id/favorite', protect, removeFromFavorites);

module.exports = router;