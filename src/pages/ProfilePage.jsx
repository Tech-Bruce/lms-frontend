import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  User,
  BookOpen,
  ShieldCheck,
  Flame,
  Zap,
  ArrowRight,
  Clock,
  Terminal,
  AlertCircle,
  RefreshCw,
  Star,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  LogOut,
  KeyRound,
  Check,
  Lock,
  Mail,
  Calendar,
  ExternalLink,
  Layers,
  GraduationCap
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import missionBg from "../assets/Midnight Cyan Communications Nexus.png";

const ProgressBar = ({ progress = 0, className = "" }) => {
  const safeProgress = Math.min(100, Math.max(0, Number(progress) || 0));
  return (
    <div className={`w-full bg-[#080d1a] rounded-full h-2.5 overflow-hidden border border-white/5 ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-700 ease-out relative shadow-[0_0_10px_rgba(6,182,212,0.6)]"
        style={{ width: `${safeProgress}%` }}
      >
        <div className="absolute top-0 inset-x-0 h-1/2 bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
};

const CyberCourseCard = ({ courseId, course, progress = 0, enrolledAt, completed }) => {
  const navigate = useNavigate();
  const safeProgress = Number(progress) || 0;
  
  return (
    <div 
      onClick={() => navigate(`/courses/${courseId}/learning`)} 
      className="group relative bg-[#091022]/90 backdrop-blur-xl rounded-2xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all duration-300 overflow-hidden flex flex-col h-full hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]"
    >
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="p-6 relative z-10 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
            <Terminal className="w-3 h-3" />
            {course?.category || "Course"}
          </div>
          {(completed || safeProgress >= 100) ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
              <Star className="w-3 h-3 fill-emerald-400" />
              <span>Completed</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold">
              <span>In Progress</span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-white leading-snug mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
          {course?.title || "Untitled Course"}
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-6 flex-1">
          {course?.description || "No description provided."}
        </p>
        
        <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {enrolledAt ? `Enrolled ${new Date(enrolledAt).toLocaleDateString()}` : 'Progress'}
            </span>
            <span className="text-xs font-black text-cyan-400 font-mono">{safeProgress}%</span>
          </div>
          <ProgressBar progress={safeProgress} className="h-2" />
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [allAvailableCourses, setAllAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Profile active tab
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const user = useSelector((state) => state?.lms_auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Student details from API
  const [studentDetails, setStudentDetails] = useState({
    name: '',
    email: '',
    role: 'student',
    streak: 0,
    strike: 0,
    lastLogin: '',
    createdAt: ''
  });

  // Account edit form
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password update form
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Fetch real data from Backend
  const fetchAllData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setError(null);
      setLoading(true);

      const [profileRes, enrollmentsRes, coursesRes] = await Promise.allSettled([
        api.get(`/users/${user.id}`),
        api.get(`/students/enrollments/${user.id}`),
        api.get('/courses')
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
        const u = profileRes.value.data;
        setStudentDetails({
          name: u.name || '',
          email: u.email || '',
          role: u.role || 'student',
          streak: u.streak || 0,
          strike: u.strike || 0,
          lastLogin: u.lastLogin || '',
          createdAt: u.createdAt || ''
        });
        setNameInput(u.name || '');
        setEmailInput(u.email || '');
      }

      if (enrollmentsRes.status === 'fulfilled' && enrollmentsRes.value?.data) {
        const userEnrollments = enrollmentsRes.value.data.enrollments || [];
        setEnrollments(userEnrollments);
      }

      if (coursesRes.status === 'fulfilled' && coursesRes.value?.data) {
        const catalog = Array.isArray(coursesRes.value.data) ? coursesRes.value.data : [];
        setAllAvailableCourses(catalog);
      }

    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Failed to load profile data from server.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Update profile details in backend
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      setIsSavingProfile(true);
      const res = await api.put(`/users/${user.id}`, {
        name: nameInput,
        email: emailInput
      });
      if (res.data) {
        setStudentDetails(prev => ({
          ...prev,
          name: nameInput,
          email: emailInput
        }));
        toast.success('Profile details saved successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile. Email might already be taken.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Change password in backend
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!passwordForm.newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setIsUpdatingPassword(true);
      await api.put(`/users/${user.id}`, {
        password: passwordForm.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to change password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = studentDetails.name || user?.name || 'Student';
  const firstName = displayName.split(' ')[0] || 'Student';
  const streakCount = Math.max(1, Number(studentDetails.streak || studentDetails.strike || user?.streak || user?.strike || 1));
  
  // Real calculations from enrollments
  const completedCourses = enrollments.filter(e => e.completed || (e.progress || 0) >= 100);
  const inProgressCourses = enrollments.filter(e => !e.completed && (e.progress || 0) < 100);
  
  const averageProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, curr) => acc + (Number(curr.progress) || 0), 0) / enrollments.length)
    : 0;

  // Active in-progress course
  const activeEnrollment = inProgressCourses[0] || enrollments[0] || null;
  const activeCourse = activeEnrollment?.courseId || null;
  const activeProgress = activeEnrollment ? (Number(activeEnrollment.progress) || 0) : 0;

  // Dynamic Recommended course: Pick from courses the user hasn't enrolled in
  const enrolledCourseIdSet = new Set(enrollments.map(e => e.courseId?._id));
  const recommendedCourse = allAvailableCourses.find(c => !enrolledCourseIdSet.has(c._id)) || allAvailableCourses[0] || null;

  // Real dynamic activities derived from user enrollments and login
  const dynamicActivities = [];
  
  // 1. Enrollment events
  enrollments.forEach(e => {
    if (e.courseId) {
      dynamicActivities.push({
        id: `enroll-${e._id}`,
        title: `Enrolled in "${e.courseId.title}"`,
        subtitle: `${e.courseId.category || 'Course'} • ${e.progress || 0}% completed`,
        date: e.enrolledAt ? new Date(e.enrolledAt) : new Date(),
        icon: BookOpen,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30'
      });
      if (e.completed || (e.progress || 0) >= 100) {
        dynamicActivities.push({
          id: `complete-${e._id}`,
          title: `Completed "${e.courseId.title}"`,
          subtitle: `100% Mastered`,
          date: e.enrolledAt ? new Date(e.enrolledAt) : new Date(),
          icon: Star,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30'
        });
      }
    }
  });

  // 2. Authentication event
  if (studentDetails.lastLogin) {
    dynamicActivities.push({
      id: 'last-login',
      title: 'Authenticated into Learning Portal',
      subtitle: `System session verified`,
      date: new Date(studentDetails.lastLogin),
      icon: ShieldCheck,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30'
    });
  }

  // Sort activities by date descending
  dynamicActivities.sort((a, b) => b.date - a.date);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6">
        <div className="bg-[#0b1329]/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 text-center max-w-md shadow-2xl">
          <Terminal className="w-16 h-16 text-cyan-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
          <h2 className="text-2xl font-black text-white mb-3">Authentication Required</h2>
          <p className="text-slate-400 mb-8 text-sm">Please sign in to access your profile and enrolled courses.</p>
          <Link 
            to="/login" 
            className="block w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-[#030712] font-black rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-cyan-500/30 flex flex-col pt-20">
      
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[5%] left-[10%] w-[35%] h-[35%] rounded-full bg-cyan-900/10 blur-[130px]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[140px]"></div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1700px] w-full mx-auto relative z-10">

        {/* Mobile Backdrop Overlay */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/75 backdrop-blur-sm z-40 transition-opacity"
          />
        )}

        {/* Mobile Sidebar Header */}
        <div className="lg:hidden sticky top-16 z-20 w-full flex items-center justify-between px-4 py-3.5 border-b border-slate-800 bg-[#060b18]/95 backdrop-blur-md shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(6,182,212,0.4)] shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm text-white block leading-tight truncate">{displayName}</span>
              <span className="text-[11px] text-cyan-400 font-semibold capitalize">
                {activeTab === 'overview' ? 'Overview' : activeTab === 'courses' ? 'Enrolled Courses' : activeTab === 'account' ? 'Account Details' : 'Security'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)] shrink-0"
          >
            {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>Tabs</span>
          </button>
        </div>

        {/* Profile Sidebar (Dedicated Profile & Account Navigation) */}
        <aside
          className={`
            fixed lg:sticky top-0 lg:top-20 z-50 lg:z-10
            h-full lg:h-[calc(100vh-5rem)] w-72 lg:w-72 shrink-0
            bg-[#060b18] lg:bg-[#060b18]/85 backdrop-blur-xl
            border-r border-slate-800/80 shadow-2xl lg:shadow-none
            flex flex-col justify-between
            p-5 overflow-y-auto scrollbar-thin
            transition-transform duration-300 ease-in-out
            ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="space-y-6">

            {/* Mobile Sidebar Close Button */}
            <div className="lg:hidden flex items-center justify-between pb-3 border-b border-slate-800/80">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Profile Menu</span>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* User Profile Mini Badge */}
            <div className="p-4 rounded-2xl bg-[#091022] border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.08)]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-white/20">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#091022] rounded-full"></span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-bold text-white truncate leading-tight">{displayName}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider">
                      {studentDetails.role}
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-500/20 border border-orange-500/40 text-orange-300 shadow-[0_0_8px_rgba(249,115,22,0.3)]">
                      <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                      {streakCount}d Streak
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 truncate mt-0.5">
                    {studentDetails.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
                PROFILE ACCOUNT
              </p>

              {/* 1. Overview */}
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === 'overview'
                    ? "bg-[#0b1b36] border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>Overview</span>
              </button>

              {/* 2. My Enrolled Courses */}
              <button
                onClick={() => {
                  setActiveTab('courses');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === 'courses'
                    ? "bg-[#0b1b36] border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>My Enrolled Courses</span>
                </div>
                {enrollments.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[10px] text-cyan-400 font-mono">
                    {enrollments.length}
                  </span>
                )}
              </button>

              {/* 3. Account Details */}
              <button
                onClick={() => {
                  setActiveTab('account');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === 'account'
                    ? "bg-[#0b1b36] border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>Account Information</span>
              </button>

              {/* 4. Security & Password */}
              <button
                onClick={() => {
                  setActiveTab('security');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === 'security'
                    ? "bg-[#0b1b36] border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Security & Password</span>
              </button>
            </div>

          </div>

          {/* Sidebar Footer with Academy Link & Logout */}
          <div className="pt-4 border-t border-slate-800/80 mt-6 space-y-2">
            <Link
              to="/courses"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-cyan-400 hover:bg-slate-800/30 transition-colors"
            >
              <span>Explore Academy</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 bg-red-500/5 hover:bg-red-500/15 border border-red-500/20 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Profile Content Area */}
        <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-8 overflow-x-hidden">

          {/* ======================================================== */}
          {/* TAB 1: OVERVIEW (Dynamic Tactical Dashboard)             */}
          {/* ======================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8 sm:space-y-10">
              
              {/* Top Greeting & Dynamic Stats Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>{getGreeting()}, {firstName}</span>
                    <span className="inline-block animate-bounce">👋</span>
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Your real learning trajectory and enrolled course progress.
                  </p>
                </div>

                {/* Real Streak & Enrollment Badges */}
                <div className="grid grid-cols-1 sm:flex sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
                  {/* Daily Streak - High Visibility Fiery Highlight Card */}
                  <div className="relative group/streak cursor-pointer w-full sm:w-auto">
                    {/* Animated outer aura glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 rounded-2xl blur-md opacity-70 group-hover/streak:opacity-100 group-hover/streak:blur-lg transition-all duration-500 animate-pulse"></div>

                    {/* Main card body */}
                    <div className="relative flex items-center justify-between sm:justify-start gap-3.5 bg-gradient-to-br from-[#1f0f04] via-[#140a03] to-[#0a0502] border-2 border-orange-500/90 hover:border-amber-400 px-4 sm:px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(249,115,22,0.45)] hover:shadow-[0_0_35px_rgba(251,146,60,0.7)] transition-all duration-300">
                      {/* Burning Flame Icon Badge */}
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_18px_rgba(249,115,22,0.85)] border border-amber-200/50">
                          <Flame className="w-6 h-6 text-white fill-amber-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-bounce" />
                        </div>
                      </div>

                      {/* Numbers and Labels */}
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(251,146,60,0.9)] leading-none">
                            {streakCount}
                          </span>
                          <span className="text-xs font-black text-amber-300 uppercase tracking-widest font-mono">
                            {streakCount === 1 ? 'DAY' : 'DAYS'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]">
                            Day Streak
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-500/30 border border-orange-400/60 text-orange-200 shadow-[0_0_8px_rgba(249,115,22,0.5)]">
                            🔥 ACTIVE
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Courses Count Badge */}
                  <div className="relative flex items-center justify-between sm:justify-start gap-3.5 bg-gradient-to-br from-[#071324] via-[#091022] to-[#050b18] border-2 border-cyan-500/50 hover:border-cyan-400 px-4 sm:px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.45)] transition-all duration-300 w-full sm:w-auto">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)] border border-cyan-200/40 flex-shrink-0">
                      <Zap className="w-6 h-6 text-white fill-cyan-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] leading-none">
                          {enrollments.length}
                        </span>
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
                          ACTIVE
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mt-1">
                        Enrolled Courses
                      </span>
                    </div>
                  </div>

                  {/* Sync Button */}
                  <button
                    onClick={fetchAllData}
                    disabled={loading}
                    className="p-3 bg-[#0a1124] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 rounded-2xl transition-all group flex items-center justify-center w-full sm:w-auto"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center justify-between backdrop-blur-md">
                  <div className="flex items-center gap-3 text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                  <button onClick={fetchAllData} className="text-xs bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-red-400 transition-colors">
                    Retry
                  </button>
                </div>
              )}

              {/* 2x2 Core Dynamic Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* CARD 1: Continue Your Course / Active Mission */}
                <div className="relative group bg-[#091022]/90 backdrop-blur-xl rounded-2xl border border-slate-800/90 hover:border-cyan-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 sm:p-7 min-h-[300px] shadow-2xl">
                  
                  {/* Backdrop */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={missionBg}
                      alt="Mission Backdrop"
                      className="w-full h-full object-cover object-center opacity-30 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091022] via-[#091022]/85 to-[#091022]/40"></div>
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-bold text-sm tracking-wide">
                        Continue Your Mission
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold tracking-wider uppercase">
                        {activeCourse?.category || "Current Course"}
                      </span>
                    </div>

                    <div className="pt-2">
                      <h2 className="text-2xl font-black text-white tracking-tight leading-tight group-hover:text-cyan-200 transition-colors line-clamp-2">
                        {activeCourse ? activeCourse.title : "No Course in Progress"}
                      </h2>
                      <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {activeCourse ? activeCourse.description : "Enroll in an academy course to start tracking your dynamic progress."}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 pt-6 space-y-4">
                    {activeCourse ? (
                      <>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-300">
                              {activeProgress}% Complete
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {activeProgress === 100 ? "Finished" : "In Progress"}
                            </span>
                          </div>
                          <ProgressBar progress={activeProgress} className="h-2.5" />
                        </div>

                        <div>
                          <button
                            onClick={() => navigate(`/courses/${activeCourse._id}/learning`)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#030712] font-black text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all"
                          >
                            <span>Continue Learning</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div>
                        <Link
                          to="/courses"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#030712] font-black text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                        >
                          <span>Browse Academy Courses</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* CARD 2: Dynamic Learning Progress by Enrolled Course */}
                <div className="bg-[#091022]/90 backdrop-blur-xl rounded-2xl border border-slate-800/90 p-6 sm:p-7 flex flex-col justify-between shadow-2xl">
                  <div>
                    <h3 className="text-white font-bold text-base mb-4 flex items-center justify-between">
                      <span>Your Course Progress</span>
                      <span className="text-xs font-normal text-slate-500">
                        Avg: {averageProgress}%
                      </span>
                    </h3>

                    {enrollments.length > 0 ? (
                      <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
                        {enrollments.map((e) => (
                          <div key={e._id} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-300 font-medium truncate max-w-[200px] sm:max-w-xs">
                                {e.courseId?.title || "Untitled Course"}
                              </span>
                              <span className="text-cyan-400 font-mono font-bold">
                                {e.progress || 0}%
                              </span>
                            </div>
                            <ProgressBar progress={e.progress || 0} className="h-2" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center space-y-2">
                        <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="text-xs text-slate-400">No courses enrolled yet.</p>
                        <p className="text-[11px] text-slate-500">Your enrolled modules and percentages will populate here dynamically.</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Total Enrolled: <strong className="text-white">{enrollments.length}</strong></span>
                    <span>Completed: <strong className="text-emerald-400">{completedCourses.length}</strong></span>
                    <span>In Progress: <strong className="text-cyan-400">{inProgressCourses.length}</strong></span>
                  </div>
                </div>

                {/* CARD 3: Dynamic Recommended Course */}
                <div className="bg-[#091022]/90 backdrop-blur-xl rounded-2xl border border-slate-800/90 p-6 sm:p-7 flex flex-col justify-between shadow-2xl">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-cyan-400 font-bold text-sm tracking-wide">
                        Recommended Next Course
                      </h3>
                      {recommendedCourse && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[10px] text-cyan-400 font-mono">
                          {recommendedCourse.category || "Academy"}
                        </span>
                      )}
                    </div>

                    {recommendedCourse ? (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] shrink-0">
                          <GraduationCap className="w-6 h-6 text-amber-400" />
                        </div>
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <h4 className="text-lg font-bold text-white leading-tight truncate">
                            {recommendedCourse.title}
                          </h4>
                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                            {recommendedCourse.description}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">All available courses enrolled!</p>
                    )}
                  </div>

                  <div className="pt-6">
                    {recommendedCourse ? (
                      <Link
                        to={`/courses/${recommendedCourse._id}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#030712] font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                      >
                        <span>View Course Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <Link
                        to="/courses"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#030712] font-black text-xs transition-all"
                      >
                        <span>Browse Catalog</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* CARD 4: Real Dynamic Recent Activity */}
                <div className="bg-[#091022]/90 backdrop-blur-xl rounded-2xl border border-slate-800/90 p-6 sm:p-7 flex flex-col justify-between shadow-2xl">
                  <div>
                    <h3 className="text-cyan-400 font-bold text-sm tracking-wide mb-4">
                      Recent Account Activity
                    </h3>

                    {dynamicActivities.length > 0 ? (
                      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                        {dynamicActivities.slice(0, 4).map((act) => (
                          <div
                            key={act.id}
                            className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 h-8 rounded-lg ${act.bg} border ${act.border} flex items-center justify-center shrink-0`}>
                                <act.icon className={`w-4 h-4 ${act.color}`} />
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate block">
                                  {act.title}
                                </span>
                                <span className="text-[10px] text-slate-500 truncate block">
                                  {act.subtitle}
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono shrink-0 ml-3">
                              {act.date.toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center space-y-1">
                        <Clock className="w-7 h-7 text-slate-600 mx-auto mb-2" />
                        <p className="text-xs text-slate-400">No account activity yet.</p>
                        <p className="text-[10px] text-slate-500">Activities will be logged dynamically when you enroll and study.</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <span>Member since: {studentDetails.createdAt ? new Date(studentDetails.createdAt).toLocaleDateString() : 'Active'}</span>
                  </div>
                </div>

              </div>

              {/* Bottom Enrolled Courses Quick Matrix */}
              <div className="pt-8 border-t border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
                      <span className="w-2 h-5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                      My Enrolled Courses ({enrollments.length})
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Direct access to all your assigned curricula</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="group flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors self-start sm:self-auto"
                  >
                    <span>View All Enrolled Courses</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {enrollments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {enrollments.slice(0, 3).map((enrollment) => (
                      <CyberCourseCard
                        key={enrollment._id}
                        courseId={enrollment.courseId?._id}
                        course={enrollment.courseId}
                        progress={enrollment.progress}
                        enrolledAt={enrollment.enrolledAt}
                        completed={enrollment.completed}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#091022]/50 border border-dashed border-slate-800 rounded-2xl p-8 text-center">
                    <Terminal className="w-9 h-9 text-slate-600 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-white mb-1">No Active Enrollments</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                      You are not enrolled in any courses yet. Explore the academy to start learning.
                    </p>
                    <Link
                      to="/courses"
                      className="inline-flex px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#030712] font-black text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
                    >
                      Browse Academy
                    </Link>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: MY ENROLLED COURSES                               */}
          {/* ======================================================== */}
          {activeTab === 'courses' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <span>My Enrolled Courses</span>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
                      {enrollments.length} Active
                    </span>
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">
                    All courses you have registered for, including lesson syllabus and progress.
                  </p>
                </div>

                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#030712] font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all self-start sm:self-auto"
                >
                  <span>Browse More Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {enrollments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {enrollments.map((enrollment) => (
                    <CyberCourseCard
                      key={enrollment._id}
                      courseId={enrollment.courseId?._id}
                      course={enrollment.courseId}
                      progress={enrollment.progress}
                      enrolledAt={enrollment.enrolledAt}
                      completed={enrollment.completed}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-[#091022] border border-dashed border-slate-800 rounded-3xl p-8 sm:p-16 text-center">
                  <Terminal className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">No Course Enrollments Found</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                    You have not enrolled in any training courses yet. Select a course from the catalog to begin.
                  </p>
                  <Link
                    to="/courses"
                    className="inline-flex px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#030712] font-black text-sm rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                  >
                    View Academy Catalog
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: ACCOUNT & PERSONAL DETAILS                        */}
          {/* ======================================================== */}
          {activeTab === 'account' && (
            <div className="space-y-8 max-w-3xl">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Account Details
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Manage your real profile information and registered account credentials.
                </p>
              </div>

              {/* Profile Card Header */}
              <div className="bg-[#091022] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-black text-3xl shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-white/20">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h2 className="text-2xl font-bold text-white">{displayName}</h2>
                  <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">{studentDetails.role}</p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-2">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      {studentDetails.email || 'No email registered'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      Joined: {studentDetails.createdAt ? new Date(studentDetails.createdAt).toLocaleDateString() : 'Active'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Last login: {studentDetails.lastLogin ? new Date(studentDetails.lastLogin).toLocaleDateString() : 'Today'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Real Edit Details Form connected to Backend API */}
              <form onSubmit={handleProfileUpdate} className="bg-[#091022] border border-slate-800 rounded-2xl p-4 sm:p-8 space-y-6 shadow-xl">
                <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
                  Edit Personal Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      required
                      placeholder="Your full name"
                      className="w-full px-4 py-2.5 bg-[#050914] border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-2.5 bg-[#050914] border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Account Role
                    </label>
                    <input
                      type="text"
                      value={studentDetails.role}
                      disabled
                      className="w-full px-4 py-2.5 bg-[#050914]/60 border border-slate-800/60 rounded-xl text-slate-500 text-sm cursor-not-allowed capitalize"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Account role is managed by the system administrator.</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#030712] font-black text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                  >
                    {isSavingProfile ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: SECURITY & PASSWORD                               */}
          {/* ======================================================== */}
          {activeTab === 'security' && (
            <div className="space-y-8 max-w-3xl">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Security & Password
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Manage your login password and review your account security status.
                </p>
              </div>

              {/* Real Security Posture Status */}
              <div className="bg-[#091022] border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Account Security Status</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active Account
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                  <div>
                    <span className="text-slate-500 block">Password Encryption</span>
                    <span className="text-white font-bold">Bcrypt Hashed</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Last Login Timestamp</span>
                    <span className="text-white font-bold">
                      {studentDetails.lastLogin ? new Date(studentDetails.lastLogin).toLocaleString() : 'Currently Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Change Password Form (Direct to PUT /users/:id) */}
              <form onSubmit={handlePasswordUpdate} className="bg-[#091022] border border-slate-800 rounded-2xl p-4 sm:p-8 space-y-6 shadow-xl">
                <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  <span>Change Password</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password (min. 6 characters)"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 bg-[#050914] border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Repeat new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 bg-[#050914] border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#030712] font-black text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                  >
                    {isUpdatingPassword ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Save New Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};

export default ProfilePage;