import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FileText, Mail, Phone, MapPin, Calendar, Loader2 } from 'lucide-react';
import { fetchPageContent } from '../redux/pageContent/pageContentSlice';
import SEO from '../components/SEO';

export default function TermsConditions() {
  const dispatch = useDispatch();
  const { pages, loading } = useSelector((state) => state.pageContent);
  const page = pages['terms-conditions'];

  useEffect(() => {
    dispatch(fetchPageContent('terms-conditions'));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Terms & Conditions" description="Read the Terms & Conditions of Shri Baba Chhotu Nath Temple website before using our services." />

      <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {page?.title || 'Terms & Conditions'}
          </h1>
          <p className="text-orange-100 text-lg">बाबा छोटू नाथ सरकार सेवा समिति</p>
          <p className="text-orange-100 text-sm mt-2">Please read these terms carefully before using our services</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8 flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span>Last Updated: {page?.lastUpdated ? new Date(page.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            </div>
          ) : (
            <>
              {(page?.sections || []).sort((a,b) => a.order - b.order).map((section, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-orange-500 pl-4">
                    {idx + 1}. {section.heading}
                  </h2>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {section.body}
                  </div>
                </div>
              ))}

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 mb-4">If you have any questions about these Terms & Conditions, please contact us:</p>
                <div className="space-y-3">
                  {page?.contactEmail && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail className="w-5 h-5 text-orange-600" />
                      <span>{page.contactEmail}</span>
                    </div>
                  )}
                  {page?.contactPhone && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone className="w-5 h-5 text-orange-600" />
                      <span>{page.contactPhone}</span>
                    </div>
                  )}
                  {page?.contactAddress && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <MapPin className="w-5 h-5 text-orange-600" />
                      <span>{page.contactAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 mt-8 pt-8 border-t border-gray-200">
                <p>© {new Date().getFullYear()} बाबा छोटू नाथ सरकार सेवा समिति. All rights reserved.</p>
                <p className="mt-2">जय बाबा छोटू नाथ 🙏</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}