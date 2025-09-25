import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchTestimonials = createAsyncThunk(
  'testimonials/fetchTestimonials',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/testimonials');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const initialState = {
  testimonials: [],
  loading: false,
  error: null,
};

const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = action.payload.data;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = testimonialsSlice.actions;
export default testimonialsSlice.reducer;