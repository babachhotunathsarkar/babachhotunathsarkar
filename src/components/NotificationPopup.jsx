import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { X, Bell, AlertCircle, Calendar, Heart } from 'lucide-react'
import { hideNotificationPopup } from '../redux/slices/notificationsSlice'

const iconMap = {
  event: Calendar,
  donation: Heart,
  alert: AlertCircle,
  default: Bell,
}

export default function NotificationPopup() {
  const dispatch = useDispatch()
  const { showPopup, currentPopup } = useSelector((state) => state.notifications)

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        dispatch(hideNotificationPopup())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showPopup, dispatch])

  if (!showPopup || !currentPopup) return null

  const IconComponent = iconMap[currentPopup.type] || iconMap.default

  return (
    <div className="fixed top-24 right-4 z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border border-orange-100 p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm">
              {currentPopup.title}
            </h4>
            <p className="text-gray-600 text-sm mt-1">
              {currentPopup.message}
            </p>
          </div>
          <button
            onClick={() => dispatch(hideNotificationPopup())}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
