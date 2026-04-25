// src/redux/analytics/analyticsService.js
import axiosInstance from '../../axiosInstance';

export const analyticsService = {
    // ADD THIS: Track event
    trackEvent: async (eventData) => {
        const response = await axiosInstance.post('/analytics/track', eventData);
        console.log("Analytics", response.data);
        return response.data;
    },

    // Fetch analytics dashboard data
    getDashboardAnalytics: async () => {
        const response = await axiosInstance.get('/analytics/admin/dashboard');
        return response.data;
    },

    // Fetch page views over time
    getPageViewsOverTime: async (days = 30) => {
        const response = await axiosInstance.get(`/analytics/page-views?days=${days}`);
        return response.data;
    },

    // Fetch click analytics
    getClickAnalytics: async (startDate, endDate) => {
        const response = await axiosInstance.get('/analytics/clicks', {
            params: { startDate, endDate }
        });
        return response.data;
    },

    // Fetch user sessions
    getUserSessions: async (page = 1, limit = 20) => {
        const response = await axiosInstance.get('/analytics/sessions', {
            params: { page, limit }
        });
        return response.data;
    },

    // Fetch route analytics
    getRouteAnalytics: async () => {
        const response = await axiosInstance.get('/analytics/routes');
        return response.data;
    },

    // Fetch real-time analytics
    getRealtimeAnalytics: async () => {
        const response = await axiosInstance.get('/analytics/realtime');
        return response.data;
    },

    // Export analytics data
    exportAnalytics: async (type, format = 'csv') => {
        const response = await axiosInstance.get(`/analytics/export/${type}`, {
            params: { format },
            responseType: 'blob'
        });
        return response;
    }
};