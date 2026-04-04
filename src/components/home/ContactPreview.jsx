import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Navigation, ArrowRight } from 'lucide-react';
import { fetchPublicAddresses } from '../../redux/address/addressSlice';

export default function ContactPreview() {
  const dispatch = useDispatch();
  const { addresses, isLoading } = useSelector((state) => state.address);
  const { templeInfo } = useSelector((state) => state.settings);

  useEffect(() => {
    dispatch(fetchPublicAddresses());
  }, [dispatch]);

  const addr = addresses?.[0];

  const getFullAddress = () => {
    if (!addr) return "Temple Road, Near Main Chowk, Hisar, Haryana";
    return [
      addr.street,
      addr.village,
      addr.city,
      addr.state,
      addr.pincode,
    ].filter(Boolean).join(', ');
  };

  const getTimings = () => {
    return templeInfo.timingsEnglish || templeInfo.timings || "5:00 AM - 9:30 PM";
  };

  const contactItems = [
    {
      icon: MapPin,
      label: "स्थान (Address)",
      value: getFullAddress(),
      color: "orange"
    },
    {
      icon: Phone,
      label: "संपर्क (Contact Number)",
      value: addr?.contactNumber || templeInfo?.phone || "+91 98XXX XXXXX",
      color: "blue"
    },
    {
      icon: Mail,
      label: "ईमेल (Email Address)",
      value: addr?.email || templeInfo?.email || "contact@temple.com",
      color: "red"
    },
    {
      icon: Clock,
      label: "दर्शन का समय (Darshan Hours)",
      value: getTimings(),
      color: "green"
    }
  ];

  return (
    <section className="py-24 bg-gray-50/50 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Side: Text and Info Grid */}
          <div className="flex-1 space-y-12 w-full">
            <div className="max-w-xl">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-orange-600 font-bold uppercase tracking-widest text-sm"
              >
                संपर्क एवं स्थान
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6"
              >
                मंदिर में आपका <span className="text-orange-600">स्वागत है</span>
              </motion.h2>
              <div className="w-20 h-1.5 bg-orange-500 rounded-full mb-8"></div>
              <p className="text-gray-600 text-lg leading-relaxed">
                श्रद्धालुओं की सुविधा के लिए मंदिर प्रशासन सदैव तत्पर है। मंदिर दर्शन, आरती के समय या किसी भी अन्य जानकारी के लिए आप सीधे हमसे संपर्क कर सकते हैं।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactItems.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all group"
                >
                  <div className={`w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-colors`}>
                    <item.icon className="w-5 h-5 text-orange-600 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-gray-900 font-bold text-sm md:text-base leading-tight">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a 
                href="/contact" 
                className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 flex items-center gap-2"
              >
                विस्तृत जानकारी <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href={templeInfo?.mapLink || "https://maps.google.com"} 
                target="_blank" 
                rel="noreferrer"
                className="px-8 py-4 bg-white border-2 border-orange-600 text-orange-600 rounded-2xl font-bold hover:bg-orange-50 transition-all flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" /> मार्ग दर्शन (Directions)
              </a>
            </div>
          </div>

          {/* Right Side: Map or Visual Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-[400px] shrink-0 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-2xl relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-[100px]" />
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-8">
                 <img src="/logo.jpeg" alt="Logo" className="w-20 h-20 object-cover rounded-full" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{templeInfo?.name || "Shri Baba Chhotu Nath Temple"}</h3>
              <p className="text-gray-500 text-sm mb-10 leading-relaxed italic">
                 "धर्म और सेवा का पवित्र संगम"
              </p>
              
              <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100/50 mb-10">
                <p className="text-orange-900 font-bold mb-4">जरूरी संपर्क:</p>
                <div className="space-y-4">
                   <div className="flex items-center justify-center gap-3">
                      <Phone className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-900 font-bold">{addr?.contactNumber || templeInfo?.phone || "+91 94162-XXXXX"}</span>
                   </div>
                    <div className="flex items-center justify-center gap-3">
                      <Mail className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-900 font-bold">{addr?.email || templeInfo?.email || "info@temple.com"}</span>
                   </div>
                </div>
              </div>

              <div className="w-full aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden shadow-inner grayscale group-hover:grayscale-0 transition-all duration-700">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111751.57945535904!2d75.64292196024844!3d29.135239634960527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391232860a289389%3A0xc3fec2c1762c2f6d!2sHisar%2C%20Haryana!5e0!3m2!1sen!2sin!4v1712211933930!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
