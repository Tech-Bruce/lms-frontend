import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Blog from './pages/Blog';
import Mentorship from './pages/Mentorship';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';

import Adminblog from './pages/Admin/adminblog'

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



function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/mentorship" element={<Mentorship />} />

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
            </Route>


            
          </Routes>
        </main>

        <Footer />
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
