import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Calendar, Plus, Pencil, Trash2, X, AlertTriangle,
  RefreshCw, ToggleLeft, ToggleRight, Star
} from 'lucide-react';
import {
  fetchAdminSpecialDays,
  createNewSpecialDay,
  updateExistingSpecialDay,
  removeSpecialDay,
  toggleSpecialDayActive
} from '../../redux/specialDay/specialDaySlice';

const EMPTY_FORM = { title: '', date: '', description: '', isActive: true };

export default function SpecialDaysManagement() {
  const dispatch = useDispatch();
  const { adminSpecialDays: items, isLoading } = useSelector(state => state.specialDay);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    dispatch(fetchAdminSpecialDays());
  }, [dispatch]);

  const openCreate = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title: item.title,
      date: item.date,
      description: item.description || '',
      isActive: item.isActive
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.date) return;
    
    if (editItem) {
      await dispatch(updateExistingSpecialDay({ id: editItem._id, data: form }));
    } else {
      await dispatch(createNewSpecialDay(form));
    }
    setShowForm(false);
  };

  const handleDelete = async () => {
    await dispatch(removeSpecialDay(deleteId));
    setShowDelete(false);
    setDeleteId(null);
  };

  const handleToggle = (id) => {
    dispatch(toggleSpecialDayActive(id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Star className="w-8 h-8 text-orange-500" />
              Special Days Management
            </h1>
            <p className="text-gray-500 text-sm">Manage annual festivals and monthly special dates</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(fetchAdminSpecialDays())}
              className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" /> Add Special Day
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading && items.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Fetching special days...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 bg-orange-50 text-orange-200 rounded-full flex items-center justify-center mb-4">
                <Star className="w-10 h-10" />
              </div>
              <p className="text-gray-900 font-bold text-lg">No Special Days Added</p>
              <button onClick={openCreate} className="text-orange-600 font-bold hover:underline">Mark Your First Special Day</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {items.map((item) => (
                <div key={item._id} className="group relative flex items-center gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex flex-col items-center justify-center text-orange-600 text-center flex-shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                     <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80">Day</span>
                     <Star className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{item.title}</h3>
                      <button onClick={() => handleToggle(item._id)} className="transition-transform active:scale-90">
                        {item.isActive ? <ToggleRight className="w-7 h-7 text-green-500" /> : <ToggleLeft className="w-7 h-7 text-gray-300" />}
                      </button>
                    </div>
                    <p className="text-orange-600 font-bold text-sm mb-1">{item.date}</p>
                    {item.description && <p className="text-gray-500 text-xs line-clamp-1">{item.description}</p>}
                  </div>

                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(item)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => { setDeleteId(item._id); setShowDelete(true); }} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-orange-600 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{editItem ? 'Edit Special Day' : 'Add Special Day'}</h2>
              <button onClick={() => setShowForm(false)} className="text-white hover:rotate-90 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Title (e.g. Maha Shivratri)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Enter festival name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Date (e.g. 15th August or Every Monday)</label>
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Enter date details"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Significance/Description (Optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none h-24 resize-none"
                  placeholder="Historical or spiritual significance..."
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-200"
                >
                  {editItem ? 'Save Updates' : 'Add Special Day'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete?</h2>
            <p className="text-gray-500 mb-6">Are you sure you want to remove this special day from the calendar?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold"
              >
                Go back
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
