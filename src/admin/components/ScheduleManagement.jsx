import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Clock, Plus, Pencil, Trash2, X, AlertTriangle,
  RefreshCw, ToggleLeft, ToggleRight, Calendar
} from 'lucide-react';
import {
  fetchAdminSchedules,
  createNewSchedule,
  updateExistingSchedule,
  removeSchedule,
  toggleScheduleActive
} from '../../redux/schedule/scheduleSlice';

const EMPTY_FORM = { time: '', activity: '', description: '', isActive: true };

export default function ScheduleManagement() {
  const dispatch = useDispatch();
  const { adminSchedules: items, isLoading } = useSelector(state => state.schedule);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [timeState, setTimeState] = useState({ hour: '05', minute: '00', period: 'AM' });

  useEffect(() => {
    dispatch(fetchAdminSchedules());
  }, [dispatch]);

  const openCreate = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setTimeState({ hour: '05', minute: '00', period: 'AM' });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      time: item.time,
      activity: item.activity,
      description: item.description || '',
      isActive: item.isActive
    });

    // Parse time string "HH:MM AM"
    if (item.time && item.time.includes(':')) {
      const [h, rest] = item.time.split(':');
      const [m, p] = rest.split(' ');
      setTimeState({ hour: h, minute: m, period: p });
    }
    
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const formattedTime = `${timeState.hour}:${timeState.minute} ${timeState.period}`;
    const submissionData = { ...form, time: formattedTime };

    if (!submissionData.activity) return;
    
    if (editItem) {
      await dispatch(updateExistingSchedule({ id: editItem._id, data: submissionData }));
    } else {
      await dispatch(createNewSchedule(submissionData));
    }
    setShowForm(false);
  };

  const handleDelete = async () => {
    await dispatch(removeSchedule(deleteId));
    setShowDelete(false);
    setDeleteId(null);
  };

  const handleToggle = (id) => {
    dispatch(toggleScheduleActive(id));
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
              <Clock className="w-8 h-8 text-orange-500" />
              Daily Schedule Management
            </h1>
            <p className="text-gray-500 text-sm">Manage the temple's daily routine activities</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(fetchAdminSchedules())}
              className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" /> Add Schedule
            </button>
          </div>
        </div>

        {/* Table content... */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading && items.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Loading schedules...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 bg-orange-50 text-orange-200 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-10 h-10" />
              </div>
              <p className="text-gray-900 font-bold text-lg">No Schedules Found</p>
              <p className="text-gray-500 max-w-xs mb-6">Start by adding the first activity of the day.</p>
              <button onClick={openCreate} className="text-orange-600 font-bold hover:underline">Add New Schedule</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm font-semibold text-orange-600 bg-orange-50/30 whitespace-nowrap">
                        {item.time}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-bold">{item.activity}</p>
                        {item.description && <p className="text-gray-500 text-xs mt-1">{item.description}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggle(item._id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            item.isActive 
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {item.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          {item.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setDeleteId(item._id); setShowDelete(true); }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-orange-600 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{editItem ? 'Edit Schedule' : 'Add New Schedule'}</h2>
              <button onClick={() => setShowForm(false)} className="text-white hover:rotate-90 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Select Activity Time</label>
                <div className="flex items-center gap-2">
                  <select
                    value={timeState.hour}
                    onChange={(e) => setTimeState({ ...timeState, hour: e.target.value })}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                  >
                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span className="font-bold text-gray-400">:</span>
                  <select
                    value={timeState.minute}
                    onChange={(e) => setTimeState({ ...timeState, minute: e.target.value })}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                  >
                    {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select
                    value={timeState.period}
                    onChange={(e) => setTimeState({ ...timeState, period: e.target.value })}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Activity Name</label>
                <input
                  type="text"
                  value={form.activity}
                  onChange={(e) => setForm({ ...form, activity: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Enter activity (e.g. Mangala Aarti)"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description (Optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none h-24 resize-none"
                  placeholder="Describe the activity..."
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
                  {editItem ? 'Save Changes' : 'Create Schedule'}
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
            <h2 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h2>
            <p className="text-gray-500 mb-6">This schedule will be permanently deleted. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold"
              >
                No, keep it
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
