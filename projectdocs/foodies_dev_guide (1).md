### Recipe Routes (src/routes/recipes.js)

```javascript
const express = require('express');
const {
  getRecipes,
  getRecipe,
  getPopularRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getMyRecipes,
  addToFavorites,
  removeFromFavorites,
  getFavoriteRecipes
} = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getRecipes);
router.get('/popular', getPopularRecipes);
router.get('/:id', getRecipe);

// Private routes
router.use(protect);
router.post('/', upload.single('image'), createRecipe);
router.put('/:id', upload.single('image'), updateRecipe);
router.delete('/:id', deleteRecipe);
router.get('/my/recipes', getMyRecipes);
router.put('/:id/favorite', addToFavorites);
router.delete('/:id/favorite', removeFromFavorites);
router.get('/my/favorites', getFavoriteRecipes);

module.exports = router;
```

## 4.4 Supporting Data Routes & Controllers

### Category Controller (src/controllers/categoryController.js)

```javascript
const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories
};
```

### Area Controller (src/controllers/areaController.js)

```javascript
const Area = require('../models/Area');

// @desc    Get all areas
// @route   GET /api/areas
// @access  Public
const getAreas = async (req, res, next) => {
  try {
    const areas = await Area.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAreas
};
```

### Ingredient Controller (src/controllers/ingredientController.js)

```javascript
const Ingredient = require('../models/Ingredient');

// @desc    Get all ingredients
// @route   GET /api/ingredients
// @access  Public
const getIngredients = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: ingredients.length,
      data: ingredients
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIngredients
};
```

### Testimonial Controller (src/controllers/testimonialController.js)

```javascript
const Testimonial = require('../models/Testimonial');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTestimonials
};
```

### Supporting Routes

```javascript
// src/routes/categories.js
const express = require('express');
const { getCategories } = require('../controllers/categoryController');

const router = express.Router();

router.get('/', getCategories);

module.exports = router;

// src/routes/areas.js
const express = require('express');
const { getAreas } = require('../controllers/areaController');

const router = express.Router();

router.get('/', getAreas);

module.exports = router;

// src/routes/ingredients.js
const express = require('express');
const { getIngredients } = require('../controllers/ingredientController');

const router = express.Router();

router.get('/', getIngredients);

module.exports = router;

// src/routes/testimonials.js
const express = require('express');
const { getTestimonials } = require('../controllers/testimonialController');

const router = express.Router();

router.get('/', getTestimonials);

module.exports = router;
```

---

# PHASE 5: FRONTEND SETUP

## 5.1 Initialize React Project

```bash
# Create React app
npx create-react-app foodies-frontend
cd foodies-frontend

# Install dependencies
npm install @reduxjs/toolkit react-redux react-router-dom
npm install axios formik yup
npm install react-paginate react-select
npm install react-hot-toast react-modal
npm install swiper

# Install development dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 5.2 Project Structure Setup

```
src/
├── components/
│   ├── common/
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Modal/
│   │   └── Loader/
│   ├── forms/
│   ├── cards/
│   └── layout/
├── pages/
├── store/
│   ├── slices/
│   └── api/
├── hooks/
├── utils/
├── services/
├── constants/
└── assets/
    ├── images/
    └── icons/
```

## 5.3 Tailwind CSS Configuration (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'mobile': '375px',
        'tablet': '768px',
        'desktop': '1440px',
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef3c7',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        'primary': ['Inter', 'sans-serif'],
        'secondary': ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
}
```

## 5.4 Redux Store Setup

### Store Configuration (src/store/index.js)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import recipesSlice from './slices/recipesSlice';
import usersSlice from './slices/usersSlice';
import categoriesSlice from './slices/categoriesSlice';
import areasSlice from './slices/areasSlice';
import ingredientsSlice from './slices/ingredientsSlice';
import testimonialsSlice from './slices/testimonialsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    recipes: recipesSlice,
    users: usersSlice,
    categories: categoriesSlice,
    areas: areasSlice,
    ingredients: ingredientsSlice,
    testimonials: testimonialsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Auth Slice (src/store/slices/authSlice.js)

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
  user: user ? user : null,
  token: token ? token : null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await authService.logout();
    return {};
  } catch (error) {
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.error) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await authService.getCurrentUser(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearError: (state) => {
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      });
  },
});

