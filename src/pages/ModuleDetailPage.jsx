import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  Star,
  ChevronRight,
  ArrowRight,
  Clock,
  BookOpen,
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
  Cable: Network,
};

const getIcon = (iconName) => {
  const Icon = iconMap[iconName] || Network;
  return <Icon className="w-6 h-6" />;
};

const ModuleDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/curriculum/courses/${courseId}`);
      setCourse(res.data);
      setChapters(res.data.chapters || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredChapters = chapters.filter(
    (ch) =>
      ch.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-2 border-primary-cyan/30 border-t-primary-cyan rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center pt-20 text-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Module Not Found</h2>
          <Link to="/modules-page" className="text-primary-cyan hover:underline text-sm font-semibold">
            &larr; Back to All Modules
          </Link>
        </div>
      </div>
    );
  }

  const totalRooms = chapters.length;

  return (
    <div className="min-h-screen bg-[#030712] text-text-main pt-28 pb-24 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-primary-blue/10 via-primary-cyan/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Breadcrumbs (Exact Image 2) */}
        <div className="flex flex-wrap items-center space-x-2 text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/modules-page" className="hover:text-white transition-colors">
            Modules
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-400">{course.track}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary-cyan font-semibold">{course.title}</span>
        </div>

        {/* Hero Section Header (Exact Image 2) */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
            {course.title}
          </h1>

          <div className="flex items-center justify-center space-x-2">
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {course.description}
            </p>
            <span className="bg-primary-blue/20 text-primary-cyan border border-primary-cyan/30 text-xs font-bold px-3 py-1 rounded-full flex-shrink-0">
              {totalRooms} rooms
            </span>
          </div>

          {/* Module Progress Bar (Exact Image 2) */}
          <div className="max-w-xl mx-auto pt-2 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>0 / {totalRooms} rooms completed</span>
              <span>0%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
              <div className="bg-primary-cyan h-full rounded-full w-0 transition-all duration-500" />
            </div>
          </div>
        </div>

        {/* Search Rooms Input (Exact Image 2) */}
        <div className="max-w-2xl mx-auto bg-[#0A1122] border border-white/10 rounded-2xl p-2 sm:p-2.5 flex items-center justify-between shadow-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => {}}
            className="bg-primary-blue hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex-shrink-0"
          >
            Search
          </button>
        </div>

        {/* Chapters / Rooms Grid (Exact Image 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((ch, idx) => (
            <div
              key={ch._id}
              className="bg-[#0A1122] border border-white/10 hover:border-primary-cyan/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 group hover:shadow-2xl hover:shadow-primary-cyan/5 relative overflow-hidden"
            >
              <div>
                {/* Header Icon + Room Title */}
                <div className="flex items-start space-x-3.5 mb-4">
                  <div className="w-13 h-13 p-3.5 rounded-2xl bg-gradient-to-br from-primary-blue/30 to-purple-600/30 border border-primary-blue/40 text-primary-cyan flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                    {getIcon(ch.icon)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary-cyan transition-colors">
                      {ch.title}
                    </h3>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {ch.roomNumber}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                  {ch.description}
                </p>
              </div>

              {/* Progress & Bottom Actions */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                {(() => {
                  const saved = localStorage.getItem(`room_completed_${ch._id}`);
                  let completedCount = 0;
                  if (saved) {
                    try {
                      completedCount = Object.keys(JSON.parse(saved)).length;
                    } catch (e) {}
                  }
                  const total = ch.tasks?.length || ch.totalTasks || 0;
                  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
                  return (
                    <>
                      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                        <span className="text-primary-cyan">{pct}% complete</span>
                        <span>{total} Tasks</span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-primary-cyan h-full rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </>
                  );
                })()}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center text-xs font-bold text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <Star className="w-3.5 h-3.5 mr-1.5 text-amber-400 fill-amber-400" />
                    {ch.xp || 100} XP
                  </div>

                  <button
                    onClick={() => navigate(`/rooms/${course._id}/${ch._id}`)}
                    className="bg-primary-blue hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center group-hover:translate-x-0.5"
                  >
                    Enter Room
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredChapters.length === 0 && (
            <div className="col-span-full text-center py-16 bg-[#0A1122] rounded-3xl border border-white/10 p-8 space-y-3">
              <h3 className="text-base font-bold text-white">No rooms recorded</h3>
              <p className="text-xs text-slate-400">
                No rooms match the search query.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailPage;
