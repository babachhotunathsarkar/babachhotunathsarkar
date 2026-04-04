// src/pages/admin/UserManagement.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Users, Search, Trash2, X, ChevronLeft, ChevronRight,
  AlertTriangle, UserCheck, TrendingUp,
  Calendar, Phone, Mail, MapPin, Crown, RefreshCw,
  ShieldCheck, UserRound,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  getAllUsers, getUserGrowth, updateUserRole,
  deleteUser, bulkDeleteUsers, setPage,
} from '../../redux/adminUsers/adminUserSlice';

/* ─────────────── helpers ─────────────── */
const OmIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none">
    <text x="50%" y="72%" textAnchor="middle" fontSize="28" fill="currentColor" fontFamily="serif">ॐ</text>
  </svg>
);

const AVATAR_COLORS = [
  '#B45309','#C2410C','#15803D','#1D4ED8',
  '#7C3AED','#BE185D','#0E7490','#92400E',
];

const getInitials = (name) => {
  const safe = name || '?';
  return safe.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
};

const getColor = (name) => {
  const safe = name || '?';
  return AVATAR_COLORS[safe.charCodeAt(0) % AVATAR_COLORS.length];
};

// Avatar component inline
const AvatarDisplay = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-16 h-16 text-xl',
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  // If user has profile image, show image
  if (user?.profileImage && user.profileImage !== '') {
    return (
      <div className={`${sizeClass} rounded-xl flex-shrink-0 overflow-hidden shadow-sm`}>
        <img 
          src={user.profileImage} 
          alt={user.name || 'User'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            const parent = e.target.parentElement;
            const color = getColor(user.name);
            const initials = getInitials(user.name);
            parent.innerHTML = `
              <div class="w-full h-full flex items-center justify-center text-white font-bold" style="background: ${color}">
                ${initials}
              </div>
            `;
          }}
        />
      </div>
    );
  }
  
  // Show initials if no image
  return (
    <div 
      className={`${sizeClass} rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm`}
      style={{ background: getColor(user?.name) }}
    >
      {getInitials(user?.name)}
    </div>
  );
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

/* ─────────────── Growth data normalizer ─────────────── */
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const normalizeGrowthData = (raw = []) =>
  raw.map(item => {
    const key   = item._id ?? item.month ?? '';
    const count = item.count ?? 0;
    let month = key;
    if (/^\d{4}-\d{2}$/.test(key)) {
      const mIdx = parseInt(key.split('-')[1], 10) - 1;
      month = MONTH_NAMES[mIdx] ?? key;
    }
    return { month, count };
  });

/* ─────────────── Bar Chart ─────────────── */
const BarChart = ({ data = [] }) => {
  const normalized = normalizeGrowthData(data);
  const max = Math.max(...normalized.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-2 h-28 px-1">
      {normalized.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[9px] text-gray-400 font-mono">{d.count}</span>
          <div
            className="w-full rounded-t transition-all duration-700"
            style={{
              height: `${Math.max((d.count / max) * 68, 4)}px`,
              background: i === normalized.length - 1
                ? 'linear-gradient(to top, #92400E, #D97706)'
                : 'linear-gradient(to top, #FDE68A, #F59E0B)',
            }}
          />
          <span className="text-[9px] text-gray-400 font-mono">{d.month}</span>
        </div>
      ))}
    </div>
  );
};

/* ─────────────── Role Badge ─────────────── */
const RoleBadge = ({ role }) =>
  role === 'admin' ? (
    <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold font-sans border border-amber-200">
      <ShieldCheck className="w-3 h-3" /> Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-semibold font-sans border border-sky-200">
      <UserRound className="w-3 h-3" /> User
    </span>
  );

