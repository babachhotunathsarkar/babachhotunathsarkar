import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosInstance';

// Fetch all events from backend
export const fetchEvents = createAsyncThunk('events/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/events');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch events');
    }
});

// Admin CRUD
export const createEvent = createAsyncThunk('events/create', async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('/events/admin', data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to create event');
    }
});

export const updateEventAPI = createAsyncThunk('events/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.put(`/events/admin/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update event');
    }
});

export const deleteEventAPI = createAsyncThunk('events/delete', async (id, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`/events/admin/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to delete event');
    }
});

const eventsSlice = createSlice({
    name: 'events',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // fetchEvents
        builder.addCase(fetchEvents.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(fetchEvents.fulfilled, (state, action) => {
            state.loading = false;
            // Normalize: backend returns array of event docs
            state.items = Array.isArray(action.payload) ? action.payload : (action.payload.events || []);
        });
        builder.addCase(fetchEvents.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

        // createEvent
        builder.addCase(createEvent.fulfilled, (state, action) => {
            const ev = action.payload.event || action.payload;
            if (ev) state.items.unshift(ev);
        });

        // updateEventAPI
        builder.addCase(updateEventAPI.fulfilled, (state, action) => {
            const updated = action.payload.event || action.payload;
            if (updated?._id) {
                const idx = state.items.findIndex(e => e._id === updated._id);
                if (idx !== -1) state.items[idx] = updated;
            }
        });

        // deleteEventAPI
        builder.addCase(deleteEventAPI.fulfilled, (state, action) => {
            state.items = state.items.filter(e => e._id !== action.payload);
        });
    }
});

export default eventsSlice.reducer;
