import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Crosshair,
  Search,
  Clock,
  Zap,
  ArrowRight,
  Shield,
  Terminal,
  Activity,
  AlertTriangle,
  Lock,
  FileText,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  FolderLock,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';
import api from '../api';
import imgHeroBg from '../assets/Midnight Cyan Communications Nexus.png';

// Category icon & color styling helper
const getCategoryMeta = (category) => {
  switch (category) {
    case 'Threat Hunting':
      return {
        icon: Crosshair,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        glow: 'group-hover:border-cyan-500/60',
      };
    case 'Incident Response':
      return {
        icon: Shield,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        glow: 'group-hover:border-amber-500/60',
      };
    case 'Malware Analysis':
      return {
        icon: Terminal,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        glow: 'group-hover:border-purple-500/60',
      };
    case 'Network Forensics':
      return {
        icon: Activity,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        glow: 'group-hover:border-blue-500/60',
      };
    case 'Identity & Cloud':
      return {
        icon: Lock,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        glow: 'group-hover:border-emerald-500/60',
      };
    case 'Ransomware Defense':
      return {
        icon: AlertTriangle,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        glow: 'group-hover:border-rose-500/60',
      };
    default:
      return {
        icon: FileText,
        color: 'text-slate-400',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/30',
        glow: 'group-hover:border-slate-500/60',
      };
  }
};

const getDifficultyBadge = (difficulty) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
    case 'Intermediate':
      return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
    case 'Advanced':
      return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
    default:
      return 'bg-slate-500/15 text-slate-400 border border-slate-500/30';
  }
};

