import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, FileText } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen w-64 bg-gray-800 text-white shadow-lg flex-shrink-0 flex flex-col sticky top-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold flex items-center">
          <LayoutDashboard className="w-6 h-6 mr-2" />
          Admin Panel
        </h1>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-grow">
        <ul className="space-y-2">
          

          <li>
            <Link
              to="/admin/instructors"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin/instructors") ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              <Users className="w-5 h-5 mr-3" />
              Manage Users
            </Link>
          </li>

          <li>
            <Link
              to="/admin/courses"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin/courses") ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              <BookOpen className="w-5 h-5 mr-3" />
              Course Management
            </Link>
          </li>
<li>
            <Link
              to="/admin"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin") ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Manage Instructor
            </Link>
          </li>
          <li>
            <Link
              to="/admin/blogs"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin/blogs") ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              <FileText className="w-5 h-5 mr-3" />
              Blog Management
            </Link>
          </li>
          <li>
            <Link
              to="/admin/allstudents"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin/allstudents") ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              <FileText className="w-5 h-5 mr-3" />
              All Students
            </Link>
          </li>
          <li>
            <Link
              to="/admin/allinstructors"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin/allinstructors") ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              <FileText className="w-5 h-5 mr-3" />
              All Instructors
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
