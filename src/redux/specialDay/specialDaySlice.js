import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import specialDayService from './specialDayService';

const initialState = {
  specialDays: [],
  adminSpecialDays: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const fetchActiveSpecialDays = createAsyncThunk('specialDay/fetchActive', async (_, thunkAPI) => {
  try {
    const response = await specialDayService.getActiveSpecialDays();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchAdminSpecialDays = createAsyncThunk('specialDay/fetchAdmin', async (_, thunkAPI) => {
  try {
    const response = await specialDayService.getAllSpecialDays();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createNewSpecialDay = createAsyncThunk('specialDay/create', async (data, thunkAPI) => {
  try {
    const response = await specialDayService.createSpecialDay(data);
    thunkAPI.dispatch(fetchAdminSpecialDays());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateExistingSpecialDay = createAsyncThunk('specialDay/update', async ({ id, data }, thunkAPI) => {
  try {
    const response = await specialDayService.updateSpecialDay(id, data);
    thunkAPI.dispatch(fetchAdminSpecialDays());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const removeSpecialDay = createAsyncThunk('specialDay/delete', async (id, thunkAPI) => {
  try {
    const response = await specialDayService.deleteSpecialDay(id);
    thunkAPI.dispatch(fetchAdminSpecialDays());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const toggleSpecialDayActive = createAsyncThunk('specialDay/toggle', async (id, thunkAPI) => {
  try {
    const response = await specialDayService.toggleSpecialDay(id);
    thunkAPI.dispatch(fetchAdminSpecialDays());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const specialDaySlice = createSlice({
  name: 'specialDay',
  initialState,
  reducers: {
    resetSpecialDayState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveSpecialDays.pending, (state) => { state.isLoading = true; })
      .addCase(fetchActiveSpecialDays.fulfilled, (state, action) => {
        state.isLoading = false;
        state.specialDays = action.payload;
      })
      .addCase(fetchActiveSpecialDays.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchAdminSpecialDays.fulfilled, (state, action) => {
        state.adminSpecialDays = action.payload;
      });
  },
});

export const { resetSpecialDayState } = specialDaySlice.actions;
export default specialDaySlice.reducer;
