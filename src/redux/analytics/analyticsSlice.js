// src/redux/analytics/analyticsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsService } from './analyticsService';

// Async Thunks
export const fetchAnalyticsDashboard = createAsyncThunk(
    'analytics/fetchDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const data = await analyticsService.getDashboardAnalytics();
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch analytics');
        }
    }
);

export const fetchPageViewsOverTime = createAsyncThunk(
    'analytics/fetchPageViewsOverTime',
    async (days = 30, { rejectWithValue }) => {
        try {
            const data = await analyticsService.getPageViewsOverTime(days);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch page views');
        }
    }
);

export const fetchUserSessions = createAsyncThunk(
    'analytics/fetchUserSessions',
    async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
        try {
            const data = await analyticsService.getUserSessions(page, limit);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch user sessions');
        }
    }
);

export const fetchRouteAnalytics = createAsyncThunk(
    'analytics/fetchRouteAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const data = await analyticsService.getRouteAnalytics();
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch route analytics');
        }
    }
);

export const exportAnalyticsData = createAsyncThunk(
    'analytics/exportData',
    async ({ type, format = 'csv' }, { rejectWithValue }) => {
        try {
            const response = await analyticsService.exportAnalytics(type, format);
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}_analytics.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            return { success: true };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to export analytics');
        }
    }
);

// ADD THIS: Action for tracking click events
export const trackClickEvent = createAsyncThunk(
    'analytics/trackClick',
    async (clickData, { rejectWithValue }) => {
        try {
            // Make API call to track the event
            const response = await analyticsService.trackEvent(clickData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to track event');
        }
    }
);

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState: {
        overview: { 
            totalPageViews: 0, 
            totalClicks: 0, 
            uniqueUsersCount: 0, 
            activeSessionsLastHour: 0 
        },
        topClicks: [],
        topRoutes: [],
        recentlyActiveUsers: [],
        pageViewsOverTime: [],
        userSessions: {
            data: [],
            pagination: { currentPage: 1, totalPages: 1, totalItems: 0 }
        },
        routeAnalytics: [],
        loading: false,
        error: null,
        exportLoading: false,
        lastUpdated: null,
    },
    reducers: {
        clearAnalyticsError: (state) => {
            state.error = null;
        },
        resetAnalytics: (state) => {
            state.overview = { totalPageViews: 0, totalClicks: 0, uniqueUsersCount: 0, activeSessionsLastHour: 0 };
            state.topClicks = [];
            state.topRoutes = [];
            state.recentlyActiveUsers = [];
            state.pageViewsOverTime = [];
            state.userSessions = { data: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0 } };
            state.routeAnalytics = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Dashboard
            .addCase(fetchAnalyticsDashboard.pending, (state) => { 
                state.loading = true; 
                state.error = null; 
            })
            .addCase(fetchAnalyticsDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.overview = action.payload.overview || state.overview;
                state.topClicks = action.payload.topClicks || [];
                state.topRoutes = action.payload.topRoutes || [];
                state.recentlyActiveUsers = action.payload.recentlyActiveUsers || [];
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchAnalyticsDashboard.rejected, (state, action) => { 
                state.loading = false; 
                state.error = action.payload; 
            })
            
            // Fetch Page Views Over Time
            .addCase(fetchPageViewsOverTime.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPageViewsOverTime.fulfilled, (state, action) => {
                state.loading = false;
                state.pageViewsOverTime = action.payload.data || [];
            })
            .addCase(fetchPageViewsOverTime.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch User Sessions
            .addCase(fetchUserSessions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserSessions.fulfilled, (state, action) => {
                state.loading = false;
                state.userSessions = action.payload;
            })
            .addCase(fetchUserSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch Route Analytics
            .addCase(fetchRouteAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRouteAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.routeAnalytics = action.payload.data || [];
            })
            .addCase(fetchRouteAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Export Analytics
            .addCase(exportAnalyticsData.pending, (state) => {
                state.exportLoading = true;
            })
            .addCase(exportAnalyticsData.fulfilled, (state) => {
                state.exportLoading = false;
            })
            .addCase(exportAnalyticsData.rejected, (state, action) => {
                state.exportLoading = false;
                state.error = action.payload;
            })
            
            // ADD THIS: Track click event
            .addCase(trackClickEvent.pending, (state) => {
                // Optional: track loading state for events
            })
            .addCase(trackClickEvent.fulfilled, (state, action) => {
                // Optionally update state if needed
                console.log('Event tracked successfully:', action.payload);
            })
            .addCase(trackClickEvent.rejected, (state, action) => {
                console.error('Failed to track event:', action.payload);
            });
    }
});

export const { clearAnalyticsError, resetAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;