const ROLES = [
  { value: 'all',   label: 'All Users', icon: <Users className="w-3.5 h-3.5" /> },
  { value: 'user',  label: 'Devotees',  icon: <UserRound className="w-3.5 h-3.5" /> },
  { value: 'admin', label: 'Admins',    icon: <ShieldCheck className="w-3.5 h-3.5" /> },
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function UserManagement() {
  const dispatch = useDispatch();
  const {
    users      = [],
    growthData = [],
    stats      = {},
    isLoading,
    pagination,
  } = useSelector((s) => s.adminUsers ?? {
    users: [], growthData: [], stats: {}, isLoading: false,
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 },
  });

  const [search,          setSearch]          = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterRole,      setFilterRole]      = useState('all');
  const [selected,        setSelected]        = useState([]);
  const [showDelete,      setShowDelete]      = useState(false);
  const [showDetail,      setShowDetail]      = useState(false);
  const [deleteTarget,    setDeleteTarget]    = useState(null);
  const [detailUser,      setDetailUser]      = useState(null);

  /* debounce search 400ms */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  /* reset to page 1 when filter/search changes */
  useEffect(() => {
    dispatch(setPage(1));
  }, [filterRole, debouncedSearch]);

  /* fetch whenever page / filter / search changes */
  useEffect(() => {
    dispatch(getAllUsers({
      page:   pagination.currentPage,
      limit:  pagination.itemsPerPage,
      role:   filterRole,
      search: debouncedSearch,
    }));
  }, [pagination.currentPage, filterRole, debouncedSearch]);

  /* growth chart — once on mount */
  useEffect(() => { dispatch(getUserGrowth()); }, []);

  /* helper to re-fetch current view */
  const refetch = () =>
    dispatch(getAllUsers({
      page:   pagination.currentPage,
      limit:  pagination.itemsPerPage,
      role:   filterRole,
      search: debouncedSearch,
    }));

  /* ── stats with safe fallbacks for any key naming ── */
  const safeStats = {
    totalUsers:  stats.totalUsers  ?? stats.total  ?? 0,
    totalAdmins: stats.totalAdmins ?? stats.admins ?? 0,
    verified:    stats.verified    ?? 0,
    thisMonth:   stats.thisMonth   ?? stats.newThisMonth ?? 0,
  };

  const handleRoleChange = async (id, role) => {
    try {
      await dispatch(updateUserRole({ id, role })).unwrap();
      toast.success(`Role updated to ${role}`);
      refetch();
    } catch (err) { toast.error(err || 'Failed to update role'); }
  };

  const confirmDelete = (user = null) => { setDeleteTarget(user); setShowDelete(true); };

  const handleDelete = async () => {
    try {
      if (deleteTarget) {
        await dispatch(deleteUser(deleteTarget._id)).unwrap();
        toast.success('User deleted successfully');
      } else {
        await dispatch(bulkDeleteUsers(selected)).unwrap();
        toast.success(`${selected.length} users deleted`);
        setSelected([]);
      }
      setShowDelete(false);
      setDeleteTarget(null);
      refetch();
    } catch (err) { toast.error(err || 'Delete failed'); }
  };

  const toggleSel = (id) =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const toggleAll = () =>
    setSelected(selected.length === users.length ? [] : users.map(u => u._id));

  /* ═══ RENDER ═══ */
  return (
    <div
      className="min-h-screen bg-[#FAFAF7]"
      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-end">
        <button
          onClick={refetch}
          className="group flex items-center gap-2 bg-white border border-stone-200 text-gray-700 px-4 py-2 rounded-xl font-sans text-sm hover:bg-stone-50 transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-gray-500 group-hover:rotate-180 transition-transform duration-500" />
          Refresh Data
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        {[
          { label: 'Total Users',  value: safeStats.totalUsers,  icon: '👥', sub: 'registered accounts' },
          { label: 'Admins',       value: safeStats.totalAdmins, icon: '🛡️', sub: 'with admin access' },
          { label: 'Verified',     value: safeStats.verified,    icon: '✅', sub: 'email verified' },
          { label: 'This Month',   value: safeStats.thisMonth,   icon: '📈', sub: 'new registrations' },
        ].map((s) => (
          <div key={s.label}
            className="bg-white rounded-2xl shadow-sm border border-stone-200/80 px-4 py-4 flex items-center gap-3.5 hover:shadow-md transition-shadow duration-200">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-xl flex-shrink-0">
              {s.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-sans font-semibold truncate">{s.label}</p>
              <p className="text-2xl font-bold text-[#92400E] leading-tight">{s.value}</p>
              <p className="text-[10px] text-gray-400 font-sans truncate">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-4">

        {/* Growth Chart */}
        {growthData.length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-gray-700 font-sans">User Growth — Last 12 Months</h3>
            </div>
            <BarChart data={growthData} />
          </div>
        )}

        {/* Role Filter Tabs */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-1.5 flex gap-1 w-fit flex-wrap">
          {ROLES.map((r) => (
            <button
              key={r.value}
              onClick={() => setFilterRole(r.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-sans font-medium transition-all duration-200 whitespace-nowrap ${
                filterRole === r.value
                  ? 'bg-gradient-to-r from-[#92400E] to-[#B45309] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-stone-50'
              }`}
            >
              {r.icon} {r.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm px-4 py-3 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search name, email, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent font-sans bg-stone-50 placeholder:text-stone-400 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {users.length > 0 && (
              <button onClick={toggleAll}
                className="text-xs px-3 py-2 border border-stone-200 rounded-xl hover:bg-stone-50 text-gray-600 font-sans transition-colors">
                {selected.length === users.length && users.length > 0 ? 'Deselect All' : 'Select All'}
              </button>
            )}
            {selected.length > 0 && (
              <button onClick={() => confirmDelete(null)}
                className="flex items-center gap-1.5 text-xs px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 font-sans transition-colors shadow-sm">
                <Trash2 className="w-3.5 h-3.5" /> Delete ({selected.length})
              </button>
            )}
            <span className="text-xs text-gray-400 font-sans hidden sm:block">
              {pagination.totalItems} total
            </span>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
                <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 animate-spin" />
              </div>
              <p className="text-amber-600/80 font-sans text-sm">Loading devotees…</p>
            </div>

          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 gap-3">
              <OmIcon className="w-14 h-14 text-amber-200" />
              <p className="text-gray-400 font-sans text-sm">No users found</p>
              {(debouncedSearch || filterRole !== 'all') && (
                <button
                  onClick={() => { setSearch(''); setFilterRole('all'); }}
                  className="text-xs px-4 py-2 bg-amber-50 text-amber-700 rounded-xl font-sans hover:bg-amber-100 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>

          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50/60">
                      <th className="px-5 py-3.5 text-left w-10">
                        <input type="checkbox"
                          checked={selected.length === users.length && users.length > 0}
                          onChange={toggleAll}
                          className="w-4 h-4 accent-amber-600 rounded" />
                      </th>
                      {['User', 'Contact', 'Role', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3.5 text-left text-[10px] text-gray-400 uppercase tracking-widest font-sans font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {users.map((u) => {
                      const isSelected = selected.includes(u._id);
                      return (
                        <tr key={u._id}
                          className={`hover:bg-amber-50/40 transition-colors duration-150 ${isSelected ? 'bg-amber-50/60' : ''}`}>
                          <td className="px-5 py-4">
                            <input type="checkbox" checked={isSelected}
                              onChange={() => toggleSel(u._id)}
                              className="w-4 h-4 accent-amber-600 rounded" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <AvatarDisplay user={u} size="md" />
                              <div>
                                <p className="text-sm font-semibold text-gray-800 leading-tight">{u.name}</p>
                                <p className="text-[10px] text-gray-400 font-mono mt-0.5">#{u._id.slice(-8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <p className="text-xs text-gray-600 font-sans flex items-center gap-1.5">
                                <Mail className="w-3 h-3 text-amber-500 flex-shrink-0" />
                                <span className="truncate max-w-[180px]">{u.email}</span>
                              </p>
                              {u.phone && (
                                <p className="text-xs text-gray-500 font-sans flex items-center gap-1.5">
                                  <Phone className="w-3 h-3 text-amber-500 flex-shrink-0" /> {u.phone}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <select 
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              className={`text-xs px-2.5 py-1.5 rounded-lg border font-sans font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300 transition-colors ${
                                u.role === 'admin'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-sky-50 text-sky-700 border-sky-200'
                              }`}
                            >
                              <option value="user">👤 User</option>
                              <option value="admin">🛡️ Admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-xs text-gray-500 font-sans">{formatDate(u.createdAt)}</p>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => { setDetailUser(u); setShowDetail(true); }}
                                title="View Details"
                                className="p-1.5 rounded-lg text-sky-500 hover:bg-sky-50 transition-colors"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                              {u.role !== 'admin' && (
                                <button 
                                  onClick={() => confirmDelete(u)}
                                  title="Delete User"
                                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="md:hidden divide-y divide-stone-100">
                {users.map((u) => (
                  <div key={u._id} className="p-4 hover:bg-amber-50/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={selected.includes(u._id)}
                        onChange={() => toggleSel(u._id)}
                        className="w-4 h-4 accent-amber-600 mt-1 flex-shrink-0" 
                      />
                      <AvatarDisplay user={u} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <p className="font-semibold text-gray-800 text-sm">{u.name}</p>
                          <RoleBadge role={u.role} />
                        </div>
                        <p className="text-xs text-gray-500 font-sans mt-0.5 truncate">{u.email}</p>
                        {u.phone && <p className="text-xs text-gray-400 font-sans">{u.phone}</p>}
                        <p className="text-[10px] text-gray-400 font-sans mt-1">{formatDate(u.createdAt)}</p>
                        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                          <button 
                            onClick={() => { setDetailUser(u); setShowDetail(true); }}
                            className="text-[11px] px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 font-sans font-medium border border-sky-100"
                          >
                            View
                          </button>
                          {u.role !== 'admin' && (
                            <button 
                              onClick={() => confirmDelete(u)}
                              className="text-[11px] px-3 py-1.5 rounded-lg bg-red-50 text-red-500 font-sans font-medium border border-red-100"
                            >
                              Delete
                            </button>
                          )}
                          <select 
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className="text-[11px] px-2 py-1.5 rounded-lg border border-stone-200 bg-white font-sans text-gray-600 focus:outline-none focus:ring-1 focus:ring-amber-300 ml-auto"
                          >
                            <option value="user">👤 User</option>
                            <option value="admin">🛡️ Admin</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PAGINATION */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-wrap justify-between items-center px-5 py-4 border-t border-stone-100 gap-3">
              <p className="text-xs text-gray-400 font-sans">
                Showing{' '}
                <span className="font-semibold text-gray-600">
                  {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}–
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                </span>{' '}
                of <span className="font-semibold text-gray-600">{pagination.totalItems}</span>
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => dispatch(setPage(pagination.currentPage - 1))}
                  disabled={pagination.currentPage === 1}
                  className="p-2 rounded-xl border border-stone-200 disabled:opacity-30 hover:bg-amber-50 hover:border-amber-200 text-amber-700 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.currentPage) <= 1)
                    .reduce((acc, p, i, arr) => {
                      if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '...' ? (
                        <span key={`e${i}`} className="px-1 text-gray-400 text-xs">…</span>
                      ) : (
                        <button 
                          key={p} 
                          onClick={() => dispatch(setPage(p))}
                          className={`w-8 h-8 rounded-lg text-sm font-sans font-medium transition-all ${
                            pagination.currentPage === p
                              ? 'bg-gradient-to-b from-[#B45309] to-[#92400E] text-white shadow-sm'
                              : 'text-gray-500 hover:bg-amber-50 hover:text-amber-800'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )
                  }
                </div>
                <button 
                  onClick={() => dispatch(setPage(pagination.currentPage + 1))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 rounded-xl border border-stone-200 disabled:opacity-30 hover:bg-amber-50 hover:border-amber-200 text-amber-700 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL — User Detail */}
      {showDetail && detailUser && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowDetail(false); }}
        >
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md shadow-2xl overflow-hidden">
            <div className="relative bg-gradient-to-r from-[#0D0500] via-[#5C1A00] to-[#92400E] px-6 py-5">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Devotee Profile</h3>
                <button 
                  onClick={() => setShowDetail(false)}
                  className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <AvatarDisplay user={detailUser} size="lg" />
                <div>
                  <p className="text-xl font-bold text-gray-800">{detailUser.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5 break-all">ID: {detailUser._id}</p>
                  <div className="mt-1.5"><RoleBadge role={detailUser.role} /></div>
                </div>
              </div>
              <div className="rounded-2xl border border-stone-200 overflow-hidden divide-y divide-stone-100">
                {[
                  { icon: Mail,     label: 'Email',   value: detailUser.email },
                  { icon: Phone,    label: 'Phone',   value: detailUser.phone   || '—' },
                  { icon: MapPin,   label: 'Address', value: detailUser.address || '—' },
                  { icon: Calendar, label: 'Joined',  value: formatDate(detailUser.createdAt) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 px-4 py-3 hover:bg-amber-50/30 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] text-gray-400 font-sans uppercase tracking-widest font-bold">{label}</p>
                      <p className="text-sm text-gray-700 font-sans truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {detailUser.role !== 'admin' && (
                <div className="flex gap-2.5 pt-1">
                  <button
                    onClick={() => { handleRoleChange(detailUser._id, 'admin'); setShowDetail(false); }}
                    className="flex-1 py-2.5 text-sm bg-gradient-to-r from-[#92400E] to-[#B45309] text-white rounded-xl font-sans shadow-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Crown className="w-4 h-4" /> Make Admin
                  </button>
                  <button
                    onClick={() => { confirmDelete(detailUser); setShowDetail(false); }}
                    className="py-2.5 px-4 text-sm bg-red-50 text-red-500 rounded-xl font-sans hover:bg-red-100 transition-colors border border-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL — Delete Confirm */}
      {showDelete && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowDelete(false); setDeleteTarget(null); } }}
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-7 shadow-2xl border border-red-100">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
                <p className="text-xs text-gray-400 font-sans">This action cannot be undone</p>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl px-4 py-3 mb-5 border border-red-100">
              <p className="text-sm text-gray-700 font-sans leading-relaxed">
                {deleteTarget ? (
                  <>Delete <strong className="text-red-600">{deleteTarget.name}</strong>? All data will be permanently removed.</>
                ) : (
                  <>Delete <strong className="text-red-600">{selected.length} selected users</strong>? This cannot be recovered.</>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => { setShowDelete(false); setDeleteTarget(null); }}
                className="flex-1 py-2.5 text-sm border border-stone-200 rounded-xl hover:bg-stone-50 font-sans text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-2.5 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 font-sans shadow-sm transition-colors font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}