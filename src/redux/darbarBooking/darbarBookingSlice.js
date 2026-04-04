import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosInstance';

// Async thunks
export const createDarbarBooking = createAsyncThunk(
  'darbarBooking/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/darbar-bookings/book', bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
    }
  }
);

export const getUserLatestBooking = createAsyncThunk(
  'darbarBooking/getUserLatestBooking',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/darbar-bookings/user/${phoneNumber}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'No booking found');
    }
  }
);

export const getAllBookingsAdmin = createAsyncThunk(
  'darbarBooking/getAllBookingsAdmin',
  async (dateQuery = '', { rejectWithValue }) => {
    try {
      const url = dateQuery 
        ? `/darbar-bookings/admin/all?date=${dateQuery}` 
        : `/darbar-bookings/admin/all`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const resetTokensAdmin = createAsyncThunk(
  'darbarBooking/resetTokensAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/darbar-bookings/admin/reset-tokens');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset tokens');
    }
  }
);

export const deleteBookingAdmin = createAsyncThunk(
  'darbarBooking/deleteBookingAdmin',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/darbar-bookings/admin/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete booking');
    }
  }
);

const initialState = {
  bookings: [], // admin list
  latestUserBooking: null, // user latest
  loading: false,
  error: null,
  successMessage: null,
  createdTokenNumber: null,
  createdDarbarDate: null,
};

const darbarBookingSlice = createSlice({
  name: 'darbarBooking',
  initialState,
  reducers: {
    clearDarbarMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearCreatedBookingState: (state) => {
      state.createdTokenNumber = null;
      state.createdDarbarDate = null;
    }
  },
  extraReducers: (builder) => {
    // createBooking
    builder.addCase(createDarbarBooking.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(createDarbarBooking.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.message;
      state.createdTokenNumber = action.payload.tokenNumber;
      state.createdDarbarDate = action.payload.darbarDate;
    });
    builder.addCase(createDarbarBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // getUserLatestBooking
    builder.addCase(getUserLatestBooking.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.latestUserBooking = null;
    });
    builder.addCase(getUserLatestBooking.fulfilled, (state, action) => {
      state.loading = false;
      state.latestUserBooking = action.payload;
    });
    builder.addCase(getUserLatestBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // getAllBookingsAdmin
    builder.addCase(getAllBookingsAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllBookingsAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
    });
    builder.addCase(getAllBookingsAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // deleteBookingAdmin
    builder.addCase(deleteBookingAdmin.fulfilled, (state, action) => {
      state.bookings = state.bookings.filter(b => b._id !== action.payload.id);
      state.successMessage = "Booking deleted successfully";
    });

    // resetTokensAdmin
    builder.addCase(resetTokensAdmin.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
  }
});

export const { clearDarbarMessages, clearCreatedBookingState } = darbarBookingSlice.actions;

export default darbarBookingSlice.reducer;
