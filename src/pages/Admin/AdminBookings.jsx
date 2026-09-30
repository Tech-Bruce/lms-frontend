import React, { useEffect, useState } from 'react';
import api from "../../api";
import { toast } from 'react-toastify';
import { Calendar, Clock, User, Mail, Target } from 'lucide-react';
import moment from 'moment';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/admin/bookings');
      setBookings(res.data.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Sort bookings by latest session first
  const sortedBookings = [...bookings].sort((a, b) => new Date(b.start) - new Date(a.start));
  
  const filteredBookings = sortedBookings.filter(b => {
    const search = filterText.toLowerCase();
    const studentName = b.student?.name?.toLowerCase() || '';
    const studentEmail = b.student?.email?.toLowerCase() || '';
    const mentorName = b.mentor?.name?.toLowerCase() || '';
    
    return studentName.includes(search) || studentEmail.includes(search) || mentorName.includes(search);
  });

  return (
    <div className="p-8 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mentorship Bookings</h1>
          <p className="text-gray-500 mt-2">View and manage all student mentorship sessions.</p>
        </div>
        <div className="w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Search by student or mentor..." 
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-16 text-center shadow-lg border border-white">
          <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No bookings yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto">When students book mentorship sessions, they will automatically appear here.</p>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-indigo-50/30 border-b border-gray-100">
                  <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Info</th>
                  <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Mentor</th>
                  <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Session Time</th>
                  <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Goals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="p-6 align-top">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                          <User className="w-4 h-4 text-gray-400" />
                          {booking.student?.name || 'Unknown'}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-2 mt-1.5">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {booking.student?.email || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 align-top">
                      <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-sm border border-blue-100">
                        {booking.mentor?.name || 'Unknown Mentor'}
                      </div>
                    </td>
                    <td className="p-6 align-top">
                      <div className="flex flex-col gap-2">
                        <span className="text-gray-900 font-semibold flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          {moment(booking.start).format('MMM DD, YYYY')}
                        </span>
                        <span className="text-gray-600 text-sm font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-500" />
                          {moment(booking.start).format('h:mm A')} - {moment(booking.end).format('h:mm A')}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 align-top max-w-sm">
                      <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <Target className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 leading-relaxed italic" title={booking.student?.goals}>
                          "{booking.student?.goals || 'No specific goals provided.'}"
                        </p>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      No bookings found matching "{filterText}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>

            {/* Mobile Cards */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <div key={booking._id} className="p-5 hover:bg-indigo-50/30 transition-colors bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-gray-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {booking.student?.name || 'Unknown'}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {booking.student?.email || 'N/A'}
                      </span>
                    </div>
                    <div className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-100 whitespace-nowrap">
                      {booking.mentor?.name || 'Unknown Mentor'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-900 text-sm font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      {moment(booking.start).format('MMM DD, YYYY')}
                    </span>
                    <span className="text-gray-600 text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      {moment(booking.start).format('h:mm A')} - {moment(booking.end).format('h:mm A')}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/50">
                    <Target className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                      "{booking.student?.goals || 'No specific goals provided.'}"
                    </p>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-gray-500">
                  No bookings found matching "{filterText}".
                </div>
              )}
            </div>

          </div>
      )}
    </div>
  );
};

export default AdminBookings;
