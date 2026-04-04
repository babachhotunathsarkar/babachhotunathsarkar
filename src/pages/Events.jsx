import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Calendar, Clock, MapPin, X } from 'lucide-react'
import SEO from "../components/SEO";

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const events = useSelector((state) => state.events.items)

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

  const formatDateRange = (start, end) => {
    if (start === end) return formatDate(start)
    return `${formatDate(start)} - ${formatDate(end)}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Upcoming Events & Festivals"
        description="Stay updated with the latest religious events, festivals, and spiritual gatherings at Shri Baba Chhotu Nath Temple, Badesra. View our calendar of celebrations."
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Events
          </h1>
          <p className="text-orange-100 max-w-2xl mx-auto">
            Information about upcoming religious events and festivals
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Upcoming Events */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-orange-600" />
              Upcoming Events
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter((e) => e.isUpcoming)
                .map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={getTitle(event)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-lg">
                        <div className="text-2xl font-bold text-orange-600 leading-none">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-xs text-gray-600 uppercase">
                          {new Date(event.date).toLocaleDateString('en-IN', { month: 'short' })}
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {getTitle(event)}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {getDescription(event)}
                      </p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span>{formatDateRange(event.date, event.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span>{event.venue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64">
              <img
                src={selectedEvent.image}
                alt={getTitle(selectedEvent)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                onClick={() => setSelectedEvent(null)}
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {getTitle(selectedEvent)}
                </h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6 leading-relaxed">
                {getDescription(selectedEvent)}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-orange-600 mb-1">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Date</span>
                  </div>
                  <p className="text-gray-900">
                    {formatDateRange(selectedEvent.date, selectedEvent.endDate)}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-orange-600 mb-1">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Time</span>
                  </div>
                  <p className="text-gray-900">{selectedEvent.time}</p>
                </div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-orange-600 mb-1">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Venue</span>
                </div>
                <p className="text-gray-900">{selectedEvent.venue}</p>
              </div>
              <button
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
