import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAnnouncements, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement,
  reset 
} from '../../redux/announcements/announcementSlice';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const AnnouncementManagement = () => {
  const dispatch = useDispatch();
  const { announcements, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.announcements
  );

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    type: 'event'
  });

  // Fetch announcements
  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  // Toast handling
  useEffect(() => {
    if (isSuccess && message) {
      toast.success(message);
      setShowForm(false);
      resetForm();
      dispatch(reset());
    }
    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      type: 'event'
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(updateAnnouncement({ id: currentId, data: formData }));
    } else {
      dispatch(createAnnouncement(formData));
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      description: announcement.description,
      date: announcement.date.split('T')[0],
      type: announcement.type
    });
    setCurrentId(announcement._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      dispatch(deleteAnnouncement(id));
    }
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-orange-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Actions - Responsive */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-6 mt-4">
          <button
            onClick={openAddForm}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add New Announcement
          </button>
        </div>

        {/* Add/Edit Form Modal - Responsive */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[95vh] overflow-hidden">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-5 flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold">
                  {isEditing ? 'Edit Announcement' : 'Create New Announcement'}
                </h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[calc(95vh-80px)]">
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-3 border border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 text-base"
                    required
                  >
                    <option value="event">Event</option>
                    <option value="news">News</option>
                    <option value="notice">Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 border border-orange-300 rounded-xl focus:outline-none focus:border-orange-500"
                    placeholder="Announcement Title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className="w-full p-3 border border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 resize-y"
                    placeholder="Enter full description..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-3 border border-orange-300 rounded-xl focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-amber-700 disabled:opacity-70 transition-all"
                  >
                    {isLoading ? 'Processing...' : isEditing ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 rounded-xl font-bold text-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Announcements List */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-5 md:p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              All Announcements ({announcements.length})
            </h2>
          </div>

          {isLoading && !showForm ? (
            <div className="text-center py-16 text-orange-600 text-lg">Loading...</div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No announcements found</div>
          ) : (
            <>
              {/* Desktop + Tablet Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-orange-800">Type</th>
                      <th className="px-6 py-4 text-left font-semibold text-orange-800">Title</th>
                      <th className="px-6 py-4 text-left font-semibold text-orange-800">Date</th>
                      <th className="px-6 py-4 text-left font-semibold text-orange-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {announcements.map((item) => (
                      <tr key={item._id} className="hover:bg-orange-50">
                        <td className="px-6 py-5">
                          <span className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize
                            ${item.type === 'event' ? 'bg-green-100 text-green-700' : 
                              item.type === 'news' ? 'bg-blue-100 text-blue-700' : 
                              'bg-amber-100 text-amber-700'}`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-medium text-gray-800">{item.title}</td>
                        <td className="px-6 py-5 text-gray-600">
                          {new Date(item.date).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-4">
                            <button
                              onClick={() => handleEdit(item)}
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium"
                            >
                              <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-medium"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4">
                {announcements.map((item) => (
                  <div key={item._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                        ${item.type === 'event' ? 'bg-green-100 text-green-700' : 
                          item.type === 'news' ? 'bg-blue-100 text-blue-700' : 
                          'bg-amber-100 text-amber-700'}`}>
                        {item.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString('hi-IN')}
                      </span>
                    </div>

                    <h3 className="font-semibold text-lg text-gray-800 mb-2 leading-tight">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {item.description}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-3 rounded-xl font-medium hover:bg-blue-100"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 py-3 rounded-xl font-medium hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementManagement;