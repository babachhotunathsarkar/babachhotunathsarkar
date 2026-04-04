import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Menu, CheckCircle, AlertCircle, IndianRupee } from 'lucide-react'
import { logout } from '../redux/auth/authSlice'
import { clearUser, getCurrentUser } from '../redux/users/userSlice'
import { getUserLatestBooking } from '../redux/darbarBooking/darbarBookingSlice'
import { fetchMyAppointments } from '../redux/appointment/appointmentSlice'

// ── Dashboard sub-components ──────────────────────────────────────────
import DashboardSidebar     from '../components/dashboard/DashboardSidebar'
import DashboardOverview    from '../components/dashboard/DashboardOverview'
import DashboardDonations   from '../components/dashboard/DashboardDonations'
import UpdateProfile        from '../components/dashboard/UpdateProfile'

// ── Placeholder tabs (you can make separate components later) ─────────
import { Calendar, Star, Link, Ticket, MapPin, Clock, User } from 'lucide-react'

const fmt = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

// ─────────────────────────────────────────────────────────────────────────────

export default function UserDashboard() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { user, isLoading } = useSelector((state) => state.user)

  const [activeTab,   setActiveTab]   = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Real donations — replace [] with actual API fetch when donation model is ready
  // e.g. dispatch(getUserDonations()) and read from state.donations.list
  const donations = []   // TODO: real data

  const totalDonated = donations
    .filter(d => d.status === 'completed' || !d.status)
    .reduce((sum, d) => sum + (d.amount || 0), 0)

  // Fetch user on mount if not in store
  useEffect(() => {
    if (!user) dispatch(getCurrentUser())
  }, [dispatch, user])

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearUser())
    navigate('/login')
  }

  const getInitial = () => (user?.name || 'U').charAt(0).toUpperCase()

  // ── Loading ──
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">

      {/* ── Top Banner ────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-orange-700 via-orange-600 to-orange-500 px-4 py-8 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center gap-4">

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white p-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center
                          text-orange-600 font-bold text-2xl shadow-md overflow-hidden flex-shrink-0">
            {user?.profileImage
              ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              : getInitial()
            }
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-white truncate">
              🙏 नमस्ते, {user?.name || 'भक्त'}
            </h1>
            <p className="text-orange-100 text-sm truncate">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full capitalize">
                {user?.role || 'user'}
              </span>
              {user?.isVerified
                ? <span className="flex items-center gap-1 text-green-200 text-xs">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                : <span className="flex items-center gap-1 text-red-200 text-xs">
                    <AlertCircle className="w-3 h-3" /> Not Verified
                  </span>
              }
            </div>
          </div>

          {/* Donated amount pill */}
          {totalDonated > 0 && (
            <div className="hidden md:flex items-center gap-1 bg-white/20 rounded-xl px-4 py-2 text-white">
              <IndianRupee className="w-4 h-4 text-yellow-200" />
              <span className="font-bold text-lg">{totalDonated.toLocaleString('en-IN')}</span>
              <span className="text-orange-100 text-xs ml-1">donated</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Layout ────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6 relative">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <div className={`
          fixed lg:static top-0 left-0 h-full lg:h-auto z-30 lg:z-auto
          w-64 lg:w-56 xl:w-64 flex-shrink-0
          rounded-none lg:rounded-2xl shadow-xl lg:shadow-lg
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <DashboardSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onClose={() => setSidebarOpen(false)}
            onLogout={handleLogout}
          />
        </div>

        {/* ── Main Content ── */}
        <main key={activeTab} className="flex-1 min-w-0">

          {activeTab === 'overview' && (
            <DashboardOverview
              user={user}
              donations={donations}
              totalDonated={totalDonated}
              onTabChange={setActiveTab}
            />
          )}

          {activeTab === 'donations' && (
            <DashboardDonations
              donations={donations}
              isLoading={false}
            />
          )}

          {activeTab === 'profile' && (
            <UpdateProfile />
          )}

          {activeTab === 'bookings' && (
            <BookingsTab user={user} />
          )}

          {activeTab === 'events' && (
            <EventsTab />
          )}

          {activeTab === 'blessings' && (
            <BlessingsTab />
          )}

        </main>
      </div>
    </div>
  )
}

// ── Inline placeholder tabs (make separate files when you add real data) ──

function EventsTab() {
  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric'})
  const events = [
    { name: 'Ram Navami Mahotsav', date: '2026-04-06', place: 'Main Mandir, Patiala' },
    { name: 'Hanuman Jayanti',     date: '2026-04-12', place: 'Ashram Bhawan'        },
    { name: 'Navratri Jagran',     date: '2026-03-30', place: 'Darbar Hall'          },
  ]
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-orange-500" /> Upcoming Events
      </h2>
      <p className="text-gray-400 text-sm mb-5">Aane wale dharmic karyakram</p>
      <div className="space-y-3">
        {events.map(ev => (
          <div key={ev.name} className="flex gap-4 p-4 border border-gray-100 rounded-2xl hover:border-orange-200 transition-all">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{ev.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{fmt(ev.date)} · {ev.place}</p>
            </div>
          </div>
        ))}
      </div>
      <a href="/events" className="mt-5 inline-flex items-center gap-1 text-orange-600 text-sm font-medium hover:underline">
        Sabhi events dekhein →
      </a>
    </div>
  )
}

