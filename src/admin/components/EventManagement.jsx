// src/pages/admin/EventManagement.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CalendarDays, Plus, Pencil, Trash2, X, AlertTriangle,
  RefreshCw, MapPin, Clock, Search, Tag, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  fetchEvents, createEvent, updateEvent,
  deleteEvent, toggleEvent, setEventPage,
} from '../../redux/events/eventSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ── helpers ── */
const OmIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none">
    <text x="50%" y="72%" textAnchor="middle" fontSize="28" fill="currentColor" fontFamily="serif">ॐ</text>
  </svg>
);

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const CATEGORIES = [
  { value: 'all',      label: 'All',       emoji: '📋' },
  { value: 'festival', label: 'Festival',  emoji: '🎪' },
  { value: 'puja',     label: 'Puja',      emoji: '🙏' },
  { value: 'seva',     label: 'Seva',      emoji: '🤲' },
  { value: 'cultural', label: 'Cultural',  emoji: '🎭' },
  { value: 'general',  label: 'General',   emoji: '📌' },
  { value: 'other',    label: 'Other',     emoji: '🔖' },
];

const CAT_COLORS = {
  festival: 'bg-rose-50 text-rose-700 border-rose-200',
  puja:     'bg-amber-50 text-amber-700 border-amber-200',
  seva:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  cultural: 'bg-violet-50 text-violet-700 border-violet-200',
  general:  'bg-sky-50 text-sky-700 border-sky-200',
  other:    'bg-stone-100 text-stone-600 border-stone-200',
};

const EMPTY_FORM = { title: '', description: '', eventDate: '', eventTime: '', location: '', category: 'general', isActive: true };

