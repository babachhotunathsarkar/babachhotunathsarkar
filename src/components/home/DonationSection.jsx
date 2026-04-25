import { Link } from 'react-router-dom'
import { Heart, CreditCard, Building2, QrCode, ArrowRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import { trackClick } from '../../utils/analytics'

const baseDonationOptions = [
  { icon: Heart, title: 'सामान्य दान', description: 'मंदिर रखरखाव और दैनिक पूजा के लिए' },
  { icon: CreditCard, title: 'विशेष पूजा', description: 'विशेष अनुष्ठानों और पूजा के लिए' },
  { icon: Building2, title: 'निर्माण सेवा', description: 'मंदिर के नवीनीकरण और विस्तार के लिए' },
  { icon: QrCode, title: 'अन्नदान', description: 'भक्तों को प्रसाद वितरण के लिए' },
]

export default function DonationSection() {
  const { data: donationInfo } = useSelector((state) => state.donationSettings)

  const amounts = donationInfo?.donationAmounts?.slice(0, 4) || [501, 1100, 2100, 5100];

  return (
    <section className="py-24 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600 relative overflow-hidden">
      {/* Premium Decorative Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM85 74c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM10 30c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66 66c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM48 62c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm23-43c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-33 10c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-10 8c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm58 39c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-2 20c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-20-40c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm20-60c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-20 20c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM30 50c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM20 80c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm10-70c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm60 40c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm0 20c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 mb-6 backdrop-blur-md">
            <Heart className="w-3.5 h-3.5" /> Support the Divine Mission
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            दान करें — <span className="text-orange-200">पुण्य कमाएं</span>
          </h2>
          <p className="text-orange-50 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            आपका योगदान मंदिर के विकास और सामाजिक कार्यों में सहायक होगा। हर छोटा और बड़ा योगदान महत्वपूर्ण है।
          </p>
        </div>

        {/* Dynamic Donation Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {baseDonationOptions.map((option, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 text-center border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-500 group shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center mx-auto mb-6 group-hover:rotate-[360deg] transition-all duration-700 shadow-lg">
                <option.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-bold text-xl mb-3">{option.title}</h3>
              <p className="text-orange-100 text-sm mb-6 leading-relaxed opacity-80">{option.description}</p>
              <div className="text-3xl font-black text-white">₹{amounts[index]?.toLocaleString('en-IN') || '101'}</div>
            </div>
          ))}
        </div>

        {/* Premium Bank Details Card */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 max-w-4xl mx-auto shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] relative group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity">
            <Building2 className="w-40 h-40 text-orange-600 rotate-12" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Banking Information</h3>
                <p className="text-gray-500 text-sm font-medium">Official account details for direct bank transfers.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <DetailItem label="Account Holder" value={donationInfo?.accountHolderName} />
                <DetailItem label="Bank Name" value={donationInfo?.bankName} />
                <DetailItem label="Branch Name" value={donationInfo?.branchName} />
                <DetailItem label="Account Number" value={donationInfo?.accountNumber} />
                <DetailItem label="IFSC Code" value={donationInfo?.ifscCode} />
              </div>
            </div>

            <div className="bg-orange-50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-6 border-2 border-orange-100">
              <div className="w-40 h-40 bg-white p-3 rounded-3xl shadow-lg border border-orange-100">
                {donationInfo?.qrCodeUrl ? (
                  <img src={donationInfo.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-gray-200" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-1">UPI ID</p>
                <p className="text-lg font-bold text-gray-800">{donationInfo?.upiId || 'Not Set'}</p>
              </div>
              <Link
                to="/donate"
                onClick={() => trackClick('home_donate_now_click')}
                className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-orange-200 transition-all active:scale-95"
              >
                सभी दान विकल्प <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DetailItem({ label, value }) {
  return (
    <div className="border-b border-gray-100 pb-2">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-base font-bold text-gray-800">{value || '—'}</p>
    </div>
  )
}

