// src/redux/videos/videoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import VideoService from './videoService';

export const uploadVideo = createAsyncThunk('videos/upload',
  async (formData, { rejectWithValue }) => {
    try { return await VideoService.uploadVideo(formData); }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Upload failed'); }
  }
);

export const uploadMultipleVideos = createAsyncThunk('videos/uploadMultiple',
  async (formData, { rejectWithValue }) => {
    try { return await VideoService.uploadMultipleVideos(formData); }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Upload failed'); }
  }
);

export const getAllVideos = createAsyncThunk('videos/getAll',
  async (params, { rejectWithValue }) => {
    try { return await VideoService.getAllVideos(params); }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch videos'); }
  }
);

export const getVideoById = createAsyncThunk('videos/getById',
  async (id, { rejectWithValue }) => {
    try { return await VideoService.getVideoById(id); }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch video'); }
  }
);

export const updateVideo = createAsyncThunk('videos/update',
  async ({ id, data }, { rejectWithValue }) => {
    try { return await VideoService.updateVideo(id, data); }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Update failed'); }
  }
);

export const deleteVideo = createAsyncThunk('videos/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await VideoService.deleteVideo(id);
      return { id, ...response };
    }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Delete failed'); }
  }
);

export const bulkDeleteVideos = createAsyncThunk('videos/bulkDelete',
  async (videoIds, { rejectWithValue }) => {
    try {
      const response = await VideoService.bulkDeleteVideos(videoIds);
      return { videoIds, ...response };
    }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Bulk delete failed'); }
  }
);

const initialState = {
  videos: [],
  currentVideo: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 20 },
};

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    reset:             (state) => { state.isLoading = false; state.isSuccess = false; state.isError = false; state.message = ''; },
    clearCurrentVideo: (state) => { state.currentVideo = null; },
    setPage:           (state, action) => { state.pagination.currentPage = action.payload; },
    clearVideos:       (state) => { state.videos = []; state.pagination = initialState.pagination; },
  },
  extraReducers: (builder) => {
    const pending   = (state) => { state.isLoading = true; state.isError = false; };
    const rejected  = (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; };

    builder
      // upload single
      .addCase(uploadVideo.pending, pending)
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true;
        if (action.payload?.data) state.videos.unshift(action.payload.data);
        state.message = action.payload?.message || 'Video uploaded';
      })
      .addCase(uploadVideo.rejected, rejected)

      // upload multiple
      .addCase(uploadMultipleVideos.pending, pending)
      .addCase(uploadMultipleVideos.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true;
        if (Array.isArray(action.payload?.data)) state.videos.unshift(...action.payload.data);
        state.message = action.payload?.message || 'Videos uploaded';
      })
      .addCase(uploadMultipleVideos.rejected, rejected)

      // get all
      .addCase(getAllVideos.pending, pending)
      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true;
        state.videos = action.payload?.data || [];
        if (action.payload?.pagination) state.pagination = action.payload.pagination;
      })
      .addCase(getAllVideos.rejected, rejected)

      // get by id
      .addCase(getVideoById.pending, pending)
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true;
        state.currentVideo = action.payload?.data;
      })
      .addCase(getVideoById.rejected, rejected)

      // update
      .addCase(updateVideo.pending, pending)
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true;
        if (action.payload?.data) {
          const idx = state.videos.findIndex(v => v._id === action.payload.data._id);
          if (idx !== -1) state.videos[idx] = action.payload.data;
          if (state.currentVideo?._id === action.payload.data._id) state.currentVideo = action.payload.data;
        }
        state.message = action.payload?.message || 'Video updated';
      })
      .addCase(updateVideo.rejected, rejected)

      // delete
      .addCase(deleteVideo.pending, pending)
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true;
        state.videos = state.videos.filter(v => v._id !== action.payload.id);
        state.message = action.payload?.message || 'Video deleted';
      })
      .addCase(deleteVideo.rejected, rejected)

      // bulk delete
      .addCase(bulkDeleteVideos.pending, pending)
      .addCase(bulkDeleteVideos.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true;
        state.videos = state.videos.filter(v => !action.payload.videoIds.includes(v._id));
        state.message = action.payload?.message || 'Videos deleted';
      })
      .addCase(bulkDeleteVideos.rejected, rejected);
  },
});

export const { reset, clearCurrentVideo, setPage, clearVideos } = videoSlice.actions;
export default videoSlice.reducer;