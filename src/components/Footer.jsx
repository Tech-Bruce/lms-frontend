import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTwitter, FiGithub, FiLinkedin, FiMail, FiArrowRight } from 'react-icons/fi';
import logo from '../assets/log.png';

const Footer = () => {
  return (
    <footer className="relative bg-[#030712] pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-500 opacity-20 blur-[100px]"></div>
        <div className="absolute bottom-0 right-[-20%] -z-10 h-[400px] w-[400px] rounded-full bg-indigo-600 opacity-10 blur-[120px]"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Section */}
          <div className="lg:col-span-5 space-y-8">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                <img src={logo} alt="Cyber Security Brigade Logo" className="relative h-14 w-auto object-contain" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors duration-300">
                Brigade
              </span>
            </Link>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md font-medium">
              Elite cybersecurity training platform engineering the next generation of threat defenders and security architects.
            </p>
            
            <div className="flex items-center gap-4 pt-4">
              {[FiTwitter, FiGithub, FiLinkedin].map((Icon, idx) => (
                <motion.a 
                  key={idx}
                  href="#" 
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-cyan-300 hover:bg-cyan-900/20 hover:border-cyan-500/50 transition-all duration-300 shadow-lg"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                Platform <span className="w-8 h-px bg-cyan-500/50"></span>
              </h3>
              <ul className="space-y-4">
                {['Home', 'Courses', 'Mentorship', 'Enterprise'].map((link) => (
                  <li key={link}>
                    <Link to="/" className="group text-gray-400 hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2 font-medium">
                      <FiArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      <span>{link}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                Support <span className="w-8 h-px bg-cyan-500/50"></span>
              </h3>
              <ul className="space-y-4">
                {['Help Center', 'API Docs', 'System Status', 'Contact Us'].map((link) => (
                  <li key={link}>
                    <Link to="/" className="group text-gray-400 hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2 font-medium">
                      <FiArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      <span>{link}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                HQ <span className="w-8 h-px bg-cyan-500/50"></span>
              </h3>
              <address className="not-italic space-y-4 text-gray-400 font-medium">
                <p className="leading-relaxed">
                  101 Security Protocol<br />
                  Cyber District, CD 2048
                </p>
                <a href="mailto:secure@brigade.com" className="group flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 mt-4 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 w-fit">
                  <FiMail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>secure@brigade.com</span>
                </a>
              </address>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-500 font-medium">
            © {new Date().getFullYear()} Cyber Security Brigade. All systems secure.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
            <Link to="/" className="text-gray-500 hover:text-white transition-colors duration-300">Privacy Policy</Link>
            <Link to="/" className="text-gray-500 hover:text-white transition-colors duration-300">Terms of Service</Link>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Systems Operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;