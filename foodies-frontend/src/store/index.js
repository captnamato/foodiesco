import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import recipesReducer from './slices/recipesSlice';
import usersReducer from './slices/usersSlice';
import categoriesReducer from './slices/categoriesSlice';
import testimonialsReducer from './slices/testimonialsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipesReducer,
    users: usersReducer,
    categories: categoriesReducer,
    testimonials: testimonialsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;