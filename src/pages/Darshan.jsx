import { motion } from 'framer-motion';
import { Play, Heart, Star, MapPin, Calendar, Clock } from 'lucide-react';
import SEO from "../components/SEO";

// Access the darbar image
import darbarImage from '../../public/CarsoleImage/darbar.jpeg';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveTimings } from '../redux/timing/timingSlice';
import { fetchActiveSpecialDays } from '../redux/specialDay/specialDaySlice';
import { fetchPublicAddresses } from '../redux/address/addressSlice';

export default function Darshan() {
  const dispatch = useDispatch();

  const { timings } = useSelector((state) => state.timing || {});
  const { specialDays } = useSelector((state) => state.specialDay || {});
  const { addresses } = useSelector((state) => state.address || {});

  useEffect(() => {
    dispatch(fetchActiveTimings());
    dispatch(fetchActiveSpecialDays());
    dispatch(fetchPublicAddresses());
  }, [dispatch]);

  const timingText = timings && timings.length > 0
    ? timings.map(t => `${t.title}: ${t.startTime} - ${t.endTime}`).join('\n')
    : "सुबह 05:00 - रात 09:00";

  const specialDaysText = specialDays && specialDays.length > 0
    ? specialDays.map(sd => sd.title).join(' एवं ')
    : "पूर्णिमा एवं मंगलवार";

  const addressObj = addresses && addresses.length > 0 ? addresses[0] : null;
  const addressText = addressObj
    ? [addressObj.village, addressObj.city, addressObj.state].filter(Boolean).join(', ')
    : "बडेसरा, भिवानी, हरियाणा";

  return (
    <div className="min-h-screen bg-stone-50">
      <SEO
        title="दिव्य दर्शन | Darshan"
        description="Shri Baba Chhotu Nath Temple Darshan - Experience the divine presence of Baba Chhotu Nath Sarkar (Darbar) through our official darshan page."
      />

      {/* Hero Section */}
      <section className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden bg-black">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src={darbarImage}
            alt="Divya Darbar"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-black/40"></div>
        </motion.div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-600 text-white text-xs sm:text-sm font-bold uppercase tracking-widest mb-6 border border-orange-400/30">
              सिद्ध दिव्य दरबार
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
              दिव्य दरबार दर्शन
            </h1>
            <p className="text-lg sm:text-2xl text-stone-200 max-w-3xl mx-auto font-medium">
              बाबा छोटु नाथ सरकार के सानिध्य में शांति एवं अध्यात्म का अनुभव करें
            </p>
          </motion.div>
        </div>
      </section>

      {/* Darbar Significance Section */}
      <section className="py-20 -mt-12 relative z-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8 bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-stone-100"
            >
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-6">श्री बाबा छोटु नाथ जी</h2>
                <div className="space-y-4 text-stone-600 leading-relaxed text-lg">
                  <p>
                    बाबा छोटु नाथ महाराज का यह दरबार अनंत शांति और ऊर्जा का केंद्र है। यहाँ आने वाले हर भक्त को हृदय की गहराई में आध्यात्मिक संतोष की अनुभूति होती है।
                  </p>
                  <p>
                    मान्यता है कि यहाँ सच्चे मन से की गई प्रार्थना कभी निष्फल नहीं होती। बाबा का आशीर्वाद भक्त के जीवन के हर अंधकार को मिटा देता है।
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center text-orange-500">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <span className="font-bold text-sm text-stone-700">अनंत कृपा</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center text-orange-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm text-stone-700">पावन धाम</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative lg:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl group"
            >
              <img
                src={darbarImage}
                alt="Main Darbar Detail"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 to-transparent"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Local Video Section */}
      <section className="py-20 bg-stone-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-600/10 blur-[120px] rounded-full translate-x-1/2"></div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">मंगल आरती दर्शन</h2>
            <p className="text-stone-400">दैनिक आरती एवं दिव्य दर्शन विडियो</p>
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="aspect-video bg-stone-800 rounded-[2rem] overflow-hidden shadow-2xl border border-stone-700 group relative"
          >
            {/* Native Video Player for Local Video */}
            <video
              className="w-full h-full object-cover"
              controls
              poster={darbarImage}
            >
              <source src="/Videos/aarti.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      </section>

      {/* Timings Brief */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "दर्शन समय", detail: timingText },
              { icon: Calendar, title: "विशेष दिन", detail: specialDaysText },
              { icon: MapPin, title: "स्थान", detail: addressText }
            ].map((info, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl text-center border border-stone-100 shadow-lg"
              >
                <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-7 h-7" />
                </div>
                <h4 className="text-stone-900 font-bold mb-2">{info.title}</h4>
                <p className="text-stone-500 whitespace-pre-line leading-relaxed">{info.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
