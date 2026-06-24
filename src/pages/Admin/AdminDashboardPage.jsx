import React, { useEffect, useState } from 'react';
import axios from '../../api';
import { Link } from 'react-router-dom';
import AssignCourseForm from './AssignCourseFrom';

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
      setInstructors(res.data.instructors);
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
  }
  const handleAssignCourse = async (instructorId) => {
        setAssignModel(true);
        setAssignInstructorId(instructorId);
  }
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <svg className="w-8 h-8 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Instructor Management
            </h1>
            <p className="text-gray-600 mt-1">Manage all instructors and their course assignments</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <span className="text-sm font-medium text-gray-700">Admin Dashboard</span>
          </div>
        </div>

        {/* Create/Update Instructor Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {editMode ? 'Update Instructor' : 'Create New Instructor'}
            </h2>
          </div>
          <div className="p-6">
         
            <form onSubmit={createOrUpdateInstructor}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" 
                    name="name" 
                    placeholder="John Doe" 
                    value={form.name} 
                    onChange={handleChange} 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" 
                    name="email" 
                    type="email"
                    placeholder="instructor@example.com" 
                    value={form.email} 
                    onChange={handleChange} 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input 
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" 
                    name="password" 
                    placeholder="••••••••" 
                    value={form.password} 
                    onChange={handleChange} 
                    required={!editMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.title || course.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {editMode ? 'Update Instructor' : 'Create Instructor'}
                </button>
                {editMode && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setEditId(null);
                      setForm({ name: '', email: '', password: '', course: '' });
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Instructors Table Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              All Instructors
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {instructors.length > 0 ? (
                    instructors.map((ins) => {
                      const assignedCourse = courses.find(c => c._id === ins.course);
                      return (
                        <tr key={ins._id} className="hover:bg-gray-50 transition duration-150">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-medium">{ins.name.charAt(0)}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{ins.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">{ins.email}</td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {assignedCourse ? assignedCourse.title || assignedCourse.name : 'No course assigned'}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                             <button 
                              onClick={() => handleAssignCourse(ins._id)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4 transition duration-200"
                            >
                              <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Assign Course
                            </button>
                            <button 
                              onClick={() => handleEdit(ins)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4 transition duration-200"
                            >
                              <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(ins._id)}
                              className="text-red-600 hover:text-red-900 transition duration-200"
                            >
                              <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No instructors found. Create your first instructor above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {assignModel && (
 <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 transition-opacity duration-200">
  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative scale-100 transition-transform duration-200">
  
      <button
        onClick={() => setAssignModel(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
      >
        &times;
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