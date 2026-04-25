import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosInstance';

export const fetchPageContent = createAsyncThunk(
    'pageContent/fetch',
    async (slug, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/page-content/${slug}`);
            return { slug, data: res.data };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch page content');
        }
    }
);

export const updatePageContentAPI = createAsyncThunk(
    'pageContent/update',
    async ({ slug, data }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/page-content/admin/${slug}`, data);
            return { slug, data: res.data.page };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

const pageContentSlice = createSlice({
    name: 'pageContent',
    initialState: {
        pages: {},   // keyed by slug
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearMessages: (state) => { state.error = null; state.successMessage = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPageContent.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPageContent.fulfilled, (state, action) => {
                state.loading = false;
                state.pages[action.payload.slug] = action.payload.data;
            })
            .addCase(fetchPageContent.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(updatePageContentAPI.fulfilled, (state, action) => {
                state.pages[action.payload.slug] = action.payload.data;
                state.successMessage = 'Page updated successfully!';
            })
            .addCase(updatePageContentAPI.rejected, (state, action) => { state.error = action.payload; });
    }
});

export const { clearMessages } = pageContentSlice.actions;
export default pageContentSlice.reducer;