export const { reset, clearError } = authSlice.actions;
export default authSlice.reducer;
```

---

# PHASE 6: FRONTEND SERVICES & API

## 6.1 API Service Setup (src/services/api.js)

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== '/auth/login' && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        // Clear local storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }

    return Promise.reject(err);
  }
);

export default api;
```

## 6.2 Auth Service (src/services/authService.js)

```javascript
import api from './api';

const AUTH_URL = '/auth';

// Register user
const register = async (userData) => {
  const response = await api.post(`${AUTH_URL}/register`, userData);
  
  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post(`${AUTH_URL}/login`, userData);

  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
};

// Logout user
const logout = async () => {
  const response = await api.post(`${AUTH_URL}/logout`);
  
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  return response.data;
};

// Get current user
const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;
```

## 6.3 Recipe Service (src/services/recipeService.js)

```javascript
import api from './api';

const RECIPES_URL = '/recipes';

// Get all recipes
const getRecipes = async (params) => {
  const response = await api.get(RECIPES_URL, { params });
  return response.data;
};

// Get single recipe
const getRecipe = async (id) => {
  const response = await api.get(`${RECIPES_URL}/${id}`);
  return response.data;
};

// Get popular recipes
const getPopularRecipes = async (limit = 4) => {
  const response = await api.get(`${RECIPES_URL}/popular`, {
    params: { limit }
  });
  return response.data;
};

// Create recipe
const createRecipe = async (formData) => {
  const response = await api.post(RECIPES_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update recipe
const updateRecipe = async (id, formData) => {
  const response = await api.put(`${RECIPES_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete recipe
const deleteRecipe = async (id) => {
  const response = await api.delete(`${RECIPES_URL}/${id}`);
  return response.data;
};

// Get user's recipes
const getMyRecipes = async (params) => {
  const response = await api.get(`${RECIPES_URL}/my/recipes`, { params });
  return response.data;
};

// Add to favorites
const addToFavorites = async (id) => {
  const response = await api.put(`${RECIPES_URL}/${id}/favorite`);
  return response.data;
};

// Remove from favorites
const removeFromFavorites = async (id) => {
  const response = await api.delete(`${RECIPES_URL}/${id}/favorite`);
  return response.data;
};

// Get favorite recipes
const getFavoriteRecipes = async (params) => {
  const response = await api.get(`${RECIPES_URL}/my/favorites`, { params });
  return response.data;
};

const recipeService = {
  getRecipes,
  getRecipe,
  getPopularRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getMyRecipes,
  addToFavorites,
  removeFromFavorites,
  getFavoriteRecipes,
};

export default recipeService;
```

---

# PHASE 7: FRONTEND COMPONENTS

## 7.1 Shared Layout Components

### Header Component (src/components/common/Header/Header.jsx)

```javascript
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from './Logo';
import Nav from './Nav';
import AuthBar from './AuthBar';
import UserBar from './UserBar';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden tablet:flex items-center space-x-8">
            {user && <Nav currentPath={location.pathname} />}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? <UserBar /> : <AuthBar />}
            
            {/* Mobile menu button */}
            {user && (
              <button
                onClick={toggleMobileMenu}
                className="tablet:hidden p-2"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          currentPath={location.pathname}
        />
      )}
    </header>
  );
};

export default Header;
```

### Logo Component (src/components/common/Header/Logo.jsx)

```javascript
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center space-x-2 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
    >
      <svg
        className="w-8 h-8"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <span>Foodies</span>
    </Link>
  );
};

export default Logo;
```

### Nav Component (src/components/common/Header/Nav.jsx)

```javascript
import React from 'react';
import { Link } from 'react-router-dom';

