import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Clock, Plus, Pencil, Trash2, X, AlertTriangle,
  RefreshCw, ToggleLeft, ToggleRight, Sun, Moon
} from 'lucide-react';
import {
  fetchAdminTimings,
  createNewTiming,
  updateExistingTiming,
  removeTiming,
  toggleTimingActive
} from '../../redux/timing/timingSlice';

const EMPTY_FORM = { title: '', startTime: '', endTime: '', isActive: true };

export default function TimingsManagement() {
  const dispatch = useDispatch();
  const { adminTimings: items, isLoading } = useSelector(state => state.timing);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [startTimeState, setStartTimeState] = useState({ hour: '05', minute: '00', period: 'AM' });
  const [endTimeState, setEndTimeState] = useState({ hour: '09', minute: '00', period: 'PM' });

  useEffect(() => {
    dispatch(fetchAdminTimings());
  }, [dispatch]);

  const openCreate = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setStartTimeState({ hour: '05', minute: '00', period: 'AM' });
    setEndTimeState({ hour: '09', minute: '00', period: 'PM' });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title: item.title,
      startTime: item.startTime,
      endTime: item.endTime,
      isActive: item.isActive
    });

    // Parse "HH:MM AM"
    if (item.startTime && item.startTime.includes(':')) {
      const [h, rest] = item.startTime.split(':');
      const [m, p] = rest.split(' ');
      setStartTimeState({ hour: h, minute: m, period: p });
    }
    if (item.endTime && item.endTime.includes(':')) {
      const [h, rest] = item.endTime.split(':');
      const [m, p] = rest.split(' ');
      setEndTimeState({ hour: h, minute: m, period: p });
    }
    
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const formattedStart = `${startTimeState.hour}:${startTimeState.minute} ${startTimeState.period}`;
    const formattedEnd = `${endTimeState.hour}:${endTimeState.minute} ${endTimeState.period}`;
    
    const submissionData = { 
      ...form, 
      startTime: formattedStart, 
      endTime: formattedEnd 
    };

    if (!submissionData.title) return;
    
    if (editItem) {
      await dispatch(updateExistingTiming({ id: editItem._id, data: submissionData }));
    } else {
      await dispatch(createNewTiming(submissionData));
    }
    setShowForm(false);
  };

  const handleDelete = async () => {
    await dispatch(removeTiming(deleteId));
    setShowDelete(false);
    setDeleteId(null);
  };

  const handleToggle = (id) => {
    dispatch(toggleTimingActive(id));
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header content... */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sun className="w-8 h-8 text-orange-500" />
              Temple Timings Management
            </h1>
            <p className="text-gray-500 text-sm">Manage when the temple is open for devotees</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(fetchAdminTimings())}
              className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" /> Add Timing
            </button>
          </div>
        </div>

        {/* List content... */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading && items.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-bold uppercase tracking-wider text-xs">Loading Timings...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 bg-orange-50 text-orange-200 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-10 h-10" />
              </div>
              <p className="text-gray-900 font-bold text-lg">No Timings Configured</p>
              <button onClick={openCreate} className="text-orange-600 font-bold hover:underline">Add New Timing Range</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50/50">
              {items.map((item) => (
                <div key={item._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3">
                    <button onClick={() => handleToggle(item._id)} className="transition-transform active:scale-95">
                      {item.isActive ? (
                        <ToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-300" />
                      )}
                    </button>
                  </div>
                  
                  <div className="text-orange-500 mb-4">
                    {item.title.toLowerCase().includes('morning') ? <Sun className="w-8 h-8" /> : <Moon className="w-8 h-8" />}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg font-mono font-bold text-sm">
                      {item.startTime}
                    </span>
                    <span className="text-gray-400">to</span>
                    <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg font-mono font-bold text-sm">
                      {item.endTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(item)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => { setDeleteId(item._id); setShowDelete(true); }}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
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
              <h2 className="text-xl font-bold text-white">{editItem ? 'Edit Timing' : 'Add New Timing'}</h2>
              <button onClick={() => setShowForm(false)} className="text-white hover:rotate-90 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Timing Label (e.g. Summer Hours)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Enter label"
                />
              </div>

              <div className="space-y-4">
                {/* Start Time Pickers */}
                <div>
                  <label className="block text-xs font-bold text-orange-600 uppercase mb-2">Opening Time (Starts)</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={startTimeState.hour}
                      onChange={(e) => setStartTimeState({ ...startTimeState, hour: e.target.value })}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                    >
                      {hours.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span className="font-bold text-gray-300">:</span>
                    <select
                      value={startTimeState.minute}
                      onChange={(e) => setStartTimeState({ ...startTimeState, minute: e.target.value })}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                    >
                      {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select
                      value={startTimeState.period}
                      onChange={(e) => setStartTimeState({ ...startTimeState, period: e.target.value })}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                {/* End Time Pickers */}
                <div>
                  <label className="block text-xs font-bold text-orange-600 uppercase mb-2">Closing Time (Ends)</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={endTimeState.hour}
                      onChange={(e) => setEndTimeState({ ...endTimeState, hour: e.target.value })}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                    >
                      {hours.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span className="font-bold text-gray-300">:</span>
                    <select
                      value={endTimeState.minute}
                      onChange={(e) => setEndTimeState({ ...endTimeState, minute: e.target.value })}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                    >
                      {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select
                      value={endTimeState.period}
                      onChange={(e) => setEndTimeState({ ...endTimeState, period: e.target.value })}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
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
                  {editItem ? 'Save Changes' : 'Add Timing'}
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
            <p className="text-gray-500 mb-6">Are you sure you want to remove this timing range?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold"
              >
                No, cancel
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
