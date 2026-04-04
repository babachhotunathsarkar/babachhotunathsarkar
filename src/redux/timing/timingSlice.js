import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import timingService from './timingService';

const initialState = {
  timings: [],
  adminTimings: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const fetchActiveTimings = createAsyncThunk('timing/fetchActive', async (_, thunkAPI) => {
  try {
    const response = await timingService.getActiveTimings();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchAdminTimings = createAsyncThunk('timing/fetchAdmin', async (_, thunkAPI) => {
  try {
    const response = await timingService.getAllTimings();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createNewTiming = createAsyncThunk('timing/create', async (data, thunkAPI) => {
  try {
    const response = await timingService.createTiming(data);
    thunkAPI.dispatch(fetchAdminTimings());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateExistingTiming = createAsyncThunk('timing/update', async ({ id, data }, thunkAPI) => {
  try {
    const response = await timingService.updateTiming(id, data);
    thunkAPI.dispatch(fetchAdminTimings());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const removeTiming = createAsyncThunk('timing/delete', async (id, thunkAPI) => {
  try {
    const response = await timingService.deleteTiming(id);
    thunkAPI.dispatch(fetchAdminTimings());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const toggleTimingActive = createAsyncThunk('timing/toggle', async (id, thunkAPI) => {
  try {
    const response = await timingService.toggleTiming(id);
    thunkAPI.dispatch(fetchAdminTimings());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const timingSlice = createSlice({
  name: 'timing',
  initialState,
  reducers: {
    resetTimingState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveTimings.pending, (state) => { state.isLoading = true; })
      .addCase(fetchActiveTimings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.timings = action.payload;
      })
      .addCase(fetchActiveTimings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchAdminTimings.fulfilled, (state, action) => {
        state.adminTimings = action.payload;
      });
  },
});

export const { resetTimingState } = timingSlice.actions;
export default timingSlice.reducer;
