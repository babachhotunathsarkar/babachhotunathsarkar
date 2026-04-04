import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Heart, CreditCard, Building2, QrCode, Copy, Check, Shield } from 'lucide-react'
import SEO from "../components/SEO";

const donationAmounts = [501, 1100, 2100, 5100, 11000, 21000]

const sevaOptions = [
  { id: 'general', name: 'General Donation', description: 'For temple maintenance and daily worship' },
  { id: 'annadaan', name: 'Food Donation', description: 'For prasad distribution to devotees' },
  { id: 'puja', name: 'Special Puja', description: 'For special rituals and worship' },
  { id: 'construction', name: 'Construction Service', description: 'For temple renovation and expansion' },
]

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState(1100)
  const [customAmount, setCustomAmount] = useState('')
  const [selectedSeva, setSelectedSeva] = useState('general')
  const [copiedField, setCopiedField] = useState(null)
  const { donationInfo } = useSelector((state) => state.settings)

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Donate & Seva | Support the Temple"
        description="Contribute to the divine mission of Shri Baba Chhotu Nath Temple, Badesra. Online donation options for Aarti, Bhandara, construction, and charitable works."
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Donate
          </h1>
          <p className="text-orange-100 max-w-2xl mx-auto">
            Donate and earn merit. Your contribution will help in temple development and social works.
          </p>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Amount Selection */}
              <div className="lg:col-span-3 space-y-6">
                {/* Seva Type */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Select Seva Type
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {sevaOptions.map((seva) => (
                      <button
                        key={seva.id}
                        onClick={() => setSelectedSeva(seva.id)}
                        className={`p-4 rounded-xl text-left transition-all ${
                          selectedSeva === seva.id
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-gray-50 hover:bg-orange-50 text-gray-900'
                        }`}
                      >
                        <h3 className="font-semibold mb-1">{seva.name}</h3>
                        <p className={`text-sm ${selectedSeva === seva.id ? 'text-orange-100' : 'text-gray-500'}`}>
                          {seva.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Select Amount
                  </h2>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {donationAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount)
                          setCustomAmount('')
                        }}
                        className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                          selectedAmount === amount && !customAmount
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                        }`}
                      >
                        ₹{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Or enter your amount"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Payment Button */}
                <button className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl">
                  <CreditCard className="w-6 h-6" />
                  Donate ₹{finalAmount?.toLocaleString() || 0}
                </button>

                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>100% Secure Payment</span>
                </div>
              </div>

              {/* Bank Details */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-600" />
                    Bank Details
                  </h2>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                      <p className="font-semibold text-gray-900">{donationInfo?.bankName}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Account Number</p>
                          <p className="font-semibold text-gray-900">{donationInfo?.accountNumber}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(donationInfo?.accountNumber, 'account')}
                          className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                        >
                          {copiedField === 'account' ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">IFSC Code</p>
                          <p className="font-semibold text-gray-900">{donationInfo?.ifscCode}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(donationInfo?.ifscCode, 'ifsc')}
                          className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                        >
                          {copiedField === 'ifsc' ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Account Holder</p>
                      <p className="font-semibold text-gray-900">{donationInfo?.accountName}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-xl border-2 border-orange-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <QrCode className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="text-xs text-orange-600 mb-0.5">UPI ID</p>
                            <p className="font-semibold text-gray-900">{donationInfo?.upiId}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(donationInfo?.upiId, 'upi')}
                          className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                        >
                          {copiedField === 'upi' ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
