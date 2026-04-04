import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import scheduleService from './scheduleService';

const initialState = {
  schedules: [],
  adminSchedules: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const fetchActiveSchedules = createAsyncThunk('schedule/fetchActive', async (_, thunkAPI) => {
  try {
    const response = await scheduleService.getActiveSchedules();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchAdminSchedules = createAsyncThunk('schedule/fetchAdmin', async (_, thunkAPI) => {
  try {
    const response = await scheduleService.getAllSchedules();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createNewSchedule = createAsyncThunk('schedule/create', async (data, thunkAPI) => {
  try {
    const response = await scheduleService.createSchedule(data);
    thunkAPI.dispatch(fetchAdminSchedules());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateExistingSchedule = createAsyncThunk('schedule/update', async ({ id, data }, thunkAPI) => {
  try {
    const response = await scheduleService.updateSchedule(id, data);
    thunkAPI.dispatch(fetchAdminSchedules());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const removeSchedule = createAsyncThunk('schedule/delete', async (id, thunkAPI) => {
  try {
    const response = await scheduleService.deleteSchedule(id);
    thunkAPI.dispatch(fetchAdminSchedules());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const toggleScheduleActive = createAsyncThunk('schedule/toggle', async (id, thunkAPI) => {
  try {
    const response = await scheduleService.toggleSchedule(id);
    thunkAPI.dispatch(fetchAdminSchedules());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    resetScheduleState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveSchedules.pending, (state) => { state.isLoading = true; })
      .addCase(fetchActiveSchedules.fulfilled, (state, action) => {
        state.isLoading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchActiveSchedules.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchAdminSchedules.fulfilled, (state, action) => {
        state.adminSchedules = action.payload;
      });
  },
});

export const { resetScheduleState } = scheduleSlice.actions;
export default scheduleSlice.reducer;
