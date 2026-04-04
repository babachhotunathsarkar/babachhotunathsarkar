import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import MarqueeService from './marqueeService';
 
export const fetchMarquees    = createAsyncThunk('marquee/fetchAll', async (_, { rejectWithValue }) => {
  try { return await MarqueeService.getAll(); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const createMarquee    = createAsyncThunk('marquee/create',   async (data, { rejectWithValue }) => {
  try { return await MarqueeService.create(data); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const updateMarquee    = createAsyncThunk('marquee/update',   async ({ id, data }, { rejectWithValue }) => {
  try { return await MarqueeService.update(id, data); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const deleteMarquee    = createAsyncThunk('marquee/delete',   async (id, { rejectWithValue }) => {
  try { await MarqueeService.remove(id); return { id }; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const toggleMarquee    = createAsyncThunk('marquee/toggle',   async (id, { rejectWithValue }) => {
  try { return await MarqueeService.toggle(id); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
 
const initialState = { items: [], isLoading: false, isError: false, message: '' };
 
const P = (s)    => { s.isLoading = true;  s.isError = false; };
const R = (s, a) => { s.isLoading = false; s.isError = true;  s.message = a.payload; };
 
const marqueeSlice = createSlice({
  name: 'marquee',
  initialState,
  reducers: { resetMarquee: (s) => { s.isError = false; s.message = ''; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarquees.pending,   P)
      .addCase(fetchMarquees.fulfilled, (s, a) => {
        s.isLoading = false;
        s.items = a.payload?.data || a.payload || [];
      })
      .addCase(fetchMarquees.rejected,  R)
 
      .addCase(createMarquee.pending,   P)
      .addCase(createMarquee.fulfilled, (s, a) => { s.isLoading = false; if (a.payload?.data) s.items.unshift(a.payload.data); })
      .addCase(createMarquee.rejected,  R)
 
      .addCase(updateMarquee.pending,   P)
      .addCase(updateMarquee.fulfilled, (s, a) => {
  s.isLoading = false;
  const item = a.payload?.data || a.payload;
  const idx = s.items.findIndex(i => i._id === item._id);
  if (idx !== -1) s.items[idx] = item;
})
      .addCase(updateMarquee.rejected,  R)
 
      .addCase(deleteMarquee.pending,   P)
      .addCase(deleteMarquee.fulfilled, (s, a) => { s.isLoading = false; s.items = s.items.filter(i => i._id !== a.payload.id); })
      .addCase(deleteMarquee.rejected,  R)
 
      .addCase(toggleMarquee.pending,   P)
      .addCase(toggleMarquee.fulfilled, (s, a) => {
  s.isLoading = false;
  const item = a.payload?.data || a.payload;
  const idx = s.items.findIndex(i => i._id === item._id);
  if (idx !== -1) s.items[idx] = item;
})
      .addCase(toggleMarquee.rejected,  R);
  },
});
 
export const { resetMarquee } = marqueeSlice.actions;
export default marqueeSlice.reducer;