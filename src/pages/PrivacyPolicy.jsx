import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Shield, Calendar, Loader2 } from 'lucide-react';
import { fetchPrivacyPolicy } from '../redux/privacy/privacySlice';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  const dispatch = useDispatch();
  const { privacy, loading } = useSelector((state) => state.privacy);

  useEffect(() => {
    dispatch(fetchPrivacyPolicy());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 uppercase-headings">
      <SEO title="Privacy Policy" description="Read our privacy policy to understand how we protect your data." />

      <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {privacy?.title || 'Privacy Policy'}
          </h1>
          <p className="text-orange-100 text-lg tracking-wider">श्री बाबा छोटू नाथ सरकार सेवा समिति</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex items-center gap-2 text-gray-500 border border-gray-100">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-bold uppercase tracking-widest">
              Last Updated: {privacy?.lastUpdated ? new Date(privacy.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '...'}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Fetching Protocol...</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 mb-10">
              <div 
                className="prose prose-orange max-w-none text-gray-600 leading-relaxed whitespace-pre-line text-lg"
                dangerouslySetInnerHTML={{ __html: privacy?.content || 'Loading content...' }}
              />
            </div>
          )}

          <div className="text-center text-sm text-gray-400 pt-8 border-t border-gray-100">
            <p>© {new Date().getFullYear()} श्री बाबा छोटू नाथ सरकार सेवा समिति. All rights reserved.</p>
            <p className="mt-2 font-bold text-orange-400">जय बाबा छोटू नाथ 🙏</p>
          </div>
        </div>
      </div>
    </div>
  );
}