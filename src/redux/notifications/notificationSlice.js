import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from './notificationService';

const initialState = {
  notifications: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get Notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/getAll',
  async (_, thunkAPI) => {
    try {
      return await notificationService.getNotifications();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch notifications';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark Single Read
export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id, thunkAPI) => {
    try {
      await notificationService.markAsRead(id);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to mark as read';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark All Read
export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, thunkAPI) => {
    try {
      await notificationService.markAllAsRead();
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to mark all as read';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete Notification
export const removeNotification = createAsyncThunk(
  'notifications/delete',
  async (id, thunkAPI) => {
    try {
      await notificationService.deleteNotification(id);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete notification';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    resetNotificationState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
       state.notifications = action.payload.notifications;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // MARK SINGLE
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const id = action.payload;
        const notification = state.notifications.find(n => n._id === id);
        if (notification) notification.isRead = true;
      })

      // MARK ALL
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(n => ({
          ...n,
          isRead: true,
        }));
      })

      // DELETE
      .addCase(removeNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          n => n._id !== action.payload
        );
      });
  },
});

export const { resetNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;