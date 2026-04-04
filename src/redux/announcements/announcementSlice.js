// src/redux/announcements/announcementSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import announcementService from './announcementService';

// Initial State
const initialState = {
  announcements: [],
  currentAnnouncement: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Fetch All Announcements
export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAll',
  async (type = null, thunkAPI) => {
    try {
      const response = await announcementService.getAll(type);
      return response.announcements || response;   // normalized return
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch announcements';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create Announcement
export const createAnnouncement = createAsyncThunk(
  'announcements/create',
  async (announcementData, thunkAPI) => {
    try {
      const response = await announcementService.create(announcementData);
      return response.announcement || response;   // normalized
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create announcement';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Announcement
export const updateAnnouncement = createAsyncThunk(
  'announcements/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await announcementService.update(id, data);
      return response.announcement || response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete Announcement
export const deleteAnnouncement = createAsyncThunk(
  'announcements/delete',
  async (id, thunkAPI) => {
    try {
      await announcementService.remove(id);
      return id;   // return id to filter from state
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const announcementSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentAnnouncement: (state) => {
      state.currentAnnouncement = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Announcements
      .addCase(fetchAnnouncements.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.announcements = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Create Announcement
      .addCase(createAnnouncement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.announcements.unshift(action.payload); // Newest first
        state.message = 'Announcement created successfully';
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update Announcement
      .addCase(updateAnnouncement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;

        // Update in list
        const index = state.announcements.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.announcements[index] = action.payload;
        }
        state.message = 'Announcement updated successfully';
      })
      .addCase(updateAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete Announcement
      .addCase(deleteAnnouncement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.announcements = state.announcements.filter(
          item => item._id !== action.payload
        );
        state.message = 'Announcement deleted successfully';
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentAnnouncement } = announcementSlice.actions;
export default announcementSlice.reducer;