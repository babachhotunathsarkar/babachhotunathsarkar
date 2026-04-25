import React from 'react';
import { Youtube, Play, ArrowRight, Music2, Video, Bell, Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackClick } from '../../utils/analytics';

const YOUTUBE_CHANNEL = 'https://www.youtube.com/@Babachotunathsarkar';

const stats = [
  { label: 'Aarti Videos', value: '50+', icon: Music2, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Darbar Streams', value: '100+', icon: Video, color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Subscribers', value: '10K+', icon: Users, color: 'text-rose-600', bg: 'bg-rose-50' },
];

export default function YouTubePromo() {
  return (
    <section className="relative py-28 overflow-hidden bg-white">
      {/* Decorative Traditional Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ea580c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-50/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-orange-50/50 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Left Side: Visual Content */}
          <div className="w-full lg:w-1/2">
            <div className="relative group">
              {/* Premium Card Container */}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(234,88,12,0.15)] bg-gray-900 aspect-video lg:aspect-[4/3] border-4 border-white shadow-orange-100">
                <img
                  src="/CarsoleImage/darbar.jpeg"
                  alt="YouTube Thumbnail"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-70 group-hover:scale-105 transition-transform duration-1000"
                />
                {/* Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-950/90 via-black/20 to-transparent opacity-80" />

                {/* Center Play Button */}
                <a
                  href={YOUTUBE_CHANNEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick('youtube_play_main')}
                  className="absolute inset-0 flex items-center justify-center group/btn"
                >
                  <div className="relative">
                    <div className="absolute -inset-8 bg-red-600/20 rounded-full animate-ping group-hover/btn:bg-red-600/30" />
                    <div className="w-24 h-24 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl transform group-hover/btn:scale-110 group-hover/btn:rotate-[360deg] transition-all duration-700">
                      <Play className="w-10 h-10 fill-current ml-1" />
                    </div>
                  </div>
                </a>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-red-200">Live on Sundays</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold font-serif">Baba Chhotu Nath Sarkar</h3>
                    <p className="text-gray-300 text-sm">Join our growing spiritual community</p>
                  </div>
                </div>
              </div>

              {/* Floating Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg -rotate-12 group-hover:rotate-0 transition-all duration-500">
                <Youtube className="text-white w-10 h-10" />
              </div>
            </div>
          </div>

          {/* Right Side: Text & Actions */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-widest border border-orange-200">
                <Bell className="w-3.5 h-3.5 animate-bounce" /> Stay Connected
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                दिव्य अनुभव <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                  सिर्फ एक क्लिक की दूरी पर
                </span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
                घर बैठे बाबा छोटू नाथ सरकार के दिव्य दरबार का दर्शन करें। हमारे YouTube चैनल को सब्सक्राइब करें और प्रतिदिन होने वाली आरती, विशेष भक्ति संगीत और रविवार के दिव्य दरबार की लाइव कवरेज पाएं।
              </p>
            </div>

            {/* Premium Stat Boxes */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className={`p-4 rounded-3xl ${bg} border border-white shadow-sm hover:shadow-md transition-shadow`}>
                  <div className={`${color} mb-2 bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-xl font-black text-gray-900">{value}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={YOUTUBE_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('youtube_subscribe_click')}
                className="flex-[1.5] flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:shadow-red-400/40 hover:-translate-y-1 transition-all"
              >
                <Youtube className="w-6 h-6" />
                Subscribe करें
              </a>
              <Link
                to="/videos"
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-orange-100 text-orange-600 rounded-2xl font-bold text-lg hover:bg-orange-50 hover:border-orange-200 transition-all"
              >
                दर्शन दीर्घा
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <p className="text-sm text-gray-400 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Visit our official YouTube handle @Babachotunathsarkar
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

