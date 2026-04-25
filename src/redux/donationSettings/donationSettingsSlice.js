import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosInstance';

export const fetchDonationSettings = createAsyncThunk(
    'donationSettings/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/donation-settings');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch donation settings');
        }
    }
);

export const updateDonationSettingsAPI = createAsyncThunk(
    'donationSettings/update',
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put('/donation-settings/update', data);
            return res.data.settings;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update');
        }
    }
);

export const uploadQRCodeAPI = createAsyncThunk(
    'donationSettings/uploadQR',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/donation-settings/upload-qr', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data.qrCodeUrl;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to upload QR');
        }
    }
);

const donationSettingsSlice = createSlice({
    name: 'donationSettings',
    initialState: {
        data: null,
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearMessages: (state) => { state.error = null; state.successMessage = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDonationSettings.pending, (state) => { state.loading = true; })
            .addCase(fetchDonationSettings.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
            .addCase(fetchDonationSettings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(updateDonationSettingsAPI.fulfilled, (state, action) => { state.data = action.payload; state.successMessage = 'Settings updated!'; })
            .addCase(updateDonationSettingsAPI.rejected, (state, action) => { state.error = action.payload; })

            .addCase(uploadQRCodeAPI.fulfilled, (state, action) => {
                if (state.data) state.data.qrCodeUrl = action.payload;
                state.successMessage = 'QR Code uploaded!';
            })
            .addCase(uploadQRCodeAPI.rejected, (state, action) => { state.error = action.payload; });
    }
});

export const { clearMessages } = donationSettingsSlice.actions;
export default donationSettingsSlice.reducer;
