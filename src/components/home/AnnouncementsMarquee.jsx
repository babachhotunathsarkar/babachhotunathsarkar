import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Megaphone, Calendar, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchAnnouncements } from '../../redux/announcements/announcementSlice';

export default function AnnouncementsMarquee() {
  const dispatch = useDispatch();
  const { announcements, isLoading } = useSelector((state) => state.announcements);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  // Handle seamless loop by duplicating content
  const marqueeItems = [...announcements, ...announcements];

  if (!isLoading && announcements.length === 0) return null;

  return (
    <div className="bg-white border-y border-orange-100 shadow-sm relative overflow-hidden group">
      <div className="container mx-auto px-4 flex items-center">
        
        {/* Fixed Title Label */}
        <div className="relative z-10 bg-white pr-6 py-4 flex items-center gap-3 shrink-0 border-r border-orange-50 shadow-[10px_0_15px_-5px_rgba(255,255,255,1)]">
          <div className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-100">
            <Megaphone className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 leading-tight">ताज़ा समाचार</h3>
            <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">News & Events</p>
          </div>
        </div>

        {/* Marquee Container */}
        <div 
          className="flex-1 overflow-hidden h-16 relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div 
            className="flex items-center gap-12 absolute whitespace-nowrap min-w-full py-4"
            animate={{ x: isPaused ? undefined : ["0%", "-50%"] }}
            transition={{ 
              x: {
                repeat: Infinity,
                duration: announcements.length * 8, // Adjust duration based on item count
                ease: "linear"
              }
            }}
          >
            {marqueeItems.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 group/item cursor-pointer"
              >
                {/* Type Icon */}
                {item.type === 'event' ? (
                  <Calendar className="w-4 h-4 text-orange-500" />
                ) : (
                  <Info className="w-4 h-4 text-blue-500" />
                )}
                
                {/* Content */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      item.type === 'event' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-sm font-bold text-gray-800 group-hover/item:text-orange-600 transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {new Date(item.date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                
                {/* Separator Dot */}
                <div className="w-1.5 h-1.5 bg-orange-200 rounded-full mx-4"></div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Desktop View All Link */}
        <Link 
          to="/events" 
          className="hidden md:flex items-center gap-2 pl-6 py-4 bg-white text-orange-600 font-bold text-sm shrink-0 hover:gap-3 transition-all border-l border-orange-50 shadow-[-10px_0_15px_-5px_rgba(255,255,255,1)]"
        >
          सब देखें <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
