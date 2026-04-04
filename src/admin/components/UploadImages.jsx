import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Upload, Trash2, Eye, X, Search,
  Grid, List, ChevronLeft, ChevronRight,
  Download, Copy, Edit, Check, AlertTriangle
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  getAllImages,
  uploadMultipalImage,
  deleteImage,
  updateImage,
  bulkDeleteImages,
  setPage
} from '../../redux/images/imageSlice';

const CATEGORIES = [
  { value: 'all', label: 'All', emoji: '🗂️' },
  { value: 'general', label: 'General', emoji: '📁' },
  { value: 'temple', label: 'Temple', emoji: '🛕' },
  { value: 'events', label: 'Events', emoji: '🎉' },
  { value: 'festivals', label: 'Festivals', emoji: '🪔' },
  { value: 'gallery', label: 'Gallery', emoji: '🖼️' },
  { value: 'other', label: 'Other', emoji: '📌' },
];

const OmIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="50%" y="72%" textAnchor="middle" fontSize="28" fill="currentColor" fontFamily="serif">ॐ</text>
  </svg>
);

const LotusDivider = () => (
  <div className="flex items-center gap-3 my-1">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-orange-200" />
    <span className="text-orange-400 text-xs">✦</span>
    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-orange-200" />
  </div>
);

// ── Portal Modal wrapper — React DOM se bahar render hoga, conflict nahi hoga ──
const Modal = ({ children }) => createPortal(
  children,
  document.body
);

