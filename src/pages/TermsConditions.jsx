// src/pages/TermsConditions.jsx
import { FileText, Shield, AlertCircle, CheckCircle, Heart, Calendar, DollarSign, Users, Mail, Phone, MapPin, Scale } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-orange-100 text-lg max-w-2xl mx-auto">
            बाबा छोटू नाथ सरकार सेवा समिति
          </p>
          <p className="text-orange-100 text-sm mt-2">
            Please read these terms carefully before using our services
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
              <span>Effective Date: {new Date().toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="w-5 h-5" />
              <span>Legally Binding Agreement</span>
            </div>
          </div>

          {/* Acceptance of Terms */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <div className="space-y-3 text-gray-600 leading-relaxed">
              <p>
                By accessing or using the Baba Chhotu Nath Sarkar Sewa Samiti website, mobile application, or any of our services, 
                you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services.
              </p>
              <div className="bg-yellow-50 rounded-lg p-4 mt-3">
                <p className="text-yellow-800 text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>These terms constitute a legally binding agreement between you and Baba Chhotu Nath Sarkar Sewa Samiti.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Services Provided */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services Provided</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We provide the following services to our devotees and visitors:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Heart className="w-5 h-5 text-orange-600 mt-0.5" />
                <span className="text-gray-700">Temple information and updates</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600 mt-0.5" />
                <span className="text-gray-700">Event registration and management</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-600 mt-0.5" />
                <span className="text-gray-700">Online donation services</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-orange-600 mt-0.5" />
                <span className="text-gray-700">Community services and updates</span>
              </div>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 mb-3 font-semibold">As a user, you agree to:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Provide accurate, current, and complete information when registering or using our services</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Maintain the security and confidentiality of your account credentials</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Notify us immediately of any unauthorized use of your account</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Comply with all applicable laws, rules, and regulations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Not use our services for any illegal or unauthorized purpose</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Not interfere with or disrupt the functionality of our website or services</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Donations */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Donations</h2>
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  All donations made to Baba Chhotu Nath Sarkar Sewa Samiti are voluntary and non-refundable. 
                  Donations are used for:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600 ml-4">
                  <li>Temple maintenance and renovation</li>
                  <li>Community welfare programs</li>
                  <li>Charitable activities and social services</li>
                  <li>Religious ceremonies and events</li>
                  <li>Educational and healthcare initiatives</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Tax Benefits:</strong> Donations are eligible for tax exemption under Section 80G of the Income Tax Act, 
                  subject to applicable laws and regulations. We provide receipts for all donations.
                </p>
              </div>
            </div>
          </div>

          {/* Event Registration */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Event Registration</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              By registering for events organized by the temple, you agree to:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Provide accurate information for registration</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Follow event guidelines, rules, and instructions</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Respect temple premises, staff, and other participants</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Understand that event schedules may change without prior notice</span>
              </li>
            </ul>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              All content on this website, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4 mb-3">
              <li>Text, articles, and written content</li>
              <li>Images, photographs, and graphics</li>
              <li>Videos and audio recordings</li>
              <li>Logos, trademarks, and branding</li>
              <li>Software and code</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              is the property of Baba Chhotu Nath Sarkar Sewa Samiti and is protected by copyright, trademark, 
              and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative 
              works without our written permission.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, Baba Chhotu Nath Sarkar Sewa Samiti, its trustees, employees, 
                and volunteers shall not be liable for any indirect, incidental, special, consequential, or punitive 
                damages arising from your use of or inability to use our services, including but not limited to:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 ml-4">
                <li>Loss of data or information</li>
                <li>Loss of profits or revenue</li>
                <li>Personal injury or property damage</li>
                <li>Service interruptions or delays</li>
                <li>Unauthorized access to your data</li>
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 leading-relaxed">
                Our services are provided on an "as is" and "as available" basis. We do not warrant that:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 ml-4">
                <li>The services will be uninterrupted, timely, secure, or error-free</li>
                <li>The results obtained from using the services will be accurate or reliable</li>
                <li>Any errors in the services will be corrected</li>
              </ul>
            </div>
          </div>

          {/* Indemnification */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Baba Chhotu Nath Sarkar Sewa Samiti and its trustees, 
              employees, volunteers, and affiliates from and against any and all claims, damages, obligations, losses, 
              liabilities, costs, or debt, and expenses arising from:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-600 ml-4">
              <li>Your use of and access to our services</li>
              <li>Your violation of any term of these Terms & Conditions</li>
              <li>Your violation of any third-party right, including without limitation any copyright, property, or privacy right</li>
              <li>Any claim that your use of our services caused damage to a third party</li>
            </ul>
          </div>

          {/* Termination */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
            <p className="text-gray-600 leading-relaxed">
              We may terminate or suspend your access to our services immediately, without prior notice or liability, 
              for any reason whatsoever, including without limitation if you breach these Terms & Conditions. Upon termination, 
              your right to use the services will cease immediately.
            </p>
          </div>

          {/* Changes to Terms */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify or replace these terms at any time. Changes will be effective immediately 
              upon posting. Your continued use of the website after any such changes constitutes acceptance of the new terms. 
              We will make reasonable efforts to notify you of material changes.
            </p>
          </div>

          {/* Governing Law */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-orange-600" />
              12. Governing Law
            </h2>
            <p className="text-gray-600 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising 
              under these terms shall be subject to the exclusive jurisdiction of the courts in [City], India. 
              Any legal proceedings shall be conducted in the English language.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">If you have any questions about these Terms & Conditions, please contact us:</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-orange-600" />
                <span>legal@babachhotunath.org</span>
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