import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Mail, Phone, MapPin, Calendar, Loader2 } from 'lucide-react';
import { fetchPageContent } from '../redux/pageContent/pageContentSlice';
import SEO from '../components/SEO';

export default function DynamicLegalPage({ slug, title: defaultTitle, icon: Icon }) {
  const dispatch = useDispatch();
  const { pages, loading } = useSelector((state) => state.pageContent);
  const page = pages[slug];

  useEffect(() => {
    dispatch(fetchPageContent(slug));
  }, [dispatch, slug]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={page?.title || defaultTitle} 
        description={`Read our ${slug.replace('-', ' ')} at Shri Baba Chhotu Nath Temple.`} 
      />

      <section className="bg-gradient-to-r from-stone-900 via-orange-800 to-orange-600 py-20 relative overflow-hidden">
         {/* Decorative elements */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
         
        <div className="container mx-auto px-4 text-center relative z-10">
          {Icon && (
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md mb-6 border border-white/20 shadow-xl">
                <Icon className="w-10 h-10 text-white" />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {page?.title || defaultTitle}
          </h1>
          <p className="text-orange-100 text-lg font-medium opacity-80 uppercase tracking-widest">बाबा छोटू नाथ सरकार सेवा समिति</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100/50 p-5 mb-10 flex items-center gap-3 text-gray-600">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Effective From</p>
                <p className="font-semibold text-gray-800">
                    {page?.lastUpdated ? new Date(page.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
              <p className="text-gray-400 font-medium animate-pulse">Loading content...</p>
            </div>
          ) : (
            <>
              {/* Dynamic sections */}
              {(!page?.sections || page.sections.length === 0) ? (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                      <p className="text-gray-400">Content for this page is being updated. Please check back later.</p>
                  </div>
              ) : (
                [...(page?.sections || [])].sort((a,b) => a.order - b.order).map((section, idx) => (
                    <div key={idx} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 hover:shadow-md transition-shadow">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-4">
                        <span className="w-1 h-8 bg-orange-500 rounded-full"></span>
                        {section.heading}
                      </h2>
                      <div className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                        {section.body}
                      </div>
                    </div>
                  ))
              )}

              {/* Contact Section */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-[2.5rem] p-10 border border-orange-100 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-2xl"></div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
                <p className="text-gray-700 mb-8 text-lg">If you have any questions about our policies, please reach out to us:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {page?.contactEmail && (
                    <div className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl border border-white">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="font-medium text-gray-700">{page.contactEmail}</span>
                    </div>
                  )}
                  {page?.contactPhone && (
                    <div className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl border border-white">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="font-medium text-gray-700">{page.contactPhone}</span>
                    </div>
                  )}
                </div>
                
                {page?.contactAddress && (
                  <div className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl border border-white mt-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="font-medium text-gray-700 pt-2">{page.contactAddress}</span>
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-gray-400 mt-16 pt-8 border-t border-gray-100">
                <p>© {new Date().getFullYear()} बाबा छोटू नाथ सरकार सेवा समिति. All rights reserved.</p>
                <p className="mt-2 font-medium text-orange-400">जय बाबा छोटू नाथ 🙏</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
