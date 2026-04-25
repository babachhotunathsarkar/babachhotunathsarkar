import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Heart, CreditCard, Building2, QrCode, Copy, Check, Shield, Loader2 } from 'lucide-react'
import SEO from "../components/SEO";
import { fetchDonationSettings } from '../redux/donationSettings/donationSettingsSlice';
import { trackClick } from '../utils/analytics';

export default function Donate() {
  const dispatch = useDispatch();
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [customAmount, setCustomAmount] = useState('')
  const [selectedSeva, setSelectedSeva] = useState(null)
  const [copiedField, setCopiedField] = useState(null)

  const { data: donationData, loading } = useSelector((state) => state.donationSettings);

  useEffect(() => {
    dispatch(fetchDonationSettings());
  }, [dispatch]);

  // Set defaults once data loads
  useEffect(() => {
    if (donationData) {
      if (donationData.donationAmounts?.length > 0 && !selectedAmount) {
        setSelectedAmount(donationData.donationAmounts[1] || donationData.donationAmounts[0]);
      }
      if (donationData.sevaOptions?.length > 0 && !selectedSeva) {
        setSelectedSeva(donationData.sevaOptions.find(s => s.isActive)?.id || donationData.sevaOptions[0]?.id);
      }
    }
  }, [donationData]);

  const handleCopy = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;
  const amounts = donationData?.donationAmounts?.length > 0
    ? donationData.donationAmounts
    : [501, 1100, 2100, 5100, 11000, 21000];
  const sevaOptions = donationData?.sevaOptions?.filter(s => s.isActive) || [];

  const CopyBtn = ({ text, field }) => (
    <button onClick={() => handleCopy(text, field)} className="p-2 text-gray-400 hover:text-orange-600 transition-colors" title="Copy">
      {copiedField === field ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Donate & Seva | Support the Temple"
        description="Contribute to the divine mission of Shri Baba Chhotu Nath Temple, Badesra. Donation options for Aarti, Bhandara, construction and charitable works."
      />

      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">दान करें</h1>
          <p className="text-orange-100 max-w-2xl mx-auto">
            दान करें और पुण्य कमाएं। आपका योगदान मंदिर के विकास और सामाजिक कार्यों में सहायक होगा।
          </p>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        </div>
      ) : (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-5 gap-8">

                {/* Left: Seva + Amount */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Seva Options */}
                  {sevaOptions.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">सेवा प्रकार चुनें (Select Seva Type)</h2>
                      <div className="grid grid-cols-2 gap-3">
                        {sevaOptions.map((seva) => (
                          <button
                            key={seva.id}
                            onClick={() => setSelectedSeva(seva.id)}
                            className={`p-4 rounded-xl text-left transition-all ${selectedSeva === seva.id
                                ? 'bg-orange-500 text-white shadow-lg'
                                : 'bg-gray-50 hover:bg-orange-50 text-gray-900'
                              }`}
                          >
                            <h3 className="font-semibold mb-1 text-sm">{seva.name}</h3>
                            <p className={`text-xs ${selectedSeva === seva.id ? 'text-orange-100' : 'text-gray-500'}`}>
                              {seva.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Amount */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">राशि चुनें (Select Amount)</h2>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {amounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                          className={`py-3 px-4 rounded-xl font-semibold transition-all ${selectedAmount === amount && !customAmount
                              ? 'bg-orange-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                            }`}
                        >
                          ₹{amount.toLocaleString('en-IN')}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Or enter custom amount"
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => trackClick('donate_button_click')}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <CreditCard className="w-6 h-6" />
                    Donate ₹{finalAmount?.toLocaleString('en-IN') || '0'}
                  </button>
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                    <Shield className="w-4 h-4" />
                    <span>100% Secure Payment</span>
                  </div>
                </div>

                {/* Right: Bank Details + QR */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-orange-600" />
                      Bank Details
                    </h2>

                    {/* QR Code */}
                    {donationData?.qrCodeUrl && (
                      <div className="flex flex-col items-center p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
                        <p className="text-xs font-semibold text-orange-600 mb-2 flex items-center gap-1">
                          <QrCode className="w-4 h-4" /> Scan to Pay
                        </p>
                        <img src={donationData.qrCodeUrl} alt="Payment QR Code" className="w-32 h-32 object-contain rounded-lg" />
                      </div>
                    )}

                    {donationData?.bankName && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                        <p className="font-semibold text-gray-900">{donationData.bankName}</p>
                      </div>
                    )}

                    {donationData?.accountHolderName && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Account Holder</p>
                        <p className="font-semibold text-gray-900">{donationData.accountHolderName}</p>
                      </div>
                    )}

                    {donationData?.accountNumber && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Account Number</p>
                            <p className="font-semibold text-gray-900">{donationData.accountNumber}</p>
                          </div>
                          <CopyBtn text={donationData.accountNumber} field="account" />
                        </div>
                      </div>
                    )}

                    {donationData?.ifscCode && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">IFSC Code</p>
                            <p className="font-semibold text-gray-900">{donationData.ifscCode}</p>
                          </div>
                          <CopyBtn text={donationData.ifscCode} field="ifsc" />
                        </div>
                      </div>
                    )}

                    {donationData?.upiId && (
                      <div className="p-3 bg-orange-50 rounded-xl border-2 border-orange-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <QrCode className="w-5 h-5 text-orange-600" />
                            <div>
                              <p className="text-xs text-orange-600 mb-0.5">UPI ID</p>
                              <p className="font-semibold text-gray-900">{donationData.upiId}</p>
                            </div>
                          </div>
                          <CopyBtn text={donationData.upiId} field="upi" />
                        </div>
                      </div>
                    )}

                    {!donationData?.bankName && !donationData?.upiId && (
                      <p className="text-sm text-gray-500 text-center py-4">Payment details coming soon. Please contact us.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
