import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, CheckCircle, RotateCw } from 'lucide-react';
import { submitContactForm, resetContactState } from '../redux/contact/contactSlice';

export default function ContactForm({ light = false }) {
  const dispatch = useDispatch();
  const { isLoading, isSuccess } = useSelector((state) => state.contact);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: '',
      });
      // Reset state after some time if needed, or keep it to show success message
      const timer = setTimeout(() => {
        dispatch(resetContactState());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitContactForm(formData));
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-200">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className={`text-2xl font-bold mb-3 ${light ? 'text-white' : 'text-gray-900'}`}>
          Message Sent Successfully!
        </h3>
        <p className={`${light ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
          Baba Chhotu Nath Sarkar Sewa Samiti will contact you soon.
        </p>
        <button
          onClick={() => dispatch(resetContactState())}
          className="mt-8 text-orange-500 font-bold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={`block text-sm font-bold uppercase tracking-wider ${light ? 'text-gray-300' : 'text-gray-700'}`}>
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
            className={`w-full px-5 py-4 rounded-2xl border transition-all outline-none focus:ring-4 ${light
                ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20'
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-orange-500 focus:ring-orange-200'
              }`}
            placeholder="Devotee Name"
          />
        </div>
        <div className="space-y-2">
          <label className={`block text-sm font-bold uppercase tracking-wider ${light ? 'text-gray-300' : 'text-gray-700'}`}>
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            className={`w-full px-5 py-4 rounded-2xl border transition-all outline-none focus:ring-4 ${light
                ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20'
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-orange-500 focus:ring-orange-200'
              }`}
            placeholder="Email Address"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={`block text-sm font-bold uppercase tracking-wider ${light ? 'text-gray-300' : 'text-gray-700'}`}>
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
            className={`w-full px-5 py-4 rounded-2xl border transition-all outline-none focus:ring-4 ${light
                ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20'
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-orange-500 focus:ring-orange-200'
              }`}
            placeholder="WhatsApp / Phone"
          />
        </div>
        <div className="space-y-2">
          <label className={`block text-sm font-bold uppercase tracking-wider ${light ? 'text-gray-300' : 'text-gray-700'}`}>
            Subject *
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            disabled={isLoading}
            className={`w-full px-5 py-4 rounded-2xl border transition-all outline-none focus:ring-4 ${light
                ? 'bg-white/5 border-white/10 text-white focus:border-orange-500 focus:ring-orange-500/20'
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-orange-500 focus:ring-orange-200'
              }`}
          >
            <option value="general" className={light ? 'bg-gray-900' : ''}>General Inquiry</option>
            <option value="donation" className={light ? 'bg-gray-900' : ''}>Donation Related</option>
            <option value="event" className={light ? 'bg-gray-900' : ''}>Event Related</option>
            <option value="seva" className={light ? 'bg-gray-900' : ''}>Seva Related</option>
            <option value="other" className={light ? 'bg-gray-900' : ''}>Other</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className={`block text-sm font-bold uppercase tracking-wider ${light ? 'text-gray-300' : 'text-gray-700'}`}>
          Your Message *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          disabled={isLoading}
          rows={5}
          className={`w-full px-5 py-4 rounded-2xl border transition-all outline-none focus:ring-4 resize-none ${light
              ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20'
              : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-orange-500 focus:ring-orange-200'
            }`}
          placeholder="How can we help you?"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 disabled:opacity-70 disabled:transform-none ${isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 shadow-orange-200'
          }`}
      >
        {isLoading ? (
          <span key="loading" className="flex items-center gap-2">
            <RotateCw className="w-6 h-6 animate-spin" /> Sending Message...
          </span>
        ) : (
          <span key="submit" className="flex items-center gap-2">
            <Send className="w-6 h-6" /> मेसेज भेजें (Submit Message)
          </span>
        )}
      </button>
    </form>
  );
}
