import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[9999]"
        >
          <div className="bg-white/80 backdrop-blur-2xl border border-orange-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-200">
                  <Cookie className="w-7 h-7 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">Cookie Settings</h3>
                  <p className="text-sm font-medium text-orange-600 mt-0.5">Customizing your experience</p>
                </div>
                <button 
                  onClick={() => setShow(false)}
                  className="ml-auto p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                हम आपकी पसंद को याद रखने और बेहतर अनुभव प्रदान करने के लिए कुकीज़ का उपयोग करते हैं। अधिक जानकारी के लिए हमारी 
                <Link to="/cookie-policy" className="text-orange-600 font-bold hover:underline mx-1">
                  कुकी नीति
                </Link> 
                पढ़ें।
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAccept}
                  className="flex-1 flex items-center justify-center gap-2 bg-stone-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl font-bold transition-all hover:shadow-xl active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  Accept All
                </button>
                <button
                  onClick={handleDecline}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-orange-200 hover:bg-orange-50/30 text-gray-700 px-6 py-3.5 rounded-2xl font-bold transition-all hover:shadow-sm active:scale-95"
                >
                  Ignore
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                  Respecting Your Privacy • Baba Chhotu Nath Temple
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
