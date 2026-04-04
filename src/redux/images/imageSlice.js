// src/redux/slices/imageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ImageService from './imageService';

// Upload single image
export const uploadImage = createAsyncThunk(
  'images/upload',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await ImageService.uploadImage(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Upload failed');
    }
  }
);

// Upload multiple images
export const uploadMultipalImage = createAsyncThunk(
  'images/uploadMultipal',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await ImageService.uploadMultipalImage(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Upload failed');
    }
  }
);

// Get all images
export const getAllImages = createAsyncThunk(
  'images/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await ImageService.getAllImages(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch images');
    }
  }
);

// Get image by ID
export const getImageById = createAsyncThunk(
  'images/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await ImageService.getImageById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch image');
    }
  }
);

// Get images by category
export const getImagesByCategory = createAsyncThunk(
  'images/getByCategory',
  async ({ category, limit }, { rejectWithValue }) => {
    try {
      const response = await ImageService.getImagesByCategory(category, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch images');
    }
  }
);

// Update image
export const updateImage = createAsyncThunk(
  'images/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await ImageService.updateImage(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

// Delete image
export const deleteImage = createAsyncThunk(
  'images/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await ImageService.deleteImage(id);
      return { id, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  }
);

// Bulk delete images
export const bulkDeleteImages = createAsyncThunk(
  'images/bulkDelete',
  async (imageIds, { rejectWithValue }) => {
    try {
      const response = await ImageService.bulkDeleteImages(imageIds);
      return { imageIds, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Bulk delete failed');
    }
  }
);

const initialState = {
  images: [],
  currentImage: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  }
};

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentImage: (state) => {
      state.currentImage = null;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearImages: (state) => {
      state.images = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Upload single image
      .addCase(uploadImage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload?.data) {
          state.images.unshift(action.payload.data);
        }
        state.message = action.payload?.message || 'Image uploaded successfully';
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Upload multiple images
      .addCase(uploadMultipalImage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(uploadMultipalImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload?.data && Array.isArray(action.payload.data)) {
          state.images.unshift(...action.payload.data);
        }
        state.message = action.payload?.message || 'Images uploaded successfully';
      })
      .addCase(uploadMultipalImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get all images
      .addCase(getAllImages.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.images = action.payload?.data || [];
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getAllImages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get image by ID
      .addCase(getImageById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getImageById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentImage = action.payload?.data;
      })
      .addCase(getImageById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get images by category
      .addCase(getImagesByCategory.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getImagesByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.images = action.payload?.data || [];
      })
      .addCase(getImagesByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update image
      .addCase(updateImage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload?.data) {
          const index = state.images.findIndex(img => img._id === action.payload.data._id);
          if (index !== -1) {
            state.images[index] = action.payload.data;
          }
          if (state.currentImage?._id === action.payload.data._id) {
            state.currentImage = action.payload.data;
          }
        }
        state.message = action.payload?.message || 'Image updated successfully';
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete image
      .addCase(deleteImage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.images = state.images.filter(img => img._id !== action.payload.id);
        state.message = action.payload?.message || 'Image deleted successfully';
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Bulk delete images
      .addCase(bulkDeleteImages.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(bulkDeleteImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.images = state.images.filter(img => !action.payload.imageIds.includes(img._id));
        state.message = action.payload?.message || 'Images deleted successfully';
      })
      .addCase(bulkDeleteImages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset, clearCurrentImage, setPage, clearImages } = imageSlice.actions;
export default imageSlice.reducer;