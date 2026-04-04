import { Link } from 'react-router-dom'
import { Heart, CreditCard, Building2, QrCode } from 'lucide-react'
import { useSelector } from 'react-redux'

const donationOptions = [
  {
    icon: Heart,
    title: 'General Donation',
    description: 'For temple maintenance and daily worship',
    amount: '501',
  },
  {
    icon: CreditCard,
    title: 'Special Puja',
    description: 'For special rituals and worship',
    amount: '1,100',
  },
  {
    icon: Building2,
    title: 'Construction Service',
    description: 'For temple renovation and expansion',
    amount: '5,100',
  },
  {
    icon: QrCode,
    title: 'Food Donation',
    description: 'For prasad distribution to devotees',
    amount: '2,100',
  },
]

export default function DonationSection() {
  const { donationInfo } = useSelector((state) => state.settings)

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block text-orange-100 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider">
            Donate
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Donate, Earn Merit
          </h2>
          <p className="text-orange-100 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Your donation will help in the development of the temple and social works. Every small and big contribution is important.
          </p>
        </div>

        {/* Donation Options */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
          {donationOptions.map((option, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center hover:bg-white/20 transition-colors group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <option.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-white font-bold mb-1 sm:mb-2 text-sm sm:text-base">
                {option.title}
              </h3>
              <p className="text-orange-100 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2 hidden sm:block">
                {option.description}
              </p>
              <div className="text-xl sm:text-2xl font-bold text-white">₹{option.amount}</div>
            </div>
          ))}
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl mx-auto shadow-xl">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            Bank Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Bank Name</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">{donationInfo?.bankName}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Account Number</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">{donationInfo?.accountNumber}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">IFSC Code</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">{donationInfo?.ifscCode}</p>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Account Holder</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">{donationInfo?.accountName}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">UPI ID</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">{donationInfo?.upiId}</p>
              </div>
              <Link
                to="/donate"
                className="inline-flex items-center justify-center gap-2 w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all text-sm sm:text-base"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
