import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { User, BookOpen, Zap, TrendingUp, Award, Clock, Mail, RefreshCw, AlertCircle, PlayCircle, Star, GraduationCap, ChevronRight, Flame, Shield, Terminal, Cpu } from 'lucide-react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const ProgressBar = ({ progress, className = "" }) => {
  return (
    <div className={`w-full bg-surface rounded-full h-3 overflow-hidden shadow-inner border border-white/5 ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-primary-cyan via-primary-blue to-indigo-600 rounded-full transition-all duration-1000 ease-out relative"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      >
        <div className="absolute top-0 inset-x-0 h-1/2 bg-white/20 rounded-full"></div>
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/40 blur-[2px] animate-pulse"></div>
      </div>
    </div>
  );
};

const CyberStatCard = ({ icon: Icon, title, value, subtitle, accent = "cyan" }) => {
  const accentConfig = {
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", glow: "shadow-cyan-500/20", icon: "text-cyan-300" },
    indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-400", glow: "shadow-indigo-500/20", icon: "text-indigo-300" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", glow: "shadow-violet-500/20", icon: "text-violet-300" },
  };
  const theme = accentConfig[accent];

  return (
    <div className="relative group bg-surface/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-${accent}-500`}></div>
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
          </div>
          <p className={`text-xs font-medium ${theme.text}`}>{subtitle}</p>
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${theme.bg} border ${theme.border} shadow-[0_0_15px_rgba(0,0,0,0)] group-hover:${theme.glow} transition-shadow duration-500`}>
          <Icon className={`w-6 h-6 ${theme.icon}`} />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-${accent}-500 to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out`}></div>
    </div>
  );
};

