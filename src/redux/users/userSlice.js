import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from './userService';

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async (_, thunkAPI) => {
    try {
      // Returns the flat user object: { _id, name, email, ... }
      return await userService.getcurrentUSer();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user information.'
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, thunkAPI) => {
    try {
      // Returns the updated flat user object
      return await userService.updateProfile(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    }
  }
);

// ── Load from localStorage safely ────────────────────────────────────────────
// localStorage mein hamesha flat user object store hota hai:
// { _id, name, email, role, phone, profileImage, ... }
const userFromStorage = (() => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Safety check: agar nested { user: {...} } aa gaya to unwrap karo
    return parsed?.user ? parsed.user : parsed;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
})();

// ── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  user: userFromStorage,  // flat user object ya null
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// ── Slice ─────────────────────────────────────────────────────────────────────
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError   = false;
      state.message   = '';
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // ── getCurrentUser ──
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.isError   = false;
        state.message   = '';
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user      = action.payload;   // flat user object
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError   = true;
        state.message   = action.payload;
      })

      // ── updateUserProfile ──
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isError   = false;
        state.message   = '';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user      = action.payload;   // updated flat user object
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError   = true;
        state.message   = action.payload;
      });
  },
});

export const { resetUserState, clearUser } = userSlice.actions;
export default userSlice.reducer;