import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/recipes', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchRecipeById',
  async (recipeId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/recipes/${recipeId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchRecipesByUser = createAsyncThunk(
  'recipes/fetchRecipesByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/recipes?author=${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const createRecipe = createAsyncThunk(
  'recipes/createRecipe',
  async (recipeData, { rejectWithValue }) => {
    try {
      const response = await api.post('/recipes', recipeData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'recipes/toggleFavorite',
  async (recipeId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentUser = state.auth.user;
      const currentUserId = currentUser?.id || currentUser?._id;

      if (!currentUserId) {
        return rejectWithValue('User not authenticated');
      }

      // Find recipe in any of the possible locations
      const recipe = state.recipes.recipes.find(r => r._id === recipeId) ||
                    state.recipes.userRecipes.find(r => r._id === recipeId) ||
                    (state.recipes.currentRecipe?._id === recipeId ? state.recipes.currentRecipe : null);

      const isFavorited = recipe?.favoritedBy?.includes(currentUserId);

      if (isFavorited) {
        await api.delete(`/recipes/${recipeId}/favorite`);
      } else {
        await api.put(`/recipes/${recipeId}/favorite`);
      }

      return { recipeId, action: isFavorited ? 'remove' : 'add', currentUserId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'recipes/addToFavorites',
  async (recipeId, { rejectWithValue }) => {
    try {
      await api.put(`/recipes/${recipeId}/favorite`);
      return recipeId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'recipes/removeFromFavorites',
  async (recipeId, { rejectWithValue }) => {
    try {
      await api.delete(`/recipes/${recipeId}/favorite`);
      return recipeId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const initialState = {
  recipes: [],
  currentRecipe: null,
  userRecipes: [],
  loading: false,
  error: null,
  pagination: null,
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch recipes
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch recipe by ID
      .addCase(fetchRecipeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload.data;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch recipes by user
      .addCase(fetchRecipesByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipesByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userRecipes = action.payload.data;
      })
      .addCase(fetchRecipesByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create recipe
      .addCase(createRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes.unshift(action.payload.data);
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle favorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { recipeId, action: toggleAction } = action.payload;

        // Get current user ID from the payload
        const currentUserId = action.payload.currentUserId;

        // Helper function to update recipe favorite status
        const updateRecipeFavorite = (recipe) => {
          if (toggleAction === 'add') {
            recipe.favoritedBy = recipe.favoritedBy || [];
            if (!recipe.favoritedBy.includes(currentUserId)) {
              recipe.favoritedBy.push(currentUserId);
              recipe.popularity = (recipe.popularity || 0) + 1;
            }
          } else {
            recipe.favoritedBy = recipe.favoritedBy?.filter(id => id !== currentUserId) || [];
            recipe.popularity = Math.max((recipe.popularity || 0) - 1, 0);
          }
        };

        // Update in recipes list
        const recipe = state.recipes.find(r => r._id === recipeId);
        if (recipe) {
          updateRecipeFavorite(recipe);
        }

        // Update in user recipes list
        const userRecipe = state.userRecipes.find(r => r._id === recipeId);
        if (userRecipe) {
          updateRecipeFavorite(userRecipe);
        }

        // Update current recipe if it matches
        if (state.currentRecipe?._id === recipeId) {
          updateRecipeFavorite(state.currentRecipe);
        }
      });
  },
});

export const { clearError } = recipesSlice.actions;
export default recipesSlice.reducer;