// src/redux/adminUsers/adminUserSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AdminUserService from './adminUserService';

/* ── Thunks ── */
export const getAllUsers = createAsyncThunk(
  'adminUsers/getAll',
  async (params, { rejectWithValue }) => {
    try { return await AdminUserService.getAllUsers(params); }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch users'); }
  }
);

export const getUserGrowth = createAsyncThunk(
  'adminUsers/growth',
  async (_, { rejectWithValue }) => {
    try { return await AdminUserService.getUserGrowth(); }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch growth data'); }
  }
);

export const updateUserRole = createAsyncThunk(
  'adminUsers/updateRole',
  async ({ id, role }, { rejectWithValue }) => {
    try { return await AdminUserService.updateUserRole(id, role); }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to update role'); }
  }
);

export const deleteUser = createAsyncThunk(
  'adminUsers/delete',
  async (id, { rejectWithValue }) => {
    try {
      const r = await AdminUserService.deleteUser(id);
      return { id, ...r };
    } catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to delete user'); }
  }
);

export const bulkDeleteUsers = createAsyncThunk(
  'adminUsers/bulkDelete',
  async (userIds, { rejectWithValue }) => {
    try {
      const r = await AdminUserService.bulkDeleteUsers(userIds);
      return { userIds, ...r };
    } catch (e) { return rejectWithValue(e.response?.data?.message || 'Bulk delete failed'); }
  }
);

/* ── Initial State ── */
const initialState = {
  users:      [],
  growthData: [],   // raw from backend — normalized in component
  stats:      {},
  isLoading:  false,
  isError:    false,
  isSuccess:  false,
  message:    '',
  pagination: {
    currentPage:  1,
    totalPages:   1,
    totalItems:   0,
    itemsPerPage: 10,
  },
};

/* ── Slice ── */
const adminUserSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    reset: (s) => {
      s.isLoading = false;
      s.isSuccess = false;
      s.isError   = false;
      s.message   = '';
    },
    setPage: (s, a) => {
      s.pagination.currentPage = a.payload;
    },
  },
  extraReducers: (builder) => {
    const pending  = (s)    => { s.isLoading = true;  s.isError = false; };
    const rejected = (s, a) => { s.isLoading = false; s.isError = true; s.message = a.payload; };

    builder
      /* getAllUsers */
      .addCase(getAllUsers.pending, pending)
      .addCase(getAllUsers.fulfilled, (s, a) => {
        s.isLoading = false;
        s.isSuccess = true;
        s.users     = a.payload?.data  || [];
        s.stats     = a.payload?.stats || {};
        if (a.payload?.pagination) {
          s.pagination = { ...s.pagination, ...a.payload.pagination };
        }
      })
      .addCase(getAllUsers.rejected, rejected)

      /* getUserGrowth
         Backend returns: { success, data: [{ _id: "2025-01", count: N }, ...] }
         We store raw — normalizeGrowthData() in the component converts _id → month label */
      .addCase(getUserGrowth.pending, pending)
      .addCase(getUserGrowth.fulfilled, (s, a) => {
        s.isLoading  = false;
        s.growthData = a.payload?.data || [];
      })
      .addCase(getUserGrowth.rejected, rejected)

      /* updateUserRole */
      .addCase(updateUserRole.pending, pending)
      .addCase(updateUserRole.fulfilled, (s, a) => {
        s.isLoading = false;
        s.isSuccess = true;
        // optimistic update in local list
        const updated = a.payload?.data;
        if (updated) {
          const idx = s.users.findIndex(u => u._id === updated._id);
          if (idx !== -1) s.users[idx] = updated;
        }
      })
      .addCase(updateUserRole.rejected, rejected)

      /* deleteUser */
      .addCase(deleteUser.pending, pending)
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.isLoading = false;
        s.isSuccess = true;
        s.users = s.users.filter(u => u._id !== a.payload.id);
        if (s.stats.totalUsers) s.stats.totalUsers = Math.max(0, s.stats.totalUsers - 1);
      })
      .addCase(deleteUser.rejected, rejected)

      /* bulkDeleteUsers */
      .addCase(bulkDeleteUsers.pending, pending)
      .addCase(bulkDeleteUsers.fulfilled, (s, a) => {
        s.isLoading = false;
        s.isSuccess = true;
        const deletedIds = new Set(a.payload.userIds);
        s.users = s.users.filter(u => !deletedIds.has(u._id));
        if (s.stats.totalUsers) {
          s.stats.totalUsers = Math.max(0, s.stats.totalUsers - a.payload.userIds.length);
        }
      })
      .addCase(bulkDeleteUsers.rejected, rejected);
  },
});

export const { reset, setPage } = adminUserSlice.actions;
export default adminUserSlice.reducer;