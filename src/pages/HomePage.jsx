import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "react-icons/fi";
import logo from "../assets/lms.png";
import { useEffect, useState } from 'react';
import api from '../api';

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
      setCourses(response.data);
      // Filter featured courses
      const featured = response.data.filter(course => course.featured);
      setFeaturedCourses(featured);
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
    // Here you would typically send the data to your backend
    setIsModalOpen(false);
    // Reset form
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

  const features = [
    {
      name: "Industry-Vetted Curriculum",
      description:
        "Our syllabus is built and constantly refreshed by active cybersecurity practitioners to mirror the 2025 threat landscape.",
      icon: <FiLayers className="w-6 h-6 md:w-8 md:h-8" />,
    },
    {
      name: "Learn from Experts",
      description:
        "Engage directly with instructors in live online sessions. Get mentorship from professionals in the field.",
      icon: <FiCode className="w-6 h-6 md:w-8 md:h-8" />,
    },
    {
      name: "Hands-On Training",
      description:
        "Get practical with tools like Splunk, Wireshark, Metasploit, Nmap, and Burp Suite in our virtual labs.",
      icon: <FiTool className="w-6 h-6 md:w-8 md:h-8" />,
    },
    {
      name: "Career Support",
      description:
        "From mock interviews to resume optimization, we prepare you for the job market.",
      icon: <FiBriefcase className="w-6 h-6 md:w-8 md:h-8" />,
    },
    {
      name: "Real-World Projects",
      description:
        "Build a portfolio with projects that simulate actual security challenges.",
      icon: <FiShield className="w-6 h-6 md:w-8 md:h-8" />,
    },
    {
      name: "Affordable Education",
      description:
        "Premium content at accessible prices - we believe cybersecurity careers should be open to all.",
      icon: <FiDollarSign className="w-6 h-6 md:w-8 md:h-8" />,
    },
  ];

  const learnerTypes = [
    {
      title: "🏢 Corporate",
      description:
        "Empowering professionals to safeguard digital assets and lead secure transformations.",
      details:
        "Our corporate training equips teams with advanced cybersecurity skills, strategic threat response capabilities, and compliance know-how to protect organizations in an evolving threat landscape.",
      icon: <FiBriefcase className="w-6 h-6 md:w-8 md:h-8" />,
      bgColor: "from-indigo-600 to-blue-500",
    },
    {
      title: "🎓 College",
      description:
        "Preparing future cyber defenders with hands-on, career-ready training.",
      details:
        "We help college students build strong foundations in cybersecurity through immersive labs, gamified learning, and mentorship—bridging the gap between academia and industry.",
      icon: <FiBook className="w-6 h-6 md:w-8 md:h-8" />,
      bgColor: "from-purple-600 to-pink-500",
    },
    {
      title: "🏫 School",
      description:
        "Instilling cyber awareness and safe digital habits from an early age.",
      details:
        "Our school programs introduce young learners to online safety, ethical tech use, and basic coding—creating a generation of responsible digital citizens.",
      icon: <FiMonitor className="w-6 h-6 md:w-8 md:h-8" />,
      bgColor: "from-green-600 to-teal-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Pop-up Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden relative border border-gray-700"
          >
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 bg-gray-700/50 p-2 rounded-full"
            >
              <FiX className="w-5 h-5" />
            </button>
            
            <div className="p-6 overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Cyber Security Brigade</h2>
                <p className="text-cyan-400 font-medium mb-3">Learn and develop cyber skills with confidence</p>
                <div className="h-0.5 w-16 bg-cyan-500 mb-3"></div>
                <p className="text-gray-300 text-sm">The path to cyber security is broken. We're here to fix it. Learning should be everyone's possibility.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1 text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1 text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1 text-sm font-medium">Candidate's Profile</label>
                  <textarea
                    name="profile"
                    value={formData.profile}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm transition-all"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm font-medium">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm font-medium">Course Interested</label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm transition-all"
                    >
                      <option value="">Select a course</option>
                      {courses.map(course => (
                        <option key={course._id} value={course._id}>{course.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 mt-2 shadow-lg hover:shadow-cyan-500/20"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-cyan-900/20"></div>
          
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, x: Math.random() * 1000, opacity: 0 }}
              animate={{
                y: 1000,
                opacity: [0, 0.2, 0],
                transition: {
                  duration: 15 + Math.random() * 20,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                },
              }}
              className="absolute w-0.5 h-20 bg-cyan-400"
              style={{
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            {/* LEFT: Text Content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <div className="mb-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 leading-tight">
              Cyber Security Brigade
                </h1>
                <div className="h-1 w-24 bg-cyan-500 mt-4 mb-4 rounded-full"></div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-blue-200">
                  Learn, build, and develop cyber skills with confidence.
                </h2>
              </div>
              
              <p className="text-lg md:text-xl text-blue-100/90 mb-8 max-w-2xl">
                The path to cybersecurity is broken. We're here to fix it. 
              </p>
              <p className="text-lg md:text-xl text-blue-100/90 mb-8 max-w-2xl">
Your future is one click away.
              </p>
              
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openModal}
                  className="px-8 py-4 rounded-xl text-white bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 text-lg font-medium flex justify-center items-center"
                >
                  Join Now
                </motion.button>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/courses"
                    className="px-8 py-4 rounded-xl text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300 text-lg font-medium flex justify-center items-center"
                  >
                    Explore Courses
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* RIGHT: Logo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 flex justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20 blur-xl"></div>
                <img
                  src={logo}
                  alt="Logo"
                  className="h-64 w-64  relative"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-1.5 bg-cyan-500/10 rounded-full mb-4">
              <span className="text-cyan-400 font-medium text-sm">OUR PROGRAMS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Featured Cybersecurity Courses
            </h2>
            <p className="max-w-2xl text-lg md:text-xl text-gray-300 mx-auto">
              Jumpstart your career with our most sought-after training programs, 
              designed by industry experts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCourses.slice(0, 4).map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="relative overflow-hidden h-56">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-cyan-500/30 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <FiBook className="w-12 h-12 text-cyan-400" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-cyan-500/90 text-white text-sm font-medium rounded-full">
                      ${course.price}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{course.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="mb-5">
                    <span className="inline-block text-xs font-semibold text-cyan-400 bg-cyan-900/30 px-3 py-1.5 rounded-full uppercase tracking-wide">
                      {course.category}
                    </span>
                  </div>
                  
                  <Link
                    to={`/courses/${course._id}`}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300 flex justify-center items-center"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-14"
          >
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 border border-gray-700 text-lg font-medium rounded-lg text-white hover:bg-gray-800/50 transition-all duration-300"
            >
              View All Courses
              <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Who Benefits Section */}
      <div className="py-16 md:py-24 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-1.5 bg-cyan-500/10 rounded-full mb-4">
              <span className="text-cyan-400 font-medium text-sm">WHO BENEFITS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Tailored Learning for Every Stage
            </h2>
            <p className="max-w-2xl text-lg md:text-xl text-gray-300 mx-auto">
              Our programs are designed to meet the unique needs of learners at
              different stages of their cybersecurity journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {learnerTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${type.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                <div className="relative z-10">
                  <div className="flex items-center mb-5">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 text-cyan-400 group-hover:text-white group-hover:bg-cyan-500 transition-all duration-300 mr-4">
                      {type.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">{type.title}</h3>
                  </div>
                  <p className="text-cyan-200 mb-4 font-medium">{type.description}</p>
                  <p className="text-gray-300">{type.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-1.5 bg-cyan-500/10 rounded-full mb-4">
              <span className="text-cyan-400 font-medium text-sm">WHY CHOOSE US</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Your Direct Path into Cybersecurity
            </h2>
            <p className="max-w-2xl text-lg md:text-xl text-gray-300 mx-auto">
              We provide the practical skills and career support you need to
              land your first role and build a successful career.
            </p>
          </motion.div>

          <div className="mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 shadow-xl hover:shadow-cyan-500/10"
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.name}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-500/20"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="inline-block px-4 py-1.5 bg-cyan-500/10 rounded-full mb-6">
            <span className="text-cyan-400 font-medium text-sm">START YOUR JOURNEY</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to start your cybersecurity journey?
          </h2>
          
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Let's build your future, together. Join thousands of students who have transformed their careers with our training.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/Mentorship"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-lg text-cyan-600 bg-white hover:bg-blue-50 transition-all duration-300"
              >
                View Mentorship
                <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 transition-all duration-300"
              >
                Join Now
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;