const CyberCourseCard = ({courseId, course, progress }) => {
  const navigate = useNavigate();
  
  return (
    <div onClick={() => navigate(`/courses/${courseId}/learning`)} className="group relative bg-surface/60 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-primary-cyan/50 cursor-pointer transition-all duration-500 overflow-hidden flex flex-col h-full hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
      
      {/* Top Accent Line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="p-6 relative z-10 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
            <Terminal className="w-3 h-3" />
            Module
          </div>
          {progress === 100 && (
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            </div>
          )}
        </div>

        <h3 className="text-xl font-black text-white leading-tight mb-3 group-hover:text-cyan-300 transition-colors line-clamp-2">{course.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-8 flex-1">{course.description}</p>
        
        <div className="mt-auto">
          <div className="flex items-end justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Initialization</span>
            <span className="text-lg font-black text-white">{progress}%</span>
          </div>
          <ProgressBar progress={progress} className="h-2" />
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state?.lms_auth.user);
  
  const [studentDetails, setStudentDetails] = useState({
    name: '',
    email: '',
    lastLogin: '',
    streak: 0
  });

  const fetchAllData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setError(null);
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
          streak: profileRes.data.streak || 0,
        });
      }
      const enrollments = coursesRes.data?.enrollments || [];
      setCourses(enrollments);
      
      const progressData = {};
      enrollments.forEach(e => {
        if (e?.courseId?._id && e?.progress !== undefined) {
          progressData[e.courseId._id] = e.progress;
        }
      });
      setProgress(progressData);
    } catch (err) {
      setError('System malfunction: Failed to fetch secure profile data.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const getAverageProgress = () => {
    if (courses.length === 0) return 0;
    const total = Object.values(progress).reduce((sum, p) => sum + p, 0);
    return Math.round(total / courses.length);
  };

  const getCompletedCourses = () => Object.values(progress).filter(p => p >= 100).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center max-w-md shadow-2xl">
          <Shield className="w-16 h-16 text-primary-cyan mx-auto mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
          <h2 className="text-2xl font-black text-white mb-3">Authentication Required</h2>
          <p className="text-text-muted mb-8 text-sm">You must establish a secure connection to access the terminal.</p>
          <Link to="/login" className="block w-full py-3 bg-primary-cyan hover:bg-cyan-400 text-background font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
            Initialize Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-main font-sans pb-24 selection:bg-primary-cyan/30 overflow-hidden relative">
      
      {/* Cyber Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Header Area */}
      <div className="relative pt-32 pb-8 z-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-8">
            <div className="flex items-center gap-5">
              <div className="relative group cursor-default">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-cyan to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative w-16 h-16 bg-surface border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Cpu className="w-8 h-8 text-primary-cyan" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  Command Center
                </h1>
                <p className="text-slate-400 mt-1 font-medium text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  System Online // Identity: <span className="text-cyan-400 font-bold">{studentDetails.name || 'Unknown'}</span>
                </p>
              </div>
            </div>
            
            {!loading && (
              <div className="flex items-center gap-4 bg-surface/50 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF5E00] to-[#FF9500] rounded-xl shadow-[0_0_15px_rgba(255,94,0,0.3)] border border-white/20">
                  <Flame className="w-4 h-4 text-yellow-200 animate-pulse" />
                  <div className="flex items-baseline gap-1">
                    <span className="text-white font-black text-base">{studentDetails.streak || 0}</span>
                    <span className="text-white/80 font-bold text-[10px] uppercase tracking-widest">Days</span>
                  </div>
                </div>
                <button
                  onClick={fetchAllData}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-cyan-400 rounded-xl transition-all duration-300 group"
                  title="Sync Data"
                >
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 z-10">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-r-2 border-indigo-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <Cpu className="absolute inset-0 m-auto w-6 h-6 text-slate-500 animate-pulse" />
            </div>
            <p className="text-cyan-500 font-black tracking-[0.2em] uppercase text-xs animate-pulse">Decrypting Profile Data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-center justify-between backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.15)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-xl text-red-400"><AlertCircle /></div>
              <p className="text-red-300 font-medium">{error}</p>
            </div>
            <button onClick={fetchAllData} className="px-6 py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              Retry Protocol
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Top Grid Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Identity Card */}
              <div className="lg:col-span-8 bg-surface/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -right-32 -top-32 w-96 h-96 bg-primary-cyan/5 rounded-full blur-3xl"></div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 relative z-10 mb-8">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary-cyan to-indigo-500 rounded-full blur-md opacity-50 group-hover:opacity-80 transition duration-500"></div>
                    <div className="w-28 h-28 bg-background border-2 border-white/20 rounded-full flex items-center justify-center relative z-10 shadow-inner overflow-hidden">
                      <User className="w-12 h-12 text-slate-500 group-hover:text-primary-cyan transition-colors duration-300" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-4xl font-black text-white tracking-tighter">{studentDetails.name || 'Anonymous'}</h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-2 px-3 py-1.5 bg-cyan-950/30 border border-cyan-500/20 text-cyan-300 text-xs font-bold rounded-lg shadow-sm">
                        <Mail className="w-3.5 h-3.5" /> {studentDetails.email || 'Classified'}
                      </span>
                      <span className="flex items-center gap-2 px-3 py-1.5 bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 text-xs font-bold rounded-lg shadow-sm">
                        <Shield className="w-3.5 h-3.5" /> Verified Operative
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500 relative z-10 border-t border-white/5 pt-6">
                  <Clock className="w-4 h-4 text-cyan-500/50" />
                  <span>Last Interface Sync: <span className="text-slate-300 ml-1">{studentDetails.lastLogin ? new Date(studentDetails.lastLogin).toLocaleDateString() : 'Never'}</span></span>
                </div>
              </div>

              {/* Mastery Card */}
              <div className="lg:col-span-4 bg-gradient-to-br from-surface to-slate-900 rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center text-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
                
                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Global Aptitude
                </h3>
                
                <div className="relative mb-8">
                  <div className="w-40 h-40 rounded-full border-8 border-slate-800 flex items-center justify-center relative z-10">
                    <div className="text-5xl font-black text-white">{getAverageProgress()}<span className="text-xl text-slate-500 ml-1">%</span></div>
                  </div>
                  {/* Decorative Progress Ring Glow */}
                  <svg className="absolute inset-0 w-40 h-40 -rotate-90 pointer-events-none drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                    <circle cx="80" cy="80" r="76" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-indigo-500" strokeDasharray="477.5" strokeDashoffset={477.5 - (477.5 * getAverageProgress()) / 100} style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }} />
                  </svg>
                </div>
                
                <p className="text-slate-400 text-xs font-medium max-w-[200px] leading-relaxed">
                  System analysis indicates consistent skill acquisition.
                </p>
              </div>

            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CyberStatCard icon={BookOpen} title="Active Modules" value={courses.length} subtitle="Currently enrolled" accent="cyan" />
              <CyberStatCard icon={Award} title="Certifications" value={getCompletedCourses()} subtitle="Modules mastered" accent="indigo" />
              <CyberStatCard icon={Zap} title="Current Tier" value="Novice" subtitle="Level 1 Operative" accent="violet" />
            </div>

            {/* Courses Matrix */}
            <div className="pt-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-primary-cyan rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
                  Active Matrix
                </h2>
                <Link to="/courses" className="group flex items-center gap-2 text-sm font-bold text-text-muted hover:text-primary-cyan transition-colors">
                  Explore Academy 
                  <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-cyan/20 transition-colors"><ChevronRight className="w-3 h-3" /></span>
                </Link>
              </div>

              {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courses.map((enrollment) => (
                    <CyberCourseCard
                      key={enrollment._id || enrollment.courseId?._id}
                      courseId={enrollment.courseId?._id}
                      course={{
                        title: enrollment.courseId?.title || 'Classified Data',
                        description: enrollment.courseId?.description || 'No public records found.'
                      }}
                      progress={progress[enrollment.courseId?._id] || 0}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-surface/40 border border-dashed border-white/20 rounded-3xl p-16 text-center backdrop-blur-sm">
                  <div className="w-20 h-20 bg-background border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner text-slate-500">
                    <Terminal className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">No Active Protocols</h3>
                  <p className="text-text-muted max-w-md mx-auto mb-8 text-sm leading-relaxed">
                    Your training matrix is currently empty. Access the Academy to inject new learning modules into your neural interface.
                  </p>
                  <Link to="/courses" className="inline-flex px-8 py-3.5 bg-white text-background rounded-xl font-black hover:bg-primary-cyan transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                    Initialize Training
                  </Link>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;