import React, { useEffect, useState } from 'react';
import { Mail, Award, Clock, User, Plus, X, Calendar } from 'lucide-react';
import api from "../../api";
import { toast } from 'react-toastify';

const AllInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const instructorsPerPage = 6;
  const uploadUrl = import.meta.env.VITE_API_UPLOAD_URL;

  // Add Mentor Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMentor, setNewMentor] = useState({ name: '', email: '', availability: [{ date: '', time: '' }] });
  const [isCreating, setIsCreating] = useState(false);

  // Edit Mentor Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editMentor, setEditMentor] = useState({ _id: '', name: '', email: '', availability: [{ date: '', time: '' }] });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchInstructors = async () => {
    try {
      const res = await api.get('/instructors/all-profiles');
      setInstructors(res.data.data);
      setFiltered(res.data.data);
    } catch (err) {
      console.error('Error fetching instructors:', err);
    }
  };

  // Fetch data
  useEffect(() => {
    fetchInstructors();
  }, []);

  // Handle Search & Filter
  useEffect(() => {
    let results = instructors;

    if (search) {
      results = results.filter(
        (ins) =>
          ins.name.toLowerCase().includes(search.toLowerCase()) ||
          ins.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (expertiseFilter) {
      results = results.filter(
        (ins) =>
          ins.profile?.expertise?.includes(expertiseFilter)
      );
    }

    setFiltered(results);
    setCurrentPage(1);
  }, [search, expertiseFilter, instructors]);

  // Handle Add Mentor
  const handleAddMentor = async (e) => {
    e.preventDefault();
    if (!newMentor.name || !newMentor.email) {
      toast.error('Please fill in required fields');
      return;
    }
    
    setIsCreating(true);
    try {
      await api.post('/admin/create-instructor', newMentor);
      toast.success('Mentor added successfully!');
      setIsAddModalOpen(false);
      setNewMentor({ name: '', email: '', availability: [{ date: '', time: '' }] });
      fetchInstructors(); // Refresh the list
    } catch (err) {
      console.error('Error creating mentor:', err);
      toast.error(err.response?.data?.msg || 'Error adding mentor');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle Edit Mentor Click
  const handleEditClick = (ins) => {
    setEditMentor({
      _id: ins._id,
      name: ins.name,
      email: ins.email,
      availability: ins.profile?.availability?.length > 0 ? ins.profile.availability : [{ date: '', time: '' }],
    });
    setIsEditModalOpen(true);
  };

  // Handle Update Mentor
  const handleUpdateMentor = async (e) => {
    e.preventDefault();
    if (!editMentor.name || !editMentor.email) {
      toast.error('Name and Email are required');
      return;
    }

    setIsUpdating(true);
    try {
      await api.put(`/admin/update-instructor/${editMentor._id}`, editMentor);
      toast.success('Mentor updated successfully!');
      setIsEditModalOpen(false);
      fetchInstructors();
    } catch (err) {
      console.error('Error updating mentor:', err);
      toast.error(err.response?.data?.msg || 'Error updating mentor');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Delete Mentor
  const handleDeleteMentor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mentor?')) return;
    try {
      await api.delete(`/admin/delete-instructor/${id}`);
      toast.success('Mentor deleted successfully!');
      fetchInstructors();
    } catch (err) {
      console.error('Error deleting mentor:', err);
      toast.error(err.response?.data?.msg || 'Error deleting mentor');
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * instructorsPerPage;
  const indexOfFirst = indexOfLast - instructorsPerPage;
  const currentInstructors = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / instructorsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <div className="text-left mb-6 sm:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
               Expert Instructors / Mentors
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Discover and manage world-class educators and mentors
            </p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" />
            Add Mentor
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search instructors by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="lg:w-80">
              <div className="relative">
                <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={expertiseFilter}
                  onChange={(e) => setExpertiseFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
                >
                  <option value="">All Expertise Areas</option>
                  {[...new Set(instructors.flatMap((ins) => ins.profile?.expertise || []))].map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {currentInstructors.length} of {filtered.length} instructors
          </p>
        </div>

        {/* Instructor Cards Grid */}
        {currentInstructors.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <User className="w-24 h-24 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No instructors found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentInstructors.map((ins) => (
              <div
                key={ins._id}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 overflow-hidden"
              >
                {/* Card Header with Gradient */}
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 h-24">
                  <div className="absolute inset-0 bg-black/10"></div>
                  {/* Profile Image */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    {ins.profile?.profileImage ? (
                      <div className="relative">
                        <img
                          src={`${uploadUrl}/instructors/${ins.profile.profileImage}`}
                          alt={ins.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <div className="absolute -top-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border-4 border-white shadow-lg flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="pt-16 pb-6 px-6">
                  {/* Name and Email */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {ins.name}
                    </h3>
                    <div className="flex items-center justify-center text-gray-600 mb-1">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="text-sm">{ins.email}</span>
                    </div>
                  </div>

                  {ins.profile ? (
                    <div className="space-y-4">
                      {/* Experience Badge */}
                      <div className="flex justify-center">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                          <Clock className="w-4 h-4 mr-1" />
                          {ins.profile.experience} years experience
                        </div>
                      </div>

                      {/* Expertise Tags */}
                      <div>
                        <div className="flex items-center mb-2">
                          <Award className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Expertise</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {ins.profile.expertise.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs rounded-lg font-medium border border-purple-200"
                            >
                              {skill}
                            </span>
                          ))}
                          {ins.profile.expertise.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                              +{ins.profile.expertise.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bio */}
                      <div>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                          {ins.profile.bio}
                        </p>
                      </div>

                      {/* Availability Info */}
                      {ins.profile?.availability && ins.profile.availability.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3 text-sm max-h-32 overflow-y-auto">
                          <div className="font-semibold text-gray-700 mb-1">Availability:</div>
                          {ins.profile.availability.map((slot, idx) => (
                            <div key={idx} className="text-gray-600 flex flex-wrap items-center mt-1">
                              {slot.date && <><Calendar className="w-3 h-3 mr-1" /> <span className="mr-3">{slot.date}</span></>}
                              {slot.time && <><Clock className="w-3 h-3 mr-1" /> <span>{slot.time}</span></>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">Profile information not available</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 flex gap-2">
                    <button 
                      onClick={() => handleEditClick(ins)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteMentor(ins._id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Add Mentor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Add New Mentor</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddMentor} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newMentor.name}
                    onChange={(e) => setNewMentor({...newMentor, name: e.target.value})}
                    placeholder="Enter full name"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newMentor.email}
                    onChange={(e) => setNewMentor({...newMentor, email: e.target.value})}
                    placeholder="Enter email address"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Availability Slots</label>
                    <button 
                      type="button" 
                      onClick={() => setNewMentor({...newMentor, availability: [...newMentor.availability, { date: '', time: '' }]})} 
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Add Slot
                    </button>
                  </div>
                  {newMentor.availability.map((slot, idx) => (
                    <div key={idx} className="flex gap-2 mb-2 items-center">
                      <input
                        type="date"
                        value={slot.date}
                        onChange={(e) => {
                          const newAvail = newMentor.availability.map((s, i) => i === idx ? { ...s, date: e.target.value } : s);
                          setNewMentor({...newMentor, availability: newAvail});
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      />
                      <input
                        type="time"
                        value={slot.time}
                        onChange={(e) => {
                          const newAvail = newMentor.availability.map((s, i) => i === idx ? { ...s, time: e.target.value } : s);
                          setNewMentor({...newMentor, availability: newAvail});
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      />
                      {newMentor.availability.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => {
                            const newAvail = newMentor.availability.filter((_, i) => i !== idx);
                            setNewMentor({...newMentor, availability: newAvail});
                          }} 
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isCreating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Add Mentor'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Mentor Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Edit Mentor</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateMentor} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editMentor.name}
                    onChange={(e) => setEditMentor({...editMentor, name: e.target.value})}
                    placeholder="Enter full name"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editMentor.email}
                    onChange={(e) => setEditMentor({...editMentor, email: e.target.value})}
                    placeholder="Enter email address"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Availability Slots</label>
                    <button 
                      type="button" 
                      onClick={() => setEditMentor({...editMentor, availability: [...editMentor.availability, { date: '', time: '' }]})} 
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Add Slot
                    </button>
                  </div>
                  {editMentor.availability.map((slot, idx) => (
                    <div key={idx} className="flex gap-2 mb-2 items-center">
                      <input
                        type="date"
                        value={slot.date}
                        onChange={(e) => {
                          const newAvail = editMentor.availability.map((s, i) => i === idx ? { ...s, date: e.target.value } : s);
                          setEditMentor({...editMentor, availability: newAvail});
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      />
                      <input
                        type="time"
                        value={slot.time}
                        onChange={(e) => {
                          const newAvail = editMentor.availability.map((s, i) => i === idx ? { ...s, time: e.target.value } : s);
                          setEditMentor({...editMentor, availability: newAvail});
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      />
                      {editMentor.availability.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => {
                            const newAvail = editMentor.availability.filter((_, i) => i !== idx);
                            setEditMentor({...editMentor, availability: newAvail});
                          }} 
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isUpdating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Update Mentor'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllInstructors;