// src/redux/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import { clearUser } from '../users/userSlice';
// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
 user: user ? user : null,
  token: token || null,
  isAuthenticated: user ? true : false, // Add this line
  isAdmin: user?.role === 'admin' ? true : false, // Add this for admin check
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Register
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      // authService ab { user, token } return karta hai
      return await authService.login(userData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');       // ← user bhi remove karo
    thunkAPI.dispatch(clearUser());         // ← userSlice reset
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = '';
        
        // Extract user data from response
       if (action.payload.data && action.payload.data.user) {
          state.user = action.payload.data.user;
          state.token = action.payload.data.JwtToken;
          state.isAuthenticated = true;
          state.isAdmin = action.payload.data.user.role === 'admin';
        } else if (action.payload.user) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.isAdmin = action.payload.user.role === 'admin';
        }
        
        console.log('User stored in state after register:', state.user);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
.addCase(loginUser.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;
  state.isError = false;
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isAuthenticated = true;                                    // ✅ yeh missing tha
  state.isAdmin = action.payload.user?.role === 'admin';           // ✅ yeh bhi missing tha
})
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        console.error('Login rejected:', action.payload);
      })

  .addCase(logoutUser.fulfilled, (state) => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;    // ✅ add karo
  state.isAdmin = false;            // ✅ add karo
  state.isSuccess = false;
  state.isError = false;
  state.message = '';
})
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;