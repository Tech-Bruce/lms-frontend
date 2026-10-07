import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  FiArrowRight,
  FiShield,
  FiCode,
  FiLayers,
  FiBriefcase,
  FiTool,
  FiDollarSign,
  FiUsers,
  FiBook,
  FiMonitor,
  FiClock,
  FiBarChart2,
  FiX,
  FiLock,
  FiTerminal,
  FiCheckCircle,
} from "react-icons/fi";
import logo from "../assets/logo.png";
import { useEffect, useState, useRef } from 'react';
import api from '../api';
import { VIDEOS } from '../constants/videos';
import imgCinematic from "../assets/Cinematic .png";
import imgOrbital from "../assets/Orbital .png";
import imgLuminous from "../assets/Luminous .png";
import FeaturedCourses from '../components/FeaturedCourses';
import WhoBenefits from '../components/WhoBenefits';
import FeaturesSection from '../components/FeaturesSection';

const BackgroundSlider = () => {
  const images = [imgLuminous, imgCinematic];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {images.map((img, index) => (
        <motion.div
          key={img}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentIndex ? 1 : 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 w-full h-full"
        >
          <img src={img} alt="Cybersecurity Background" className="w-full h-full object-cover object-center" />
        </motion.div>
      ))}
    </>
  );
};
const CountUp = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profile: '',
    city: '',
    course: ''
  });

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      // Backend already returns sorted by newest first, but ensure we have the array
      setCourses(response.data);
      // Strictly show the 4 newest courses
      setFeaturedCourses(response.data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsModalOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      profile: '',
      city: '',
      course: ''
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);



  return (
    <div className="min-h-screen bg-background text-text-main overflow-hidden selection:bg-primary-cyan selection:text-background">
      {/* Pop-up Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-500/25 w-full max-w-lg max-h-[92vh] overflow-hidden relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 bg-gray-800 hover:bg-gray-700 p-2 rounded-full border border-gray-700"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8 overflow-y-auto max-h-[92vh] scrollbar-thin">
              <div className="mb-6 flex items-center space-x-3">
                <div className="p-2.5 bg-cyan-500/10 rounded-lg border border-cyan-500/30 text-cyan-400">
                  <FiLock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-wide text-white">Join the Brigade</h2>
                  <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">Cybersecurity Gateway Portal</p>
                </div>
              </div>

              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent mb-6"></div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1.5 text-xs font-semibold uppercase tracking-wider">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="John"
                      className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1.5 text-xs font-semibold uppercase tracking-wider">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Doe"
                      className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1.5 text-xs font-semibold uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1.5 text-xs font-semibold uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1.5 text-xs font-semibold uppercase tracking-wider">Brief Professional Bio / Background</label>
                  <textarea
                    name="profile"
                    value={formData.profile}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Tell us about your background or cyber security interests..."
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white text-sm transition-all"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1.5 text-xs font-semibold uppercase tracking-wider">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="New York"
                      className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1.5 text-xs font-semibold uppercase tracking-wider">Program / Course</label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white text-sm transition-all"
                    >
                      <option value="">Select a path</option>
                      {courses.map(course => (
                        <option key={course._id} value={course._id}>{course.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 mt-2 shadow-lg shadow-cyan-500/20 uppercase tracking-widest text-xs"
                >
                  Request Access Badge
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center pt-28 md:pt-32 pb-16 border-b border-gray-900/80">
        {/* Animated Cyber Grid */}
        <div className="absolute inset-0 z-0">
          {/* Looping Background Images */}
          <BackgroundSlider />
          {/* Dark overlay so text remains readable */}
          <div className="absolute inset-0 bg-gray-950/50"></div>

          {/* Cyber Grid background removed as per request */}
          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -50, x: Math.random() * 1200, opacity: 0 }}
              animate={{
                y: 1000,
                opacity: [0, 0.4, 0],
                transition: {
                  duration: 10 + Math.random() * 12,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                },
              }}
              className="absolute w-0.5 h-12 bg-gradient-to-b from-cyan-400 to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col">
            {/* Text Content */}
            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col text-left space-y-6 lg:space-y-8 lg:max-w-3xl mt-12 md:mt-0"
            >
              <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 text-cyan-400 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2 w-max mx-0 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                <FiShield className="w-4 h-4 text-cyan-400" />
                <span>The Path to a Secure Future</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                Every alert tells a story <br className="hidden md:inline" />
                <span className="text-cyan-500">
                  Learn to investigate it.
                </span>
              </h1>

              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-300 max-w-2xl mx-0 leading-relaxed">
                Build practical cybersecurity skills through realistic investigations, hands-on missions.
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-0 leading-relaxed">
                Guided learning designed for modern defenders
              </p>

              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 justify-start pt-6 md:pt-8 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openModal}
                  className="px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl text-background bg-gradient-to-r from-primary-cyan to-primary-blue hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/20 transition-all text-sm sm:text-base font-bold tracking-wide w-full sm:w-auto text-center"
                >
                  Start Learning
                </motion.button>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/courses"
                    className="px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl text-primary-cyan border border-primary-cyan/30 bg-primary-cyan/5 hover:bg-primary-cyan/10 hover:border-primary-cyan transition-all text-sm sm:text-base font-bold tracking-wide flex justify-center items-center h-full w-full"
                  >
                    Explore Missions
                  </Link>
                </motion.div>
              </div>
              
            </motion.div>
            
          </div>
          {/* Stats Dashboard Banner */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 lg:mt-16 relative z-10 py-8 bg-gray-900/40 border border-gray-800/80 backdrop-blur-md rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.05)] overflow-hidden w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center px-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                  <CountUp end={10} suffix="k+" />
                </p>
                <p className="text-gray-400 text-xs md:text-sm uppercase tracking-widest mt-2 font-semibold">Students Trained</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                  <CountUp end={95} suffix="%" />
                </p>
                <p className="text-gray-400 text-xs md:text-sm uppercase tracking-widest mt-2 font-semibold">Success Rate</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                  <CountUp end={150} suffix="+" />
                </p>
                <p className="text-gray-400 text-xs md:text-sm uppercase tracking-widest mt-2 font-semibold">Virtual Sandboxes</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">24/7</p>
                <p className="text-gray-400 text-xs md:text-sm uppercase tracking-widest mt-2 font-semibold">Security Mentor Support</p>
              </div>
            </div>
          </motion.div>

          {/* Workflow/Methodology Section */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex flex-wrap justify-center gap-4 md:gap-6 z-10 relative w-full"
          >
            {[
              { label: 'Learn', icon: FiBook },
              { label: 'Investigate', icon: FiMonitor },
              { label: 'Detect', icon: FiShield },
              { label: 'Respond', icon: FiTerminal },
            ].map((step, idx) => (
              <div key={idx} className="flex items-center space-x-3 bg-gray-900/60 border border-cyan-500/20 backdrop-blur-md px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300">
                <step.icon className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-200 font-bold tracking-wider uppercase text-xs sm:text-sm">{step.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      

      {/* Featured Courses Section */}
      <FeaturedCourses courses={courses} />

      {/* Who Benefits Section */}
      <WhoBenefits />

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <div className="relative py-24 md:py-32 border-t border-white/5 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[400px] bg-primary-cyan/5 blur-[120px] rounded-full"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTAgMGgyNHYyNEgwWiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjEiIGN5PSIxIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] opacity-50"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-surface/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-16 text-center overflow-hidden shadow-2xl"
          >
            {/* Inner Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-cyan/20 blur-[60px] rounded-full"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary-blue/20 blur-[60px] rounded-full"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-cyan-400 font-semibold text-xs uppercase tracking-widest">Mission Control</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">secure</span> your future?
              </h2>

              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
                Gain immediate hands-on defense capabilities. Join the next operational class cohort of cybersecurity experts.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openModal}
                  className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-2xl text-background bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] flex items-center justify-center gap-2"
                >
                  <FiLock className="w-5 h-5" />
                  Access Secure Gateway
                </motion.button>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/Mentorship"
                    className="flex items-center justify-center gap-2 px-8 py-4 border border-white/10 text-base font-bold rounded-2xl text-white bg-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all w-full"
                  >
                    Mentorship Support
                    <FiArrowRight className="w-5 h-5 text-cyan-400" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;