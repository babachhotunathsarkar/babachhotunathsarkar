// src/admin/components/AdminHeader.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { logoutUser } from '../../redux/auth/authSlice';
import { toast } from 'react-toastify';

export default function AdminHeader({ sidebarOpen, setSidebarOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications (you can replace with real data)
  const notifications = [
    { id: 1, title: 'New user registered', time: '5 min ago', read: false },
    { id: 2, title: 'New donation received', time: '1 hour ago', read: false },
    { id: 3, title: 'Event booking completed', time: '3 hours ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Mobile menu button and title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight hidden md:block">Baba Chhotu Nath Sarkar Sewa Samiti</h2>
              <p className="text-sm text-gray-600 font-medium">Welcome, {user?.name || 'Admin'} <span className="text-gray-400 font-normal hidden lg:inline-block">({user?.email || 'admin@example.com'})</span></p>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-orange-50' : ''
                            }`}
                        >
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <button className="text-sm text-orange-600 hover:text-orange-700 w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
              </button>

              {/* Profile dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    {/* <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </button> */}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}