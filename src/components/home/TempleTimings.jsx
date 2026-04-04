import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Star, Clock } from 'lucide-react';
import { fetchActiveSchedules } from '../../redux/schedule/scheduleSlice';
import { fetchActiveTimings } from '../../redux/timing/timingSlice';
import { fetchActiveSpecialDays } from '../../redux/specialDay/specialDaySlice';

export default function TempleTimings() {
  const dispatch = useDispatch();
  
  const { schedules } = useSelector(state => state.schedule);
  const { timings } = useSelector(state => state.timing);
  const { specialDays } = useSelector(state => state.specialDay);

  useEffect(() => {
    dispatch(fetchActiveSchedules());
    dispatch(fetchActiveTimings());
    dispatch(fetchActiveSpecialDays());
  }, [dispatch]);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block text-orange-600 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider">
            समयावली
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            मंदिर का समय एवं कार्यक्रम
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Temple Timings Column */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                दर्शन का समय
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              {timings.length > 0 ? (
                <table className="w-full">
                  <tbody>
                    {timings.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-0">
                        <td className="py-2 sm:py-3 text-gray-700 text-sm sm:text-base pr-3">
                          {item.title}
                        </td>
                        <td className="py-2 sm:py-3 text-orange-600 font-bold text-sm sm:text-base whitespace-nowrap text-right">
                          {item.startTime} - {item.endTime}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400 italic text-center py-4">अद्यतन किया जा रहा है...</p>
              )}
            </div>
          </div>

          {/* Daily Schedule Column */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-red-500 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                दैनिक कार्यक्रम
              </h3>
            </div>
            <div className="p-4 sm:p-6 text-sm">
              {schedules.length > 0 ? (
                <table className="w-full">
                  <tbody>
                    {schedules.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-orange-50/50">
                        <td className="py-2 sm:py-3 text-orange-600 font-semibold whitespace-nowrap">
                          {item.time}
                        </td>
                        <td className="py-2 sm:py-3 text-gray-700 font-bold pl-3">
                          {item.activity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400 italic text-center py-4">जानकारी जल्द ही...</p>
              )}
            </div>
          </div>

          {/* Special Days Column */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                विशेष पर्व
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              {specialDays.length > 0 ? (
                <table className="w-full">
                  <tbody>
                    {specialDays.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-0">
                        <td className="py-2 sm:py-3 text-gray-700 font-bold text-sm sm:text-base">
                          {item.title}
                        </td>
                        <td className="py-2 sm:py-3 text-orange-600 font-semibold text-xs sm:text-sm text-right pl-3">
                          {item.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400 italic text-center py-4">जल्द आ रहा है...</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-6 sm:mt-8 bg-orange-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-bold uppercase tracking-wider text-sm">
              महत्वपूर्ण सूचना
            </span>
          </div>
          <p className="text-sm sm:text-base text-orange-100">
            विशेष त्योहारों और उत्सवों के दौरान समय में परिवर्तन हो सकता है। कृपया दर्शन के पूर्व जानकारी लें।
          </p>
        </div>
      </div>
    </section>
  );
}
