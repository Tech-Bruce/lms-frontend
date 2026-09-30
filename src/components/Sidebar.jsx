import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  UserCheck, 
  LogOut, 
  ShieldAlert,
  CalendarCheck,
  X
} from "lucide-react";

const Sidebar = ({ onClose }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Retrieve user name or fallback to Admin
  const adminName = "LMS Admin";
  const adminEmail = "admin@gesdemn.com";

  const menuItems = [
    {
      label: "Instructors Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "User Management",
      path: "/admin/instructors",
      icon: Users,
    },
    {
      label: "Course Management",
      path: "/admin/courses",
      icon: BookOpen,
    },
    {
      label: "Blog Management",
      path: "/admin/blogs",
      icon: FileText,
    },
    {
      label: "All Students",
      path: "/admin/allstudents",
      icon: GraduationCap,
    },
    {
      label: "All Instructors",
      path: "/admin/allinstructors",
      icon: UserCheck,
    },
    {
      label: "Mentorship Bookings",
      path: "/admin/bookings",
      icon: CalendarCheck,
    },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-slate-100 shadow-2xl flex-shrink-0 flex flex-col justify-between sticky top-0 border-r border-slate-800">
      {/* Upper Brand Section */}
      <div>
        {/* Header / Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" onClick={onClose} className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                Gesdemn LMS
              </span>
              <p className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">
                Control Hub
              </p>
            </div>
          </Link>
          <button 
            onClick={onClose} 
            className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Group Title */}
        <div className="px-6 pt-6 pb-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Main Management
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${active ? "scale-110" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Section */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
              A
            </div>
            <div className="overflow-hidden w-32">
              <h4 className="text-sm font-semibold truncate text-slate-200">{adminName}</h4>
              <p className="text-xs text-slate-500 truncate">{adminEmail}</p>
            </div>
          </div>
          <Link 
            to="/" 
            className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Exit Panel"
          >
            <LogOut className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Simple compass element helper for brand logo
const Compass = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

export default Sidebar;
