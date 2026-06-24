import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { User, BookOpen, Zap, TrendingUp, Award, Clock, Mail, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const ProgressBar = ({ progress, className = "" }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 overflow-hidden ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      >
        <div className="h-full w-full bg-white/20 animate-pulse"></div>
      </div>
    </div>
  );
};

const StatsCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600", 
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600"
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        </div>
        <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[color]} rounded-2xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
};

const CourseCard = ({courseId, course, progress }) => {
    const navigate = useNavigate();
  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}/learning`);  
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "from-green-500 to-emerald-600";
    if (progress >= 50) return "from-blue-500 to-cyan-600";
    return "from-orange-500 to-red-500";
  };

  const getProgressText = (progress) => {
    if (progress >= 80) return "Excellent Progress!";
    if (progress >= 50) return "Good Progress";
    return "Just Getting Started";
  };

  return (
    <div onClick={() => handleCourseClick(courseId)} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
        </div>
        <div className="ml-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{getProgressText(progress)}</span>
          <span className="text-lg font-bold text-gray-900">{progress}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${getProgressColor(progress)} rounded-full transition-all duration-1000 ease-out relative`}
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const [strike, setStrike] = useState(0);
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state?.lms_auth.user);
  
  const [studentDetails, setStudentDetails] = useState({
    name: '',
    email: '',
    lastLogin: ''
  });

  const clearError = () => setError(null);

  const fetchAllData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      clearError();
      setLoading(true);
      
      const [profileRes, coursesRes] = await Promise.all([
        api.get(`/users/${user.id}`),
        api.get(`/students/enrollments/${user.id}`)
      ]);
      
      if (profileRes.data) {
        setStudentDetails({
          name: profileRes.data.name || '',
          email: profileRes.data.email || '',
          lastLogin: profileRes.data.lastLogin || '',
        });
        setStrike(profileRes.data.strike || 0);
      }
      
      const enrollments = coursesRes.data?.enrollments || [];
      setCourses(enrollments);
      
      const progressData = {};
      enrollments.forEach(enrollment => {
        if (enrollment?.courseId?._id && enrollment?.progress !== undefined) {
          progressData[enrollment.courseId._id] = enrollment.progress;
        }
      });
      setProgress(progressData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleRetry = () => {
    fetchAllData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const getAverageProgress = () => {
    if (courses.length === 0) return 0;
    const totalProgress = Object.values(progress).reduce((sum, prog) => sum + prog, 0);
    return Math.round(totalProgress / courses.length);
  };

  const getCompletedCourses = () => {
    return Object.values(progress).filter(prog => prog >= 100).length;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Required</h2>
          <p className="text-gray-600">Please log in to view your profile dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, {studentDetails.name || 'Student'}!</p>
            </div>
            {!loading && (
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading your dashboard...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        {!loading && !error && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                icon={BookOpen}
                title="Total Courses"
                value={courses.length}
                subtitle="Enrolled courses"
                color="blue"
              />
              <StatsCard
                icon={Award}
                title="Completed"
                value={getCompletedCourses()}
                subtitle="Courses finished"
                color="green"
              />
              <StatsCard
                icon={TrendingUp}
                title="Avg Progress"
                value={`${getAverageProgress()}%`}
                subtitle="Overall completion"
                color="purple"
              />
              <StatsCard
                icon={Zap}
                title="Strike Count"
                value={strike}
                subtitle="Current strikes"
                color="orange"
              />
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{studentDetails.name || 'Loading...'}</h2>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" />
                      {studentDetails.email || 'Loading...'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Last Login:</span>
                  <span>{formatDate(studentDetails.lastLogin)}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Overall Progress
                </h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">{getAverageProgress()}%</div>
                    <ProgressBar progress={getAverageProgress()} />
                  </div>
                  <div className="text-center text-gray-600 text-sm">
                    Keep up the great work!
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Your Coursessss
              </h2>
              
              {courses.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {courses.map((enrollment) => (
                    <CourseCard
                      courseId={enrollment.courseId?._id}
                      key={enrollment._id || enrollment.courseId?._id}
                      course={{
                        title: enrollment.courseId?.title || 'Course Title Not Available',
                        description: enrollment.courseId?.description || 'No description available'
                      }}
                      progress={progress[enrollment.courseId?._id] || 0}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Courses Yet</h3>
                  <p className="text-gray-600 mb-6">Start your learning journey by enrolling in your first course!</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                    Browse Courses
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;