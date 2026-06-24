import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/lms.png";
import api from "../api";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
  const [courses, setCourses] = useState([]);

  const dropdownRef = useRef(null);

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

  return (
    <nav className="bg-gradient-to-r from-black to-indigo-500 shadow-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Title */}
          <div
            onClick={handleNavigate}
            className="flex items-center space-x-2 cursor-pointer transition-transform hover:scale-105"
          >
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-12 object-cover  border-white shadow-md"
            />
            <span className="text-2xl font-bold text-white">
            Cyber Security Brigade
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-100 hover:text-white font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-800"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-100 hover:text-white font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-800"
            >
              About
            </Link>

            {/* Courses Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleCoursesDropdown}
                className="text-gray-100 hover:text-white font-medium flex items-center px-3 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200"
              >
                Courses
                <svg
                  className={`ml-1 h-4 w-4 transition-transform ${
                    isCoursesDropdownOpen ? "rotate-180" : ""
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
                <div className="absolute z-10 mt-2 w-56 rounded-lg shadow-xl bg-white py-2 border border-gray-200 animate-fadeIn">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
                    AVAILABLE COURSES
                  </div>
                  {courses.map((course) => (
                    <Link
                      key={course.id}
                      to={course.path}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                      onClick={() => setIsCoursesDropdownOpen(false)}
                    >
                      <div className="font-medium">{course.title}</div>
                      <div className="text-xs text-gray-500">
                        {course.category}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/blog"
              className="text-gray-100 hover:text-white font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-800"
            >
              Blog
            </Link>
            <Link
              to="/mentorship"
              className="text-gray-100 hover:text-white font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-800"
            >
              Mentorship
            </Link>
            <Link
              to="/contact"
              className="text-gray-100 hover:text-white font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-800"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 bg-blue-800/50 rounded-full pl-1 pr-4 py-1 shadow-inner">
                <div className="flex items-center gap-3">
                  {/* Avatar Container */}
                  <div className="relative h-10 w-10">
                    {/* Strike Badge */}
                    {user?.strike > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md border border-white">
                        {user?.strike}
                      </div>
                    )}
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-white font-semibold text-lg uppercase shadow-lg border-2 border-white">
                      {user?.name?.charAt(0)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-medium text-sm">
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
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-1.5 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-colors duration-200 shadow-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-100 hover:text-white font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-blue-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2.5 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-800 focus:outline-none transition-colors duration-200"
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
        <div className="md:hidden bg-gradient-to-b from-blue-900 to-indigo-900 shadow-xl animate-slideIn">
          <div className="px-4 py-4 space-y-1">
            <Link
              to="/"
              onClick={toggleMobileMenu}
              className="block text-white hover:bg-blue-800 px-4 py-3 rounded-lg transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={toggleMobileMenu}
              className="block text-white hover:bg-blue-800 px-4 py-3 rounded-lg transition-colors duration-200"
            >
              About
            </Link>

            {/* Mobile Courses Dropdown */}
            <div className="px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200">
              <button
                onClick={toggleCoursesDropdown}
                className="w-full text-left text-white flex justify-between items-center"
              >
                <span>Courses</span>
                <svg
                  className={`ml-1 h-4 w-4 transition-transform ${
                    isCoursesDropdownOpen ? "rotate-180" : ""
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
                <div className="pl-4 mt-2 space-y-2 border-l-2 border-blue-700 ml-2">
                  {courses.map((course) => (
                    <Link
                      key={course.id}
                      to={course.path}
                      onClick={toggleMobileMenu}
                      className="block text-blue-200 hover:text-white py-2 transition-colors duration-200"
                    >
                      {course.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/blog"
              onClick={toggleMobileMenu}
              className="block text-white hover:bg-blue-800 px-4 py-3 rounded-lg transition-colors duration-200"
            >
              Blog
            </Link>
            <Link
              to="/mentorship"
              onClick={toggleMobileMenu}
              className="block text-white hover:bg-blue-800 px-4 py-3 rounded-lg transition-colors duration-200"
            >
              Mentorship
            </Link>
            <Link
              to="/contact"
              onClick={toggleMobileMenu}
              className="block text-white hover:bg-blue-800 px-4 py-3 rounded-lg transition-colors duration-200"
            >
              Contact
            </Link>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-blue-700 mt-2">
              {user ? (
                <div className="px-4 py-3 bg-blue-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-10 w-10">
                      {user?.strike > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md border border-white">
                          {user?.strike}
                        </div>
                      )}
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-white font-semibold text-lg uppercase shadow-lg border-2 border-white">
                        {user?.name?.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{user.name}</div>
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
                      className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-colors duration-200"
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
                    className="text-center text-white bg-blue-800 hover:bg-blue-700 py-3 rounded-lg transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMobileMenu}
                    className="text-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add these styles for animations */}
      <style jsx>{`
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
      `}</style>
    </nav>
  );
};

export default Navbar;
 