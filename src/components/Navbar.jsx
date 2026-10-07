import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/log.png";
import api from "../api";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
  const [courses, setCourses] = useState([]);

  const dropdownRef = useRef(null);
  const location = useLocation();

  const user = useSelector((state) => state?.lms_auth.user);
  const roleIcons = {
    admin: { icon: "🛡️", color: "text-red-500", label: "Admin" },
    instructor: { icon: "🎓", color: "text-green-500", label: "Instructor" },
    student: { icon: "📘", color: "text-blue-500", label: "Student" },
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses/nav");
      const courses = res.data.map((course) => ({
        id: course._id,
        title: course.title,
        category: course.category,
        path: `/courses/${course._id}`,
      }));
      setCourses(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCoursesDropdownOpen(false);
      }
    }
    if (isCoursesDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCoursesDropdownOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsCoursesDropdownOpen(false);
  };

  const toggleCoursesDropdown = () => {
    setIsCoursesDropdownOpen(!isCoursesDropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleNavigate = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    switch (user.role) {
      case "admin":
        navigate("/admin");
        break;
      case "instructor":
        navigate("/InstructorDashboard");
        break;
      case "student":
        navigate("/profile");
        break;
      default:
        navigate("/login");
    }
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ to, children }) => {
    const active = isActive(to);
    return (
      <Link to={to} className="relative group px-4 py-2 flex items-center justify-center">
        {active && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full blur opacity-40"></div>
        )}
        <div className={`absolute inset-0 rounded-full transition-all duration-300 ${active ? 'bg-[#030712]/60 border border-cyan-500/50' : 'group-hover:bg-white/10'}`}></div>
        <span className={`relative z-10 font-semibold transition-colors duration-300 ${active ? 'text-primary-cyan drop-shadow-[0_0_8px_rgba(37,217,255,0.8)]' : 'text-gray-200 group-hover:text-white'}`}>
          {children}
        </span>
      </Link>
    );
  };

  return (
    <nav className="bg-transparent absolute w-full top-0 z-50 transition-all duration-300">
      <div className="w-full px-4 sm:px-8 lg:px-12 mt-2">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Title */}
          <div
            onClick={() => navigate("/")}
            className="group flex items-center space-x-3 cursor-pointer"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
              <motion.img
                layoutId="main-logo"
                src={logo}
                alt="Logo"
                className="relative h-12 w-12 object-cover"
              />
            </div>
            <div className="flex flex-col leading-none group-hover:text-cyan-300 transition-colors duration-300">
              <span className="text-lg md:text-xl font-black text-white tracking-tight">
                Cyber Security Brigade
              </span>

            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1 text-sm">

            <NavItem to="/courses">Academy</NavItem>
            <NavItem to="/missions">Missions</NavItem>
            <NavItem to="/learning-paths">Learning path</NavItem>
            <NavItem to="/certifications">Certifications</NavItem>
            <NavItem to="/about">About</NavItem>
            <NavItem to="/mentorship">Mentorship</NavItem>
            <NavItem to="/blog">Blog</NavItem>

          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 bg-[#0a0d18]/80 border border-white/10 backdrop-blur-md rounded-full pl-1 pr-4 py-1 shadow-lg hover:border-cyan-500/30 transition-all duration-300">
                <div onClick={handleNavigate} className="flex items-center gap-3 cursor-pointer group/profile">
                  {/* Avatar Container */}
                  <div className="relative h-10 w-10">
                    {/* Strike Badge */}
                    {user?.strike > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md border border-white">
                        {user?.strike}
                      </div>
                    )}
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 text-white font-semibold text-lg uppercase shadow-[0_0_15px_rgba(34,211,238,0.4)] border border-white/20 group-hover/profile:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all">
                      {user?.name?.charAt(0)}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-medium text-sm group-hover/profile:text-cyan-300 transition-colors">
                      {user?.name}
                    </span>
                    {user?.role && (
                      <span
                        className={`text-xs font-medium flex items-center space-x-1 ${roleIcons[user.role]?.color}`}
                      >
                        <span>{roleIcons[user.role]?.icon}</span>
                        <span>{roleIcons[user.role]?.label}</span>
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-sm rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 shadow-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="relative text-gray-200 hover:text-cyan-400 font-semibold transition-all duration-300 px-4 py-2 hover:-translate-y-1"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-cyan to-primary-blue text-background font-semibold px-6 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(37,217,255,0.4)] transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-cyan-400 focus:outline-none transition-colors duration-200"
            >
              {!isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a0d18]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-slideIn">
          <div className="px-4 py-4 space-y-1">
            <Link
              to="/"
              onClick={toggleMobileMenu}
              className={`block px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${isActive("/") ? 'bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
            >
              Home
            </Link>

            {/* Mobile Courses Dropdown */}
            <div className={`px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${isActive("/courses") ? 'bg-cyan-900/10 border border-cyan-500/10' : 'hover:bg-white/5'}`}>
              <button
                onClick={toggleCoursesDropdown}
                className={`w-full text-left flex justify-between items-center ${isActive("/courses") ? 'text-cyan-300' : 'text-gray-300'}`}
              >
                <span>Academy</span>
                <svg
                  className={`ml-1 h-4 w-4 transition-transform ${isCoursesDropdownOpen ? "rotate-180" : ""
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isCoursesDropdownOpen && (
                <div className="pl-4 mt-3 space-y-2 border-l-2 border-cyan-500/30 ml-2">
                  {courses.map((course) => (
                    <Link
                      key={course.id}
                      to={course.path}
                      onClick={toggleMobileMenu}
                      className="block text-gray-400 hover:text-cyan-300 py-2 transition-colors duration-200 text-sm font-medium"
                    >
                      {course.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/missions"
              onClick={toggleMobileMenu}
              className={`block px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${isActive("/missions") ? 'bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
            >
              Missions
            </Link>
            <Link
              to="/learning-paths"
              onClick={toggleMobileMenu}
              className={`block px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${isActive("/learning-paths") ? 'bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
            >
              Learning path
            </Link>
            <Link
              to="/certifications"
              onClick={toggleMobileMenu}
              className={`block px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${isActive("/certifications") ? 'bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
            >
              Certifications
            </Link>
            <Link
              to="/about"
              onClick={toggleMobileMenu}
              className={`block px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${isActive("/about") ? 'bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
            >
              About
            </Link>
            <Link
              to="/mentorship"
              onClick={toggleMobileMenu}
              className={`block px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${isActive("/mentorship") ? 'bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
            >
              Mentorship
            </Link>
            <Link
              to="/blog"
              onClick={toggleMobileMenu}
              className={`block px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${isActive("/blog") ? 'bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
            >
              Blog
            </Link>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-white/10 mt-2">
              {user ? (
                <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-10 w-10">
                      {user?.strike > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md border border-white">
                          {user?.strike}
                        </div>
                      )}
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 text-white font-semibold text-lg uppercase shadow-[0_0_15px_rgba(34,211,238,0.4)] border border-white/20">
                        {user?.name?.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold">{user.name}</div>
                      {user.role && (
                        <div
                          className={`text-xs font-medium flex items-center space-x-1 ${roleIcons[user.role]?.color}`}
                        >
                          <span>{roleIcons[user.role]?.icon}</span>
                          <span>{roleIcons[user.role]?.label}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 mt-3">
                  <Link
                    to="/login"
                    onClick={toggleMobileMenu}
                    className="text-center text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white font-semibold py-3 rounded-xl transition-all duration-200 border border-white/10"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMobileMenu}
                    className="text-center bg-gradient-to-r from-primary-cyan to-primary-blue text-background font-semibold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(37,217,255,0.4)] transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add these styles for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}} />
    </nav>
  );
};

export default Navbar;