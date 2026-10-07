import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiShield, FiAward, FiMonitor, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../api';
import imgHeroBg from '../assets/Orbital .png';

const CertificationsPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-text-main font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            src={imgHeroBg} 
            alt="Certifications Background" 
            className="absolute inset-0 w-full object-cover object-center opacity-40 mix-blend-screen" 
          />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div> */}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <span className="text-cyan-400 font-bold tracking-widest text-sm uppercase mb-4 block">
              CERTIFICATIONS
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Prove <span className="text-white">what you can do.</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl mb-8">
              Practical certifications designed around real-world skills and scenarios used by defensive security teams.
            </p>
            
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <FiMonitor className="text-cyan-400 text-lg" />
                <span>Hands-on assessments</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <FiShield className="text-cyan-400 text-lg" />
                <span>Real-world scenarios</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <FiAward className="text-cyan-400 text-lg" />
                <span>Verifiable credentials</span>
              </div>
            </div>
          </div>
          
            {/* Visual placeholder for the 3D shield seen in the mockup */}
          {/* <div className="hidden lg:block">
            <div className="w-64 h-80 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
              <FiShield className="text-[180px] text-cyan-400/80 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)] relative z-10" />
            </div>
          </div> */}
        </div>
      </section>

      {/* Controls Section Removed */}

      {/* Certifications List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No certifications currently available.
            </div>
          ) : (
            <div className="space-y-6">
              {courses.map((course, index) => {
                // Determine a nice badge color based on index
                const colors = ['border-orange-300/50 text-orange-200', 'border-purple-400/50 text-purple-300', 'border-yellow-400/50 text-yellow-300', 'border-blue-400/50 text-blue-300'];
                const badgeStyle = colors[index % colors.length];
                
                // Generic checkmark features if course doesn't have any
                const features = course.features?.length > 0 
                  ? course.features.slice(0, 4) 
                  : ['Alert triage', 'Log investigation', 'Threat intelligence', 'Incident documentation'];

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    key={course._id}
                    className="group relative bg-[#050B14]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(34,211,238,0.1)] transition-all duration-500 overflow-hidden"
                  >
                    
                    {/* Subtle Hover Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    
                    {/* Top Section for Mobile (Title + Thumbnail) / Left Badge for Desktop */}
                    <div className="flex flex-row lg:flex-col items-start gap-4 lg:gap-0 z-10">
                      {/* Badge Icon - Adjusting for both mobile & desktop */}
                      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-32 relative items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        {/* Glow Behind Badge */}
                        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden lg:block"></div>
                        
                        <div className="absolute inset-0 bg-white/5 rounded-xl lg:border border-white/10 transform lg:rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
                        <div className={`absolute inset-0 bg-[#050B14] rounded-xl border-2 ${badgeStyle} flex items-center justify-center overflow-hidden shadow-xl lg:shadow-2xl`}>
                          {course.thumbnail ? (
                            <>
                              <img
                                src={course.thumbnail.startsWith('http') ? course.thumbnail : `${import.meta.env.VITE_API_UPLOAD_URL || 'http://localhost:8000/uploads'}/course/${course.thumbnail}`}
                                alt={course.title}
                                className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            </>
                          ) : (
                            <span className="font-bold text-xs sm:text-sm lg:text-xl leading-tight text-center px-1">
                              CB<br/>CERT
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info - Mobile Layout Title (Visible alongside badge on small screens) */}
                      <div className="flex-1 lg:hidden">
                        <h2 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2">
                          {course.title}
                        </h2>
                        <p className="text-cyan-400 font-bold tracking-wide text-[10px] sm:text-xs uppercase opacity-90 line-clamp-1">
                          {course.category}
                        </p>
                      </div>
                    </div>

                    {/* Desktop Info & Shared Description */}
                    <div className="flex-1 z-10 flex flex-col justify-center">
                      <div className="hidden lg:block">
                        <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300">
                          {course.title}
                        </h2>
                        <p className="text-cyan-400 font-bold tracking-wide text-xs uppercase mb-3 opacity-90">
                          {course.category}
                        </p>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed max-w-2xl group-hover:text-gray-300 transition-colors duration-300 line-clamp-3 lg:line-clamp-none">
                        {course.description || "Demonstrate your ability to triage, investigate, and analyze security events using real-world tools and scenarios."}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="flex-shrink-0 w-full lg:w-48 z-10">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                        {features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                            <FiCheck className="text-cyan-400 mt-0.5 flex-shrink-0 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                            <span className="leading-tight line-clamp-1 lg:line-clamp-2">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Area */}
                    <div className="flex-shrink-0 w-full lg:w-48 flex flex-col gap-4 z-10 mt-2 lg:mt-0 pt-4 lg:pt-0 border-t border-white/5 lg:border-none">
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <div>
                          <span className="block text-gray-500 mb-0.5">Level:</span>
                          <span className="font-semibold text-gray-300">{course.level || 'Foundation'}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500 mb-0.5">Assessment:</span>
                          <span className="font-semibold text-gray-300">Practical</span>
                        </div>
                      </div>
                      
                      <Link
                        to={`/courses/${course._id}`}
                        className="w-full bg-cyan-950/40 border border-cyan-500/50 text-cyan-400 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:text-white hover:border-transparent font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                      >
                        <span>View Certification</span>
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CertificationsPage;
