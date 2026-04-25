import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Clock, Sun, Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackClick } from '../../utils/analytics';
import { fetchActiveSchedules } from '../../redux/schedule/scheduleSlice';
import { fetchActiveTimings } from '../../redux/timing/timingSlice';
import { fetchActiveSpecialDays } from '../../redux/specialDay/specialDaySlice';

export default function HomeProgramSection() {
  const dispatch = useDispatch();

  const { schedules, isLoading: isSchedulesLoading } = useSelector(state => state.schedule);
  const { timings, isLoading: isTimingsLoading } = useSelector(state => state.timing);
  const { specialDays, isLoading: isSpecialDaysLoading } = useSelector(state => state.specialDay);

  const isLoading = isSchedulesLoading || isTimingsLoading || isSpecialDaysLoading;

  useEffect(() => {
    dispatch(fetchActiveSchedules());
    dispatch(fetchActiveTimings());
    dispatch(fetchActiveSpecialDays());
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-100/30 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-orange-600 font-bold uppercase tracking-widest text-sm"
          >
            दिव्य दर्शन एवं सेवा
          </motion.span>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4"
          >
            मंदिर का कार्यक्रम
          </motion.h2>
          <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Temple Timings Section */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 hover:border-orange-200 transition-all group">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Sun className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">मंदिर के समय</h3>
            </div>

            <div className="space-y-6">
              {timings.length > 0 ? timings.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                  <span className="font-bold text-gray-700">{t.title}</span>
                  <div className="text-right">
                    <p className="text-orange-600 font-bold text-sm">{t.startTime} - {t.endTime}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 italic text-center py-4">अद्यतन किया जा रहा है...</p>
              )}
            </div>
          </motion.div>

          {/* Daily Schedule Section */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 hover:border-orange-200 transition-all group lg:scale-105 lg:z-20 border-orange-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">दैनिक कार्यक्रम</h3>
            </div>

            <div className="space-y-4">
              {schedules.length > 0 ? schedules.map((s, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                  <span className="font-mono text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded shrink-0">{s.time}</span>
                  <span className="font-bold text-gray-800 text-sm">{s.activity}</span>
                </div>
              )) : (
                <p className="text-gray-400 italic text-center py-4">शीघ्र उपलब्ध होगा...</p>
              )}
            </div>
          </motion.div>

          {/* Special Days Section */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 hover:border-orange-200 transition-all group">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Star className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">विशेष दिन</h3>
            </div>

            <div className="space-y-6">
              {specialDays.length > 0 ? specialDays.map((d, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col items-center justify-center text-orange-600 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">{d.title}</p>
                    <p className="text-orange-600 font-bold text-xs mt-1">{d.date}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 italic text-center py-4">जानकारी जल्द ही...</p>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Call to Action Links */}
        <div className="mt-20 flex flex-wrap justify-center gap-6">
          <Link
            to="/about"
            onClick={() => trackClick('home_program_about_click')}
            className="px-10 py-4 bg-orange-600 text-white rounded-[2rem] font-bold hover:bg-orange-500 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-200"
          >
            हमारे बारे में जानें
          </Link>
          <Link
            to="/events"
            onClick={() => trackClick('home_program_events_click')}
            className="px-10 py-4 bg-white border-2 border-orange-600 text-orange-600 rounded-[2rem] font-bold hover:bg-orange-50 hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            आगामी कार्यक्रम देखें
          </Link>
        </div>
      </div>
    </section>
  );
}
