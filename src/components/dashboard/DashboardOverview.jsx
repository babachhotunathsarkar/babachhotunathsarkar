import { IndianRupee, Gift, Clock, User, Mail, Phone, Shield, Settings } from 'lucide-react'

const fmt = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const STATUS_STYLE = {
  completed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  failed:    'bg-red-100 text-red-700',
}

export default function DashboardOverview({ user, donations, totalDonated, onTabChange }) {
  return (
    <div className="space-y-5">

      {/* ── Stat Cards ── */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Total Donated"  value={`₹${totalDonated.toLocaleString('en-IN')}`} icon={IndianRupee} bg="bg-orange-100" color="text-orange-600" />
        <StatCard label="Donations Made" value={donations.length}                           icon={Gift}        bg="bg-pink-100"   color="text-pink-600"   />
        <StatCard label="Member Since"   value={user?.createdAt ? fmt(user.createdAt) : '—'} icon={Clock}      bg="bg-purple-100" color="text-purple-600" />
      </div>

      {/* ── Profile Card ── */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-orange-500" />
          Profile Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: User,   label: 'Name',  value: user?.name  },
            { icon: Mail,   label: 'Email', value: user?.email },
            { icon: Phone,  label: 'Phone', value: user?.phone },
            { icon: Shield, label: 'Role',  value: user?.role  },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
              <Icon className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="font-semibold text-gray-800 text-sm truncate">{value || '—'}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => onTabChange('profile')}
          className="mt-4 text-sm text-orange-600 font-medium hover:underline flex items-center gap-1"
        >
          <Settings className="w-3.5 h-3.5" />
          Edit Profile
        </button>
      </div>

      {/* ── Recent Donations ── */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-orange-500" />
            Recent Donations
          </h2>
          <button
            onClick={() => onTabChange('donations')}
            className="text-xs text-orange-500 font-medium hover:underline"
          >
            View All
          </button>
        </div>

        {donations.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            No donations found yet.
          </p>
        ) : (
          <div className="space-y-2">
            {donations.slice(0, 3).map(d => (
              <div key={d._id || d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{d.cause || d.title || 'Donation'}</p>
                  <p className="text-xs text-gray-400">{fmt(d.date || d.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">₹{(d.amount || 0).toLocaleString('en-IN')}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[d.status] || STATUS_STYLE.completed}`}>
                    {d.status || 'completed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, bg, color }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}