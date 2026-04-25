import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import termsService from './termsService';

const initialState = {
    terms: null,
    loading: false,
    error: null,
    success: false,
};

export const fetchTerms = createAsyncThunk(
    'terms/get',
    async (_, thunkAPI) => {
        try {
            return await termsService.getTerms();
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateTermsAction = createAsyncThunk(
    'terms/update',
    async (data, thunkAPI) => {
        try {
            return await termsService.updateTerms(data);
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const termsSlice = createSlice({
    name: 'terms',
    initialState,
    reducers: {
        resetTermsState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTerms.pending, (state) => { state.loading = true; })
            .addCase(fetchTerms.fulfilled, (state, action) => {
                state.loading = false;
                state.terms = action.payload;
            })
            .addCase(fetchTerms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateTermsAction.pending, (state) => { state.loading = true; })
            .addCase(updateTermsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.terms = action.payload.terms || action.payload;
            })
            .addCase(updateTermsAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetTermsState } = termsSlice.actions;
export default termsSlice.reducer;
