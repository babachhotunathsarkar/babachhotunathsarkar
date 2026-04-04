// src/admin/components/AdminSidebar.jsx
import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Image, 
  Video, 
  AlignLeft, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Upload,
  Bell,
  MapPin,
  Clock,
  Sun,
  Star,
  Calendar
} from 'lucide-react';
import { logoutUser } from '../../redux/auth/authSlice';

export default function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('adminSidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save collapsed state
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newState));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/marquee', icon: AlignLeft, label: 'Marquee Messages' },
    { to: '/admin/upload-images', icon: Image, label: 'Upload Images' },
    { to: '/admin/upload-videos', icon: Video, label: 'Upload Videos' },
    { to: '/admin/announcements', icon: Bell, label: 'Announcements' },
    { to: '/admin/address', icon: MapPin, label: 'Addresses' },
    { to: '/admin/schedules', icon: Clock, label: 'Daily Schedule' },
    { to: '/admin/timings', icon: Sun, label: 'Temple Timings' },
    { to: '/admin/special-days', icon: Star, label: 'Special Days' },
    { to: '/admin/darbar-bookings', icon: Calendar, label: 'Darbar Bookings' },
  ];

  return (
    <div 
      className={`relative bg-white shadow-lg transition-all duration-300 h-full ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-20 bg-orange-500 text-white rounded-full p-1 shadow-lg hover:bg-orange-600 transition-all z-20"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Logo Section */}
      <div className={`p-6 py-5 border-b border-gray-200 flex items-center ${isCollapsed ? 'justify-center px-4' : 'justify-center lg:justify-start'}`}>
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-500 flex-shrink-0 shadow-md">
          <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 space-y-1">
        {navItems.map((item) => (
          <div
            key={item.to}
            className="relative group"
            onMouseEnter={() => setHoveredItem(item.to)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'} px-6 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors ${
                  isActive ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-600' : ''
                }`
              }
            >
              <item.icon className={`w-5 h-5 ${isCollapsed ? '' : ''}`} />
              {!isCollapsed && (
                <span className="transition-opacity duration-300 whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </NavLink>
            
            {/* Tooltip for collapsed state - Fixed position */}
            {isCollapsed && (
              <div className={`absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50 pointer-events-none transition-opacity duration-200 ${
                hoveredItem === item.to ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}>
                {item.label}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className={`absolute bottom-0 ${isCollapsed ? 'left-0 right-0' : 'w-full'} p-6 border-t border-gray-200`}>
        <div className="relative group">
          <button
            onClick={handleLogout}
            className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'space-x-3'} text-gray-700 hover:text-red-600 transition-colors w-full`}
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <LogOut className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
            {!isCollapsed && <span>Logout</span>}
          </button>
          
          {/* Tooltip for logout when collapsed */}
          {isCollapsed && (
            <div className={`absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50 transition-opacity duration-200 ${
              hoveredItem === 'logout' ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}>
              Logout
            </div>
          )}
        </div>
      </div>
    </div>
  );
}