const CATEGORIES = [
  'All Categories',
  'Threat Hunting',
  'Incident Response',
  'Malware Analysis',
  'Network Forensics',
  'Identity & Cloud',
  'Ransomware Defense',
];

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const MissionsPage = () => {
  const user = useSelector((state) => state?.lms_auth?.user);
  const [missions, setMissions] = useState([]);
  const [userProgressMap, setUserProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'In Progress', 'Completed', 'Unstarted'

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch published missions
      const missionsRes = await api.get('/missions');
      const missionList = Array.isArray(missionsRes.data)
        ? missionsRes.data
        : (missionsRes.data?.data || missionsRes.data?.missions || []);
      setMissions(missionList);

      // 2. Fetch user progress if logged in
      const userId = user?._id || user?.id;
      if (userId) {
        try {
          const progressRes = await api.get('/missions/progress', {
            params: { userId },
          });
          const rawProgress = progressRes.data?.data || progressRes.data || {};
          if (Array.isArray(rawProgress)) {
            const mapping = {};
            rawProgress.forEach((p) => {
              const mId = typeof p.missionId === 'object' && p.missionId !== null ? p.missionId._id : p.missionId;
              mapping[mId] = p;
            });
            setUserProgressMap(mapping);
          } else if (typeof rawProgress === 'object') {
            setUserProgressMap(rawProgress);
          }
        } catch (progErr) {
          console.warn('Could not load user progress:', progErr);
        }
      }
    } catch (err) {
      console.error('Failed to load missions:', err);
      setError('Unable to load missions at this moment. Please check server connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?._id, user?.id]);

  // Telemetry Calculations
  const telemetry = useMemo(() => {
    const totalMissions = missions.length;
    const totalXp = missions.reduce((acc, m) => acc + (m.xpReward || 0), 0);
    let completedCount = 0;
    let earnedXp = 0;

    Object.values(userProgressMap).forEach((p) => {
      const isDone = p.status?.toLowerCase() === 'completed' || p.progress === 100;
      if (isDone) {
        completedCount += 1;
      }
      earnedXp += p.earnedXp || 0;
    });

    return { totalMissions, totalXp, completedCount, earnedXp };
  }, [missions, userProgressMap]);

  // Filtered Missions
  const filteredMissions = useMemo(() => {
    return missions.filter((m) => {
      // Category
      if (selectedCategory !== 'All Categories' && m.category !== selectedCategory) {
        return false;
      }
      // Difficulty
      if (selectedDifficulty !== 'All' && m.difficulty !== selectedDifficulty) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'All') {
        const prog = userProgressMap[m._id];
        const isDone = prog?.status?.toLowerCase() === 'completed' || prog?.progress === 100;
        const isInProg = !isDone && (prog?.status?.toLowerCase() === 'in_progress' || (prog?.progress || 0) > 0);
        if (statusFilter === 'Completed' && !isDone) return false;
        if (statusFilter === 'In Progress' && !isInProg) return false;
        if (statusFilter === 'Unstarted' && (isDone || isInProg)) return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title?.toLowerCase().includes(q);
        const matchCode = m.missionCode?.toLowerCase().includes(q);
        const matchDesc = m.shortDescription?.toLowerCase().includes(q);
        const matchMitre = m.mitreTechnique?.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchDesc && !matchMitre) return false;
      }
      return true;
    });
  }, [missions, selectedCategory, selectedDifficulty, statusFilter, searchQuery, userProgressMap]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Hero Section with Cyber HUD styling */}
      <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-24 overflow-hidden border-b border-cyan-500/10">
        {/* Background glow and image */}
        <div className="absolute inset-0 z-0">
          {imgHeroBg && (
            <img
              src={imgHeroBg}
              alt="SOC Nexus Background"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-screen pointer-events-none"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/70 via-[#020617]/90 to-[#020617]"></div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* Live Indicator */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wider uppercase mb-5 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Live Tactical Operations & SOC Investigations
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              Where Cybersecurity Defense <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                Becomes Tangible Reality.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl font-normal">
              Step into high-fidelity simulated enterprise breaches. Analyze raw SIEM logs, decrypt captured payloads, 
              pivot across compromised networks, and formulate real-world incident mitigation strategies.
            </p>

            {/* User Quick Stats Telemetry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              <div className="bg-[#0A1122]/80 backdrop-blur border border-white/10 rounded-xl p-3.5">
                <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                  Missions
                </div>
                <div className="text-xl font-bold text-white">{telemetry.totalMissions} Available</div>
              </div>

              <div className="bg-[#0A1122]/80 backdrop-blur border border-white/10 rounded-xl p-3.5">
                <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Total XP
                </div>
                <div className="text-xl font-bold text-amber-400">+{telemetry.totalXp} XP</div>
              </div>

              <div className="bg-[#0A1122]/80 backdrop-blur border border-white/10 rounded-xl p-3.5">
                <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Resolved
                </div>
                <div className="text-xl font-bold text-emerald-400">
                  {telemetry.completedCount} <span className="text-xs text-slate-400 font-normal">/ {telemetry.totalMissions}</span>
                </div>
              </div>

              <div className="bg-[#0A1122]/80 backdrop-blur border border-white/10 rounded-xl p-3.5">
                <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Earned XP
                </div>
                <div className="text-xl font-bold text-cyan-300">+{telemetry.earnedXp} XP</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog & Search Section */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Controls Bar: Search & Difficulty & Status */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 bg-[#0A1122]/90 border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search scenarios by title, code (MIS-001), MITRE technique, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#020617]/70 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Difficulty Tabs */}
            <div className="flex items-center gap-1.5 bg-[#020617]/70 p-1 rounded-xl border border-white/5 overflow-x-auto">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedDifficulty === diff
                      ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Status Filter (if logged in) */}
            {user && (
              <div className="flex items-center gap-1.5 bg-[#020617]/70 p-1 rounded-xl border border-white/5 overflow-x-auto">
                {['All', 'In Progress', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      statusFilter === st
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Horizontal Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all duration-200 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                      : 'bg-[#0A1122]/60 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <span>{cat}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                </button>
              );
            })}
          </div>

          {/* Mission Grid or State Indicators */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((sk) => (
                <div
                  key={sk}
                  className="bg-[#0A1122] border border-white/5 rounded-2xl p-6 h-80 animate-pulse flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-3 w-20 bg-white/5 rounded"></div>
                        <div className="h-4 w-44 bg-white/10 rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="h-3 bg-white/5 rounded w-full"></div>
                      <div className="h-3 bg-white/5 rounded w-5/6"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-white/5 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-[#0A1122]/60 border border-rose-500/20 rounded-2xl p-8">
              <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Failed to load tactical scenarios</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">{error}</p>
              <button
                onClick={fetchData}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-semibold text-sm hover:bg-rose-500/30 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Connection
              </button>
            </div>
          ) : filteredMissions.length === 0 ? (
            <div className="text-center py-20 bg-[#0A1122]/50 border border-white/5 rounded-2xl p-8">
              <Crosshair className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No Matching Missions Found</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                Try modifying your search criteria, switching categories, or resetting difficulty filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                  setSelectedDifficulty('All');
                  setStatusFilter('All');
                }}
                className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-sm text-white font-medium hover:bg-white/15 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredMissions.map((mission, index) => {
                  const meta = getCategoryMeta(mission.category);
                  const Icon = meta.icon;
                  const progressObj = userProgressMap[mission._id];
                  const isCompleted = progressObj?.status?.toLowerCase() === 'completed' || progressObj?.progress === 100;
                  const isInProgress = progressObj && !isCompleted && ((progressObj?.progress || 0) > 0 || progressObj?.status?.toLowerCase() === 'in_progress');
                  const progressPercent = progressObj?.progress || 0;
                  const completedTaskCount = progressObj?.completedTasks?.length || 0;
                  const totalTaskCount = mission.tasks?.length || 0;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      key={mission._id}
                      className="group bg-[#0A1122] border border-white/10 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden hover:shadow-[0_0_25px_rgba(6,182,212,0.12)] hover:bg-[#0C162C]"
                    >
                      {/* Top Corner Glow on hover */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 group-hover:bg-cyan-500/10 blur-2xl rounded-full transition-all duration-500 pointer-events-none"></div>

                      <div>
                        {/* Header Badge Row */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-xs font-bold tracking-wider text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-1 rounded-md">
                            {mission.missionCode || `MIS-${String(index + 1).padStart(3, '0')}`}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {mission.mitreTechnique && (
                              <span className="font-mono text-[11px] text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                                {mission.mitreTechnique}
                              </span>
                            )}
                            <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${getDifficultyBadge(mission.difficulty)}`}>
                              {mission.difficulty}
                            </span>
                          </div>
                        </div>

                        {/* Title and Icon */}
                        <div className="flex gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${meta.bg} ${meta.color} ${meta.border} transition-transform duration-300 group-hover:scale-105`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase block">
                              {mission.category}
                            </span>
                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                              {mission.title}
                            </h3>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5 line-clamp-3">
                          {mission.shortDescription || mission.incidentBriefing?.substring(0, 140) + '...'}
                        </p>

                        {/* Metadata Pills */}
                        <div className="grid grid-cols-3 gap-2 mb-5 py-3 border-y border-white/5 text-xs text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="font-medium text-slate-300">{mission.estimatedDuration || '45 mins'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span className="font-medium text-amber-300">+{mission.xpReward || 200} XP</span>
                          </div>
                          <div className="flex items-center gap-1.5 justify-end">
                            <Layers className="w-3.5 h-3.5 text-purple-400" />
                            <span className="font-medium text-slate-300">{totalTaskCount} Tasks</span>
                          </div>
                        </div>

                        {/* User Progress Bar (if available) */}
                        {user && progressPercent > 0 && (
                          <div className="mb-5">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="text-slate-400 font-medium">Investigation Progress</span>
                              <span className={`font-semibold ${isCompleted ? 'text-emerald-400' : 'text-cyan-400'}`}>
                                {isCompleted ? '100% Resolved' : `${completedTaskCount}/${totalTaskCount} Solved (${progressPercent}%)`}
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isCompleted ? 'bg-emerald-400' : 'bg-gradient-to-r from-cyan-500 to-teal-400'
                                }`}
                                style={{ width: `${progressPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Launch Button */}
                      <Link
                        to={`/missions/${mission._id}`}
                        className={`w-full py-3 px-4 rounded-xl flex items-center justify-between font-semibold text-sm transition-all duration-300 border ${
                          isCompleted
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                            : isInProgress
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-black hover:border-amber-500'
                            : 'bg-[#101A30] border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:text-black" />
                              Review Mission
                            </>
                          ) : isInProgress ? (
                            <>
                              <Crosshair className="w-4 h-4" />
                              Resume Investigation
                            </>
                          ) : (
                            <>
                              <Crosshair className="w-4 h-4" />
                              Start Investigation
                            </>
                          )}
                        </span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Briefing Footer Callout */}
      <section className="py-16 border-t border-white/5 bg-[#050B18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-cyan-950/40 via-[#0A1122] to-blue-950/40 border border-cyan-500/20 rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 block">
                [SOC WORKSTATION WORKFLOW]
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Designed for Future Threat Hunters & SOC Analysts
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Every mission replicates authentic incident handling conditions. Inspect system telemetry, correlate PCAPs,
                query mock SIEM indices, and formulate incident triage reports to prove your tactical skills.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="/learning-paths"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                Explore Learning Paths
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default MissionsPage;
