import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDonationSettings, updateDonationSettingsAPI, uploadQRCodeAPI, clearMessages } from '../../redux/donationSettings/donationSettingsSlice';
import { Plus, Trash2, Save, Upload, QrCode, IndianRupee, Building2, Loader2, CheckCircle, X } from 'lucide-react';

export default function DonationSettingsManagement() {
    const dispatch = useDispatch();
    const { data, loading, error, successMessage } = useSelector(s => s.donationSettings);

    const [form, setForm] = useState({
        bankName: '', accountNumber: '', ifscCode: '', accountHolderName: '', upiId: '',
        donationAmounts: [],
        sevaOptions: []
    });
    const [newAmount, setNewAmount] = useState('');
    const [qrFile, setQrFile] = useState(null);
    const [qrPreview, setQrPreview] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        dispatch(fetchDonationSettings());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            setForm({
                bankName: data.bankName || '',
                accountNumber: data.accountNumber || '',
                ifscCode: data.ifscCode || '',
                accountHolderName: data.accountHolderName || '',
                upiId: data.upiId || '',
                donationAmounts: data.donationAmounts || [501, 1100, 2100, 5100, 11000, 21000],
                sevaOptions: data.sevaOptions || [],
            });
            if (data.qrCodeUrl) setQrPreview(data.qrCodeUrl);
        }
    }, [data]);

    useEffect(() => {
        if (successMessage || error) {
            const t = setTimeout(() => dispatch(clearMessages()), 3000);
            return () => clearTimeout(t);
        }
    }, [successMessage, error, dispatch]);

    const handleSave = async () => {
        setSaving(true);
        await dispatch(updateDonationSettingsAPI(form));
        setSaving(false);
    };

    const handleQRUpload = async () => {
        if (!qrFile) return;
        const fd = new FormData();
        fd.append('qrCode', qrFile);
        setSaving(true);
        await dispatch(uploadQRCodeAPI(fd));
        setSaving(false);
        setQrFile(null);
    };

    const addAmount = () => {
        const n = parseInt(newAmount);
        if (n > 0 && !form.donationAmounts.includes(n)) {
            setForm(f => ({ ...f, donationAmounts: [...f.donationAmounts, n].sort((a, b) => a - b) }));
            setNewAmount('');
        }
    };

    const removeAmount = (amt) => setForm(f => ({ ...f, donationAmounts: f.donationAmounts.filter(a => a !== amt) }));

    const addSeva = () => {
        const newSeva = { id: Date.now().toString(), name: 'New Seva', description: '', isActive: true };
        setForm(f => ({ ...f, sevaOptions: [...f.sevaOptions, newSeva] }));
    };

    const updateSeva = (id, field, value) => {
        setForm(f => ({ ...f, sevaOptions: f.sevaOptions.map(s => s.id === id ? { ...s, [field]: value } : s) }));
    };

    const removeSeva = (id) => setForm(f => ({ ...f, sevaOptions: f.sevaOptions.filter(s => s.id !== id) }));

    return (
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <IndianRupee className="w-7 h-7 text-orange-600" /> Donation Settings
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage bank details, QR code, seva options and preset amounts.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-60"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save All
                </button>
            </div>

            {/* Feedback */}
            {successMessage && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-xl border border-green-200">
                    <CheckCircle className="w-5 h-5" /> {successMessage}
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-xl border border-red-200">
                    <X className="w-5 h-5" /> {error}
                </div>
            )}

            {loading && !data ? (
                <div className="flex justify-center py-16"><Loader2 className="w-10 h-10 text-orange-500 animate-spin" /></div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Bank Details */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-orange-500" /> Bank Details
                        </h2>
                        {[
                            { key: 'bankName', label: 'Bank Name', placeholder: 'e.g. State Bank of India' },
                            { key: 'branchName', label: 'Branch Name', placeholder: 'e.g. Main Branch, Bhiwani' },
                            { key: 'accountHolderName', label: 'Account Holder Name', placeholder: 'Account holder name' },
                            { key: 'accountNumber', label: 'Account Number', placeholder: 'Bank account number' },
                            { key: 'ifscCode', label: 'IFSC Code', placeholder: 'e.g. SBIN0001234' },
                            { key: 'upiId', label: 'UPI ID', placeholder: 'e.g. temple@upi' },
                        ].map(({ key, label, placeholder }) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                <input
                                    type="text"
                                    value={form[key]}
                                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                    placeholder={placeholder}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition-all"
                                />
                            </div>
                        ))}
                    </div>

                    {/* QR Code + Amounts */}
                    <div className="space-y-6">
                        {/* QR Code Upload */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <QrCode className="w-5 h-5 text-orange-500" /> Payment QR Code
                            </h2>
                            {qrPreview && (
                                <div className="flex justify-center mb-4">
                                    <img src={qrPreview} alt="QR Code" className="w-32 h-32 object-contain rounded-xl border border-gray-200" />
                                </div>
                            )}
                            <div className="flex gap-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setQrFile(file);
                                            setQrPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                    className="flex-1 text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 file:text-sm file:font-medium cursor-pointer"
                                />
                                <button
                                    onClick={handleQRUpload}
                                    disabled={!qrFile || saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-700 disabled:opacity-50 transition-colors"
                                >
                                    <Upload className="w-4 h-4" /> Upload
                                </button>
                            </div>
                        </div>

                        {/* Donation Amounts */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <IndianRupee className="w-5 h-5 text-orange-500" /> Preset Amounts
                            </h2>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {form.donationAmounts.map(amt => (
                                    <span key={amt} className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-semibold">
                                        ₹{amt.toLocaleString('en-IN')}
                                        <button onClick={() => removeAmount(amt)} className="ml-1 text-orange-400 hover:text-red-500 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={newAmount}
                                    onChange={e => setNewAmount(e.target.value)}
                                    placeholder="Enter amount (e.g. 5100)"
                                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
                                    onKeyDown={e => e.key === 'Enter' && addAmount()}
                                />
                                <button onClick={addAmount} className="px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-700 transition-colors">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Seva Options */}
            {!loading && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Seva Options</h2>
                        <button onClick={addSeva} className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-sm font-medium hover:bg-orange-100 transition-colors">
                            <Plus className="w-4 h-4" /> Add Seva
                        </button>
                    </div>
                    {form.sevaOptions.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-6">No seva options. Click "Add Seva" to create one.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {form.sevaOptions.map((seva) => (
                                <div key={seva.id} className="p-4 border border-gray-200 rounded-xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={seva.isActive}
                                                onChange={e => updateSeva(seva.id, 'isActive', e.target.checked)}
                                                className="w-4 h-4 accent-orange-600"
                                            />
                                            <span className="text-xs font-medium text-gray-600">Active</span>
                                        </label>
                                        <button onClick={() => removeSeva(seva.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={seva.name}
                                        onChange={e => updateSeva(seva.id, 'name', e.target.value)}
                                        placeholder="Seva name"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 outline-none text-sm font-medium"
                                    />
                                    <input
                                        type="text"
                                        value={seva.description}
                                        onChange={e => updateSeva(seva.id, 'description', e.target.value)}
                                        placeholder="Description"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 outline-none text-sm text-gray-600"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
