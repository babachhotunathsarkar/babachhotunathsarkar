import { Link } from 'react-router-dom'
import { Heart, Users, Calendar, Award, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: Heart,
    title: 'Spiritual Service',
    description: 'Continuous service and worship to bring devotees closer to God.',
  },
  {
    icon: Users,
    title: 'Social Service',
    description: 'Various programs to help the poor and needy.',
  },
  {
    icon: Calendar,
    title: 'Religious Programs',
    description: 'Special events on Navratri, Diwali and other festivals.',
  },
  {
    icon: Award,
    title: 'Tradition Preservation',
    description: 'Effort to keep ancient traditions and culture alive.',
  },
]

export default function AboutSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-orange-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div>
            <span className="inline-block text-orange-600 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider">
              About Us
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Baba Chhotu Nath Sarkar
              <span className="text-orange-600">
                &nbsp;Sewa Samiti
              </span>
            </h2>
            <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Baba Chhotu Nath Sarkar Sewa Samiti is a sacred spiritual organization dedicated to bringing devotees closer to God and serving society. Our temple has been a center of faith for devotees for centuries.
            </p>
            <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              Thousands of devotees visit daily for darshan and fulfill their wishes. We organize various religious and social programs.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-2 sm:mb-3">
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 hidden sm:block">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm sm:text-base group"
            >
              Learn More
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?w=400&h=300&fit=crop"
                  alt="Temple ceremony"
                  className="w-full h-32 sm:h-40 md:h-48 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1609941871666-5da8a26c5879?w=400&h=400&fit=crop"
                  alt="Devotees praying"
                  className="w-full h-40 sm:h-52 md:h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1567591370504-80d5e5b370a2?w=400&h=400&fit=crop"
                  alt="Festival decorations"
                  className="w-full h-40 sm:h-52 md:h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=300&fit=crop"
                  alt="Aarti ceremony"
                  className="w-full h-32 sm:h-40 md:h-48 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

