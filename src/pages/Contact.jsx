import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import { fetchPublicAddresses } from '../redux/address/addressSlice'
import SEO from "../components/SEO";
import ContactForm from '../components/ContactForm';

export default function Contact() {
  const dispatch = useDispatch()

  const { templeInfo } = useSelector((state) => state.settings)
  const { addresses } = useSelector((state) => state.address)

  useEffect(() => {
    dispatch(fetchPublicAddresses())
  }, [dispatch])

  const addr = addresses?.[0]

  const getTimings = () => {
    return templeInfo?.timingsEnglish || templeInfo?.timings
  }

  // Build full address from dynamic addr, fallback to settings
  const getAddress = () => {
    if (addr) {
      return [
        addr.street,
        addr.village,
        addr.city,
        addr.state,
        addr.pincode,
        addr.country,
      ].filter(Boolean).join(', ')
    }
    return templeInfo?.addressEnglish || templeInfo?.address
  }

  const phone = addr?.phone || templeInfo?.phone
  const email = addr?.email || templeInfo?.email

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      value: getAddress(),
    },
    {
      icon: Phone,
      title: 'Phone',
      value: phone,
      link: phone ? `tel:${phone}` : null,
    },
    {
      icon: Mail,
      title: 'Email',
      value: email,
      link: email ? `mailto:${email}` : null,
    },
    {
      icon: Clock,
      title: 'Darshan Timings',
      value: getTimings(),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Contact Us | Location & Directions"
        description="Get in touch with Shri Baba Chhotu Nath Temple, Badesra. Find our contact details, phone number, email, and Google Maps directions to the temple."
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-orange-100 max-w-2xl mx-auto">
            Get in touch with us - we are here to help you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-primary">
                Send Message
              </h2>
              <ContactForm />
            </div>

            {/* Contact Info & Map */}
            <div className="space-y-6">
              {/* Contact Cards */}
              <div className="grid grid-cols-2 gap-4">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                      <info.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {info.title}
                    </h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-gray-600 text-sm hover:text-orange-600 transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-gray-600 text-sm">{info.value}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-80">
                <iframe
                  src="https://maps.google.com/maps?q=28.9249893,76.2154088&z=19&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Temple Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
