import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Calendar, Clock, MapPin, X, Loader2 } from 'lucide-react'
import SEO from "../components/SEO";
import { fetchEvents } from '../redux/events/eventSlice';

export default function Events() {
  const dispatch = useDispatch();
  const [selectedEvent, setSelectedEvent] = useState(null)
  const { events = [], isLoading: loading, isError: error } = useSelector((state) => state.events || {})
  console.log("events", events);
  useEffect(() => {
    dispatch(fetchEvents({ page: 1, limit: 100 }));
  }, [dispatch]);

  const getTitle = (event) => event.titleEnglish || event.title
  const getDesc = (event) => event.descriptionEnglish || event.description

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const formatDateRange = (start, end) => {
    if (!start) return '';
    if (!end || start === end) return formatDate(start)
    return `${formatDate(start)} – ${formatDate(end)}`
  }

  // Separate upcoming and past events
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const upcomingEvents = events.filter(e => e.isActive !== false && new Date(e.eventDate || e.date) >= today);
  const pastEvents = events.filter(e => e.isActive !== false && new Date(e.eventDate || e.date) < today);

  const EventCard = ({ event }) => (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group border border-orange-50"
      onClick={() => setSelectedEvent(event)}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50">
        {event.image ? (
          <img src={event.image} alt={getTitle(event)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🪔</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 left-4 bg-white rounded-xl px-3 py-2 shadow-lg text-center">
          <div className="text-2xl font-extrabold text-orange-600 leading-none">
            {new Date(event.eventDate || event.date).getDate()}
          </div>
          <div className="text-xs text-gray-600 uppercase font-medium">
            {new Date(event.eventDate || event.date).toLocaleDateString('en-IN', { month: 'short' })}
          </div>
        </div>
        <div className="absolute bottom-3 left-4">
          <span className="px-2 py-1 bg-orange-600/90 text-white text-xs font-semibold rounded-full uppercase tracking-wide">
            {event.category || 'Event'}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
          {getTitle(event)}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{getDesc(event)}</p>
        <div className="space-y-1.5 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <span>{formatDateRange(event.eventDate || event.date, event.endDate)}</span>
          </div>
          {(event.eventTime || event.time) && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <span>{event.eventTime || event.time}</span>
            </div>
          )}
          {(event.location || event.venue) && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <span className="line-clamp-1">{event.location || event.venue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Upcoming Events & Festivals"
        description="Stay updated with the latest religious events, festivals, and spiritual gatherings at Shri Baba Chhotu Nath Temple, Badesra. View our calendar of celebrations."
      />

      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🪔</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">आगामी कार्यक्रम</h1>
          <p className="text-orange-100 max-w-2xl mx-auto">Upcoming religious events, festivals and spiritual gatherings</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500">
              <p className="text-lg font-medium">Could not load events. Please try again.</p>
            </div>
          ) : (
            <>
              {/* Upcoming */}
              {upcomingEvents.length > 0 && (
                <div className="mb-14">
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar className="w-6 h-6 text-orange-600" />
                    <h2 className="text-2xl font-bold text-gray-900">आगामी कार्यक्रम (Upcoming Events)</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => <EventCard key={event._id || event.id} event={event} />)}
                  </div>
                </div>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-6 h-6 text-gray-400" />
                    <h2 className="text-2xl font-bold text-gray-700">पिछले कार्यक्रम (Past Events)</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                    {pastEvents.map((event) => <EventCard key={event._id || event.id} event={event} />)}
                  </div>
                </div>
              )}

              {events.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🪔</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">कोई कार्यक्रम नहीं</h3>
                  <p className="text-gray-500">No events listed at the moment. Please check back soon.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Event detail modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-56 bg-gradient-to-br from-orange-100 to-amber-50">
              {selectedEvent.image ? (
                <img src={selectedEvent.image} alt={getTitle(selectedEvent)} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">🪔</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors" onClick={() => setSelectedEvent(null)}>
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-0 inset-x-0 p-6">
                <span className="text-xs text-orange-300 font-semibold uppercase tracking-widest">{selectedEvent.category || 'Event'}</span>
                <h2 className="text-2xl font-bold text-white">{getTitle(selectedEvent)}</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6 leading-relaxed">{getDesc(selectedEvent)}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-orange-600 mb-1"><Calendar className="w-4 h-4" /><span className="font-medium text-sm">Date</span></div>
                  <p className="text-gray-900 text-sm font-semibold">{formatDateRange(selectedEvent.eventDate || selectedEvent.date, selectedEvent.endDate)}</p>
                </div>
                {(selectedEvent.eventTime || selectedEvent.time) && (
                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-orange-600 mb-1"><Clock className="w-4 h-4" /><span className="font-medium text-sm">Time</span></div>
                    <p className="text-gray-900 text-sm font-semibold">{selectedEvent.eventTime || selectedEvent.time}</p>
                  </div>
                )}
              </div>
              {(selectedEvent.location || selectedEvent.venue) && (
                <div className="bg-orange-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 text-orange-600 mb-1"><MapPin className="w-4 h-4" /><span className="font-medium text-sm">Venue</span></div>
                  <p className="text-gray-900 text-sm font-semibold">{selectedEvent.location || selectedEvent.venue}</p>
                </div>
              )}
              <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors" onClick={() => setSelectedEvent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
