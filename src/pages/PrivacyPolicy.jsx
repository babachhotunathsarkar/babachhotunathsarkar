// src/pages/PrivacyPolicy.jsx
import { Shield, Lock, Database, Eye, Cookie, Mail, Phone, MapPin, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-orange-100 text-lg max-w-2xl mx-auto">
            बाबा छोटू नाथ सरकार सेवा समिति
          </p>
          <p className="text-orange-100 text-sm mt-2">
            Your privacy is important to us
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated Badge */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5 text-orange-600" />
              <span>Last Updated: {new Date().toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>Effective Immediately</span>
            </div>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <div className="space-y-3 text-gray-600 leading-relaxed">
              <p>
                बाबा छोटू नाथ सरकार सेवा समिति ("हम", "हमारा", "हमें") आपकी गोपनीयता की रक्षा करने के लिए प्रतिबद्ध है। 
                यह गोपनीयता नीति बताती है कि जब आप हमारी वेबसाइट का उपयोग करते हैं तो हम आपकी व्यक्तिगत जानकारी को कैसे एकत्र, 
                उपयोग, प्रकट और सुरक्षित करते हैं।
              </p>
              <p>
                Baba Chhotu Nath Sarkar Sewa Samiti ("we", "our", "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information 
                when you use our website and services.
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-orange-600" />
              Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Personal Information</h3>
                <p className="text-gray-600 mb-2">We may collect personal information that you voluntarily provide to us when you:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Register for an account (Name, Email, Phone Number)</li>
                  <li>Make a donation (Payment information is processed securely)</li>
                  <li>Register for events or ceremonies</li>
                  <li>Contact us through forms or email</li>
                  <li>Subscribe to our newsletter or updates</li>
                  <li>Participate in surveys or feedback</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Automatic Information</h3>
                <p className="text-gray-600 mb-2">We automatically collect certain information when you visit our website:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>IP Address and Device Information</li>
                  <li>Browser Type and Version</li>
                  <li>Pages Visited and Time Spent</li>
                  <li>Referring Website URLs</li>
                  <li>Cookies and Usage Data</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-orange-600" />
              How We Use Your Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">To Provide Services</h3>
                <p className="text-gray-600 text-sm">Process donations, event registrations, and manage your account</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">To Communicate</h3>
                <p className="text-gray-600 text-sm">Send updates, newsletters, and important announcements</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">To Improve</h3>
                <p className="text-gray-600 text-sm">Enhance our website, services, and user experience</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">To Protect</h3>
                <p className="text-gray-600 text-sm">Prevent fraud, ensure security, and comply with legal obligations</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">To Personalize</h3>
                <p className="text-gray-600 text-sm">Customize content and recommendations based on your preferences</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">To Analyze</h3>
                <p className="text-gray-600 text-sm">Understand usage patterns and improve our services</p>
              </div>
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Cookie className="w-6 h-6 text-orange-600" />
              Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
              Cookies are files with small amount of data which may include an anonymous unique identifier.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 mb-2">Types of cookies we use:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Security Cookies:</strong> Help protect your account and data</li>
              </ul>
              <p className="text-gray-600 mt-3 text-sm">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed mb-3">
                We implement appropriate technical and organizational security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>SSL encryption for data transmission</li>
                <li>Secure servers and firewalls</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Data backup and recovery procedures</li>
              </ul>
              <p className="text-gray-600 mt-3 text-sm">
                However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.
              </p>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-gray-700 mb-3 font-semibold">You have the right to:</p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-600">Access your personal information</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-600">Correct inaccurate information</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-600">Request deletion of your information</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-600">Opt-out of marketing communications</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-600">Withdraw consent at any time</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-600">Data portability</span>
                </div>
              </div>
            </div>
          </div>

          {/* Children's Privacy */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our services are not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If we become aware that we have collected personal 
              information from a child under 13, we will take steps to delete that information.
            </p>
          </div>

          {/* Changes to Policy */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review 
              this Privacy Policy periodically for any changes.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-orange-600" />
                <span>privacy@babachhotunath.org</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-orange-600" />
                <span>+91 1234567890</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-orange-600" />
                <span>Baba Chhotu Nath Temple, [City], [State] - [PIN Code]</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-sm text-gray-500 mt-8 pt-8 border-t border-gray-200">
            <p>© {new Date().getFullYear()} बाबा छोटू नाथ सरकार सेवा समिति. All rights reserved.</p>
            <p className="mt-2">जय बाबा छोटू नाथ 🙏</p>
          </div>
        </div>
      </div>
    </div>
  );
}