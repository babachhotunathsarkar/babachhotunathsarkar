import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Bell, X, Check, CheckCheck } from 'lucide-react'
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../redux/notifications/notificationSlice'

export default function NotificationDropdown({ onClose }) {
  const dispatch = useDispatch()

  const notifications = useSelector((state) => state.notifications?.notifications || [])

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationRead(id))
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsRead())
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
    })
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          <span className="font-medium">सूचनाएं</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllAsRead}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {!notifications || notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>कोई नई सूचना नहीं (No notifications)</p>
          </div>
        ) : (
          notifications?.map((notification) => (
            <div
              key={notification._id}
              className={`px-4 py-3 border-b border-gray-50 hover:bg-orange-50/50 transition-colors cursor-pointer ${
                !(notification.isRead || notification.isread || notification.read) ? 'bg-orange-50' : ''
              }`}
              onClick={() => handleMarkAsRead(notification._id)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    !(notification.isRead || notification.isread || notification.read) ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
                {notification.logo ? (
                  <img
                    src={notification.logo}
                    alt={notification.title || 'Notification logo'}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bell className="w-5 h-5 text-orange-500 opacity-70" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {notification.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <span className="text-xs text-gray-400 mt-1 block">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>

                {!(notification.isRead || notification.isread || notification.read) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMarkAsRead(notification._id)
                    }}
                    className="p-1 text-orange-500 hover:bg-orange-100 rounded transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {notifications?.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <button className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium py-1">
            सभी सूचनाएं देखें
          </button>
        </div>
      )}
    </div>
  )
}