export default function UploadImages() {
  const dispatch = useDispatch();
  const { images, isLoading, pagination } = useSelector((s) => s.images);

  const [selectedImages, setSelectedImages] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [showUpload, setShowUpload] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  // ── Local loading states — global isLoading se gallery flicker nahi hogi ──
  const [deletingId, setDeletingId] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadForm, setUploadForm] = useState({ title: '', category: 'general' });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const [editForm, setEditForm] = useState({ title: '', category: '' });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(getAllImages({
      page: pagination.currentPage,
      limit: pagination.itemsPerPage,
      category: filterCat === 'all' ? '' : filterCat,
      search: debouncedSearch,
    }));
  }, [pagination.currentPage, filterCat, debouncedSearch]);

  useEffect(() => {
    return () => previews.forEach(p => p && URL.revokeObjectURL(p));
  }, []);

  const refetch = () => {
    dispatch(getAllImages({
      page: pagination.currentPage,
      limit: pagination.itemsPerPage,
      category: filterCat === 'all' ? '' : filterCat,
      search: debouncedSearch,
    }));
  };

  const onFilePick = (e) => {
    const picked = Array.from(e.target.files);
    if (!picked.length) return;
    previews.forEach(p => URL.revokeObjectURL(p));
    setFiles(picked);
    setPreviews(picked.map(f => URL.createObjectURL(f)));
  };

  const removePreview = (idx) => {
    if (previews[idx]) URL.revokeObjectURL(previews[idx]);
    setPreviews(prev => prev.filter((_, i) => i !== idx));
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUploadSubmit = async () => {
    if (!files.length) return toast.error('Please select at least one image');
    if (!uploadForm.title.trim()) return toast.error('Please enter a title');

    setUploading(true);
    const fd = new FormData();
    files.forEach(f => fd.append('images', f));
    fd.append('title', uploadForm.title);
    fd.append('category', uploadForm.category);

    try {
      const res = await dispatch(uploadMultipalImage(fd)).unwrap();
      toast.success(res.message || `${files.length} image(s) uploaded!`);
      closeUploadModal();
      refetch();
    } catch (err) {
      toast.error(err || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const closeUploadModal = () => {
    previews.forEach(p => p && URL.revokeObjectURL(p));
    setShowUpload(false);
    setFiles([]);
    setPreviews([]);
    setUploadForm({ title: '', category: 'general' });
  };

  // ── FIX: deletingId set karo, aur fetchImages mat karo (Redux state already update karega) ──
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await dispatch(deleteImage(id)).unwrap();
      toast.success('Image deleted');
      setSelectedImages(prev => prev.filter(x => x !== id));
      // Agar current page empty ho jaaye toh prev page pe jao
      if (images.length === 1 && pagination.currentPage > 1) {
        dispatch(setPage(pagination.currentPage - 1));
      }
    } catch (err) {
      toast.error(err || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    try {
      await dispatch(bulkDeleteImages(selectedImages)).unwrap();
      toast.success(`${selectedImages.length} images deleted`);
      setSelectedImages([]);
      setShowDelete(false);
    } catch (err) {
      toast.error(err || 'Delete failed');
    } finally {
      setBulkDeleting(false);
    }
  };

  const openEdit = (img) => {
    setCurrentImage(img);
    setEditForm({ title: img.title, category: img.category });
    setShowEdit(true);
  };

  const toggleSel = (id) =>
    setSelectedImages(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelectedImages(selectedImages.length === images.length && images.length > 0 ? [] : images.map(i => i._id));

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied!');
  };

  // ── FIX: DOM touch nahi, sirf blob URL ──
  const download = (url, title) => {
    fetch(url)
      .then(r => r.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = title || 'image';
        a.click();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      })
      .catch(() => window.open(url, '_blank'));
  };

  const handleUpdate = async () => {
    if (!editForm.title.trim()) return toast.error('Title required');
    setUpdating(true);
    try {
      await dispatch(updateImage({ id: currentImage._id, data: editForm })).unwrap();
      toast.success('Image updated successfully');
      setShowEdit(false);
    } catch (err) {
      toast.error(err || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }} className="min-h-screen bg-[#FDFAF6]">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-center justify-end">
        <button onClick={() => setShowUpload(true)}
          className="group flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow hover:opacity-90 transition-opacity">
          <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          Upload Images
        </button>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Images', value: pagination.totalItems ?? 0, icon: '🖼️' },
          { label: 'Total Pages', value: pagination.totalPages ?? 0, icon: '📄' },
          { label: 'Selected', value: selectedImages.length, icon: '✅' },
          { label: 'Current Page', value: pagination.currentPage ?? 1, icon: '📍' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-orange-100 px-4 py-4 flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-sans">{s.label}</p>
              <p className="text-2xl font-bold text-[#C2410C]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">

        {/* Category Tabs */}
        <div className="mb-5 overflow-x-auto pb-1">
          <div className="flex gap-2 w-max sm:w-auto sm:flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c.value} onClick={() => { setFilterCat(c.value); dispatch(setPage(1)); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-sans font-medium whitespace-nowrap transition-all duration-200 border ${filterCat === c.value
                  ? 'bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white border-transparent shadow-md'
                  : 'bg-white text-gray-500 border-orange-100 hover:border-orange-300 hover:text-orange-600'}`}>
                <span>{c.emoji}</span> {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm px-4 py-3 mb-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-300 w-4 h-4" />
            <input type="text" placeholder="Search images…" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-orange-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 w-52 font-sans bg-orange-50/50 placeholder:text-orange-300" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={toggleAll}
              className="text-xs px-3 py-1.5 border border-orange-200 rounded-lg hover:bg-orange-50 text-gray-600 font-sans transition-colors">
              {selectedImages.length === images.length && images.length > 0 ? 'Deselect All' : 'Select All'}
            </button>
            {selectedImages.length > 0 && (
              <button onClick={() => setShowDelete(true)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-sans transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Delete ({selectedImages.length})
              </button>
            )}
            <div className="flex gap-1 border border-orange-100 rounded-xl overflow-hidden">
              {[{ mode: 'grid', Icon: Grid }, { mode: 'list', Icon: List }].map(({ mode, Icon }) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={`p-2 transition-colors ${viewMode === mode ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'}`}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
          {/* ── FIX: isLoading sirf initial load pe dikhao, delete/update pe nahi ── */}
          {isLoading && images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-4 border-orange-100" />
                <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 animate-spin" />
              </div>
              <p className="text-orange-400 font-sans text-sm">Loading sacred images…</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <OmIcon className="w-16 h-16 text-orange-200" />
              <p className="text-gray-400 font-sans text-sm">No images found in this collection</p>
              <button onClick={() => setShowUpload(true)}
                className="mt-2 px-5 py-2 bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white rounded-full text-sm font-sans shadow hover:shadow-orange-200 transition-all">
                Upload First Image
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-5">
              {images.map((img) => (
                <div key={img._id}
                  className="group relative rounded-2xl overflow-hidden border border-orange-50 shadow-sm hover:shadow-lg hover:shadow-orange-100 transition-all duration-300">
                  <img src={img.imageUrl} alt={img.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2.5 left-2.5">
                    <input type="checkbox" checked={selectedImages.includes(img._id)}
                      onChange={() => toggleSel(img._id)} className="w-4 h-4 accent-orange-500 cursor-pointer rounded" />
                  </div>
                  <span className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 rounded-full font-sans uppercase tracking-wide">
                    {img.category}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-semibold truncate mb-2">{img.title}</p>
                    <div className="flex gap-1.5 justify-center">
                      <button onClick={() => { setCurrentImage(img); setShowViewer(true); }}
                        className="p-1.5 rounded-full bg-white/90 text-gray-800 hover:bg-white transition-all shadow-sm">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button onClick={() => openEdit(img)}
                        className="p-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-sm">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button onClick={() => copyUrl(img.imageUrl)}
                        className="p-1.5 rounded-full bg-white/90 text-gray-800 hover:bg-white transition-all shadow-sm">
                        <Copy className="w-3 h-3" />
                      </button>
                      <button onClick={() => download(img.imageUrl, img.title)}
                        className="p-1.5 rounded-full bg-white/90 text-gray-800 hover:bg-white transition-all shadow-sm">
                        <Download className="w-3 h-3" />
                      </button>
                      {/* ── FIX: individual delete spinner ── */}
                      <button onClick={() => handleDelete(img._id)} disabled={deletingId === img._id}
                        className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm disabled:opacity-60">
                        {deletingId === img._id
                          ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : <Trash2 className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="px-3 py-2 bg-white">
                    <p className="text-xs font-semibold text-gray-700 truncate">{img.title}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-orange-50">
              {images.map((img) => (
                <div key={img._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-orange-50/40 transition-colors">
                  <input type="checkbox" checked={selectedImages.includes(img._id)}
                    onChange={() => toggleSel(img._id)} className="w-4 h-4 accent-orange-500 flex-shrink-0" />
                  <img src={img.imageUrl} alt={img.title} className="w-14 h-14 object-cover rounded-xl flex-shrink-0 border border-orange-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{img.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-sans">{img.category}</span>
                      {img.size && <span className="text-[10px] text-gray-400 font-sans">{(img.size / 1024).toFixed(1)} KB</span>}
                      {img.width && <span className="text-[10px] text-gray-400 font-sans">{img.width}×{img.height}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => { setCurrentImage(img); setShowViewer(true); }}
                      className="p-2 rounded-xl text-blue-400 hover:bg-blue-50 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => openEdit(img)}
                      className="p-2 rounded-xl text-orange-500 hover:bg-orange-50 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(img._id)} disabled={deletingId === img._id}
                      className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors disabled:opacity-60">
                      {deletingId === img._id
                        ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 px-5 py-4 border-t border-orange-50">
              <button onClick={() => dispatch(setPage(pagination.currentPage - 1))}
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-xl border border-orange-200 disabled:opacity-40 hover:bg-orange-50 text-orange-600 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-500 font-sans">
                Page <strong className="text-orange-600">{pagination.currentPage}</strong> of <strong className="text-orange-600">{pagination.totalPages}</strong>
              </span>
              <button onClick={() => dispatch(setPage(pagination.currentPage + 1))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 rounded-xl border border-orange-200 disabled:opacity-40 hover:bg-orange-50 text-orange-600 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══ MODAL — Upload (Portal mein) ══ */}
      {showUpload && (
        <Modal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl shadow-orange-900/20 overflow-hidden">
              <div className="bg-gradient-to-r from-[#7C2D12] to-[#EA580C] px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <OmIcon className="w-8 h-8 text-white/60" />
                  <div>
                    <h3 className="text-lg font-bold text-white">Upload Images</h3>
                    <p className="text-orange-200 text-xs font-sans">Add to the sacred collection</p>
                  </div>
                </div>
                <button onClick={closeUploadModal} className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-orange-200 bg-orange-50/60 rounded-2xl p-8 text-center cursor-pointer hover:bg-orange-100/60 hover:border-orange-300 transition-all group">
                  <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-orange-500" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Click to select images</p>
                  <p className="text-xs text-gray-400 mt-1 font-sans">PNG, JPG, GIF — up to 5 MB each</p>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={onFilePick} className="hidden" />
                </div>
                {previews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {previews.map((src, i) => (
                      <div key={`prev-${i}`} className="relative group rounded-xl overflow-hidden border border-orange-100 shadow-sm">
                        <img src={src} alt="" className="w-full h-20 object-cover" />
                        <button onClick={() => removePreview(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-sans">Title <span className="text-red-400">*</span></label>
                  <input type="text" value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    placeholder="e.g. Diwali Mahotsav 2024"
                    className="w-full px-4 py-2.5 text-sm border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 font-sans bg-orange-50/30 placeholder:text-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.filter(c => c.value !== 'all').map((c) => (
                      <button key={c.value} onClick={() => setUploadForm({ ...uploadForm, category: c.value })}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-sans transition-all ${uploadForm.category === c.value
                          ? 'bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white border-transparent shadow-md'
                          : 'bg-white text-gray-600 border-orange-100 hover:border-orange-300'}`}>
                        <span>{c.emoji}</span> {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-orange-100 flex gap-3 bg-orange-50/30">
                <button onClick={closeUploadModal} className="flex-1 py-2.5 text-sm border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors font-sans text-gray-600">Cancel</button>
                <button onClick={handleUploadSubmit} disabled={uploading}
                  className="flex-1 py-2.5 text-sm bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 font-sans shadow-md">
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> Upload {files.length > 0 ? `(${files.length})` : ''}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ══ MODAL — Viewer ══ */}
      {showViewer && currentImage && (
        <Modal>
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4" onClick={() => setShowViewer(false)}>
            <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowViewer(false)}
                className="absolute -top-12 right-0 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <img src={currentImage.imageUrl} alt={currentImage.title} className="w-full max-h-[78vh] object-contain rounded-2xl shadow-2xl" />
              <div className="mt-3 flex items-center justify-between px-1">
                <div>
                  <p className="font-bold text-white text-lg">{currentImage.title}</p>
                  <span className="text-xs bg-orange-500 text-white px-3 py-0.5 rounded-full mt-1 inline-block font-sans">{currentImage.category}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => copyUrl(currentImage.imageUrl)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => download(currentImage.imageUrl, currentImage.title)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ══ MODAL — Bulk Delete ══ */}
      {showDelete && (
        <Modal>
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-7 shadow-2xl border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-2xl">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
                  <p className="text-xs text-gray-400 font-sans">This cannot be undone</p>
                </div>
              </div>
              <LotusDivider />
              <p className="text-sm text-gray-600 my-4 font-sans leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <strong className="text-red-500">{selectedImages.length} image(s)</strong>{' '}
                from the sacred collection?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDelete(false)} disabled={bulkDeleting}
                  className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 font-sans transition-colors disabled:opacity-60">
                  Cancel
                </button>
                <button onClick={handleBulkDelete} disabled={bulkDeleting}
                  className="flex-1 py-2.5 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 font-sans transition-colors shadow disabled:opacity-60 flex items-center justify-center gap-2">
                  {bulkDeleting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting…
                    </span>
                  ) : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ══ MODAL — Edit ══ */}
      {showEdit && currentImage && (
        <Modal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#7C2D12] to-[#EA580C] px-6 py-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Edit Image</h3>
                <button onClick={() => setShowEdit(false)} className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <img src={currentImage.imageUrl} alt="" className="w-full h-40 object-cover rounded-2xl border border-orange-100" />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-sans">Title</label>
                  <input type="text" value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 font-sans bg-orange-50/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.filter(c => c.value !== 'all').map((c) => (
                      <button key={c.value} onClick={() => setEditForm({ ...editForm, category: c.value })}
                        className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-sans transition-all ${editForm.category === c.value
                          ? 'bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white border-transparent shadow-md'
                          : 'bg-white text-gray-600 border-orange-100 hover:border-orange-300'}`}>
                        <span>{c.emoji}</span> {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-orange-100 flex gap-3 bg-orange-50/30">
                <button onClick={() => setShowEdit(false)} disabled={updating}
                  className="flex-1 py-2.5 text-sm border border-orange-200 rounded-xl hover:bg-orange-50 font-sans text-gray-600 transition-colors disabled:opacity-60">
                  Cancel
                </button>
                <button onClick={handleUpdate} disabled={updating}
                  className="flex-1 py-2.5 text-sm bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white rounded-xl hover:opacity-90 font-sans shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {updating ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…
                    </span>
                  ) : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}