import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn, FiShield } from 'react-icons/fi';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
                <a href="#" className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                  Forgot password?
                </a>
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
    </main>
  );
};

export default LoginPage;