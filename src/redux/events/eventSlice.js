import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import EventService from './eventService';
 
export const fetchEvents  = createAsyncThunk('events/fetchAll', async (params, { rejectWithValue }) => {
  try { return await EventService.getAll(params); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const createEvent  = createAsyncThunk('events/create',   async (data, { rejectWithValue }) => {
  try { return await EventService.create(data); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const updateEvent  = createAsyncThunk('events/update',   async ({ id, data }, { rejectWithValue }) => {
  try { return await EventService.update(id, data); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const deleteEvent  = createAsyncThunk('events/delete',   async (id, { rejectWithValue }) => {
  try { await EventService.remove(id); return { id }; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const toggleEvent  = createAsyncThunk('events/toggle',   async (id, { rejectWithValue }) => {
  try { return await EventService.toggle(id); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
 
const initialState = {
  events: [], isLoading: false, isError: false, message: '',
  pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 },
};
 
const P = (s)    => { s.isLoading = true;  s.isError = false; };
const R = (s, a) => { s.isLoading = false; s.isError = true;  s.message = a.payload; };
 
const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    resetEvents:   (s) => { s.isError = false; s.message = ''; },
    setEventPage:  (s, a) => { s.pagination.currentPage = a.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending,   P)
      .addCase(fetchEvents.fulfilled, (s, a) => {
        s.isLoading  = false;
        s.events     = a.payload?.data || [];
        if (a.payload?.pagination) s.pagination = a.payload.pagination;
      })
      .addCase(fetchEvents.rejected,  R)
 
      .addCase(createEvent.pending,   P)
      .addCase(createEvent.fulfilled, (s, a) => { s.isLoading = false; if (a.payload?.data) s.events.unshift(a.payload.data); })
      .addCase(createEvent.rejected,  R)
 
      .addCase(updateEvent.pending,   P)
      .addCase(updateEvent.fulfilled, (s, a) => {
        s.isLoading = false;
        const idx = s.events.findIndex(e => e._id === a.payload?.data?._id);
        if (idx !== -1) s.events[idx] = a.payload.data;
      })
      .addCase(updateEvent.rejected,  R)
 
      .addCase(deleteEvent.pending,   P)
      .addCase(deleteEvent.fulfilled, (s, a) => { s.isLoading = false; s.events = s.events.filter(e => e._id !== a.payload.id); })
      .addCase(deleteEvent.rejected,  R)
 
      .addCase(toggleEvent.pending,   P)
      .addCase(toggleEvent.fulfilled, (s, a) => {
        s.isLoading = false;
        const idx = s.events.findIndex(e => e._id === a.payload?.data?._id);
        if (idx !== -1) s.events[idx] = a.payload.data;
      })
      .addCase(toggleEvent.rejected,  R);
  },
});
 
export const { resetEvents, setEventPage } = eventSlice.actions;
export default eventSlice.reducer;