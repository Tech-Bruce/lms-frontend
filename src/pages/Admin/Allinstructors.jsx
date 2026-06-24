import React, { useEffect, useState } from 'react';
import { Mail, Award, Clock, User, MapPin, Star } from 'lucide-react';
import api from "../../api";

const AllInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const instructorsPerPage = 6;
  const uploadUrl = import.meta.env.VITE_API_UPLOAD_URL;

  // Fetch data
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await api.get('/instructors/all-profiles');
        setInstructors(res.data.data);
        setFiltered(res.data.data);
      } catch (err) {
        console.error('Error fetching instructors:', err);
      }
    };

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

  // Pagination logic
  const indexOfLast = currentPage * instructorsPerPage;
  const indexOfFirst = indexOfLast - instructorsPerPage;
  const currentInstructors = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / instructorsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
             Expert Instructors
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover world-class educators passionate about sharing their knowledge and expertise
          </p>
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

                      {/* Action Button */}
                      {/* <div className="pt-4">
                        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          View Profile
                        </button>
                      </div> */}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">Profile information not available</p>
                    </div>
                  )}
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
    </div>
  );
};

export default AllInstructors;