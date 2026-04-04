import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AddressService from './addressService';
 
// Public fetch — no auth token needed (Footer, Contact, About)
export const fetchPublicAddresses = createAsyncThunk('address/fetchPublic', async (_, { rejectWithValue }) => {
  try { return await AddressService.getPublic(); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});

export const fetchAddresses  = createAsyncThunk('address/fetchAll', async (_, { rejectWithValue }) => {
  try { return await AddressService.getAll(); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const createAddress   = createAsyncThunk('address/create',   async (data, { rejectWithValue }) => {
  try { return await AddressService.create(data); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const updateAddress   = createAsyncThunk('address/update',   async ({ id, data }, { rejectWithValue }) => {
  try { return await AddressService.update(id, data); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const deleteAddress   = createAsyncThunk('address/delete',   async (id, { rejectWithValue }) => {
  try { await AddressService.remove(id); return { id }; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const setMainAddress  = createAsyncThunk('address/setMain',  async (id, { rejectWithValue }) => {
  try { return await AddressService.setMain(id); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
 
const initialState = { addresses: [], isLoading: false, isError: false, message: '' };
 
const P = (s)    => { s.isLoading = true;  s.isError = false; };
const R = (s, a) => { s.isLoading = false; s.isError = true;  s.message = a.payload; };
 
const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: { resetAddress: (s) => { s.isError = false; s.message = ''; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending,   P)
      .addCase(fetchAddresses.fulfilled, (s, a) => { s.isLoading = false; s.addresses = a.payload?.data || []; })
      .addCase(fetchAddresses.rejected,  R)
 
      // Public fetch — same shape, same state
      .addCase(fetchPublicAddresses.pending,   P)
.addCase(fetchPublicAddresses.fulfilled, (s, a) => {
  s.isLoading = false;
  // Backend se milne wala single object 'data' ko array mein store karein 
  // taaki Footer.js mein addresses[0] kaam kar sake
  if (a.payload?.data) {
    s.addresses = [a.payload.data];
  } else {
    s.addresses = [];
  }
})     .addCase(fetchPublicAddresses.rejected,  R)
 
      .addCase(createAddress.pending,   P)
      .addCase(createAddress.fulfilled, (s, a) => { s.isLoading = false; if (a.payload?.data) s.addresses.unshift(a.payload.data); })
      .addCase(createAddress.rejected,  R)
 
      .addCase(updateAddress.pending,   P)
      .addCase(updateAddress.fulfilled, (s, a) => {
        s.isLoading = false;
        const idx = s.addresses.findIndex(a2 => a2._id === a.payload?.data?._id);
        if (idx !== -1) s.addresses[idx] = a.payload.data;
      })
      .addCase(updateAddress.rejected,  R)
 
      .addCase(deleteAddress.pending,   P)
      .addCase(deleteAddress.fulfilled, (s, a) => { s.isLoading = false; s.addresses = s.addresses.filter(a2 => a2._id !== a.payload.id); })
      .addCase(deleteAddress.rejected,  R)
 
      .addCase(setMainAddress.pending,   P)
      .addCase(setMainAddress.fulfilled, (s, a) => {
        s.isLoading = false;
        // un-main all, then set the returned one as main
        s.addresses = s.addresses.map(addr =>
          addr._id === a.payload?.data?._id
            ? { ...a.payload.data }
            : { ...addr, isMain: false }
        );
      })
      .addCase(setMainAddress.rejected,  R);
  },
});
 
export const { resetAddress } = addressSlice.actions;
export default addressSlice.reducer;