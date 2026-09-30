import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiUserPlus, FiHexagon } from 'react-icons/fi';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') navigate('/profile');
    });
  };

  return (
    <main className="min-h-screen bg-[#070B14] pt-28 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden text-white font-sans">
      {/* Ambient Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 top-1/3 h-[600px] w-[600px] rounded-full bg-blue-600/[0.08] blur-[120px]" />
        <div className="absolute right-0 -bottom-20 h-[600px] w-[600px] rounded-full bg-cyan-500/[0.08] blur-[120px]" />
      </div>

      <div className="max-w-6xl w-full bg-[#0A111E]/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 min-h-[650px]">
        
        {/* Left Side: Branding Content */}
        <div className="md:w-5/12 p-10 md:p-14 flex flex-col justify-center bg-gradient-to-br from-blue-900/10 to-[#0A111E] border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <FiHexagon className="w-8 h-8 text-blue-400" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-[1.1]">
              Start Your <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Journey</span>
            </h2>
            
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Join thousands of students mastering cybersecurity. Gain access to premium courses, mentorship, and a thriving community.
            </p>

            <div className="flex flex-col gap-3">
              {[
                "Expert-led Curriculum",
                "1-on-1 Mentorship Sessions",
                "Real-world Projects & Labs"
              ].map((perk, i) => (
                <div key={i} className="flex items-center text-sm font-medium text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-3 shadow-[0_0_8px_#22d3ee]"></div>
                  {perk}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-10 md:p-14 flex flex-col justify-center bg-[#070C15]/50">
          <div className="max-w-md w-full mx-auto">
            <h3 className="text-2xl font-bold text-white mb-2">Create Account</h3>
            <p className="text-slate-400 mb-8 text-sm">Fill in your details below to join the brigade.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="text-slate-500" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-white placeholder-slate-600"
                    placeholder="John Doe"
                  />
                </div>
              </div>

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
                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-white placeholder-slate-600"
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
                    autoComplete="new-password"
                    required
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-white placeholder-slate-600"
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500 pl-1">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div className="flex items-center pt-2 pb-2">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 bg-white/[0.05] border-white/20 rounded text-blue-500 focus:ring-blue-500/50"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-slate-400">
                  I agree to the <a href="#" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Terms</a> and <a href="#" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] mt-2"
              >
                Create Account <FiUserPlus className="text-lg" />
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </main>
  );
};

export default RegisterPage;