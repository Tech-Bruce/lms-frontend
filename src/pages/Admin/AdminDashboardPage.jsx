import React, { useEffect, useState } from 'react';
import axios from '../../api';
import { Link } from 'react-router-dom';
import AssignCourseForm from './AssignCourseFrom';
import { 
  Users, 
  BookOpen, 
  Activity, 
  Plus, 
  Edit3, 
  Trash2, 
  BookOpenCheck,
  UserPlus,
  X 
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', course: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [assignModel, setAssignModel] = useState(false);
  const [assignInstructorId, setAssignInstructorId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchInstructors = async () => {
    try {
      const res = await axios.get('/admin/instructors');
      setInstructors(res.data.instructors || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/courses'); 
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const createOrUpdateInstructor = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`/admin/update-instructor/${editId}`, form);
        alert('Instructor updated successfully');
      } else {
        await axios.post('/admin/create-instructor', form);
        alert('Instructor created successfully');
      }
      setForm({ name: '', email: '', password: '', course: '' });
      setEditMode(false);
      setEditId(null);
      fetchInstructors();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error occurred');
    }
  };

  const handleAssignCourse = async (instructorId) => {
    setAssignModel(true);
    setAssignInstructorId(instructorId);
  };

  const handleEdit = (instructor) => {
    setForm({ 
      name: instructor.name, 
      email: instructor.email, 
      password: '', 
      course: instructor.course 
    });
    setEditMode(true);
    setEditId(instructor._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this instructor?')) return;
    try {
      await axios.delete(`/admin/delete-instructor/${id}`);
      alert('Instructor deleted successfully');
      fetchInstructors();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error deleting instructor');
    }
  };

  useEffect(() => {
    fetchInstructors();
    fetchCourses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-cyan to-primary-blue">
            Instructor Command
          </h1>
          <p className="text-text-muted mt-1 text-sm font-medium">
            Register new instructors and coordinate their dynamic course curricula
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-primary-cyan/10 border border-primary-cyan/20 px-4 py-2 rounded-2xl shadow-sm text-primary-cyan font-semibold text-xs uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-primary-cyan animate-ping"></span>
          <span>System Portal</span>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface border border-white/10 shadow-sm rounded-2xl p-6 hover:shadow-md hover:border-primary-cyan/30 transition-all duration-200 flex items-center space-x-4">
          <div className="p-3.5 bg-primary-cyan/10 text-primary-cyan rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-muted uppercase tracking-wider">Total Instructors</p>
            <h3 className="text-2xl font-bold text-white">{instructors.length}</h3>
          </div>
        </div>

        <div className="bg-surface border border-white/10 shadow-sm rounded-2xl p-6 hover:shadow-md hover:border-primary-cyan/30 transition-all duration-200 flex items-center space-x-4">
          <div className="p-3.5 bg-primary-blue/10 text-primary-blue rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-muted uppercase tracking-wider">Curriculum Courses</p>
            <h3 className="text-2xl font-bold text-white">{courses.length}</h3>
          </div>
        </div>

        <div className="bg-surface border border-white/10 shadow-sm rounded-2xl p-6 hover:shadow-md hover:border-primary-cyan/30 transition-all duration-200 flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl animate-pulse">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-muted uppercase tracking-wider">Portal Mode</p>
            <h3 className="text-2xl font-bold text-white">Operational</h3>
          </div>
        </div>
      </div>

      {/* Create / Edit Form Card */}
      <div className="bg-surface rounded-2xl border border-white/10 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="px-6 py-4.5 bg-surface2 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-primary-cyan/10 text-primary-cyan rounded-lg">
              <UserPlus className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white p-4">
              {editMode ? 'Edit Instructor Profile' : 'Register New Instructor'}
            </h2>
          </div>
          {editMode && (
            <span className="bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/20 text-xs px-2.5 py-1 rounded-full font-semibold">
              Edit Mode Active
            </span>
          )}
        </div>
        
        <form onSubmit={createOrUpdateInstructor} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Full Name</label>
              <input 
                className="w-full px-4 py-2.5 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan transition-all duration-200 placeholder-slate-500" 
                name="name" 
                placeholder="e.g. John Doe" 
                value={form.name} 
                onChange={handleChange} 
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Email Address</label>
              <input 
                className="w-full px-4 py-2.5 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan transition-all duration-200 placeholder-slate-500" 
                name="email" 
                type="email"
                placeholder="instructor@domain.com" 
                value={form.email} 
                onChange={handleChange} 
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Security Password {editMode && <span className="text-slate-500 italic font-normal">(Leave blank to keep same)</span>}
              </label>
              <input 
                type="password"
                className="w-full px-4 py-2.5 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan transition-all duration-200 placeholder-slate-500" 
                name="password" 
                placeholder="••••••••" 
                value={form.password} 
                onChange={handleChange} 
                required={!editMode}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Course Track Assignment</label>
              <select
                className="w-full px-4 py-2.5 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan transition-all duration-200 [&>option]:bg-surface"
                name="course"
                value={form.course}
                onChange={handleChange}
                required
              >
                <option value="">Select an active course...</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title || course.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button 
              type="submit"
              className="bg-primary-cyan hover:bg-cyan-300 text-[#07121D] px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-primary-cyan/10 hover:shadow-lg hover:shadow-primary-cyan/20 active:scale-[0.98] transition-all duration-150 flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              {editMode ? 'Save Profile' : 'Register Instructor'}
            </button>
            
            {editMode && (
              <button 
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setEditId(null);
                  setForm({ name: '', email: '', password: '', course: '' });
                }}
                className="bg-white/5 hover:bg-white/10 text-slate-300 px-6 py-2.5 rounded-xl font-semibold active:scale-[0.98] transition-all duration-150 text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Instructors Table Card */}
      <div className="bg-surface rounded-2xl border border-white/10 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
        <div className="px-6 py-4.5 bg-surface2 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-primary-cyan/10 text-primary-cyan rounded-lg">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white p-4">Instructor Directory</h2>
          </div>
          <span className="text-text-muted text-xs font-semibold">
            {instructors.length} Profiles Found
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-background border-b border-white/10">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Instructor Details</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Course Assignment</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-surface">
              {instructors.length > 0 ? (
                instructors.map((ins) => {
                  const assignedCourse = courses.find(c => c._id === ins.course);
                  return (
                    <tr key={ins._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-xl bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/20 flex items-center justify-center font-bold text-sm">
                            {ins.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{ins.name}</div>
                            <div className="text-[10px] text-text-muted font-semibold tracking-wider uppercase">Instructor</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-300">
                        {ins.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-lg border ${
                          assignedCourse 
                            ? 'bg-success/10 text-success border-success/30' 
                            : 'bg-warning/10 text-warning border-warning/30'
                        }`}>
                          {assignedCourse ? assignedCourse.title || assignedCourse.name : 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                        <button 
                          onClick={() => handleAssignCourse(ins._id)}
                          className="inline-flex items-center text-primary-cyan hover:text-cyan-300 font-semibold transition-colors"
                        >
                          <BookOpenCheck className="w-4 h-4 mr-1.5" />
                          Assign
                        </button>
                        
                        <button 
                          onClick={() => handleEdit(ins)}
                          className="inline-flex items-center text-slate-300 hover:text-white font-semibold transition-colors"
                        >
                          <Edit3 className="w-4 h-4 mr-1.5" />
                          Edit
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(ins._id)}
                          className="inline-flex items-center text-critical hover:text-red-400 font-semibold transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">
                    No active instructors recorded. Create a new instructor file above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Course Modal */}
      {assignModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/90 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-surface rounded-2xl border border-white/10 shadow-xl max-w-md w-full overflow-hidden relative p-6 space-y-4 transition-transform duration-200">
            <button
              onClick={() => setAssignModel(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <AssignCourseForm
              instructor_id={assignInstructorId}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;