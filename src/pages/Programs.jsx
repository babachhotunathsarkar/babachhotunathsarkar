import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Clock, Sun, Star, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { fetchActiveSchedules } from '../redux/schedule/scheduleSlice';
import { fetchActiveTimings } from '../redux/timing/timingSlice';
import { fetchActiveSpecialDays } from '../redux/specialDay/specialDaySlice';
import SEO from "../components/SEO";

export default function Programs() {
  const dispatch = useDispatch();
  const { schedules, isLoading: isSchedulesLoading } = useSelector(state => state.schedule);
  const { timings, isLoading: isTimingsLoading } = useSelector(state => state.timing);
  const { specialDays, isLoading: isSpecialDaysLoading } = useSelector(state => state.specialDay);

  const isLoading = isSchedulesLoading || isTimingsLoading || isSpecialDaysLoading;

  useEffect(() => {
    dispatch(fetchActiveSchedules());
    dispatch(fetchActiveTimings());
    dispatch(fetchActiveSpecialDays());
    window.scrollTo(0, 0);
  }, [dispatch]);

  const cardClass = "bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-100/50 hover:shadow-2xl hover:border-orange-200 transition-all group";

  return (
    <div className="min-h-screen bg-[#FAFAF9] pt-24 pb-20">
      <SEO 
        title="Temple Programs & Daily Schedule"
        description="Explore the daily routine, special programs, and temple timings at Shri Baba Chhotu Nath Temple, Badesra. Find information about Aarti, Seva, and special religious gatherings."
      />
      {/* Header Section */}
      <div className="relative py-20 bg-gradient-to-b from-orange-100/50 to-transparent overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-orange-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            मंदिर के कार्यक्रम
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            बाबा छोटु नाथ जी के सानिध्य में आयोजित होने वाले दैनिक एवं विशेष कार्यक्रमों की विस्तृत जानकारी
          </motion.p>
          <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full mt-8"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Daily Schedule */}
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className={cardClass}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">दैनिक समय सारिणी</h2>
                <p className="text-gray-500 text-sm">प्रतिदिन होने वाली सेवा एवं आरती</p>
              </div>
            </div>

            <div className="space-y-4">
              {schedules.length > 0 ? schedules.map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 p-5 rounded-2xl hover:bg-orange-50/50 transition-colors border border-transparent hover:border-orange-100 group/item">
                  <div className="w-24 shrink-0">
                    <span className="font-mono text-sm font-bold text-orange-600 bg-orange-100/50 px-3 py-1 rounded-lg">
                      {item.time}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg group-hover/item:text-orange-600 transition-colors">
                      {item.activity}
                    </h4>
                    {item.description && <p className="text-gray-500 text-sm mt-1">{item.description}</p>}
                  </div>
                </div>
              )) : <div className="text-center py-10 text-gray-400">जानकारी शीघ्र ही अपडेट की जाएगी</div>}
            </div>
          </motion.div>

          <div className="space-y-10">
            {/* Temple Door Timings */}
            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className={cardClass}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                  <Sun className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">दर्शन का समय</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {timings.map((timing, idx) => (
                  <div key={idx} className="p-5 bg-orange-50 rounded-2xl border border-orange-100">
                    <p className="font-bold text-gray-700 mb-2">{timing.title}</p>
                    <p className="text-orange-600 font-bold text-lg">{timing.startTime} - {timing.endTime}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Special Days Calendar */}
            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={cardClass}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                  <Star className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">महत्वपूर्ण तिथियां</h3>
              </div>
              <div className="space-y-4">
                {specialDays.map((day, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    <div className="w-12 h-12 bg-white shadow-sm border border-orange-100 rounded-xl flex flex-col items-center justify-center text-orange-600 shrink-0">
                       <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{day.title}</h4>
                      <p className="text-orange-600 font-bold text-xs">{day.date}</p>
                      {day.description && <p className="text-gray-500 text-xs mt-1">{day.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Bar */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-orange-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-orange-200"
        >
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">क्या आप किसी उत्सव में शामिल होना चाहते हैं?</h3>
            <p className="text-orange-100">आगामी बड़े कार्यक्रमों की जानकारी के लिए यहाँ क्लिक करें</p>
          </div>
          <Link 
            to="/events" 
            className="px-10 py-4 bg-white text-orange-600 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-xl"
          >
            आगामी कार्यक्रम <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
