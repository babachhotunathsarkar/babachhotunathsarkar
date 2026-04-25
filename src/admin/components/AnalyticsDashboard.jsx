// src/pages/admin/Analytics.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BarChart3, Users, Eye, MousePointerClick, Activity,
    TrendingUp, Download, RefreshCw, Calendar, Clock,
    Globe, Smartphone, Monitor, ArrowUp, ArrowDown,
    Loader2, AlertCircle, UserCheck, Route, Link
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
    fetchAnalyticsDashboard,
    fetchPageViewsOverTime,
    fetchUserSessions,
    fetchRouteAnalytics,
    exportAnalyticsData,
    clearAnalyticsError
} from '../../redux/analytics/analyticsSlice';

const Analytics = () => {
    const dispatch = useDispatch();
    const {
        overview,
        topClicks,
        topRoutes,
        recentlyActiveUsers,
        pageViewsOverTime,
        userSessions,
        routeAnalytics,
        loading,
        error,
        exportLoading,
        lastUpdated
    } = useSelector((state) => state.analytics);

    const [dateRange, setDateRange] = useState('7');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchAllData();
    }, [dateRange]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearAnalyticsError());
        }
    }, [error, dispatch]);

    const fetchAllData = async () => {
        await Promise.all([
            dispatch(fetchAnalyticsDashboard()),
            dispatch(fetchPageViewsOverTime(parseInt(dateRange))),
            dispatch(fetchUserSessions({ page: 1, limit: 10 })),
            dispatch(fetchRouteAnalytics())
        ]);
    };

    const handleRefresh = () => {
        fetchAllData();
        toast.success('Analytics data refreshed');
    };

    const handleExport = async (type) => {
        await dispatch(exportAnalyticsData({ type, format: 'csv' }));
        toast.success(`Exported ${type} analytics`);
    };

    const StatCard = ({ title, value, icon: Icon, trend, color }) => (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-semibold ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <p className="text-2xl font-bold text-gray-800">{value?.toLocaleString() || 0}</p>
            <p className="text-xs text-gray-500 font-sans mt-1">{title}</p>
        </div>
    );

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAFAF7] to-[#F5F3F0]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0D0500] via-[#3b0764] to-[#581c87] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <BarChart3 className="w-8 h-8" />
                                Analytics Dashboard
                            </h1>
                            <p className="text-violet-200 mt-2">Track user engagement and platform performance</p>
                            {lastUpdated && (
                                <p className="text-xs text-violet-300 mt-2">
                                    Last updated: {new Date(lastUpdated).toLocaleString()}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                            <button
                                onClick={() => handleExport('dashboard')}
                                disabled={exportLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <StatCard
                                title="Total Page Views"
                                value={overview.totalPageViews}
                                icon={Eye}
                                trend={12}
                                color="bg-violet-100 text-violet-600"
                            />
                            <StatCard
                                title="Total Clicks"
                                value={overview.totalClicks}
                                icon={MousePointerClick}
                                trend={8}
                                color="bg-blue-100 text-blue-600"
                            />
                            <StatCard
                                title="Unique Users"
                                value={overview.uniqueUsersCount}
                                icon={Users}
                                trend={15}
                                color="bg-emerald-100 text-emerald-600"
                            />
                            <StatCard
                                title="Active Sessions"
                                value={overview.activeSessionsLastHour}
                                icon={Activity}
                                trend={-3}
                                color="bg-amber-100 text-amber-600"
                            />
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 border-b border-stone-200 mb-6">
                            {['overview', 'clicks', 'routes', 'users'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 text-sm font-semibold capitalize transition-all ${activeTab === tab
                                        ? 'text-violet-600 border-b-2 border-violet-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Content based on active tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Page Views Chart Placeholder */}
                                <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Page Views Over Time</h3>
                                        <select
                                            value={dateRange}
                                            onChange={(e) => setDateRange(e.target.value)}
                                            className="px-3 py-1.5 text-sm border border-stone-200 rounded-lg"
                                        >
                                            <option value="7">Last 7 days</option>
                                            <option value="30">Last 30 days</option>
                                            <option value="90">Last 90 days</option>
                                        </select>
                                    </div>
                                    <div className="h-80 flex items-center justify-center bg-stone-50 rounded-xl">
                                        {pageViewsOverTime.length > 0 ? (
                                            <div className="text-center">
                                                <TrendingUp className="w-12 h-12 text-violet-400 mx-auto mb-2" />
                                                <p className="text-gray-500">Chart visualization would go here</p>
                                                <p className="text-xs text-gray-400 mt-1">{pageViewsOverTime.length} data points</p>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                                <p className="text-gray-400">No data available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Top Routes */}
                                <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Route className="w-5 h-5 text-violet-500" />
                                        Most Visited Routes
                                    </h3>
                                    <div className="space-y-3">
                                        {topRoutes?.slice(0, 5).map((route, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-bold text-violet-600">#{idx + 1}</span>
                                                    <span className="text-sm text-gray-700 font-mono">{route.path || route.route}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Eye className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-semibold text-gray-700">{route.count?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {(!topRoutes || topRoutes.length === 0) && (
                                            <p className="text-center text-gray-400 py-8">No route data available</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'clicks' && (
                            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <MousePointerClick className="w-5 h-5 text-violet-500" />
                                    Top Clicked Items
                                </h3>
                                <div className="space-y-3">
                                    {topClicks?.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-violet-600">#{idx + 1}</span>
                                                    <span className="text-sm font-medium text-gray-800">{item.title || item.name}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{item.url || item.link}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MousePointerClick className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm font-semibold text-gray-700">{item.clicks?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {(!topClicks || topClicks.length === 0) && (
                                        <p className="text-center text-gray-400 py-8">No click data available</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'routes' && (
                            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Link className="w-5 h-5 text-violet-500" />
                                    Route Analytics
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-stone-200">
                                                <th className="text-left py-3 text-xs font-semibold text-gray-500">Route</th>
                                                <th className="text-left py-3 text-xs font-semibold text-gray-500">Views</th>
                                                <th className="text-left py-3 text-xs font-semibold text-gray-500">Unique Users</th>
                                                <th className="text-left py-3 text-xs font-semibold text-gray-500">Avg. Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {routeAnalytics?.map((route, idx) => (
                                                <tr key={idx} className="border-b border-stone-100">
                                                    <td className="py-3 text-sm text-gray-700 font-mono">{route.path}</td>
                                                    <td className="py-3 text-sm text-gray-600">{route.views?.toLocaleString()}</td>
                                                    <td className="py-3 text-sm text-gray-600">{route.uniqueUsers?.toLocaleString()}</td>
                                                    <td className="py-3 text-sm text-gray-600">{route.avgTimeSpent || '—'}</td>
                                                </tr>
                                            ))}
                                            {(!routeAnalytics || routeAnalytics.length === 0) && (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-8 text-gray-400">No route data available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <UserCheck className="w-5 h-5 text-violet-500" />
                                    Recently Active Users
                                </h3>
                                <div className="space-y-3">
                                    {recentlyActiveUsers?.map((user, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{user.name || user.email}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span className="text-xs text-gray-500">
                                                    {user.lastActive ? new Date(user.lastActive).toLocaleString() : 'Recently'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {(!recentlyActiveUsers || recentlyActiveUsers.length === 0) && (
                                        <p className="text-center text-gray-400 py-8">No active users data available</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Analytics;