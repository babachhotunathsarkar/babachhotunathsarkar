import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ExternalLink } from 'lucide-react';
import { useEffect } from 'react';
import { fetchAnnouncements } from '../../redux/announcements/announcementSlice';

let _uid = 0;

function ScrollBackground({ children, label }) {
  const uid = `sv${++_uid}`;

  return (
    <div style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }}>
      <svg
        viewBox="0 0 340 520"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`${uid}-paper`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f9edcc" />
            <stop offset="35%" stopColor="#f0d898" />
            <stop offset="70%" stopColor="#e8c870" />
            <stop offset="100%" stopColor="#d4a83a" />
          </linearGradient>
          <linearGradient id={`${uid}-lEdge`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(90,45,5,0.28)" />
            <stop offset="100%" stopColor="rgba(90,45,5,0)" />
          </linearGradient>
          <linearGradient id={`${uid}-rEdge`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(90,45,5,0)" />
            <stop offset="100%" stopColor="rgba(90,45,5,0.28)" />
          </linearGradient>
          <linearGradient id={`${uid}-rod`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3d1a02" />
            <stop offset="28%" stopColor="#7a3a0c" />
            <stop offset="50%" stopColor="#b86818" />
            <stop offset="72%" stopColor="#7a3a0c" />
            <stop offset="100%" stopColor="#3d1a02" />
          </linearGradient>
          <linearGradient id={`${uid}-shine`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,220,140,0.50)" />
            <stop offset="100%" stopColor="rgba(255,220,140,0)" />
          </linearGradient>
          <radialGradient id={`${uid}-knob`} cx="38%" cy="32%" r="62%">
            <stop offset="0%" stopColor="#c87020" />
            <stop offset="55%" stopColor="#7a3a0c" />
            <stop offset="100%" stopColor="#2e1002" />
          </radialGradient>

          <clipPath id={`${uid}-clip`}>
            <rect x="26" y="62" width="288" height="390" />
          </clipPath>
        </defs>

        {/* PAPER */}
        <rect x="18" y="56" width="304" height="402" rx="3" fill={`url(#${uid}-paper)`} />
        <rect x="18" y="56" width="30" height="402" fill={`url(#${uid}-lEdge)`} />
        <rect x="292" y="56" width="30" height="402" fill={`url(#${uid}-rEdge)`} />

        {/* faint lines */}
        <line x1="26" y1="160" x2="314" y2="158" stroke="rgba(150,95,20,0.13)" strokeWidth="1" />
        <line x1="26" y1="270" x2="314" y2="268" stroke="rgba(150,95,20,0.11)" strokeWidth="1" />
        <line x1="26" y1="370" x2="314" y2="372" stroke="rgba(150,95,20,0.09)" strokeWidth="1" />

        <rect x="26" y="64" width="288" height="386" rx="2"
          fill="none" stroke="rgba(155,100,18,0.40)" strokeWidth="1.2" strokeDasharray="7,5" />

        {/* TOP ROD */}
        <rect x="6" y="24" width="328" height="42" rx="21" fill={`url(#${uid}-rod)`} />
        <rect x="6" y="24" width="328" height="16" rx="10" fill={`url(#${uid}-shine)`} />
        <ellipse cx="22" cy="45" rx="16" ry="21" fill={`url(#${uid}-knob)`} />
        <ellipse cx="318" cy="45" rx="16" ry="21" fill={`url(#${uid}-knob)`} />

        {/* LABEL */}
        <text
          x="170" y="51"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="700"
          fontFamily="'Noto Serif Devanagari', serif"
          fill="#fff5d0"
          style={{ letterSpacing: '0.5px' }}
        >
          {label}
        </text>

        {/* BOTTOM ROD */}
        <rect x="6" y="454" width="328" height="42" rx="21" fill={`url(#${uid}-rod)`} />
        <rect x="6" y="454" width="328" height="16" rx="10" fill={`url(#${uid}-shine)`} />
        <ellipse cx="22" cy="475" rx="16" ry="21" fill={`url(#${uid}-knob)`} />
        <ellipse cx="318" cy="475" rx="16" ry="21" fill={`url(#${uid}-knob)`} />

        {/* SCROLLING CONTENT */}
        <foreignObject x="26" y="62" width="288" height="390" clipPath={`url(#${uid}-clip)`}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '390px', overflow: 'hidden' }}>
            <div className="scroll-up-anim" style={{ width: '100%' }}>
              {children}
              {children} {/* seamless loop */}
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

export default function NewsSection() {
  const dispatch = useDispatch();
  const { announcements, isLoading } = useSelector((state) => state.announcements);

  // Fetch announcements from backend
  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  // Filter announcements
  const upcomingEvents = announcements.filter(item => item.type === 'event');
  const generalNews = announcements.filter(item => item.type !== 'event');

  // Updated renderItem - Full text without "Details" link
  const renderItem = (item) => (
    <div
      key={item._id}
      style={{
        textAlign: 'center',
        borderBottom: '1px dashed #c8a050',
        padding: '14px 10px',
      }}
    >
      {/* Title */}
      <p style={{
        color: '#b91c1c',
        fontWeight: '700',
        fontSize: '13.5px',
        textTransform: 'uppercase',
        lineHeight: '1.4',
        margin: '0 0 8px',
      }}>
        {item.title}
      </p>

      {/* Full Description - Pura text dikhega */}
      <p style={{
        color: '#1c1209',
        fontSize: '11.8px',
        lineHeight: '1.65',
        margin: '0 0 10px',
        textAlign: 'justify',
      }}>
        {item.description}
      </p>

      {/* Only Date */}
      <p style={{
        color: '#1d4ed8',
        fontWeight: '600',
        fontSize: '10.8px',
        margin: '0',
      }}>
        {new Date(item.date).toLocaleDateString('en-IN')}
      </p>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes scrollFromBottom {
          0%   { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        .scroll-up-anim {
          animation: scrollFromBottom 28s linear infinite;
        }
        .scroll-up-anim:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section className="py-12 bg-orange-50/30">
        <div className="container mx-auto px-4">

          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900 border-b-2 border-orange-500 inline-block pb-2">
              Upcoming Events & News
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center justify-items-center">

            {/* 1. Upcoming Events Scroll */}
            <ScrollBackground label="Upcoming Events">
              {isLoading ? (
                <div className="text-center py-8 text-orange-600">Loading...</div>
              ) : upcomingEvents.length > 0 ? (
                upcomingEvents.map((item) => renderItem(item))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No upcoming events
                </div>
              )}
            </ScrollBackground>

            {/* 2. Welcome / Center Content */}
            <div className="flex flex-col justify-center space-y-5 px-4 w-full max-w-md">
              <span className="text-orange-600 font-bold uppercase tracking-widest text-sm">
                Welcome
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                Heartiest Welcome to Shri Mandir
              </h2>

              <div className="text-gray-600 space-y-4 text-base sm:text-lg leading-relaxed">
                <p>We respect your devotion. Avail all the facilities of the temple and receive blessings.</p>
              </div>

              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-orange-600 hover:bg-orange-600 hover:text-white text-orange-600 font-bold uppercase text-sm tracking-wider transition-all duration-300 rounded-lg"
                >
                  Read More
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 3. General News Scroll */}
            <ScrollBackground label="News">
              {isLoading ? (
                <div className="text-center py-8 text-orange-600">Loading...</div>
              ) : generalNews.length > 0 ? (
                generalNews.map((item) => renderItem(item))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No news available
                </div>
              )}
            </ScrollBackground>

          </div>
        </div>
      </section>
    </>
  );
}