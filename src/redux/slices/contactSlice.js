import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosInstance';
import { toast } from 'react-toastify';

export const submitContactForm = createAsyncThunk(
  'contact/submit',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/contacts', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  },
  reducers: {
    resetContactState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitContactForm.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        toast.success('Thank you for your interest! We will contact you soon.');
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;
