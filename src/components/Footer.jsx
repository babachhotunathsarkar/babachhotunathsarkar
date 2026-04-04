import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Facebook, Instagram, Youtube, Heart,
} from 'lucide-react';
import { fetchPublicAddresses } from '../redux/address/addressSlice';

export default function Footer() {
  const dispatch = useDispatch();
  const { templeInfo } = useSelector((state) => state.settings);
  const { addresses } = useSelector((state) => state.address);

  useEffect(() => {
    dispatch(fetchPublicAddresses());
  }, [dispatch]);

  const addr = addresses?.[0];

  const getTempleName = () =>
    templeInfo?.nameEnglish || templeInfo?.name || 'Shri Baba Chhotu Nath Temple';

  const socialLinks = [
    {
      icon: Youtube,
      href: 'https://www.youtube.com/@Babachotunathsarkar',
      label: 'YouTube',
      color: '#FF0000',
      hoverBg: 'hover:bg-red-600',
    },
    {
      icon: Instagram,
      href: 'https://www.instagram.com/baba_chhotu_nath_sarkar_samiti/',
      label: 'Instagram',
      color: '#E1306C',
      hoverBg: 'hover:bg-pink-600',
    },
    {
      icon: Facebook,
      href: 'https://www.facebook.com/profile.php?id=61574480576744',
      label: 'Facebook',
      color: '#1877F2',
      hoverBg: 'hover:bg-blue-600',
    },
  ];

  const legalLinks = [
    { path: '/privacy-policy', label: 'Privacy Policy' },
    { path: '/terms-conditions', label: 'Terms & Conditions' },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#1a0a00] text-white">

      {/* ── Background Logo Watermark ── */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <img
          src="/logo.jpeg"
          alt=""
          className="w-[420px] h-[420px] object-cover rounded-full opacity-[0.06] blur-[2px] select-none"
        />
      </div>

      {/* ── Ambient Glows ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px]" />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 pt-16 pb-10">

        {/* Logo + Name */}
        <div className="flex flex-col items-center text-center mb-10">
          <Link to="/" className="group flex flex-col items-center gap-5">
            {/* Logo Ring */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-orange-500 via-orange-300 to-white shadow-lg shadow-orange-900/40 group-hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-[#1a0a00]">
                  <img
                    src="/logo.jpeg"
                    alt="Temple Logo"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
              {/* Spin ring on hover */}
              <div className="absolute -inset-1 rounded-full border border-orange-500/0 border-t-orange-500 group-hover:border-orange-500/60 animate-spin-slow transition-all duration-500" />
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                {getTempleName()}
              </h3>
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="h-px w-10 bg-orange-500/60" />
                <span className="text-orange-400 text-xs font-bold uppercase tracking-[0.25em]">
                  Service & Devotion
                </span>
                <span className="h-px w-10 bg-orange-500/60" />
              </div>
            </div>
          </Link>

          <p className="mt-6 text-white/50 text-sm sm:text-base max-w-lg leading-relaxed italic">
            "A sacred space of devotion and service — bringing everyone closer to the divine through faith, love, and community."
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-10" />

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mb-10">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className={`
                group w-12 h-12 rounded-2xl flex items-center justify-center
                border border-white/10 bg-white/5
                ${s.hoverBg} hover:border-transparent
                hover:-translate-y-2 hover:shadow-xl
                transition-all duration-400 ease-out
              `}
            >
              <s.icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            </a>
          ))}
        </div>

        {/* Legal Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10">
          {legalLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-white/40 hover:text-orange-400 text-xs sm:text-sm font-medium uppercase tracking-widest transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-orange-400 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()}{' '}
            <span className="text-orange-500 font-semibold">{getTempleName()}</span>
            . All rights reserved.
          </p>
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full">
            <span className="text-orange-300 text-xs font-bold uppercase tracking-widest">Devotion</span>
            <Heart className="w-3 h-3 fill-orange-500 text-orange-500 animate-pulse" />
            <span className="text-orange-300 text-xs font-bold uppercase tracking-widest">Service</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </footer>
  );
}