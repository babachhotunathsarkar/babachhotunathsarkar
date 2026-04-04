import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress, 
  setMainAddress 
} from '../../redux/address/addressSlice';
import { Plus, Pencil, Trash2, MapPin, Check, X, Star } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminAddress() {
  const dispatch = useDispatch();
  const { addresses, isLoading } = useSelector(state => state.address);
  
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    street: '',
    village: '',
    city: '',
    state: '',
    contactNumber: '',
    email: ''
  });

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEdit = (address) => {
    setEditId(address._id);
    setFormData({
      street: address.street || '',
      village: address.village || '',
      city: address.city || '',
      state: address.state || '',
      contactNumber: address.contactNumber || '',
      email: address.email || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ street: '', village: '', city: '', state: '', contactNumber: '', email: '' });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await dispatch(updateAddress({ id: editId, data: formData })).unwrap();
        toast.success("Address updated successfully!");
      } else {
        await dispatch(createAddress(formData)).unwrap();
        toast.success("Address created successfully!");
      }
      resetForm();
    } catch (error) {
      toast.error(error || "Failed to save address");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await dispatch(deleteAddress(id)).unwrap();
        toast.success("Address deleted successfully!");
      } catch (error) {
        toast.error(error || "Failed to delete address");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="text-orange-600" /> 
          Manage Address
        </h1>
        {(!addresses || addresses.length === 0) && (
          <button 
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700 transition"
          >
            <Plus className="w-5 h-5" /> Add Address
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{editId ? 'Edit Address' : 'Add New Address'}</h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-red-500">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <input required type="text" name="street" value={formData.street} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-orange-500 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-orange-500 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-orange-500 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Village/Town *</label>
                <input required type="text" name="village" value={formData.village} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-orange-500 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-orange-500 focus:border-orange-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-orange-500 focus:border-orange-500" />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button disabled={isLoading} type="submit" className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition">
                {isLoading ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading && !showForm ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
        </div>
      ) : addresses?.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg border border-gray-100 shadow-sm mt-6">
          <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No addresses found.</p>
          <p className="text-gray-400 text-sm mt-1">Click the "Add Address" button above to create one.</p>
        </div>
      ) : (
        <div className="mt-8 max-w-4xl">
          {addresses?.map(address => (
            <div key={address._id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100/50 flex flex-col relative transition-all duration-300 hover:shadow-2xl">
              
              {/* Top Banner / Accent */}
              <div className="h-3 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
              
              <div className="p-8 md:p-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-8 border-b border-gray-100 gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl flex items-center justify-center border border-orange-200/50 shadow-inner">
                      <MapPin className="w-8 h-8 text-orange-600 drop-shadow-sm" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Active Address</h3>
                      <p className="text-sm text-gray-500 font-medium mt-1">This is your primary configured location</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 bg-gray-50/80 p-1.5 rounded-2xl border border-gray-200/60 shadow-sm w-full sm:w-auto">
                    <button onClick={() => handleEdit(address)} className="flex-1 sm:flex-none justify-center text-blue-600 hover:text-blue-700 hover:bg-white p-2.5 rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100 hover:shadow-md flex items-center gap-2">
                       <Pencil className="w-4 h-4" /> <span className="text-sm font-bold pr-2">Edit</span>
                    </button>
                    <div className="w-px bg-gray-200 my-2"></div>
                    <button onClick={() => handleDelete(address._id)} className="flex-1 sm:flex-none justify-center text-red-600 hover:text-red-700 hover:bg-white p-2.5 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100 hover:shadow-md flex items-center gap-2">
                       <Trash2 className="w-4 h-4" /> <span className="text-sm font-bold pr-2">Remove</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div className="space-y-1.5 p-4 rounded-2xl hover:bg-gray-50/50 transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Street Address</p>
                    <p className="text-gray-800 font-semibold text-lg leading-relaxed">{address.street}</p>
                  </div>
                  
                  <div className="space-y-1.5 p-4 rounded-2xl hover:bg-gray-50/50 transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Region Details</p>
                    <p className="text-gray-800 font-semibold text-lg">
                      {address.village ? `${address.village}, ` : ''}{address.city}, {address.state}
                    </p>
                  </div>

                  {address.contactNumber && (
                    <div className="space-y-1.5 p-4 rounded-2xl hover:bg-gray-50/50 transition-colors">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Phone Number</p>
                      <p className="text-gray-800 font-semibold text-lg flex items-center gap-2">
                         {address.contactNumber}
                      </p>
                    </div>
                  )}

                  {address.email && (
                    <div className="space-y-1.5 p-4 rounded-2xl hover:bg-gray-50/50 transition-colors">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address</p>
                      <p className="text-gray-800 font-semibold text-lg flex items-center gap-2 break-all">
                        {address.email}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
