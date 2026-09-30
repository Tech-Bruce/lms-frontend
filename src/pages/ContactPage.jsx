import React, { useState } from 'react';
import { FiMail, FiUser, FiMessageSquare, FiSend, FiChevronRight, FiTwitter, FiLinkedin, FiGithub, FiMessageCircle } from 'react-icons/fi';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const { name, email, message } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <main className="min-h-screen bg-[#070B14] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[650px] w-[850px] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[110px]" />
        <div className="absolute right-[-200px] top-[400px] h-[600px] w-[600px] rounded-full bg-blue-600/[0.07] blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">

          <h1 className="max-w-3xl mx-auto text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-[4.5rem]">
            Contact <br />
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              Cyber Security Brigade
            </span>
          </h1>
          <p className="mt-7 max-w-2xl mx-auto text-base leading-8 text-slate-400 sm:text-lg">
            Have questions about our programs? Want to discuss your cybersecurity career path? We're here to help you navigate the digital frontline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-start">
          
          {/* Contact Information Cards (Left Col) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0A111E] border border-white/[0.09] p-8 rounded-3xl relative overflow-hidden group hover:border-cyan-400/30 transition-colors">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
              <div className="h-12 w-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 border border-cyan-400/20 mb-6">
                <FiMail className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
              <p className="text-slate-400 mb-4 text-sm">Typically reply within 24 hours</p>
              <a href="mailto:contact@thecyberbrigade.com" className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors">
                contact@thecyberbrigade.com
              </a>
            </div>

            <div className="bg-[#0A111E] border border-white/[0.09] p-8 rounded-3xl relative overflow-hidden group hover:border-blue-400/30 transition-colors">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all" />
              <div className="h-12 w-12 rounded-2xl bg-blue-400/10 flex items-center justify-center text-blue-400 border border-blue-400/20 mb-6">
                <FiMessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Join Community</h3>
              <p className="text-slate-400 mb-4 text-sm">Get real-time support on Discord</p>
              <button className="text-blue-400 font-medium hover:text-blue-300 transition-colors flex items-center gap-1.5">
                Join our Server <FiChevronRight />
              </button>
            </div>

            <div className="bg-[#0A111E] border border-white/[0.09] p-8 rounded-3xl relative overflow-hidden">
              <h3 className="text-lg font-semibold text-white mb-4">Connect on Socials</h3>
              <div className="flex gap-4">
                <a href="#" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-400/10 transition-all">
                  <FiTwitter className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-400/10 transition-all">
                  <FiLinkedin className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-400/10 transition-all">
                  <FiGithub className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form (Right Col) */}
          <div className="lg:col-span-3">
            <div className="bg-[#0A111E] border border-white/[0.09] p-8 sm:p-10 rounded-3xl relative overflow-hidden backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white mb-2">Send a Message</h2>
              <p className="text-slate-400 mb-8 text-sm">Fill out the form below and our team will get back to you.</p>
              
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiUser className="text-slate-500" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder-slate-500 outline-none transition-all"
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
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder-slate-500 outline-none transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Your Message
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <FiMessageSquare className="text-slate-500" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={message}
                      onChange={onChange}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder-slate-500 outline-none transition-all resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 bg-cyan-400 text-[#07121D] font-bold rounded-xl hover:bg-cyan-300 transition-colors flex items-center justify-center gap-2 shadow-[0_5px_20px_rgba(34,211,238,0.25)] group"
                  >
                    Send Message
                    <FiSend className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>

            {/* FAQ Mini Section */}
            <div className="mt-8 bg-[#0A111E] border border-white/[0.09] p-8 rounded-3xl">
              <h3 className="text-lg font-semibold text-white mb-6">Frequently Asked Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Do you offer payment plans?",
                  "What are the prerequisites for courses?",
                  "Do you provide job placement assistance?",
                  "Can I get a refund if I'm not satisfied?"
                ].map((question, index) => (
                  <div key={index} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-cyan-400/20 transition-colors group cursor-pointer">
                    <p className="text-sm text-slate-300 group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                      {question}
                      <FiChevronRight className="text-slate-500 group-hover:text-cyan-400" />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;