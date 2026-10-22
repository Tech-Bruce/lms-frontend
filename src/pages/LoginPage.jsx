import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn, FiShield, FiX, FiKey, FiRefreshCw } from 'react-icons/fi';
import api from '../api';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email request, 2: OTP + New Password
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        const role = res.payload.role;
        if (role === 'student') navigate('/profile');
        else if (role === 'instructor') navigate('/InstructorDashboard');
        else if (role === 'admin') navigate('/admin');
      }
    });
  };

  // Step 1: Send OTP to email
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    try {
      setIsSendingCode(true);
      const res = await api.post('/auth/forgot-password', { email: resetEmail.trim() });
      toast.success(res.data?.msg || 'Verification code sent to your email!');
      setForgotStep(2);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Failed to send verification code.');
    } finally {
      setIsSendingCode(false);
    }
  };

  // Step 2: Verify OTP and reset password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetOtp.trim()) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }
    if (!resetNewPassword) {
      toast.error('Please enter a new password');
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (resetNewPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setIsResettingPassword(true);
      const res = await api.post('/auth/reset-password', {
        email: resetEmail.trim(),
        otp: resetOtp.trim(),
        newPassword: resetNewPassword
      });
      toast.success(res.data?.msg || 'Password reset successfully! Please sign in.');
      setForm((prev) => ({ ...prev, email: resetEmail.trim(), password: '' }));
      setIsForgotModalOpen(false);
      setForgotStep(1);
      setResetOtp('');
      setResetNewPassword('');
      setResetConfirmPassword('');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Failed to reset password. Please check your verification code.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-16 px-4 sm:px-8 flex flex-col relative overflow-hidden text-text-main font-sans">
      {/* Ambient Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-cyan-500/[0.08] blur-[120px]" />
        <div className="absolute -right-40 -bottom-40 h-[600px] w-[600px] rounded-full bg-blue-600/[0.08] blur-[120px]" />
      </div>

      <div className="max-w-6xl w-full mx-auto my-auto bg-surface/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 min-h-[500px]">
        
        {/* Left Side: Branding Content */}
        <div className="md:w-5/12 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-primary-cyan/10 to-surface border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-cyan-400/10 border border-cyan-400/20 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
              <FiShield className="w-8 h-8 text-cyan-400" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-[1.1]">
              Welcome <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-cyan to-primary-blue">back.</span>
            </h2>
            
            <p className="text-text-muted text-lg leading-relaxed mb-8">
              Continue building your defensive cybersecurity skills.
            </p>

            <div className="flex items-center space-x-3 text-sm font-medium text-slate-500">
              <span className="h-px w-8 bg-slate-700"></span>
              <span>Secure Login Portal</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-surface2/50">
          <div className="max-w-md w-full mx-auto">
            <h3 className="text-2xl font-bold text-white mb-2">Sign In</h3>
            <p className="text-slate-400 mb-8 text-sm">Please enter your credentials to access your account.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-slate-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    required
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 text-white placeholder-slate-600"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="text-slate-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={form.password}
                    required
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 text-white placeholder-slate-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 bg-white/[0.05] border-white/20 rounded text-cyan-500 focus:ring-cyan-500/50"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400 cursor-pointer hover:text-slate-300">
                    Remember me
                  </label>
                </div>
                
                {/* Working Forgot Password Button */}
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(form.email || '');
                    setForgotStep(1);
                    setIsForgotModalOpen(true);
                  }}
                  className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors focus:outline-none"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-primary-cyan text-background font-bold rounded-xl hover:bg-cyan-300 transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,217,255,0.2)] hover:shadow-[0_0_25px_rgba(37,217,255,0.3)] mt-4"
              >
                Sign In <FiLogIn className="text-lg" />
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                Sign up now
              </Link>
            </p>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#091022] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <FiKey className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Reset Password</h3>
                <p className="text-xs text-cyan-400 font-semibold tracking-wider">
                  {forgotStep === 1 ? "Step 1 of 2: Verify Identity" : "Step 2 of 2: Set New Password"}
                </p>
              </div>
            </div>

            {forgotStep === 1 ? (
              <form onSubmit={handleSendCode} className="space-y-5">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your registered account email. We will dispatch a secure 6-digit verification code to authorize your password reset.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FiMail className="text-slate-500" />
                    </div>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#050914] border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 text-white text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingCode}
                  className="w-full py-3.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-[#030712] font-black rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 text-sm mt-2"
                >
                  {isSendingCode ? (
                    <>
                      <FiRefreshCw className="animate-spin text-base" />
                      <span>Sending Verification Code...</span>
                    </>
                  ) : (
                    <span>Send Verification Code</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter the 6-digit verification code dispatched to <strong className="text-cyan-400">{resetEmail}</strong> and your new password.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-2.5 bg-[#050914] border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 text-center font-mono text-xl tracking-widest text-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FiLock className="text-slate-500" />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="Min. 6 characters"
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#050914] border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FiLock className="text-slate-500" />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="Repeat new password"
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#050914] border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={isResettingPassword}
                    className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-[#030712] font-black rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 text-sm"
                  >
                    {isResettingPassword ? (
                      <>
                        <FiRefreshCw className="animate-spin text-base" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <span>Reset Password</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="w-full text-center text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    ← Change Email or Resend Code
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default LoginPage;