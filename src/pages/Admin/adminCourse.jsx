import React, { useEffect, useState } from "react";
import axios from "../../api";
import CreateCourseForm from "./CreateCoureseFrom";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  X, 
  SlidersHorizontal,
  FolderOpen 
} from "lucide-react";

const AdminCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/courses");
      setCourses(res.data);
    } catch {
      alert("Failed to load courses");
    }
  };

  const handleOpen = (course = null) => {
    setShowModal(true);
    if (course) {
      setEditMode(true);
      setCurrentCourse(course);
    } else {
      setEditMode(false);
      setCurrentCourse(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`/courses/${id}`);
      fetchCourses();
      alert("Course deleted successfully");
    } catch {
      alert("Failed to delete course");
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-cyan to-primary-blue">
            Course Management
          </h1>
          <p className="text-text-muted mt-1 text-sm font-medium">
            Define, structure, organize, and publish premium courses in the curriculum
          </p>
        </div>
        <button
          onClick={() => handleOpen()}
          className="bg-primary-cyan hover:bg-cyan-300 text-[#07121D] px-5 py-2.5 rounded-xl font-bold shadow-md shadow-primary-cyan/10 hover:shadow-lg hover:shadow-primary-cyan/20 active:scale-[0.98] transition-all duration-150 flex items-center text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Course
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="bg-surface rounded-2xl border border-white/10 shadow-sm p-4 sm:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses by title..."
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-background border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-primary-cyan transition-all duration-200 text-white placeholder-slate-500 font-medium"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-44 px-4 py-2.5 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-primary-cyan transition-all duration-200 font-semibold text-sm [&>option]:bg-surface"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Courses List Table */}
      <div className="bg-surface rounded-2xl border border-white/10 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
        <div className="px-6 py-4.5 bg-surface2 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-primary-cyan/10 text-primary-cyan rounded-lg">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white p-4">Curriculum Records</h2>
          </div>
          <span className="text-text-muted text-xs font-semibold">
            {filteredCourses.length} Records Found
          </span>
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-background border-b border-white/10">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Course Details</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Enrolled Pupils</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">List Price</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-surface">
              {filteredCourses.map((c) => (
                <tr key={c._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl bg-primary-cyan/10 border border-primary-cyan/20 text-primary-cyan flex items-center justify-center font-bold text-sm">
                        C
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{c.title}</div>
                        <div className="text-[10px] text-text-muted font-semibold tracking-wider uppercase">Active Course</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-300">
                    {c.category || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-300">
                    {c.students ?? 0} Students
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-lg border ${
                      c.status === "published"
                        ? "bg-success/10 text-success border-success/30"
                        : "bg-warning/10 text-warning border-warning/30"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                    ${c.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                    <button
                      onClick={() => handleOpen(c)}
                      className="inline-flex items-center text-slate-300 hover:text-white font-semibold transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-1.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="inline-flex items-center text-critical hover:text-red-400 font-semibold transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium">
                    No courses recorded matching the active filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="block lg:hidden divide-y divide-white/10">
          {filteredCourses.length > 0 ? filteredCourses.map((c) => (
            <div key={c._id} className="p-4 bg-surface hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-primary-cyan/10 border border-primary-cyan/20 text-primary-cyan flex items-center justify-center font-bold text-sm">
                  C
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{c.title}</div>
                  <div className="text-[10px] text-text-muted font-semibold tracking-wider uppercase">Active Course</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div className="flex flex-col">
                  <span className="text-xs text-text-muted font-semibold uppercase">Category</span>
                  <span className="font-medium text-slate-300">{c.category || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-text-muted font-semibold uppercase">Price</span>
                  <span className="font-bold text-white">${c.price}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-text-muted font-semibold uppercase">Enrolled</span>
                  <span className="font-semibold text-slate-300">{c.students ?? 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-text-muted font-semibold uppercase">Status</span>
                  <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-lg border w-max ${
                    c.status === "published"
                      ? "bg-success/10 text-success border-success/30"
                      : "bg-warning/10 text-warning border-warning/30"
                  }`}>
                    {c.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => handleOpen(c)}
                  className="inline-flex items-center text-slate-300 hover:text-white font-semibold transition-colors text-sm"
                >
                  <Edit3 className="w-4 h-4 mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="inline-flex items-center text-critical hover:text-red-400 font-semibold transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </button>
              </div>
            </div>
          )) : (
            <div className="px-6 py-12 text-center text-slate-400 font-medium">
              No courses recorded matching the active filters
            </div>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/90 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-surface rounded-3xl border border-white/10 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative p-6 sm:p-8 space-y-6 transition-transform duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-extrabold text-white pr-8">
              {editMode ? "Modify Course Profile" : "Create New Curriculum Course"}
            </h3>
            
            <CreateCourseForm
              initialValues={
                currentCourse || {
                  title: "",
                  category: "",
                  description: "",
                  price: "",
                  thumbnail: null,
                  status: "draft",
                  featured: false,
                  isNav: false,
                }
              }
              editMode={editMode}
              currentCourse={currentCourse}
              onClose={() => setShowModal(false)}
              onSuccess={() => {
                fetchCourses();
                setShowModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseManagement;
