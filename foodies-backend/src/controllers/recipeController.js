const Recipe = require('../models/Recipe');
const User = require('../models/User');

// @desc    Get all recipes with filters
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.area) {
      query.area = req.query.area;
    }

    if (req.query.ingredient) {
      query['ingredients.ingredient'] = req.query.ingredient;
    }

    if (req.query.author) {
      query.author = req.query.author;
    }

    // Add search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { instructions: searchRegex }
      ];
    }

    const total = await Recipe.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const recipes = await Recipe.find(query)
      .populate('author', 'name avatar')
      .populate('category', 'name')
      .populate('area', 'name')
      .populate('ingredients.ingredient', 'name image')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: recipes.length,
      pagination: {
        page,
        limit,
        total,
        totalPages
      },
      data: recipes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
const getRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name avatar email')
      .populate('category', 'name')
      .populate('area', 'name')
      .populate('ingredients.ingredient', 'name image');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }

    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a recipe image'
      });
    }

    const recipeData = {
      ...req.body,
      image: req.file.path,
      author: req.user.id
    };

    // Parse ingredients if it's a string (from form data)
    if (typeof recipeData.ingredients === 'string') {
      recipeData.ingredients = JSON.parse(recipeData.ingredients);
    }

    // Handle ingredients format - convert to proper structure
    if (recipeData.ingredients) {
      recipeData.ingredients = recipeData.ingredients.map(ingredient => {
        if (typeof ingredient === 'object' && ingredient.name) {
          // Frontend format: { name: "flour", measure: "2 cups" }
          return {
            ingredient: ingredient.name, // Store as string for now
            name: ingredient.name,
            measure: ingredient.measure
          };
        }
        return ingredient; // Keep existing format if already correct
      });
    }

    const recipe = await Recipe.create(recipeData);

    const populatedRecipe = await Recipe.findById(recipe._id)
      .populate('author', 'name avatar')
      .populate('category', 'name')
      .populate('area', 'name')
      .populate('ingredients.ingredient', 'name image');

    res.status(201).json({
      success: true,
      data: populatedRecipe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add recipe to favorites
// @route   PUT /api/recipes/:id/favorite
// @access  Private
const addToFavorites = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }

    // Check if already favorited
    if (recipe.favoritedBy.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        error: 'Recipe already in favorites'
      });
    }

    await Recipe.findByIdAndUpdate(req.params.id, {
      $push: { favoritedBy: req.user.id }
    });

    res.status(200).json({
      success: true,
      message: 'Recipe added to favorites'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove recipe from favorites
// @route   DELETE /api/recipes/:id/favorite
// @access  Private
const removeFromFavorites = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }

    await Recipe.findByIdAndUpdate(req.params.id, {
      $pull: { favoritedBy: req.user.id }
    });

    res.status(200).json({
      success: true,
      message: 'Recipe removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular recipes
// @route   GET /api/recipes/popular
// @access  Public
const getPopularRecipes = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 4;

    const recipes = await Recipe.aggregate([
      {
        $addFields: {
          popularityCount: { $size: '$favoritedBy' }
        }
      },
      {
        $sort: { popularityCount: -1, createdAt: -1 }
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
          pipeline: [{ $project: { name: 1, avatar: 1 } }]
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
          pipeline: [{ $project: { name: 1 } }]
        }
      },
      {
        $lookup: {
          from: 'areas',
          localField: 'area',
          foreignField: '_id',
          as: 'area',
          pipeline: [{ $project: { name: 1 } }]
        }
      },
      {
        $unwind: { path: '$author', preserveNullAndEmptyArrays: true }
      },
      {
        $unwind: { path: '$category', preserveNullAndEmptyArrays: true }
      },
      {
        $unwind: { path: '$area', preserveNullAndEmptyArrays: true }
      }
    ]);

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private
const updateRecipe = async (req, res, next) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }

    // Check ownership
    if (recipe.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this recipe'
      });
    }

    const updateData = { ...req.body };

    // Handle image update
    if (req.file) {
      updateData.image = req.file.path;
    }

    // Handle ingredients format
    if (updateData.ingredients) {
      if (typeof updateData.ingredients === 'string') {
        updateData.ingredients = JSON.parse(updateData.ingredients);
      }

      updateData.ingredients = updateData.ingredients.map(ingredient => {
        if (typeof ingredient === 'object' && ingredient.name) {
          return {
            ingredient: ingredient.name,
            name: ingredient.name,
            measure: ingredient.measure
          };
        }
        return ingredient;
      });
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('author', 'name avatar')
      .populate('category', 'name')
      .populate('area', 'name');

    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private
const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }

    // Check ownership
    if (recipe.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this recipe'
      });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getPopularRecipes,
  addToFavorites,
  removeFromFavorites
};