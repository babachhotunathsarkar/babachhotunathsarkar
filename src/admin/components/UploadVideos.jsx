// pages/admin/UploadVideos.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Upload, Trash2, Eye, X, Search,
  Grid, List, ChevronLeft, ChevronRight,
  Copy, Edit, Check, AlertTriangle, Play, Film, Clock
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  getAllVideos, uploadMultipleVideos, deleteVideo,
  bulkDeleteVideos, updateVideo, setPage,
} from '../../redux/videos/videoSlice';

const CATEGORIES = [
  { value: 'all', label: 'All', emoji: '🗂️' },
  { value: 'general', label: 'General', emoji: '📁' },
  { value: 'temple', label: 'Temple', emoji: '🛕' },
  { value: 'events', label: 'Events', emoji: '🎉' },
  { value: 'festivals', label: 'Festivals', emoji: '🪔' },
  { value: 'gallery', label: 'Gallery', emoji: '🎬' },
  { value: 'other', label: 'Other', emoji: '📌' },
];

const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const formatSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function UploadVideos() {
  const dispatch = useDispatch();
  const { videos, isLoading, pagination } = useSelector((s) => s.videos);

  const [selectedVideos, setSelectedVideos] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const [showUpload, setShowUpload] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadForm, setUploadForm] = useState({ title: '', category: 'general' });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef();
  const uploadIntervalRef = useRef(null);
  const abortControllerRef = useRef(null);

  const [editForm, setEditForm] = useState({ title: '', category: '' });

  // Cleanup function
  const cleanupPreviews = useCallback(() => {
    previews.forEach(preview => {
      if (preview.url) {
        URL.revokeObjectURL(preview.url);
      }
    });
  }, [previews]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupPreviews();
      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cleanupPreviews]);

  const fetchVideos = useCallback(() => {
    dispatch(getAllVideos({
      page: pagination.currentPage,
      limit: pagination.itemsPerPage,
      category: filterCat === 'all' ? '' : filterCat,
      search: searchTerm,
    }));
  }, [dispatch, pagination.currentPage, pagination.itemsPerPage, filterCat, searchTerm]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const onFilePick = (e) => {
    const picked = Array.from(e.target.files);
    if (!picked.length) return;

    // Clean old previews
    cleanupPreviews();

    setFiles(picked);
    const newPreviews = picked.map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name,
      size: f.size,
    }));
    setPreviews(newPreviews);
  };

  const removePreview = (index) => {
    if (previews[index]?.url) {
      URL.revokeObjectURL(previews[index].url);
    }
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const closeUploadModal = () => {
    cleanupPreviews();
    setShowUpload(false);
    setFiles([]);
    setPreviews([]);
    setUploadForm({ title: '', category: 'general' });
    setUploadProgress(0);
    setUploading(false);
    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current);
      uploadIntervalRef.current = null;
    }
  };

  const handleUploadSubmit = async () => {
    if (!files.length) {
      toast.error('Please select at least one video');
      return;
    }
    if (!uploadForm.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    files.forEach((file) => formData.append('videos', file));
    formData.append('title', uploadForm.title);
    formData.append('category', uploadForm.category);

    // Simulate progress
    uploadIntervalRef.current = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      abortControllerRef.current = new AbortController();
      const result = await dispatch(uploadMultipleVideos(formData)).unwrap();

      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
        uploadIntervalRef.current = null;
      }

      setUploadProgress(100);
      toast.success(result.message || `${files.length} video(s) uploaded successfully!`);
      closeUploadModal();
      fetchVideos();
    } catch (error) {
      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
        uploadIntervalRef.current = null;
      }
      toast.error(error.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      abortControllerRef.current = null;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await dispatch(deleteVideo(id)).unwrap();
        toast.success('Video deleted successfully');
        fetchVideos();
        setSelectedVideos(prev => prev.filter(vid => vid !== id));
      } catch (error) {
        toast.error(error.message || 'Delete failed');
      }
    }
  };

  const handleBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteVideos(selectedVideos)).unwrap();
      toast.success(`${selectedVideos.length} video(s) deleted successfully`);
      setSelectedVideos([]);
      setShowDelete(false);
      fetchVideos();
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const openEdit = (video) => {
    setCurrentVideo(video);
    setEditForm({ title: video.title, category: video.category });
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    if (!editForm.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      await dispatch(updateVideo({
        id: currentVideo._id,
        data: { title: editForm.title, category: editForm.category }
      })).unwrap();
      toast.success('Video updated successfully');
      setShowEdit(false);
      fetchVideos();
    } catch (error) {
      toast.error(error.message || 'Update failed');
    }
  };

  const toggleSelect = (id) => {
    setSelectedVideos(prev =>
      prev.includes(id) ? prev.filter(vid => vid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedVideos.length === videos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(videos.map(v => v._id));
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Video Gallery</h1>
            <p className="text-gray-500 mt-1">Manage your sacred video collection</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Upload className="w-5 h-5" />
            Upload Videos
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Videos', value: pagination.totalItems || 0, icon: '🎬', color: 'from-blue-500 to-blue-600' },
            { label: 'Total Pages', value: pagination.totalPages || 0, icon: '📄', color: 'from-green-500 to-green-600' },
            { label: 'Selected', value: selectedVideos.length, icon: '✅', color: 'from-purple-500 to-purple-600' },
            { label: 'Current Page', value: pagination.currentPage || 1, icon: '📍', color: 'from-orange-500 to-orange-600' },
          ].map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-r ${stat.color} rounded-2xl shadow-lg p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilterCat(cat.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${filterCat === cat.value
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <span className="mr-1">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-md' : 'hover:bg-gray-200'
                    }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-md' : 'hover:bg-gray-200'
                    }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedVideos.length > 0 && (
          <div className="bg-orange-50 rounded-xl p-4 mb-6 flex items-center justify-between">
            <span className="text-orange-700 font-medium">
              {selectedVideos.length} video(s) selected
            </span>
            <div className="flex gap-3">
              <button
                onClick={toggleSelectAll}
                className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {selectedVideos.length === videos.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Videos Grid/List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <Film className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No videos found</p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Upload your first video
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all">
                <div className="relative h-48 bg-gray-900">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setCurrentVideo(video);
                      setShowPlayer(true);
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-12 h-12 text-white" />
                  </button>
                  <input
                    type="checkbox"
                    checked={selectedVideos.includes(video._id)}
                    onChange={() => toggleSelect(video._id)}
                    className="absolute top-3 left-3 w-5 h-5 cursor-pointer"
                  />
                  <span className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {video.category}
                  </span>
                  {video.duration > 0 && (
                    <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(video.duration)}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{video.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{formatSize(video.size)}</span>
                    <div className="flex gap-2">
                      <button onClick={() => copyToClipboard(video.videoUrl)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                      <button onClick={() => openEdit(video)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button onClick={() => handleDelete(video._id)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {videos.map((video) => (
              <div key={video._id} className="flex items-center gap-4 p-4 border-b hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedVideos.includes(video._id)}
                  onChange={() => toggleSelect(video._id)}
                  className="w-5 h-5"
                />
                <div className="w-24 h-16 bg-gray-900 rounded-lg overflow-hidden relative flex-shrink-0">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{video.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{video.category}</span>
                    {video.duration > 0 && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(video.duration)}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{formatSize(video.size)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentVideo(video);
                      setShowPlayer(true);
                    }}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 text-blue-600" />
                  </button>
                  <button onClick={() => openEdit(video)} className="p-2 hover:bg-orange-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-orange-600" />
                  </button>
                  <button onClick={() => handleDelete(video._id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => dispatch(setPage(pagination.currentPage - 1))}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => dispatch(setPage(pagination.currentPage + 1))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div translate="no" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 notranslate" onClick={closeUploadModal}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Upload Videos</h2>
              <button onClick={closeUploadModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* File Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Click to select videos</p>
                <p className="text-sm text-gray-400 mt-1">MP4, MOV, MKV (Max 200MB each)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={onFilePick}
                  className="hidden"
                />
              </div>

              {/* Preview List */}
              {previews.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-700">Selected Files ({previews.length})</h3>
                  {previews.map((preview, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                      <Film className="w-8 h-8 text-gray-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{preview.name}</p>
                        <p className="text-xs text-gray-500">{formatSize(preview.size)}</p>
                      </div>
                      <button onClick={() => removePreview(idx)} className="p-1 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Progress */}
              {uploading && (
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="Enter video title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={uploading}
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.filter(c => c.value !== 'all').map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setUploadForm({ ...uploadForm, category: cat.value })}
                      className={`px-4 py-2 rounded-lg transition-all ${uploadForm.category === cat.value
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      disabled={uploading}
                    >
                      <span className="mr-1">{cat.emoji}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-6 flex gap-3">
              <button
                onClick={closeUploadModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
                <button
                  onClick={handleUploadSubmit}
                  disabled={uploading || files.length === 0}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <span key="vid-uploading" translate="no" className="notranslate">Uploading...</span>
                  ) : (
                    <span key="vid-ready">Upload {files.length} Video(s)</span>
                  )}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {showPlayer && currentVideo && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4" onClick={() => setShowPlayer(false)}>
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowPlayer(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <video
              src={currentVideo.videoUrl}
              controls
              autoPlay
              className="w-full rounded-xl shadow-2xl"
              onError={() => toast.error('Failed to load video')}
            />
            <div className="mt-4">
              <h3 className="text-white text-xl font-semibold">{currentVideo.title}</h3>
              <p className="text-gray-400 text-sm mt-1">Category: {currentVideo.category}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDelete(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Confirm Delete</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong className="text-red-600">{selectedVideos.length}</strong> video(s)? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && currentVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEdit(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Video</h2>
              <button onClick={() => setShowEdit(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.filter(c => c.value !== 'all').map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setEditForm({ ...editForm, category: cat.value })}
                      className={`px-4 py-2 rounded-lg transition-all ${editForm.category === cat.value
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      <span className="mr-1">{cat.emoji}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEdit(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}