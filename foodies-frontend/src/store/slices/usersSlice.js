import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const followUser = createAsyncThunk(
  'users/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${userId}/follow`);
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'users/unfollowUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${userId}/unfollow`);
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.data;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Follow user
      .addCase(followUser.fulfilled, (state, action) => {
        if (state.currentUser && state.currentUser._id === action.payload.userId) {
          state.currentUser.followersCount = (state.currentUser.followersCount || 0) + 1;
        }
      })
      // Unfollow user
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (state.currentUser && state.currentUser._id === action.payload.userId) {
          state.currentUser.followersCount = Math.max((state.currentUser.followersCount || 0) - 1, 0);
        }
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;