// src/pages/admin/AddressManagement.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MapPin, Plus, Pencil, Trash2, X, AlertTriangle,
  RefreshCw, Phone, Mail, Globe, Star, Building2, Navigation,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  fetchAddresses, createAddress, updateAddress,
  deleteAddress, setMainAddress,
} from '../../redux/address/addressSlice';
import Loader from '../../components/Loader';

/* ── helpers ── */
const OmIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none">
    <text x="50%" y="72%" textAnchor="middle" fontSize="28" fill="currentColor" fontFamily="serif">ॐ</text>
  </svg>
);

const EMPTY_FORM = {
  label: '', addressLine1: '', addressLine2: '', city: '', state: '',
  pincode: '', country: 'India', phone: '', altPhone: '', email: '',
  website: '', mapLink: '', isMain: false,
};

const inp = "w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 font-sans bg-stone-50 placeholder:text-stone-400";

/* ════════════════════════════════════════ */
export default function AddressManagement() {
  const dispatch = useDispatch();
  const { addresses = [], isLoading } = useSelector(s => s.address ?? { addresses: [], isLoading: false });

  const [showForm,   setShowForm]   = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);

  useEffect(() => { dispatch(fetchAddresses()); }, []);

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit   = (item) => {
    setEditItem(item);
    setForm({
      label: item.label || '', addressLine1: item.addressLine1 || '',
      addressLine2: item.addressLine2 || '', city: item.city || '',
      state: item.state || '', pincode: item.pincode || '',
      country: item.country || 'India', phone: item.phone || '',
      altPhone: item.altPhone || '', email: item.email || '',
      website: item.website || '', mapLink: item.mapLink || '',
      isMain: item.isMain || false,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.addressLine1.trim() || !form.city.trim())
      return toast.error('Address Line 1 and City are required');
    try {
      if (editItem) {
        await dispatch(updateAddress({ id: editItem._id, data: form })).unwrap();
        toast.success('Address updated');
      } else {
        await dispatch(createAddress(form)).unwrap();
        toast.success('Address created');
      }
      setShowForm(false);
      dispatch(fetchAddresses());
    } catch (err) { toast.error(err || 'Failed'); }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteAddress(deleteId)).unwrap();
      toast.success('Address deleted'); setShowDelete(false); setDeleteId(null);
    } catch (err) { toast.error(err || 'Failed'); }
  };

  const handleSetMain = async (id) => {
    try {
      await dispatch(setMainAddress(id)).unwrap();
      toast.success('Set as main address');
    } catch (err) { toast.error(err || 'Failed'); }
  };

  const setF = (key, val) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div className="min-h-screen bg-[#FAFAF7]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

      {/* BANNER */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0500] via-[#134e4a] to-[#0f766e]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, #2dd4bf 0%, transparent 50%)' }} />
        <div className="absolute top-3 right-6 opacity-[0.07] select-none pointer-events-none"><OmIcon className="w-28 h-28 text-white" /></div>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-teal-400 rounded-full" />
              <span className="text-teal-300/80 text-xs tracking-[0.25em] uppercase font-sans">Admin Panel</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide flex items-center gap-3">
              <MapPin className="w-8 h-8 text-teal-300" /> Address Management
            </h1>
            <p className="text-teal-200/60 text-sm mt-1.5 font-sans">Manage contact information, phone numbers & location details</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => dispatch(fetchAddresses())}
              className="group flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-2.5 rounded-xl font-sans text-sm hover:bg-white/20 transition-all">
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> Refresh
            </button>
            <button onClick={openCreate}
              className="flex items-center gap-2 bg-teal-400 text-[#0D0500] px-5 py-2.5 rounded-xl font-sans text-sm font-bold hover:bg-teal-300 transition-all shadow-lg">
              <Plus className="w-4 h-4" /> Add Address
            </button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Total',        value: addresses.length,                      color: 'text-[#0f766e]' },
            { label: 'Main Address', value: addresses.filter(a => a.isMain).length, color: 'text-amber-600' },
            { label: 'With Email',   value: addresses.filter(a => a.email).length,  color: 'text-sky-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-stone-200/80 shadow-sm px-4 py-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-sans font-semibold">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Address Cards Grid */}
        {isLoading ? (
          <Loader fullScreen={false} />
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm flex flex-col items-center justify-center py-24 gap-3">
            <MapPin className="w-12 h-12 text-teal-200" />
            <p className="text-gray-400 font-sans text-sm">No addresses added yet</p>
            <button onClick={openCreate} className="text-xs px-4 py-2 bg-teal-50 text-teal-700 rounded-xl font-sans hover:bg-teal-100">Add First Address</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {addresses.map((addr) => (
              <div key={addr._id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 ${
                  addr.isMain ? 'border-teal-300 ring-2 ring-teal-100' : 'border-stone-200/80'
                }`}>
                {/* Card header */}
                <div className={`px-5 py-4 flex items-center justify-between ${addr.isMain ? 'bg-teal-50' : 'bg-stone-50/60'}`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${addr.isMain ? 'bg-teal-100' : 'bg-stone-100'}`}>
                      <Building2 className={`w-4 h-4 ${addr.isMain ? 'text-teal-600' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 font-sans">{addr.label || 'Address'}</p>
                      {addr.isMain && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-teal-700 font-sans font-bold">
                          <Star className="w-2.5 h-2.5 fill-teal-500 text-teal-500" /> Main Address
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(addr)} className="p-1.5 rounded-lg text-teal-500 hover:bg-teal-50 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => { setDeleteId(addr._id); setShowDelete(true); }} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-5 py-4 space-y-2.5">
                  {/* Address */}
                  <div className="flex gap-2.5">
                    <MapPin className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-700 font-sans leading-relaxed">
                        {addr.addressLine1}
                        {addr.addressLine2 && <>, {addr.addressLine2}</>}
                      </p>
                      <p className="text-xs text-gray-500 font-sans">
                        {[addr.city, addr.state, addr.pincode, addr.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  {(addr.phone || addr.altPhone) && (
                    <div className="flex gap-2.5">
                      <Phone className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                      <div>
                        {addr.phone    && <p className="text-sm text-gray-700 font-sans">{addr.phone}</p>}
                        {addr.altPhone && <p className="text-xs text-gray-500 font-sans">{addr.altPhone}</p>}
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {addr.email && (
                    <div className="flex gap-2.5 items-center">
                      <Mail className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      <p className="text-sm text-gray-700 font-sans truncate">{addr.email}</p>
                    </div>
                  )}

                  {/* Website */}
                  {addr.website && (
                    <div className="flex gap-2.5 items-center">
                      <Globe className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      <a href={addr.website} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-teal-600 font-sans hover:underline truncate">{addr.website}</a>
                    </div>
                  )}

                  {/* Map link */}
                  {addr.mapLink && (
                    <a href={addr.mapLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-teal-600 font-sans hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg w-fit border border-teal-100 hover:bg-teal-100 transition-colors">
                      <Navigation className="w-3 h-3" /> View on Map
                    </a>
                  )}
                </div>

                {/* Set main button */}
                {!addr.isMain && (
                  <div className="px-5 pb-4">
                    <button onClick={() => handleSetMain(addr._id)}
                      className="w-full py-2 text-xs text-teal-700 border border-teal-200 rounded-xl hover:bg-teal-50 font-sans font-medium transition-colors flex items-center justify-center gap-1.5">
                      <Star className="w-3.5 h-3.5" /> Set as Main Address
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#0D0500] via-[#134e4a] to-[#0f766e] px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />
              <h3 className="text-lg font-bold text-white">{editItem ? 'Edit Address' : 'Add New Address'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white"><X className="w-4 h-4" /></button>
            </div>

            {/* Scrollable form body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              {/* Label + isMain */}
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Label</label>
                  <input type="text" value={form.label} onChange={e => setF('label', e.target.value)}
                    placeholder="e.g. Main Temple, Branch Office" className={inp} />
                </div>
                <div className="flex items-center gap-2 pb-0.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-sans whitespace-nowrap">Main?</label>
                  <button onClick={() => setF('isMain', !form.isMain)}
                    className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${form.isMain ? 'bg-teal-400' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.isMain ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Address lines */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Address Line 1 *</label>
                <input type="text" value={form.addressLine1} onChange={e => setF('addressLine1', e.target.value)}
                  placeholder="Street / Building / Area" className={inp} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Address Line 2</label>
                <input type="text" value={form.addressLine2} onChange={e => setF('addressLine2', e.target.value)}
                  placeholder="Landmark, Near…" className={inp} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">City *</label>
                  <input type="text" value={form.city} onChange={e => setF('city', e.target.value)} placeholder="City" className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">State</label>
                  <input type="text" value={form.state} onChange={e => setF('state', e.target.value)} placeholder="State" className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Pincode</label>
                  <input type="text" value={form.pincode} onChange={e => setF('pincode', e.target.value)} placeholder="000000" className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Country</label>
                  <input type="text" value={form.country} onChange={e => setF('country', e.target.value)} placeholder="India" className={inp} />
                </div>
              </div>

              {/* Contact info */}
              <div className="border-t border-stone-100 pt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-sans mb-3">Contact Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setF('phone', e.target.value)} placeholder="+91 00000 00000" className={inp} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Alt. Phone</label>
                    <input type="tel" value={form.altPhone} onChange={e => setF('altPhone', e.target.value)} placeholder="+91 00000 00000" className={inp} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => setF('email', e.target.value)} placeholder="contact@temple.org" className={inp} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Website</label>
                <input type="url" value={form.website} onChange={e => setF('website', e.target.value)} placeholder="https://…" className={inp} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest font-sans mb-1.5">Google Maps Link</label>
                <input type="url" value={form.mapLink} onChange={e => setF('mapLink', e.target.value)} placeholder="https://maps.google.com/…" className={inp} />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 text-sm border border-stone-200 rounded-xl hover:bg-stone-50 font-sans text-gray-700">Cancel</button>
                <button onClick={handleSubmit} disabled={isLoading}
                  className="flex-1 py-2.5 text-sm bg-gradient-to-r from-[#0f766e] to-[#0d9488] text-white rounded-xl font-sans font-semibold shadow-md hover:opacity-90 transition-opacity disabled:opacity-60">
                  {isLoading ? 'Saving…' : editItem ? 'Update Address' : 'Create Address'}
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
                <h3 className="text-lg font-bold text-gray-900">Delete Address?</h3>
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