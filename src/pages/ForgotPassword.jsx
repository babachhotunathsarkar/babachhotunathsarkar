import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { forgotPassword, verifyOtp, resetPassword } from '../redux/auth/authSlice';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';
import { trackClick } from '../utils/analytics';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(forgotPassword(email)).unwrap();
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (err) {
      toast.error(err || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(verifyOtp({ email, otp })).unwrap();
      toast.success('OTP verified');
      setStep(3);
    } catch (err) {
      toast.error(err || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await dispatch(resetPassword(password)).unwrap();
      toast.success('Password updated successfully');
      setStep(4);
    } catch (err) {
      toast.error(err || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <SEO title="Forgot Password | Baba Chhotu Nath Temple" description="Reset your account password via email OTP verification." />

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-orange-100">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-500 shadow-xl flex items-center justify-center mx-auto mb-6 bg-white transform hover:scale-105 transition-transform duration-300">
              <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>

            {step === 1 && (
              <>
                <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
                <p className="text-gray-500 mt-2">Enter your email to receive a recovery code</p>
              </>
            )}
            {step === 2 && (
              <>
                <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
                <p className="text-gray-500 mt-2">Enter the 6-digit code sent to <span className="text-orange-600 font-semibold">{email}</span></p>
              </>
            )}
            {step === 3 && (
              <>
                <h1 className="text-2xl font-bold text-gray-900">New Password</h1>
                <p className="text-gray-500 mt-2">Please choose a strong password for your account</p>
              </>
            )}
            {step === 4 && (
              <>
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">All Done!</h1>
                <p className="text-gray-500 mt-2">Your password has been reset successfully.</p>
              </>
            )}
          </div>

          {/* Form Steps */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none bg-gray-50/50"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-orange-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Verification Code</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none bg-gray-50/50 text-center text-2xl font-bold tracking-[0.5em]"
                    placeholder="000000"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm font-semibold text-gray-500 hover:text-orange-600 transition-colors"
                disabled={loading}
              >
                Resend Code
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none bg-gray-50/50"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none bg-gray-50/50"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                onClick={() => trackClick('forgot_password_success')}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
              >
                Back to Login
              </button>
            </div>
          )}

          {/* Footer Navigation */}
          {step !== 4 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link to="/login" className="flex items-center justify-center gap-2 text-gray-500 hover:text-orange-600 font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
