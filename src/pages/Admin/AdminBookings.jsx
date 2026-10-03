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
          <h1 className="text-3xl font-bold text-white tracking-tight">Mentorship Bookings</h1>
          <p className="text-text-muted mt-2">View and manage all student mentorship sessions.</p>
        </div>
        <div className="w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Search by student or mentor..." 
            className="w-full px-4 py-2 bg-background border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-cyan focus:outline-none transition-all text-white placeholder-slate-500"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-surface rounded-2xl p-16 text-center shadow-lg border border-white/10">
          <div className="bg-primary-cyan/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-primary-cyan" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No bookings yet</h3>
          <p className="text-text-muted max-w-sm mx-auto">When students book mentorship sessions, they will automatically appear here.</p>
        </div>
      ) : (
        <div className="bg-surface rounded-3xl shadow-xl border border-white/10 overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background border-b border-white/10">
                  <th className="p-6 text-xs font-bold text-text-muted uppercase tracking-wider">Student Info</th>
                  <th className="p-6 text-xs font-bold text-text-muted uppercase tracking-wider">Mentor</th>
                  <th className="p-6 text-xs font-bold text-text-muted uppercase tracking-wider">Session Time</th>
                  <th className="p-6 text-xs font-bold text-text-muted uppercase tracking-wider">Goals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6 align-top">
                      <div className="flex flex-col">
                        <span className="font-bold text-white flex items-center gap-2 group-hover:text-primary-cyan transition-colors">
                          <User className="w-4 h-4 text-slate-400" />
                          {booking.student?.name || 'Unknown'}
                        </span>
                        <span className="text-sm text-text-muted flex items-center gap-2 mt-1.5">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {booking.student?.email || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 align-top">
                      <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary-blue/20 text-primary-cyan font-semibold text-sm border border-primary-cyan/20">
                        {booking.mentor?.name || 'Unknown Mentor'}
                      </div>
                    </td>
                    <td className="p-6 align-top">
                      <div className="flex flex-col gap-2">
                        <span className="text-white font-semibold flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary-cyan" />
                          {moment(booking.start).format('MMM DD, YYYY')}
                        </span>
                        <span className="text-slate-300 text-sm font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4 text-success" />
                          {moment(booking.start).format('h:mm A')} - {moment(booking.end).format('h:mm A')}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 align-top max-w-sm">
                      <div className="flex items-start gap-2 bg-surface2 rounded-xl p-3 border border-white/10">
                        <Target className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-text-muted leading-relaxed italic" title={booking.student?.goals}>
                          "{booking.student?.goals || 'No specific goals provided.'}"
                        </p>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-text-muted">
                      No bookings found matching "{filterText}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>

            {/* Mobile Cards */}
            <div className="block lg:hidden divide-y divide-white/10">
              {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <div key={booking._id} className="p-5 hover:bg-white/5 transition-colors bg-surface">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        {booking.student?.name || 'Unknown'}
                      </span>
                      <span className="text-sm text-text-muted flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {booking.student?.email || 'N/A'}
                      </span>
                    </div>
                    <div className="inline-flex items-center px-2 py-1 rounded bg-primary-blue/20 text-primary-cyan font-semibold text-xs border border-primary-cyan/20 whitespace-nowrap">
                      {booking.mentor?.name || 'Unknown Mentor'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 mb-4 bg-background p-3 rounded-xl border border-white/10">
                    <span className="text-white text-sm font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-cyan" />
                      {moment(booking.start).format('MMM DD, YYYY')}
                    </span>
                    <span className="text-slate-300 text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-success" />
                      {moment(booking.start).format('h:mm A')} - {moment(booking.end).format('h:mm A')}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 bg-surface2 rounded-xl p-3 border border-white/10">
                    <Target className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-text-muted leading-relaxed italic">
                      "{booking.student?.goals || 'No specific goals provided.'}"
                    </p>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-text-muted">
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
