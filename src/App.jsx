import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Blog from './pages/Blog';
import Mentorship from './pages/Mentorship';
import MissionsPage from './pages/MissionsPage';
import LearningPathsPage from './pages/LearningPathsPage';
import CertificationsPage from './pages/CertificationsPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';

import Adminblog from './pages/Admin/adminblog';
import AdminBookings from './pages/Admin/AdminBookings';

import ProfilePage from './pages/ProfilePage';
import InstructorDashboard from './pages/InstructorDashboard';

import InstructorDetails from './pages/InstructorDetails';
import AdminLayout from './Layout/AdminLayout';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import Builder from './pages/CourseBuilder/Builder';
import ModuleList from './pages/CourseBuilder/ModuleList';
import LessionLIst from './pages/CourseBuilder/LessionLIst';
import LessonFormPage from './pages/CourseBuilder/LessonFormPage';
import AdminCourseManagement from './pages/Admin/adminCourse';
import Learning from './pages/student/Learning';
import MentorDashboard from './pages/Instructor/MentorshipDashboard';
import AllStudents from './pages/Admin/AllStudents';
import Allinstructors from './pages/Admin/Allinstructors';



function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/learning-paths" element={<LearningPathsPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Courses */}
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/courses/module/builder/:courseId" element={<ModuleList />} />
          <Route path="/lession/:moduleId/builder" element={<LessionLIst />} />
          <Route path="/modules/:moduleId/lessons/create" element={<LessonFormPage />} />
          <Route path="/modules/:moduleId/lessons/:lessonId/edit" element={<LessonFormPage />} />
          <Route path="/courses/:courseId/learning" element={<Learning />} />
          {/* Profile / Instructor */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/InstructorDashboard" element={<InstructorDashboard />} />
          <Route path="/MentorDashboard" element={<MentorDashboard />} />

          {/* Admin Layout with Sidebar */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="instructors" element={<InstructorDetails />} />
            <Route path="courses" element={<AdminCourseManagement />} />
            <Route path="blogs" element={<Adminblog />} />
            <Route path="allstudents" element={<AllStudents />} />
            <Route path="allinstructors" element={<Allinstructors />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>


          
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show splash screen for 2.5 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading ? (
        <SplashScreen key="splash" />
      ) : (
        <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-h-screen">
          <Router>
            <ScrollToTop />
            <AppContent />
            <ToastContainer />
          </Router>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
