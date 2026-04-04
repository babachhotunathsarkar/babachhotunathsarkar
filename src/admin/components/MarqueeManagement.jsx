// src/pages/admin/MarqueeManagement.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Megaphone, Plus, Pencil, Trash2, X, AlertTriangle,
  RefreshCw, ToggleLeft, ToggleRight, GripVertical, Eye, EyeOff,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  fetchMarquees, createMarquee, updateMarquee,
  deleteMarquee, toggleMarquee,
} from '../../redux/marquee/marqueeSlice';

/* ── helpers ── */
const OmIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none">
    <text x="50%" y="72%" textAnchor="middle" fontSize="28" fill="currentColor" fontFamily="serif">ॐ</text>
  </svg>
);

// Remove types, keep it simple

const EMPTY_FORM = { text: '', order: 0, isActive: true };

/* ════════════════════════════════════════ */
export default function MarqueeManagement() {
  const dispatch = useDispatch();
  const { items = [], isLoading } = useSelector(s => s.marquee ?? { items: [], isLoading: false });
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);   // null = create mode
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => { dispatch(fetchMarquees()); }, []);

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ text: item.text, order: item.order, isActive: item.isActive }); setShowForm(true); };

  const handleSubmit = async () => {
    if (!form.text.trim()) return toast.error('Text is required');
    try {
      if (editItem) {
        await dispatch(updateMarquee({ id: editItem._id, data: form })).unwrap();
        toast.success('Marquee updated');
      } else {
        await dispatch(createMarquee(form)).unwrap();
        toast.success('Marquee created');
      }
      setShowForm(false);
    } catch (err) { toast.error(err || 'Failed'); }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteMarquee(deleteId)).unwrap();
      toast.success('Deleted');
      setShowDelete(false); setDeleteId(null);
    } catch (err) { toast.error(err || 'Failed'); }
  };

  const handleToggle = async (id) => {
    try {
      await dispatch(toggleMarquee(id)).unwrap();
      toast.success('Status updated');
    } catch (err) { toast.error(err || 'Failed'); }
  };

  /* ── live marquee preview ── */
  const activeItems = items.filter(i => i.isActive);

  return (
    <div className="min-h-screen bg-[#FAFAF7]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-end gap-3">
        <button onClick={() => dispatch(fetchMarquees())}
          className="group flex items-center gap-2 bg-white border border-stone-200 text-gray-700 px-4 py-2 rounded-xl font-sans text-sm hover:bg-stone-50 transition-all shadow-sm">
          <RefreshCw className="w-4 h-4 text-gray-500 group-hover:rotate-180 transition-transform duration-500" /> Refresh
        </button>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-xl font-sans text-sm font-bold hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="w-4 h-4" /> Add Marquee
        </button>
      </div>

      {/* LIVE PREVIEW */}
      {activeItems.length > 0 && (
        <div className="bg-gradient-to-r from-[#1a0a00] to-[#3b1200] border-b border-amber-900/40 px-4 py-2 overflow-hidden">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 text-xs font-sans font-bold uppercase tracking-widest whitespace-nowrap flex-shrink-0 hidden sm:block">
              🔴 Live Preview
            </span>
            <div className="overflow-hidden flex-1">
              <div className="flex gap-8 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
                {[...activeItems, ...activeItems].map((item, i) => (
                  <span key={i} className="text-sm font-sans inline-flex items-center gap-2 text-white/90">
                    {item.text}
                    <span className="text-amber-700 mx-2">✦</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: items.length, color: 'text-[#92400E]' },
            { label: 'Active', value: items.filter(i => i.isActive).length, color: 'text-emerald-600' },
            { label: 'Inactive', value: items.filter(i => !i.isActive).length, color: 'text-gray-500' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-stone-200/80 shadow-sm px-4 py-3 flex items-center gap-3">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-sans font-semibold">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-24 gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-amber-100 border-t-amber-500 animate-spin" />
              <p className="text-amber-600/80 font-sans text-sm">Loading…</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Megaphone className="w-12 h-12 text-amber-200" />
              <p className="text-gray-400 font-sans text-sm">No marquee items yet</p>
              <button onClick={openCreate} className="text-xs px-4 py-2 bg-amber-50 text-amber-700 rounded-xl font-sans hover:bg-amber-100 transition-colors">
                Add First Item
              </button>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50/60">
                      {['#', 'Text', 'Order', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3.5 text-left text-[10px] text-gray-400 uppercase tracking-widest font-sans font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {items.map((item, idx) => (
                      <tr key={item._id}>
                        <td className="px-4 py-4 text-xs text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-4 max-w-xs">
                          <p className="text-sm text-gray-800 truncate">{item.text}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs text-gray-500 font-mono bg-stone-100 px-2 py-0.5 rounded">{item.order}</span>
                        </td>
                        <td className="px-4 py-4">
                          <button onClick={() => handleToggle(item._id)}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-sans font-medium transition-colors ${item.isActive ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}>
                            {item.isActive ? <><ToggleRight className="w-4 h-4" /> Active</> : <><ToggleLeft className="w-4 h-4" /> Inactive</>}
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <button onClick={() => openEdit(item)}
                              className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => { setDeleteId(item._id); setShowDelete(true); }}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="md:hidden divide-y divide-stone-100">
                {items.map((item) => (
                  <div key={item._id} className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm text-gray-800 flex-1">{item.text}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => handleToggle(item._id)}
                        className={`text-[11px] px-3 py-1.5 rounded-lg font-sans font-medium border ${item.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button onClick={() => openEdit(item)}
                        className="text-[11px] px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 font-sans font-medium border border-amber-100">
                        Edit
                      </button>
                      <button onClick={() => { setDeleteId(item._id); setShowDelete(true); }}
                        className="text-[11px] px-3 py-1.5 rounded-lg bg-red-50 text-red-500 font-sans font-medium border border-red-100">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl overflow-hidden">
            <div className="relative bg-gradient-to-r from-[#0D0500] via-[#5C1A00] to-[#92400E] px-6 py-5 flex items-center justify-between">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
              <h3 className="text-lg font-bold text-white">{editItem ? 'Edit Marquee' : 'Add New Marquee'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Text */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Marquee Text *</label>
                <textarea
                  value={form.text}
                  onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
                  rows={3}
                  placeholder="Enter announcement text…"
                  className="w-full px-4 py-3 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 font-sans bg-stone-50 placeholder:text-stone-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Order */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Display Order</label>
                  <input type="number" value={form.order}
                    onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 font-sans bg-stone-50" />
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <p className="text-sm font-semibold text-gray-700 font-sans">Active Status</p>
                  <p className="text-xs text-gray-400 font-sans">Show this item on the website</p>
                </div>
                <button onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-emerald-400' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.isActive ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 text-sm border border-stone-200 rounded-xl hover:bg-stone-50 font-sans text-gray-700">Cancel</button>
                <button onClick={handleSubmit} disabled={isLoading}
                  className="flex-1 py-2.5 text-sm bg-gradient-to-r from-[#92400E] to-[#B45309] text-white rounded-xl font-sans font-semibold shadow-md hover:opacity-90 transition-opacity disabled:opacity-60">
                  {isLoading ? 'Saving…' : editItem ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowDelete(false); setDeleteId(null); } }}>
          <div className="bg-white rounded-3xl max-w-sm w-full p-7 shadow-2xl border border-red-100">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Marquee?</h3>
                <p className="text-xs text-gray-400 font-sans">This cannot be undone</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowDelete(false); setDeleteId(null); }}
                className="flex-1 py-2.5 text-sm border border-stone-200 rounded-xl hover:bg-stone-50 font-sans text-gray-700">Cancel</button>
              <button onClick={handleDelete}
                className="flex-1 py-2.5 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 font-sans font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}