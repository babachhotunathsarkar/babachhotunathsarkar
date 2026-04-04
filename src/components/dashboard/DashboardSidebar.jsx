import { Link } from 'react-router-dom'
import {
  Home, IndianRupee, Settings, Calendar, Star,
  Heart, BookOpen, LogOut, X, ChevronRight
} from 'lucide-react'

export default function DashboardSidebar({ activeTab, setActiveTab, onClose, onLogout }) {
  const NAV_ITEMS = [
    { id: 'overview',  label: 'Overview',  icon: Home },
    { id: 'donations', label: 'Donations', icon: IndianRupee },
    { id: 'profile',   label: 'Profile',   icon: Settings },
    { id: 'bookings',  label: 'My Bookings', icon: Calendar },
    { id: 'events',    label: 'Events',    icon: Calendar },
    { id: 'blessings', label: 'Blessings', icon: Star },
  ]

  const QUICK_LINKS = [
    { to: '/donate', label: 'Quick Donate', icon: Heart,    iconColor: 'text-pink-500' },
    { to: '/events', label: 'Quick Events', icon: BookOpen, iconColor: 'text-blue-500' },
  ]

  return (
    <aside className="flex flex-col h-full bg-white overflow-y-auto border-r border-orange-100">

      {/* Mobile header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-orange-100 lg:hidden">
        <span className="font-bold text-orange-700 text-sm">Dashboard Menu</span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Main Nav */}
      <nav className="px-2 pt-3 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-2">
          My Account
        </p>

        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); onClose?.() }}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5
              text-sm font-medium transition-all duration-150
              ${activeTab === id
                ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                : 'text-gray-600 hover:bg-orange-50 hover:text-orange-700'
              }
            `}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left truncate">{label}</span>
            {activeTab === id && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
          </button>
        ))}

        {/* Quick Links */}
        <div className="border-t border-orange-100 mt-3 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-2">
            Quick Links
          </p>
          {QUICK_LINKS.map(({ to, label, icon: Icon, iconColor }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                         text-gray-600 hover:bg-orange-50 hover:text-orange-700 transition-all"
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-orange-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                     text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}