import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Globe, Shield, ArrowRight, History } from 'lucide-react';
import { trackClick } from '../../utils/analytics';

const features = [
  {
    icon: History,
    title: "प्राचीन इतिहास",
    desc: "बाबा छोटू नाथ सरकार का पावन इतिहास और उनकी दिव्य लीलाएं।"
  },
  {
    icon: Globe,
    title: "सामाजिक सेवा",
    desc: "शिक्षा, स्वास्थ्य और लोक कल्याण हेतु समर्पित बाबा का दरबार।"
  },
  {
    icon: Shield,
    title: "आध्यात्मिक सुरक्षा",
    desc: "भक्तों के जीवन में आने वाली बाधाओं का निवारण और दिव्य सुरक्षा।"
  }
];

export default function HomeAboutSection() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Decorative Traditional Element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Left: Image Canvas */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative rounded-[3rem] overflow-hidden shadow-2xl z-10 aspect-[4/5] sm:aspect-square"
              >
                <img
                  src="/CarsoleImage/darbar.jpeg"
                  alt="Temple History"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-950/40 to-transparent" />
              </motion.div>

              {/* Floating Stat Card */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl z-20 border border-orange-50 hidden sm:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white">
                    <Heart className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-gray-900 leading-none">100+</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold font-sans">वर्षों की सेवा</p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Frame */}
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-orange-200 rounded-[3rem] -z-0" />
            </div>
          </div>

          {/* Right: Content */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-orange-700 rounded-full text-xs font-bold uppercase tracking-widest border border-orange-100">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                बाबा छोटू नाथ सरकार - बडेसरा
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
                आध्यात्मिकता और <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                  परम सुख का धाम
                </span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                बाबा छोटू नाथ सरकार का यह पावन दरबार भक्तों के लिए असीम शांति और दिव्य ऊर्जा का स्रोत है। वर्षों से यहाँ आने वाले भक्त अपनी श्रद्धा और विश्वास के फल स्वरूप दिव्य अनुभूतियां प्राप्त करते रहे हैं।
              </p>
            </div>

            <div className="grid gap-6">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{f.title}</h4>
                    <p className="text-sm text-gray-500 leading-snug">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/about"
                onClick={() => trackClick('home_about_read_more')}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200"
              >
                अधिक जानें
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
