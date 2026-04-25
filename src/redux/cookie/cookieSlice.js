import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cookieService from './cookieService';

const initialState = {
    cookie: null,
    loading: false,
    error: null,
    success: false,
};

export const fetchCookiePolicy = createAsyncThunk(
    'cookie/get',
    async (_, thunkAPI) => {
        try {
            return await cookieService.getCookiePolicy();
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateCookiePolicyAction = createAsyncThunk(
    'cookie/update',
    async (data, thunkAPI) => {
        try {
            return await cookieService.updateCookiePolicy(data);
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const cookieSlice = createSlice({
    name: 'cookie',
    initialState,
    reducers: {
        resetCookieState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCookiePolicy.pending, (state) => { state.loading = true; })
            .addCase(fetchCookiePolicy.fulfilled, (state, action) => {
                state.loading = false;
                state.cookie = action.payload;
            })
            .addCase(fetchCookiePolicy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCookiePolicyAction.pending, (state) => { state.loading = true; })
            .addCase(updateCookiePolicyAction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.cookie = action.payload.policy || action.payload;
            })
            .addCase(updateCookiePolicyAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetCookieState } = cookieSlice.actions;
export default cookieSlice.reducer;