/* ════════════════════════════════════════ */
export default function EventManagement() {
  const dispatch = useDispatch();
  const { events = [], isLoading, pagination } = useSelector(s => s.events ?? {
    events: [], isLoading: false,
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 },
  });

  const [search,          setSearch]          = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterCat,       setFilterCat]       = useState('all');
  const [showForm,        setShowForm]        = useState(false);
  const [showDelete,      setShowDelete]      = useState(false);
  const [editItem,        setEditItem]        = useState(null);
  const [deleteId,        setDeleteId]        = useState(null);
  const [form,            setForm]            = useState(EMPTY_FORM);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { dispatch(setEventPage(1)); }, [filterCat, debouncedSearch]);

  useEffect(() => {
    dispatch(fetchEvents({ page: pagination.currentPage, limit: pagination.itemsPerPage, search: debouncedSearch, category: filterCat }));
  }, [pagination.currentPage, filterCat, debouncedSearch]);

  const refetch = () => dispatch(fetchEvents({
    page: pagination.currentPage, limit: pagination.itemsPerPage,
    search: debouncedSearch, category: filterCat,
  }));

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit   = (item) => {
    setEditItem(item);
    setForm({
      title: item.title, description: item.description || '',
      eventDate: item.eventDate ? new Date(item.eventDate).toISOString().split('T')[0] : '',
      eventTime: item.eventTime || '', location: item.location || '',
      category: item.category || 'general', isActive: item.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.eventDate) return toast.error('Title and date are required');
    try {
      if (editItem) {
        await dispatch(updateEvent({ id: editItem._id, data: form })).unwrap();
        toast.success('Event updated');
      } else {
        await dispatch(createEvent(form)).unwrap();
        toast.success('Event created');
      }
      setShowForm(false); refetch();
    } catch (err) { toast.error(err || 'Failed'); }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteEvent(deleteId)).unwrap();
      toast.success('Event deleted'); setShowDelete(false); setDeleteId(null); refetch();
    } catch (err) { toast.error(err || 'Failed'); }
  };

  const handleToggle = async (id) => {
    try { await dispatch(toggleEvent(id)).unwrap(); toast.success('Status updated'); }
    catch (err) { toast.error(err || 'Failed'); }
  };

  const inp = "w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 font-sans bg-stone-50 placeholder:text-stone-400";

  return (
    <div className="min-h-screen bg-[#FAFAF7]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-end gap-3">
        <button onClick={refetch}
          className="group flex items-center gap-2 bg-white border border-stone-200 text-gray-700 px-4 py-2 rounded-xl font-sans text-sm hover:bg-stone-50 transition-all shadow-sm">
          <RefreshCw className="w-4 h-4 text-gray-500 group-hover:rotate-180 transition-transform duration-500" /> Refresh
        </button>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-violet-600 text-white px-5 py-2 rounded-xl font-sans text-sm font-bold hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Events', value: pagination.totalItems, color: 'text-[#581c87]' },
            { label: 'Active',       value: events.filter(e => e.isActive).length, color: 'text-emerald-600' },
            { label: 'This Page',    value: events.length, color: 'text-violet-600' },
            { label: 'Upcoming',     value: events.filter(e => new Date(e.eventDate) >= new Date()).length, color: 'text-sky-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-stone-200/80 shadow-sm px-4 py-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-sans font-semibold">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Category tabs */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-1.5 flex gap-1 overflow-x-auto flex-shrink-0">
            {CATEGORIES.map(c => (
              <button key={c.value} onClick={() => setFilterCat(c.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans font-medium whitespace-nowrap transition-all ${
                  filterCat === c.value ? 'bg-gradient-to-r from-[#581c87] to-[#7e22ce] text-white shadow-sm' : 'text-gray-500 hover:bg-stone-50'
                }`}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400 w-4 h-4 pointer-events-none" />
            <input type="text" placeholder="Search title, location…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 font-sans bg-white" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X className="w-3.5 h-3.5" /></button>}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-24 gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-violet-100 border-t-violet-500 animate-spin" />
              <p className="text-violet-600/80 font-sans text-sm">Loading events…</p>
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <CalendarDays className="w-12 h-12 text-violet-200" />
              <p className="text-gray-400 font-sans text-sm">No events found</p>
              {(debouncedSearch || filterCat !== 'all') && (
                <button onClick={() => { setSearch(''); setFilterCat('all'); }}
                  className="text-xs px-4 py-2 bg-violet-50 text-violet-700 rounded-xl font-sans hover:bg-violet-100">Clear filters</button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50/60">
                      {['Title', 'Date & Time', 'Location', 'Category', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3.5 text-left text-[10px] text-gray-400 uppercase tracking-widest font-sans font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {events.map((event) => (
                      <tr key={event._id} className="hover:bg-violet-50/30 transition-colors">
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-gray-800">{event.title}</p>
                          {event.description && <p className="text-[11px] text-gray-400 font-sans truncate max-w-[200px] mt-0.5">{event.description}</p>}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-xs text-gray-700 font-sans flex items-center gap-1.5">
                            <CalendarDays className="w-3 h-3 text-violet-400" />{formatDate(event.eventDate)}
                          </p>
                          {event.eventTime && (
                            <p className="text-xs text-gray-500 font-sans flex items-center gap-1.5 mt-0.5">
                              <Clock className="w-3 h-3 text-violet-400" />{event.eventTime}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {event.location ? (
                            <p className="text-xs text-gray-600 font-sans flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-violet-400 flex-shrink-0" />
                              <span className="truncate max-w-[120px]">{event.location}</span>
                            </p>
                          ) : <span className="text-gray-300 text-xs">—</span>}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border font-sans font-semibold ${CAT_COLORS[event.category] || CAT_COLORS.general}`}>
                            {CATEGORIES.find(c => c.value === event.category)?.emoji} {event.category}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button onClick={() => handleToggle(event._id)}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-sans font-medium transition-colors ${
                              event.isActive ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}>
                            {event.isActive ? <><ToggleRight className="w-4 h-4" /> Active</> : <><ToggleLeft className="w-4 h-4" /> Inactive</>}
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <button onClick={() => openEdit(event)} className="p-1.5 rounded-lg text-violet-500 hover:bg-violet-50 transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => { setDeleteId(event._id); setShowDelete(true); }} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-stone-100">
                {events.map((event) => (
                  <div key={event._id} className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold text-gray-800 text-sm">{event.title}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-sans font-semibold flex-shrink-0 ${CAT_COLORS[event.category] || CAT_COLORS.general}`}>
                        {event.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 font-sans my-1.5">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{formatDate(event.eventDate)}</span>
                      {event.eventTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.eventTime}</span>}
                      {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => handleToggle(event._id)}
                        className={`text-[11px] px-3 py-1.5 rounded-lg font-sans font-medium border ${event.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        {event.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button onClick={() => openEdit(event)} className="text-[11px] px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 font-sans font-medium border border-violet-100">Edit</button>
                      <button onClick={() => { setDeleteId(event._id); setShowDelete(true); }} className="text-[11px] px-3 py-1.5 rounded-lg bg-red-50 text-red-500 font-sans font-medium border border-red-100">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-wrap justify-between items-center px-5 py-4 border-t border-stone-100 gap-3">
              <p className="text-xs text-gray-400 font-sans">
                Showing <span className="font-semibold text-gray-600">
                  {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}–
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                </span> of <span className="font-semibold text-gray-600">{pagination.totalItems}</span>
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => dispatch(setEventPage(pagination.currentPage - 1))} disabled={pagination.currentPage === 1}
                  className="p-2 rounded-xl border border-stone-200 disabled:opacity-30 hover:bg-violet-50 text-violet-700 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.currentPage) <= 1)
                  .reduce((acc, p, i, arr) => { if (i > 0 && p - arr[i - 1] > 1) acc.push('...'); acc.push(p); return acc; }, [])
                  .map((p, i) => p === '...' ? <span key={`e${i}`} className="px-1 text-gray-400 text-xs">…</span> : (
                    <button key={p} onClick={() => dispatch(setEventPage(p))}
                      className={`w-8 h-8 rounded-lg text-sm font-sans font-medium transition-all ${pagination.currentPage === p ? 'bg-gradient-to-b from-[#7e22ce] to-[#581c87] text-white shadow-sm' : 'text-gray-500 hover:bg-violet-50'}`}>
                      {p}
                    </button>
                  ))}
                <button onClick={() => dispatch(setEventPage(pagination.currentPage + 1))} disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 rounded-xl border border-stone-200 disabled:opacity-30 hover:bg-violet-50 text-violet-700 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="relative bg-gradient-to-r from-[#0D0500] via-[#3b0764] to-[#581c87] px-6 py-5 flex items-center justify-between sticky top-0 z-10">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
              <h3 className="text-lg font-bold text-white">{editItem ? 'Edit Event' : 'Add New Event'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Event title…" className={inp} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3} placeholder="Event description…" className={inp + ' resize-none'} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Date *</label>
                  <input type="date" value={form.eventDate} onChange={e => setForm(p => ({ ...p, eventDate: e.target.value }))} className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Time</label>
                  <input type="text" value={form.eventTime} onChange={e => setForm(p => ({ ...p, eventTime: e.target.value }))}
                    placeholder="e.g. 10:00 AM" className={inp} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Location</label>
                <input type="text" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  placeholder="Venue / location…" className={inp} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={inp}>
                  {CATEGORIES.filter(c => c.value !== 'all').map(c => (
                    <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <p className="text-sm font-semibold text-gray-700 font-sans">Active Status</p>
                  <p className="text-xs text-gray-400 font-sans">Show this event publicly</p>
                </div>
                <button onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-emerald-400' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.isActive ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 text-sm border border-stone-200 rounded-xl hover:bg-stone-50 font-sans text-gray-700">Cancel</button>
                <button onClick={handleSubmit} disabled={isLoading}
                  className="flex-1 py-2.5 text-sm bg-gradient-to-r from-[#581c87] to-[#7e22ce] text-white rounded-xl font-sans font-semibold shadow-md hover:opacity-90 transition-opacity disabled:opacity-60">
                  {isLoading ? 'Saving…' : editItem ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowDelete(false); setDeleteId(null); } }}>
          <div className="bg-white rounded-3xl max-w-sm w-full p-7 shadow-2xl border border-red-100">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Event?</h3>
                <p className="text-xs text-gray-400 font-sans">This cannot be undone</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowDelete(false); setDeleteId(null); }} className="flex-1 py-2.5 text-sm border border-stone-200 rounded-xl hover:bg-stone-50 font-sans">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 font-sans font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}