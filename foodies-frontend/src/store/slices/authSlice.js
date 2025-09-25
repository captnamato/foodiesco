import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import { followUser, unfollowUser } from './usersSlice';
import { toggleFavorite } from './recipesSlice';

// Check auth status on app load
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const user = await authService.getCurrentUser();
      return { user, token };
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue(error.message);
    }
  }
);

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.login(userData);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Check auth status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user.data;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Follow user
      .addCase(followUser.fulfilled, (state, action) => {
        if (state.user) {
          if (!state.user.following) {
            state.user.following = [];
          }
          if (!state.user.following.includes(action.payload.userId)) {
            state.user.following.push(action.payload.userId);
            state.user.followingCount = (state.user.followingCount || 0) + 1;
          }
        }
      })
      // Unfollow user
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (state.user && state.user.following) {
          state.user.following = state.user.following.filter(id => id !== action.payload.userId);
          state.user.followingCount = Math.max((state.user.followingCount || 0) - 1, 0);
        }
      })
      // Toggle favorite recipe
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (state.user) {
          const { action: toggleAction } = action.payload;
          if (toggleAction === 'add') {
            state.user.favoritesCount = (state.user.favoritesCount || 0) + 1;
          } else {
            state.user.favoritesCount = Math.max((state.user.favoritesCount || 0) - 1, 0);
          }
        }
      });
  },
});

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;