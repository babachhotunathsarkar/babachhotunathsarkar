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
  Calendar,
  BarChart2,
  IndianRupee,
  FileText,
  Users
} from 'lucide-react';
import { logoutUser } from '../../redux/auth/authSlice';

export default function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const savedState = localStorage.getItem('adminSidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newState));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const menuSections = [
    {
      title: 'मुख्य (Main)',
      items: [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
      ]
    },
    {
      title: 'सामग्री (Content)',
      items: [
        { to: '/admin/marquee', icon: AlignLeft, label: 'Marquee' },
        { to: '/admin/announcements', icon: Bell, label: 'Announcements' },
        { to: '/admin/upload-images', icon: Image, label: 'Images' },
        { to: '/admin/upload-videos', icon: Video, label: 'Videos' },
        { to: '/admin/page-content', icon: FileText, label: 'Pages' },
      ]
    },
    {
      title: 'प्रबंधन (Management)',
      items: [
        { to: '/admin/events', icon: Calendar, label: 'Events' },
        { to: '/admin/special-days', icon: Star, label: 'Special Days' },
        { to: '/admin/schedules', icon: Clock, label: 'Schedules' },
        { to: '/admin/timings', icon: Sun, label: 'Timings' },
        { to: '/admin/donation-settings', icon: IndianRupee, label: 'Donations' },
        { to: '/admin/address', icon: MapPin, label: 'Addresses' },
        { to: '/admin/users', icon: Users, label: 'Users' },
      ]
    }
  ];

  return (
    <div 
      className={`relative bg-white text-gray-700 shadow-xl transition-all duration-500 h-full flex flex-col ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-20 bg-orange-500 text-white rounded-full p-1.5 shadow-xl hover:bg-orange-600 hover:scale-110 transition-all z-50 border-2 border-white"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Logo Section */}
      <div className={`p-8 border-b border-gray-100 flex items-center justify-center transition-all ${isCollapsed ? 'px-4' : ''}`}>
        <div className={`rounded-2xl overflow-hidden border-2 border-orange-500 shadow-md bg-white p-1 transition-all ${isCollapsed ? 'w-12 h-12' : 'w-16 h-16'}`}>
          <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover rounded-xl" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 px-3 space-y-8 overflow-y-auto no-scrollbar">
        {menuSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-2">
            {!isCollapsed && (
              <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <div
                  key={item.to}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.to)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center ${isCollapsed ? 'justify-center' : 'justify-start gap-4'} px-4 py-3 rounded-xl transition-all duration-300 group ${
                        isActive 
                        ? 'bg-orange-50 text-orange-600 font-bold border-r-4 border-orange-500 rounded-r-none' 
                        : 'hover:bg-orange-50/50 hover:text-orange-500'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`transition-all duration-300 ${isActive ? 'scale-110 text-orange-600' : 'text-gray-400 group-hover:text-orange-500'}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        {!isCollapsed && <span className="text-sm tracking-tight">{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                  
                  {isCollapsed && hoveredItem === item.to && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg shadow-2xl z-[100] animate-in fade-in slide-in-from-left-2">
                      {item.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-4 px-4 py-4 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all w-full group ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
          {!isCollapsed && <span className="text-sm font-bold">Sign Out</span>}
        </button>
      </div>
    </div>
  );
}