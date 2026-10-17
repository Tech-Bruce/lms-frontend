import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import {
  Network,
  Shield,
  Server,
  Share2,
  Terminal,
  Lock,
  Users,
  Cpu,
  Database,
  Layers,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Clock,
} from "lucide-react";

const iconMap = {
  Network: Network,
  Shield: Shield,
  Server: Server,
  Share2: Share2,
  Terminal: Terminal,
  Lock: Lock,
  Users: Users,
  Cpu: Cpu,
  Database: Database,
  Layers: Layers,
};

const getIcon = (iconName) => {
  const Icon = iconMap[iconName] || Network;
  return <Icon className="w-6 h-6" />;
};

const ModulesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("all");

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await api.get("/curriculum/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const tracks = Array.from(new Set(courses.map((c) => c.track).filter(Boolean)));

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack = selectedTrack === "all" || c.track === selectedTrack;
    return matchesSearch && matchesTrack;
  });

  return (
    <div className="min-h-screen bg-[#030712] text-text-main pt-28 pb-20 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-primary-cyan/10 via-primary-blue/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-300">All Modules</span>
        </div>

        {/* Hero Section (Matching Image 1: Explore All Modules) */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
            Explore All Modules
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <p className="text-slate-400 text-base sm:text-lg">
              Browse every module across all learning tracks.
            </p>
            <span className="bg-primary-blue/20 text-primary-cyan border border-primary-cyan/30 text-xs font-bold px-3 py-1 rounded-full">
              {courses.length} modules
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-3xl mx-auto bg-[#0A1122] border border-white/10 rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-center gap-3 shadow-xl">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search all modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="bg-[#050B16] border border-white/10 text-xs text-slate-300 font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-primary-cyan w-full sm:w-auto"
            >
              <option value="all">All Tracks</option>
              {tracks.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <button
              onClick={() => {}}
              className="bg-primary-blue hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex-shrink-0"
            >
              Search
            </button>
          </div>
        </div>

        {/* Modules Grid (Matching Image 1) */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-primary-cyan/30 border-t-primary-cyan rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Loading learning modules...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((c) => {
              const roomsCount = c.totalRooms || 0;
              return (
                <div
                  key={c._id}
                  className="bg-[#0A1122] border border-white/10 hover:border-primary-cyan/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 group hover:shadow-2xl hover:shadow-primary-cyan/5 relative overflow-hidden"
                >
                  <div>
                    {/* Icon + Track */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-cyan/20 to-primary-blue/20 border border-primary-cyan/30 text-primary-cyan flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                        {getIcon(c.icon)}
                      </div>

                      <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-white/5 border border-white/10 text-slate-300">
                        {c.track || "Module"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-primary-cyan transition-colors">
                      {c.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                      {c.description}
                    </p>
                  </div>

                  {/* Footer & Progress (Exact Image 1 layout) */}
                  <div className="pt-4 border-t border-white/10 space-y-3.5">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                      <span>0/{roomsCount} rooms · 0%</span>
                      <span className="text-primary-cyan font-bold">{c.level}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary-cyan h-full rounded-full w-0" />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center text-xs font-bold text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        <BookOpen className="w-3.5 h-3.5 mr-1.5 text-primary-cyan" />
                        {roomsCount} rooms
                      </div>

                      <button
                        onClick={() => navigate(`/modules/${c._id}`)}
                        className="bg-primary-blue hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center group-hover:translate-x-0.5"
                      >
                        Explore
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredCourses.length === 0 && !loading && (
          <div className="text-center py-20 bg-[#0A1122] rounded-3xl border border-white/10 p-8 space-y-3">
            <h3 className="text-lg font-bold text-white">No modules found</h3>
            <p className="text-sm text-slate-400">
              Try adjusting your search criteria or explore other tracks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModulesPage;