const Nav = ({ currentPath, isMobile = false }) => {
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/add', label: 'Add Recipe' },
  ];

  const baseClasses = isMobile 
    ? "block py-3 px-4 text-lg font-medium transition-colors"
    : "text-gray-700 hover:text-primary-600 font-medium transition-colors";

  const activeClasses = isMobile
    ? "text-primary-600 bg-primary-50 border-r-4 border-primary-600"
    : "text-primary-600";

  return (
    <nav className={isMobile ? "py-4" : "flex items-center space-x-8"}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`${baseClasses} ${
            currentPath === item.path ? activeClasses : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Nav;
```

### AuthBar Component (src/components/common/Header/AuthBar.jsx)

```javascript
import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import SignInModal from '../../modals/SignInModal';
import SignUpModal from '../../modals/SignUpModal';

const AuthBar = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsSignInOpen(true)}
          className="px-4 py-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          Sign In
        </button>
        <button
          onClick={() => setIsSignUpOpen(true)}
          className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Sign Up
        </button>
      </div>

      {/* Modals */}
      {isSignInOpen && (
        <Modal onClose={() => setIsSignInOpen(false)}>
          <SignInModal
            onClose={() => setIsSignInOpen(false)}
            onSwitchToSignUp={() => {
              setIsSignInOpen(false);
              setIsSignUpOpen(true);
            }}
          />
        </Modal>
      )}

      {isSignUpOpen && (
        <Modal onClose={() => setIsSignUpOpen(false)}>
          <SignUpModal
            onClose={() => setIsSignUpOpen(false)}
            onSwitchToSignIn={() => {
              setIsSignUpOpen(false);
              setIsSignInOpen(true);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default AuthBar;
```

### UserBar Component (src/components/common/Header/UserBar.jsx)

```javascript
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Modal from '../Modal/Modal';
import LogOutModal from '../../modals/LogOutModal';

const UserBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogOutOpen, setIsLogOutOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsLogOutOpen(true);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <img
            src={user?.avatar || '/default-avatar.png'}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="hidden tablet:block font-medium text-gray-700">
            {user?.name}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-modal border border-gray-200 py-2 z-50">
            <Link
              to={`/user/${user?.id}`}
              onClick={handleProfileClick}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile
            </Link>
            <hr className="my-2 border-gray-200" />
            <button
              onClick={handleLogoutClick}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* Log Out Modal */}
      {isLogOutOpen && (
        <Modal onClose={() => setIsLogOutOpen(false)}>
          <LogOutModal onClose={() => setIsLogOutOpen(false)} />
        </Modal>
      )}
    </>
  );
};

export default UserBar;
```

## 7.2 Modal Components

### Modal Component (src/components/common/Modal/Modal.jsx)

```javascript
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ children, onClose }) => {
  // Close modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Close modal on backdrop click
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-xl shadow-modal max-w-md w-full max-h-screen overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
```

### Sign In Modal (src/components/modals/SignInModal.jsx)

```javascript
import React from 'react';
import SignInForm from '../forms/SignInForm';

const SignInModal = ({ onClose, onSwitchToSignUp }) => {
  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sign In
        </h2>
        <p className="text-gray-600">
          Welcome back! Please sign in to your account.
        </p>
      </div>

      <SignInForm onSuccess={onClose} />

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignUp}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignInModal;
```

### Sign Up Modal (src/components/modals/SignUpModal.jsx)

```javascript
import React from 'react';
import SignUpForm from '../forms/SignUpForm';

const SignUpModal = ({ onClose, onSwitchToSignIn }) => {
  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sign Up
        </h2>
        <p className="text-gray-600">
          Create your account to start sharing recipes.
        </p>
      </div>

      <SignUpForm onSuccess={onClose} />

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToSignIn}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpModal;
```

### Log Out Modal (src/components/modals/LogOutModal.jsx)

```javascript
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

const LogOutModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout on client side regardless of server response
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      onClose();
      navigate('/');
    }
  };

  return (
    <div className="p-8 text-center">
      <div className="mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Are you sure you want to log out?
      </h3>
      
      <p className="text-sm text-gray-500 mb-6">
        You'll need to sign in again to access your account.
      </p>

      <div className="flex space-x-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default LogOutModal;
```

## 7.3 Form Components

### Sign In Form (src/components/forms/SignInForm.jsx)

```javascript
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login, reset } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';

const SignInForm = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  // Reset state on component mount
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  // Handle success/error states
  useEffect(() => {
    if (isSuccess) {
      toast.success('Signed in successfully!');
      dispatch(reset());
      onSuccess();
    }

    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch, onSuccess]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleSubmit = (values) => {
    dispatch(login(values));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <Field
              type="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your email"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Field
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default SignInForm;
```

### Sign Up Form (src/components/forms/SignUpForm.jsx)

```javascript
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { register, reset } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';

const SignUpForm = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  // Reset state on component mount
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  // Handle success/error states
  useEffect(() => {
    if (isSuccess) {
      toast.success('Account created successfully!');
      dispatch(reset());
      onSuccess();
    }

    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch, onSuccess]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleSubmit = (values) => {
    dispatch(register(values));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <Field
              type="text"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your name"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <Field
              type="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your email"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Field
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpForm;
```

---

# PHASE 8: PAGE COMPONENTS

## 8.1 Home Page Components

### HomePage (src/pages/HomePage.jsx)

```javascript
import React from 'react';
import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import Testimonials from '../components/home/Testimonials';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Categories />
      <Testimonials />
    </div>
  );
};

export default HomePage;
```

### Hero Component (src/components/home/Hero.jsx)

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Modal from '../common/Modal/Modal';
import SignInModal from '../modals/SignInModal';

const Hero = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleAddRecipeClick = () => {# Foodies App - Complete Development Guide

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
    // Add user to req.body
    req.body.author = req.user.id;

    // Handle image upload
    if (req.file) {
      req.body.image = req.file.path;
    }

    const recipe = await Recipe.create(req.body);

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

    // Make sure user is recipe owner
    if (recipe.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this recipe'
      });
    }

    // Handle image upload
    if (req.file) {
      req.body.image = req.file.path;
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    .populate('author', 'name avatar')
    .populate('category', 'name')
    .populate('area', 'name')
    .populate('ingredients.ingredient', 'name image');

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

    // Make sure user is recipe owner
    if (recipe.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this recipe'
      });
    }

    await recipe.remove();

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's own recipes
// @route   GET /api/recipes/my-recipes
// @access  Private
const getMyRecipes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Recipe.countDocuments({ author: req.user.id });
    const totalPages = Math.ceil(total / limit);

    const recipes = await Recipe.find({ author: req.user.id })
      .populate('category', 'name')
      .populate('area', 'name')
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

    // Check if already in favorites
    if (recipe.favoritedBy.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        error: 'Recipe already in favorites'
      });
    }

    recipe.favoritedBy.push(req.user.id);
    await recipe.save();

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

    // Check if not in favorites
    if (!recipe.favoritedBy.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        error: 'Recipe not in favorites'
      });
    }

    recipe.favoritedBy = recipe.favoritedBy.filter(
      userId => userId.toString() !== req.user.id
    );
    await recipe.save();

    res.status(200).json({
      success: true,
      message: 'Recipe removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's favorite recipes
// @route   GET /api/recipes/favorites
// @access  Private
const getFavoriteRecipes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Recipe.countDocuments({ favoritedBy: req.user.id });
    const totalPages = Math.ceil(total / limit);

    const recipes = await Recipe.find({ favoritedBy: req.user.id })
      .populate('author', 'name avatar')
      .populate('category', 'name')
      .populate('area', 'name')
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

module.exports = {
  getRecipes,
  getRecipe,
  getPopularRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getMyRecipes,
  addToFavorites,
  removeFromFavorites,
  getFavoriteRecipes
};
    