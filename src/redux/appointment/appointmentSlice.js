import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './appointmentService';
import { toast } from 'react-toastify';

export const fetchMyAppointments = createAsyncThunk(
  'appointments/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getMyAppointments();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (appointmentData, { rejectWithValue }) => {
    try {
      return await api.createAppointment(appointmentData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to book appointment');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchMyAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        toast.success('Appointment booked successfully!');
      });
  },
});

export default appointmentSlice.reducer;
