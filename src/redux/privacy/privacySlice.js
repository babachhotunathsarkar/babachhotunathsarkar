import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import privacyService from './privacyService';

const initialState = {
    privacy: null,
    loading: false,
    error: null,
    success: false,
};

export const fetchPrivacyPolicy = createAsyncThunk(
    'privacy/get',
    async (_, thunkAPI) => {
        try {
            return await privacyService.getPrivacyPolicy();
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updatePrivacyPolicyAction = createAsyncThunk(
    'privacy/update',
    async (data, thunkAPI) => {
        try {
            return await privacyService.updatePrivacyPolicy(data);
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const privacySlice = createSlice({
    name: 'privacy',
    initialState,
    reducers: {
        resetPrivacyState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPrivacyPolicy.pending, (state) => { state.loading = true; })
            .addCase(fetchPrivacyPolicy.fulfilled, (state, action) => {
                state.loading = false;
                state.privacy = action.payload;
            })
            .addCase(fetchPrivacyPolicy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePrivacyPolicyAction.pending, (state) => { state.loading = true; })
            .addCase(updatePrivacyPolicyAction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.privacy = action.payload.policy || action.payload;
            })
            .addCase(updatePrivacyPolicyAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetPrivacyState } = privacySlice.actions;
export default privacySlice.reducer;
