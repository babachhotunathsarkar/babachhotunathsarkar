import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react'

export default function UpcomingEvents() {
  const events = useSelector((state) => state.events.items)

  const upcomingEvents = events.filter((e) => e.isUpcoming).slice(0, 3)

  const getTitle = (event) => {
    return event.titleEnglish || event.title
  }

  const getDescription = (event) => {
    return event.descriptionEnglish || event.description
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="inline-block text-orange-600 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider">
              Events
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Upcoming Events
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm sm:text-base group"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={getTitle(event)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Date Badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-lg">
                  <div className="text-lg sm:text-2xl font-bold text-orange-600 leading-none">
                    {new Date(event.date).getDate()}
                  </div>
                  <div className="text-xs text-gray-600 uppercase">
                    {new Date(event.date).toLocaleDateString('en-IN', { month: 'short' })}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
                  {getTitle(event)}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                  {getDescription(event)}
                </p>

                {/* Meta Info */}
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
                    <span className="truncate">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
