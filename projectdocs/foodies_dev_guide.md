# Foodies App - Complete Development Guide

## Project Overview
A full-stack recipe sharing application with user authentication, recipe management, social features, and responsive design.

## Tech Stack
- **Backend**: Node.js, Express.js, MongoDB/PostgreSQL
- **Frontend**: React.js, Redux Toolkit, React Router
- **Authentication**: JWT
- **File Upload**: Multer/Cloudinary
- **Validation**: Yup + Formik
- **Documentation**: Swagger (optional)

---

# PHASE 1: PROJECT SETUP & BACKEND FOUNDATION

## 1.1 Initialize Backend Project

```bash
# Create project directory
mkdir foodies-backend
cd foodies-backend

# Initialize npm project
npm init -y

# Install core dependencies
npm install express mongoose cors dotenv helmet morgan
npm install jsonwebtoken bcryptjs multer cloudinary
npm install express-validator express-rate-limit

# Install development dependencies
npm install -D nodemon concurrently

# Optional: Swagger documentation
npm install swagger-jsdoc swagger-ui-express
```

## 1.2 Create Basic Server Structure

```
foodies-backend/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── config/
├── uploads/
├── .env
├── .gitignore
└── server.js
```

## 1.3 Basic Server Setup (server.js)

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Database connection
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/recipes', require('./src/routes/recipes'));
app.use('/api/categories', require('./src/routes/categories'));
app.use('/api/areas', require('./src/routes/areas'));
app.use('/api/ingredients', require('./src/routes/ingredients'));
app.use('/api/testimonials', require('./src/routes/testimonials'));

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 1.4 Database Configuration (src/config/database.js)

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## 1.5 Error Handling Middleware (src/middleware/errorHandler.js)

```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
```

---

# PHASE 2: DATABASE MODELS

## 2.1 User Model (src/models/User.js)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: null
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for recipes count
userSchema.virtual('recipesCount', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'author',
  count: true
});

// Virtual for favorite recipes count
userSchema.virtual('favoritesCount', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'favoritedBy',
  count: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

## 2.2 Recipe Model (src/models/Recipe.js)

```javascript
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
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  instructions: {
    type: String,
    required: [true, 'Please add instructions'],
    maxlength: [1000, 'Instructions cannot be more than 1000 characters']
  },
  image: {
    type: String,
    required: [true, 'Please add an image']
  },
  cookingTime: {
    type: Number,
    required: [true, 'Please add cooking time'],
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true
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
```

## 2.3 Supporting Models

```javascript
// src/models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please add a category image']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);

// src/models/Area.js
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

// src/models/Ingredient.js
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

// src/models/Testimonial.js
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  text: {
    type: String,
    required: [true, 'Please add testimonial text'],
    maxlength: [500, 'Text cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
```

---

# PHASE 3: AUTHENTICATION MIDDLEWARE & UTILITIES

## 3.1 JWT Utilities (src/utils/jwt.js)

```javascript
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Verify JWT Token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};
```

## 3.2 Auth Middleware (src/middleware/auth.js)

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Get user from token
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};

module.exports = { protect };
```

## 3.3 File Upload Middleware (src/middleware/upload.js)

```javascript
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'avatar') {
      cb(null, 'uploads/avatars/');
    } else if (file.fieldname === 'image') {
      cb(null, 'uploads/recipes/');
    } else {
      cb(null, 'uploads/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
```

---

# PHASE 4: BACKEND ROUTES & CONTROLLERS

## 4.1 Authentication Routes & Controllers

### Auth Controller (src/controllers/authController.js)

```javascript
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken({ id: user._id });

    res.status(201).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken({ id: user._id });

    res.status(200).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout
};
```

### Auth Routes (src/routes/auth.js)

```javascript
const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);

module.exports = router;
```

## 4.2 User Routes & Controllers

### User Controller (src/controllers/userController.js)

```javascript
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const upload = require('../middleware/upload');

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('recipesCount')
      .populate('favoritesCount')
      .select('-password');

    const userData = {
      ...user.toObject(),
      recipesCount: user.recipesCount || 0,
      favoritesCount: user.favoritesCount || 0,
      followersCount: user.followers.length,
      followingCount: user.following.length
    };

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('recipesCount')
      .select('-password -following -followers');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const userData = {
      ...user.toObject(),
      recipesCount: user.recipesCount || 0,
      followersCount: user.followers.length
    };

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.path },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user followers
// @route   GET /api/users/:id/followers
// @access  Private
const getUserFollowers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const user = await User.findById(req.params.id)
      .populate({
        path: 'followers',
        select: 'name email avatar',
        options: {
          skip: startIndex,
          limit: limit
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const total = user.followers.length;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: user.followers.length,
      pagination: {
        page,
        limit,
        total,
        totalPages
      },
      data: user.followers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user following
// @route   GET /api/users/:id/following
// @access  Private
const getUserFollowing = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const user = await User.findById(req.params.id)
      .populate({
        path: 'following',
        select: 'name email avatar',
        options: {
          skip: startIndex,
          limit: limit
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const total = user.following.length;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: user.following.length,
      pagination: {
        page,
        limit,
        total,
        totalPages
      },
      data: user.following
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow user
// @route   PUT /api/users/:id/follow
// @access  Private
const followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot follow yourself'
      });
    }

    // Check if already following
    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Already following this user'
      });
    }

    // Add to following/followers
    await User.findByIdAndUpdate(req.user.id, {
      $push: { following: req.params.id }
    });

    await User.findByIdAndUpdate(req.params.id, {
      $push: { followers: req.user.id }
    });

    res.status(200).json({
      success: true,
      message: 'User followed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unfollow user
// @route   PUT /api/users/:id/unfollow
// @access  Private
const unfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if not following
    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Not following this user'
      });
    }

    // Remove from following/followers
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { following: req.params.id }
    });

    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user.id }
    });

    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  getUserById,
  updateAvatar,
  getUserFollowers,
  getUserFollowing,
  followUser,
  unfollowUser
};
```

### User Routes (src/routes/users.js)

```javascript
const express = require('express');
const {
  getMe,
  getUserById,
  updateAvatar,
  getUserFollowers,
  getUserFollowing,
  followUser,
  unfollowUser
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/me', getMe);
router.get('/:id', getUserById);
router.put('/avatar', upload.single('avatar'), updateAvatar);
router.get('/:id/followers', getUserFollowers);
router.get('/:id/following', getUserFollowing);
router.put('/:id/follow', followUser);
router.put('/:id/unfollow', unfollowUser);

module.exports = router;
```

## 4.3 Recipe Routes & Controllers

### Recipe Controller (src/controllers/recipeController.js)

```javascript
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
        $unwind: '$author'
      },
      {
        $unwind: '$category'
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

// @desc    Create recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res, next) => {
  try {
    