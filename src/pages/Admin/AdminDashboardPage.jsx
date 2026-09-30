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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200/80 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-950">
            Instructor Command
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Register new instructors and coordinate their dynamic course curricula
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-50/60 border border-indigo-100/50 px-4 py-2 rounded-2xl shadow-sm text-indigo-700 font-semibold text-xs uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
          <span>System Portal</span>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 hover:shadow-md transition-all duration-200 flex items-center space-x-4">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Instructors</p>
            <h3 className="text-2xl font-bold text-slate-800">{instructors.length}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 hover:shadow-md transition-all duration-200 flex items-center space-x-4">
          <div className="p-3.5 bg-violet-50 text-violet-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Curriculum Courses</p>
            <h3 className="text-2xl font-bold text-slate-800">{courses.length}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 hover:shadow-md transition-all duration-200 flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl animate-pulse">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Portal Mode</p>
            <h3 className="text-2xl font-bold text-slate-800">Operational</h3>
          </div>
        </div>
      </div>

      {/* Create / Edit Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <UserPlus className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 p-4">
              {editMode ? 'Edit Instructor Profile' : 'Register New Instructor'}
            </h2>
          </div>
          {editMode && (
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-semibold">
              Edit Mode Active
            </span>
          )}
        </div>
        
        <form onSubmit={createOrUpdateInstructor} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200 placeholder-slate-400" 
                name="name" 
                placeholder="e.g. John Doe" 
                value={form.name} 
                onChange={handleChange} 
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200 placeholder-slate-400" 
                name="email" 
                type="email"
                placeholder="instructor@domain.com" 
                value={form.email} 
                onChange={handleChange} 
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Security Password {editMode && <span className="text-slate-400 italic font-normal">(Leave blank to keep same)</span>}
              </label>
              <input 
                type="password"
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200 placeholder-slate-400" 
                name="password" 
                placeholder="••••••••" 
                value={form.password} 
                onChange={handleChange} 
                required={!editMode}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Course Track Assignment</label>
              <select
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200"
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
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] transition-all duration-150 flex items-center text-sm"
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
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-2.5 rounded-xl font-semibold active:scale-[0.98] transition-all duration-150 text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Instructors Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
        <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-violet-100 text-violet-700 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 p-4">Instructor Directory</h2>
          </div>
          <span className="text-slate-400 text-xs font-semibold">
            {instructors.length} Profiles Found
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200/80">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Instructor Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Course Assignment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {instructors.length > 0 ? (
                instructors.map((ins) => {
                  const assignedCourse = courses.find(c => c._id === ins.course);
                  return (
                    <tr key={ins._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 border border-indigo-100/50 flex items-center justify-center font-bold text-sm">
                            {ins.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{ins.name}</div>
                            <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Instructor</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500">
                        {ins.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-lg border ${
                          assignedCourse 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100/55' 
                            : 'bg-amber-50 text-amber-700 border-amber-100/55'
                        }`}>
                          {assignedCourse ? assignedCourse.title || assignedCourse.name : 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                        <button 
                          onClick={() => handleAssignCourse(ins._id)}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 font-semibold transition-colors"
                        >
                          <BookOpenCheck className="w-4 h-4 mr-1.5" />
                          Assign
                        </button>
                        
                        <button 
                          onClick={() => handleEdit(ins)}
                          className="inline-flex items-center text-slate-600 hover:text-slate-900 font-semibold transition-colors"
                        >
                          <Edit3 className="w-4 h-4 mr-1.5" />
                          Edit
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(ins._id)}
                          className="inline-flex items-center text-rose-600 hover:text-rose-900 font-semibold transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl max-w-md w-full overflow-hidden relative p-6 space-y-4 transition-transform duration-200">
            <button
              onClick={() => setAssignModel(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
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