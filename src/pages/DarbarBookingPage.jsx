import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDarbarBooking, clearDarbarMessages, clearCreatedBookingState } from '../redux/darbarBooking/darbarBookingSlice';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LogIn, User as UserIcon, Phone, MapPin, Users, FileText, Calendar as CalendarIcon, CheckCircle, AlertCircle } from 'lucide-react';

const DarbarBookingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage, createdTokenNumber, createdDarbarDate } = useSelector((state) => state.darbarBooking);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    devoteeName: '',
    phoneNumber: '',
    city: '',
    numberOfPeople: 1,
    email: '',
    notes: ''
  });

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        devoteeName: user.name || '',
        phoneNumber: user.phone || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, user]);

  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    dispatch(clearDarbarMessages());
    dispatch(clearCreatedBookingState());
    checkBookingOpen();
    const interval = setInterval(checkBookingOpen, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [dispatch]);

  // DarbarBookingPage.jsx
  const checkBookingOpen = () => {
    const now = moment().utcOffset("+05:30"); // ✅ IST correct
    let open = false;
    if (now.day() === 6 && now.hour() >= 16) {  // ✅ Sat 4PM
      open = true;
    }
    if (now.day() === 0 && now.hour() < 13) {   // ✅ Sun 1PM
      open = true;
    }
    setIsBookingOpen(open);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createDarbarBooking(formData));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4">
      <div className="max-w-xl w-full space-y-10 bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
            Sunday <span className="text-orange-500">Darbar</span>
          </h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Token Booking Suvidha</p>
          <div className="w-20 h-1.5 bg-orange-500 mx-auto rounded-full mt-6"></div>
        </div>

        {!isBookingOpen ? (
          <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl text-center" role="alert">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 mx-auto mb-4 shadow-sm">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-orange-900 mb-2">Booking Not Open</h3>
            <p className="text-orange-800/70">Booking opens on Saturday at 4:00 PM and closes on Sunday at 1:00 PM.</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="bg-white border border-gray-100 p-10 rounded-[2.5rem] text-center shadow-xl">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-6">
              <LogIn className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Login Required</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Token booking ke liye aapko login karna anivarya hai. Kripaya login karein aur apna token surakshit karein.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all flex items-center justify-center gap-3"
            >
              Login Now <LogIn className="w-5 h-5" />
            </button>
            <p className="mt-6 text-sm text-gray-400">
              Naya account banana chahte hain? <button onClick={() => navigate('/register')} className="text-orange-600 font-bold hover:underline">Register Karein</button>
            </p>
          </div>
        ) : createdTokenNumber ? (
          <div className="bg-green-50 border border-green-100 p-8 rounded-[2.5rem] text-center shadow-lg" role="alert">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-green-500 mx-auto mb-6 shadow-sm border border-green-100">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-green-900 mb-2 uppercase">Booking Successful!</h3>
            <p className="text-green-800/70 mb-8">{successMessage}</p>

            <div className="bg-white p-8 rounded-3xl text-center border-2 border-dashed border-green-200 shadow-inner">
              <span className="block text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Your Token Number</span>
              <span className="block text-6xl font-black text-indigo-600 mb-4">{createdTokenNumber}</span>
              <div className="h-[1px] bg-gray-100 w-full mb-4"></div>
              <span className="flex items-center justify-center gap-2 text-indigo-900/60 font-bold">
                <CalendarIcon className="w-5 h-5" />
                {new Date(createdDarbarDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <p className="mt-8 text-sm text-gray-500 italic">Please save this token number. An email confirmation has also been sent.</p>

            <button
              onClick={() => {
                dispatch(clearCreatedBookingState());
                setFormData(prev => ({ ...prev, notes: '' }));
              }}
              className="mt-8 w-full bg-gray-900 text-white py-5 rounded-2xl font-bold hover:bg-black transition-all shadow-xl"
            >
              Book Another Token
            </button>
          </div>
        ) : (
          <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 px-5 py-4 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div className="group">
                <label className="block text-gray-500 text-xs font-black uppercase tracking-widest mb-1.5 ml-1">Devotee Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <input required type="text" name="devoteeName" value={formData.devoteeName} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none font-bold text-gray-800" placeholder="Full Name" />
                </div>
              </div>

              <div className="group">
                <label className="block text-gray-500 text-xs font-black uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <input required type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none font-bold text-gray-800" placeholder="Phone Number" />
                </div>
              </div>

              <div className="group">
                <label className="block text-gray-500 text-xs font-black uppercase tracking-widest mb-1.5 ml-1">City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none font-bold text-gray-800" placeholder="City Name" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="group">
                  <label className="block text-gray-500 text-xs font-black uppercase tracking-widest mb-1.5 ml-1">Number of People</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <input required type="number" min="1" name="numberOfPeople" value={formData.numberOfPeople} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none font-bold text-gray-800" />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-gray-500 text-xs font-black uppercase tracking-widest mb-1.5 ml-1">Notes (Optional)</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none font-bold text-gray-800 resize-none" placeholder="Any special requests..." />
                </div>
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full py-5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-100 hover:from-orange-700 hover:to-orange-600 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:transform-none">
              {loading ? 'Booking Token...' : 'Confirm Token Booking'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default DarbarBookingPage;