function BlessingsTab() {
  return (
    <div className="bg-white rounded-2xl shadow p-6 text-center py-14">
      <div className="text-6xl mb-4">🙏</div>
      <h2 className="font-bold text-xl text-gray-800 mb-2">Baba Chhotu Nath Sarkar ki Kripa</h2>
      <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
        Aapki har dua aur daan Baba ji tak pahuncha.<br />
        Unki kripa aap par sada bani rahe. Jai Baba Chhotu Nath! 🌸
      </p>
      <div className="mt-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 max-w-sm mx-auto">
        <p className="text-orange-700 italic text-sm">"Sewa hi puja hai, daan hi dharma hai"</p>
      </div>
    </div>
  )
}

function BookingsTab({ user }) {
  const dispatch = useDispatch();
  const { latestUserBooking, loading: darbarLoading } = useSelector((state) => state.darbarBooking || {});
  const { list: myAppointments, isLoading: appointmentsLoading } = useSelector((state) => state.appointments || {});

  useEffect(() => {
    if (user?.phone) {
      dispatch(getUserLatestBooking(user.phone));
    }
    dispatch(fetchMyAppointments());
  }, [dispatch, user?.phone]);

  if (!user?.phone) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Ticket className="w-10 h-10 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Phone Number Required</h2>
        <p className="text-gray-600 mb-8">
          To see your Darbar Token and Bookings, please update your phone number in the Profile section.
        </p>
        <Link 
          to="/profile" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
        >
          Update Profile
        </Link>
      </div>
    );
  }

  const isLoading = darbarLoading || appointmentsLoading;

  if (isLoading && !latestUserBooking && !myAppointments.length) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* ── SECTION 1: Sunday Darbar Token ──────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-4 px-2">
          <Ticket className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900 font-primary">Sunday Darbar Token</h2>
        </div>
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-orange-100">
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Latest Darbar Token Status</h2>
              <p className="text-orange-100 text-sm opacity-90">Apna token status yahan check karein</p>
            </div>
            <Ticket className="w-10 h-10 opacity-30" />
          </div>

          {latestUserBooking ? (
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Token Display */}
                <div className="w-40 h-40 rounded-full bg-orange-50 border-8 border-white shadow-inner flex flex-col items-center justify-center text-center shrink-0">
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Token No</span>
                  <span className="text-5xl font-black text-orange-600">#{latestUserBooking.tokenNumber}</span>
                </div>

                {/* Details Grid */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 w-full">
                  <DetailItem icon={User} label="Devotee" value={latestUserBooking.devoteeName} />
                  <DetailItem icon={Calendar} label="Darbar Date" value={fmt(latestUserBooking.darbarDate)} />
                  <DetailItem icon={Clock} label="Booking Time" value={latestUserBooking.bookingTime || "N/A"} />
                  <DetailItem icon={MapPin} label="City / Place" value={latestUserBooking.city} />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm font-bold text-green-700">Booking Confirmed</span>
                </div>
                <p className="text-sm text-gray-400 italic">
                  * Kripaya samay par mandir pahunchein. Jai Baba Chhotu Nath!
                </p>
              </div>
            </div>
          ) : (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">Koi booking nahi mili.</p>
              <Link to="/darbar-booking" className="text-orange-500 text-sm font-bold hover:underline mt-2 inline-block">
                Abhi Token Book Karein →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 2: Appointments ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-4 px-2">
          <Calendar className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900 font-primary">My Appointments</h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {myAppointments?.length > 0 ? (
            myAppointments.map((apt) => (
              <div key={apt._id} className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 hover:shadow-xl transition-all flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Subject / Doctor</p>
                    <p className="font-bold text-gray-800">{apt.reason || apt.doctorName || "General Consultation"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Date & Time</p>
                    <p className="font-bold text-gray-800">{fmt(apt.appointmentDate)} · {apt.appointmentTime}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                      apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {apt.status || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-16 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100">
               <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
               <p className="text-gray-400 font-medium">Koi purana appointment nahi mila.</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8 flex gap-5 items-center">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-600 shrink-0 shadow-sm border border-orange-100">
          <Star className="w-8 h-8" />
        </div>
        <div>
          <h4 className="font-bold text-orange-900 text-lg">Sunday Darbar Suvidha</h4>
          <p className="text-orange-800/70 leading-relaxed">
            Baba Chhotu Nath Sarkar ki kripa se aapka har token surakshit hai. Kripaya apne samay aur turn ka intezaar karein. Koi aur jaankari ke liye contact page par message karein.
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-orange-500 shrink-0 transition-transform hover:scale-110">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-black uppercase tracking-wider mb-0.5">{label}</p>
        <p className="font-bold text-gray-800 leading-tight">{value}</p>
      </div>
    </div>
  );
}