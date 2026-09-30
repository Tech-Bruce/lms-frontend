import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  useGetMentorsQuery,
  useBookSlotMutation,
  useCreateSlotMutation,
} from "../redux/mentorshipApi";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMail,
  FiTarget,
  FiX,
  FiCheck,
  FiArrowRight,
  FiBookOpen,
  FiAward,
  FiBriefcase,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import api from "../api";

const localizer = momentLocalizer(moment);

const StudentMentorship = () => {
  const { data, isLoading, isError } = useGetMentorsQuery();
  const [bookSlot] = useBookSlotMutation();
  const [createSlot] = useCreateSlotMutation();

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [expandedMentors, setExpandedMentors] = useState({});
  const [studentDetails, setStudentDetails] = useState({
    name: "",
    email: "",
    goals: "",
  });
  const [allMentors, setAllMentors] = useState([]);
  const [mentorsLoading, setMentorsLoading] = useState(true);

  // Fetch all mentors to list them regardless of slots
  React.useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await api.get("/instructors/all-profiles");
        setAllMentors(res.data.data || []);
      } catch (err) {
        console.error("Error fetching all mentors:", err);
      } finally {
        setMentorsLoading(false);
      }
    };
    fetchMentors();
  }, []);

  if (isLoading || mentorsLoading)
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-400">Loading mentors...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center">
        <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-md">
          <div className="bg-red-500/20 p-4 rounded-full inline-flex mb-4">
            <FiX className="h-8 w-8 text-red-400" />
          </div>
          <p className="text-lg text-gray-300">Error fetching mentors</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  const mentorsData = data?.slots || [];

  // Filter out booked slots and only keep available ones with valid mentors
  const availableSlots = mentorsData.filter((slot) => !slot.booked && slot.mentor);

  // Group available slots by mentor ID
  const groupedSlots = availableSlots.reduce((acc, slot) => {
    const mentorId = slot.mentor?._id || "unknown";
    if (!acc[mentorId]) {
      acc[mentorId] = [];
    }
    acc[mentorId].push(slot);
    return acc;
  }, {});

  // Toggle expanded view for a mentor
  const toggleMentorExpansion = (mentorId) => {
    if (!mentorId) return; // ✅ safeguard
    setExpandedMentors((prev) => ({
      ...prev,
      [mentorId]: !prev[mentorId],
    }));
  };

  // Count available slots for a mentor
  const countAvailableSlots = (slots) => {
    return slots?.filter((slot) => !slot.booked).length || 0;
  };

  // Open booking modal directly with the slot
  const handleRequestMentorship = (slot, mentorInfo) => {
    if (!slot) return;
    setSelectedMentor(mentorInfo);
    setSelectedSlot(slot);
    setShowBookingModal(true);
    setBookingConfirmed(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      alert("Please select a valid slot.");
      return;
    }

    try {
      let slotToBook = selectedSlot;

      // If it's a custom slot chosen from the calendar, create it first
      if (selectedSlot.isCustom) {
        slotToBook = await createSlot({
          mentorId: selectedMentor._id,
          start: selectedSlot.start,
          end: selectedSlot.end,
        }).unwrap();
      }

      await bookSlot({
        slotId: slotToBook._id,
        student: {
          name: studentDetails.name,
          email: studentDetails.email,
          goals: studentDetails.goals,
        },
      }).unwrap();

      setBookingConfirmed(true);
    } catch (error) {
      console.error("Booking failed:", error);
      alert(error?.data?.error || "Booking failed. Try again.");
    }
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedMentor(null);
    setSelectedSlot(null);
    setStudentDetails({ name: "", email: "", goals: "" });
  };

  // Format date for display
  const formatDate = (date) => {
    return moment(date).format("MMM D, YYYY h:mm A");
  };

  return (
    <main className="min-h-screen bg-[#070B14] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[650px] w-[850px] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[110px]" />
        <div className="absolute right-[-200px] top-[400px] h-[600px] w-[600px] rounded-full bg-blue-600/[0.07] blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
            One-to-One Program
          </div>
          <h1 className="max-w-3xl mx-auto text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-[4.5rem]">
            Master your craft with <br />
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              expert mentorship.
            </span>
          </h1>
          <p className="mt-7 max-w-2xl mx-auto text-base leading-8 text-slate-400 sm:text-lg">
            Get personalized guidance from experienced cybersecurity professionals who have been in the trenches and know exactly what it takes to succeed.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3">
              <FiUser className="text-cyan-400 h-5 w-5" />
              <span className="text-sm font-medium text-slate-300">Industry Experts</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3">
              <FiClock className="text-cyan-400 h-5 w-5" />
              <span className="text-sm font-medium text-slate-300">Flexible Scheduling</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3">
              <FiTarget className="text-cyan-400 h-5 w-5" />
              <span className="text-sm font-medium text-slate-300">Career-Focused</span>
            </div>
          </div>
        </div>

        {/* Mentor Cards Section */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">Available Mentors</h2>
              <p className="mt-2 text-sm text-slate-400">Book a 1-on-1 session with our elite defensive and offensive experts.</p>
            </div>
          </div>

          {allMentors.length === 0 ? (
            <div className="text-center py-20 border border-white/[0.09] bg-white/[0.02] rounded-3xl backdrop-blur-md">
              <div className="bg-cyan-400/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cyan-400/20">
                <FiUser className="h-10 w-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                No Mentors Available
              </h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Check back soon as we onboard new experts to our platform.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allMentors.map((mentor, idx) => {
                const mentorId = mentor?._id || `mentor-${idx}`;
                const availableSlotsCount = mentor.profile?.availability?.length || 0;
                const isExpanded = expandedMentors[mentorId];
                const initials = mentor?.name?.split(" ").map((n) => n[0]).join("") || "M";

                return (
                  <div
                    key={mentorId}
                    className="group relative overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-cyan-400/[0.055]"
                  >
                    <div className="p-8">
                      {/* Mentor Header */}
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-5">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.08] text-xl font-bold text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                            {initials}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold tracking-tight text-white mb-1">
                              {mentor?.name || "Unnamed Mentor"}
                            </h3>
                            <p className="text-sm font-medium text-slate-400">
                              {mentor?.role || "Cybersecurity Mentor"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-8 inline-flex items-center gap-2 rounded bg-white/[0.05] px-3 py-1.5 text-xs font-mono text-cyan-400 border border-white/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        {availableSlotsCount} AVAILABLE SLOT{availableSlotsCount !== 1 ? "S" : ""}
                      </div>

                      {/* Slot Details (shown when expanded) */}
                      {isExpanded && (
                        <div className="mb-6 bg-[#0A111E] border border-white/10 p-5 rounded-2xl shadow-inner">
                          {mentor?.profile?.availability?.length > 0 ? (
                            <>
                              <p className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                                <FiClock className="text-cyan-400" /> Available Time Slots
                              </p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {mentor.profile.availability.map((slot, i) => {
                                  if (!slot.date || !slot.time) return null;
                                  const [hours, minutes] = slot.time.split(":");
                                  const slotStart = moment(slot.date).hours(parseInt(hours)).minutes(parseInt(minutes)).toDate();
                                  const slotEnd = moment(slot.date).hours(parseInt(hours) + 1).minutes(parseInt(minutes)).toDate();

                                  return (
                                    <button
                                      key={i}
                                      onClick={() => {
                                        setSelectedMentor(mentor);
                                        setSelectedSlot({ start: slotStart, end: slotEnd, isCustom: true, step: "time" });
                                        setShowBookingModal(true);
                                        setBookingConfirmed(false);
                                      }}
                                      className="py-3 px-2 rounded-xl border border-white/10 bg-white/5 flex flex-col items-center justify-center hover:border-cyan-400 hover:bg-cyan-400/10 transition-all text-center group"
                                    >
                                      <span className="text-xs font-semibold text-slate-400 group-hover:text-cyan-300 mb-1">
                                        {moment(slot.date).format("MMM DD, YYYY")}
                                      </span>
                                      <span className="text-sm font-bold text-slate-200 group-hover:text-cyan-400">
                                        {moment(slot.time, "HH:mm").format("h:mm A")}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-6">
                              <FiClock className="mx-auto h-8 w-8 text-slate-500 mb-3" />
                              <p className="text-sm text-slate-400">No availability set for this mentor yet.</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quick Action Button */}
                      <button
                        onClick={() => toggleMentorExpansion(mentorId)}
                        className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium border border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.08] hover:text-white transition-colors"
                      >
                        {isExpanded ? "Hide Calendar" : "Select Time & Book"}
                        {isExpanded ? <FiChevronUp className="ml-2 h-4 w-4" /> : <FiChevronDown className="ml-2 h-4 w-4" />}
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent transition group-hover:via-cyan-400/50" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/[0.09] bg-white/[0.02] p-10 sm:p-14 mb-16 backdrop-blur-sm">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="mb-12 max-w-2xl text-center mx-auto">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              The Process
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-white">
              How mentorship works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="relative">
              <div className="bg-cyan-400/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-cyan-400/20 text-cyan-300">
                <FiBookOpen className="h-7 w-7" />
              </div>
              <span className="absolute -top-4 right-0 font-mono text-6xl font-bold text-white/[0.03] pointer-events-none">01</span>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Choose a Mentor</h3>
              <p className="text-slate-400 text-sm leading-7">
                Select from our industry experts based on your learning goals, background, and career aspirations.
              </p>
            </div>

            <div className="relative">
              <div className="bg-cyan-400/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-cyan-400/20 text-cyan-300">
                <FiCalendar className="h-7 w-7" />
              </div>
              <span className="absolute -top-4 right-0 font-mono text-6xl font-bold text-white/[0.03] pointer-events-none">02</span>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Book a Session</h3>
              <p className="text-slate-400 text-sm leading-7">
                Pick an available time slot that fits your schedule. Our mentors open new slots weekly.
              </p>
            </div>

            <div className="relative">
              <div className="bg-cyan-400/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-cyan-400/20 text-cyan-300">
                <FiAward className="h-7 w-7" />
              </div>
              <span className="absolute -top-4 right-0 font-mono text-6xl font-bold text-white/[0.03] pointer-events-none">03</span>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Level Up</h3>
              <p className="text-slate-400 text-sm leading-7">
                Get personalized, 1-on-1 guidance, resume reviews, and technical advice to advance your career.
              </p>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity bg-[#030712]/90 backdrop-blur-sm"
                aria-hidden="true"
                onClick={closeModal}
              ></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-[#0C1423] border border-white/[0.09] rounded-[24px] text-left overflow-hidden shadow-[0_35px_100px_rgba(0,0,0,0.8)] transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative">
                
                {/* Modal Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/20 blur-[80px] pointer-events-none" />

                <div className="px-6 pt-6 pb-6 sm:p-8 relative z-10">
                  <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-5">
                    <h3 className="text-2xl font-semibold text-white tracking-tight">
                      Book Session
                    </h3>
                    <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full p-2">
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>

                  {!bookingConfirmed ? (
                    <>
                      <div className="bg-[#111C2B] border border-white/[0.07] p-5 rounded-2xl mb-8">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="h-10 w-10 rounded-lg bg-cyan-400/10 flex items-center justify-center text-cyan-300 font-bold border border-cyan-400/20">
                             {selectedMentor?.name?.charAt(0) || "M"}
                           </div>
                           <div>
                             <p className="text-sm text-slate-400">Mentorship with</p>
                             <p className="font-semibold text-white">{selectedMentor?.name || "Unknown"}</p>
                           </div>
                        </div>
                        <div className="space-y-2 pt-4 border-t border-white/5">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">Date & Time</p>
                            <p className="text-sm font-medium text-slate-200">
                              {selectedSlot?.start ? formatDate(selectedSlot.start) : "N/A"}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">Duration</p>
                            <p className="text-sm font-medium text-slate-200 bg-white/5 px-2 py-0.5 rounded">
                              {selectedSlot?.end && selectedSlot?.start ? moment(selectedSlot.end).diff(moment(selectedSlot.start), "minutes") : 0} mins
                            </p>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleBookingSubmit} className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiUser className="text-slate-500" />
                            </div>
                            <input
                              type="text"
                              name="name"
                              value={studentDetails.name}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 bg-[#0A111E] border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder-slate-500 outline-none transition-all"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiMail className="text-slate-500" />
                            </div>
                            <input
                              type="email"
                              name="email"
                              value={studentDetails.email}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 bg-[#0A111E] border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder-slate-500 outline-none transition-all"
                              placeholder="you@example.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Session Goals
                          </label>
                          <textarea
                            name="goals"
                            value={studentDetails.goals}
                            onChange={handleInputChange}
                            rows="3"
                            required
                            className="w-full px-4 py-3 bg-[#0A111E] border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder-slate-500 outline-none transition-all resize-none"
                            placeholder="What do you hope to achieve? (e.g. Resume review, interview prep, technical guidance)"
                          />
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
                          <button
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-3 text-sm font-medium text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-3 text-sm font-bold text-[#07121D] bg-cyan-400 rounded-xl hover:bg-cyan-300 transition-colors flex items-center shadow-[0_5px_20px_rgba(34,211,238,0.25)]"
                          >
                            Confirm Booking
                            <FiArrowRight className="ml-2 h-4 w-4" />
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-10">
                      <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 mb-6 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                        <FiCheck className="h-10 w-10 text-cyan-400" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
                        Booking Confirmed!
                      </h3>
                      <p className="text-slate-400 mb-8 leading-relaxed max-w-sm mx-auto">
                        Your session with <strong className="text-white font-medium">{selectedMentor?.name || "Unknown"}</strong> has been successfully booked. Check your inbox for calendar invites and details.
                      </p>
                      <button
                        onClick={closeModal}
                        className="w-full px-6 py-3.5 text-sm font-bold text-[#07121D] bg-cyan-400 rounded-xl hover:bg-cyan-300 transition-colors"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default StudentMentorship;
