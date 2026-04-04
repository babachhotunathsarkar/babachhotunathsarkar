import { Link } from 'react-router-dom'
import { IndianRupee, Heart, Clock } from 'lucide-react'

const fmt = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const STATUS_STYLE = {
  completed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  failed:    'bg-red-100 text-red-700',
}

export default function DashboardDonations({ donations, isLoading }) {
  const totalDonated = donations
    .filter(d => d.status === 'completed' || !d.status)
    .reduce((sum, d) => sum + (d.amount || 0), 0)

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
        <IndianRupee className="w-5 h-5 text-orange-500" /> My Donations
      </h2>
      <p className="text-gray-400 text-sm mb-5">List of all your donations</p>

      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-0 mb-5 p-4 bg-orange-50 rounded-2xl">
        <div className="text-center px-4 py-1 border-r border-orange-200">
          <p className="text-2xl font-bold text-orange-600">₹{totalDonated.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-500">Total Donated</p>
        </div>
        <div className="text-center px-4 py-1 border-r border-orange-200">
          <p className="text-2xl font-bold text-gray-700">{donations.length}</p>
          <p className="text-xs text-gray-500">Transactions</p>
        </div>
        <div className="text-center px-4 py-1">
          <p className="text-2xl font-bold text-green-600">
            {donations.filter(d => d.status === 'completed' || !d.status).length}
          </p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : donations.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-4xl mb-3">🙏</div>
          <p className="text-gray-500 font-medium">No donations made yet</p>
          <p className="text-gray-400 text-sm mt-1">Make your first donation and get blessings</p>
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map(d => (
            <div
              key={d._id || d.id}
              className="flex items-center justify-between p-4 border border-gray-100
                         rounded-2xl hover:border-orange-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{d.cause || d.title || 'Donation'}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {fmt(d.date || d.createdAt)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-orange-600 text-lg">
                  ₹{(d.amount || 0).toLocaleString('en-IN')}
                </p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                  ${STATUS_STYLE[d.status] || STATUS_STYLE.completed}`}>
                  {d.status || 'completed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <Link
          to="/donate"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600
                     text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md"
        >
          <Heart className="w-4 h-4" /> Donate Now
        </Link>
      </div>
    </div>
  )
}