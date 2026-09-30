import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import { FiCalendar, FiClock, FiBell, FiPlus, FiCheckCircle } from "react-icons/fi";

const MentorDashboard = () => {
  const [newSlot, setNewSlot] = useState({ start: "", end: "" });
  const [openSection, setOpenSection] = useState(null);
  const user = useSelector((state) => state?.lms_auth?.user);
  const queryClient = useQueryClient();

  // Fetch slots using TanStack Query
  const { data: slotsData, isLoading } = useQuery({
    queryKey: ["mentorSlots", user?.id],
    queryFn: async () => {
      const response = await api.get("/mentorship/mentors");
      return response.data;
    },
    enabled: !!user?.id,
  });

  // Filter slots for current mentor
  const mySlots = slotsData?.slots?.filter(
    (slot) => slot.mentor && slot.mentor._id === user?.id
  ) || [];

  // Get notifications (booked slots)
  const notifications = mySlots.filter((slot) => slot.booked);
  
  // Create slot mutation
  const createSlotMutation = useMutation({
    mutationFn: (slotData) => 
      api.post("/mentorship/slots", {
        mentorId: user.id,
        start: slotData.start,
        end: slotData.end,
      }),
    onSuccess: () => {
      // Invalidate and refetch slots data
      queryClient.invalidateQueries({ queryKey: ["mentorSlots"] });
      setNewSlot({ start: "", end: "" });
    },
  });

  const handleCreateSlot = (e) => {
    e.preventDefault();
    createSlotMutation.mutate(newSlot);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-6 sm:p-10 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            Control Panel
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white mb-2 sm:text-5xl">
            Mentor <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-slate-400 text-lg">Manage your availability and view upcoming sessions.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Slot Booking Card */}
          <div className="flex-1">
            <div 
              className={`rounded-[24px] border border-white/[0.09] transition-all duration-300 overflow-hidden backdrop-blur-md ${
                openSection === "slots" ? "bg-white/[0.04]" : "bg-white/[0.02]"
              }`}
            >
              <div
                className="px-6 py-5 flex justify-between items-center font-semibold text-lg cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setOpenSection(openSection === "slots" ? null : "slots")}
              >
                <div className="flex items-center text-white">
                  <div className="h-10 w-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mr-4">
                    <FiCalendar className="text-cyan-400 h-5 w-5" />
                  </div>
                  Slot Management
                </div>
                <span className="text-slate-400 text-sm font-mono">{openSection === "slots" ? "CLOSE" : "OPEN"}</span>
              </div>

              {openSection === "slots" && (
                <div className="p-6 pt-2 border-t border-white/[0.05]">
                  {/* Slot Creation Form */}
                  <form
                    onSubmit={handleCreateSlot}
                    className="bg-[#0A111E] p-6 rounded-2xl mb-8 border border-white/[0.08]"
                  >
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-5 flex items-center gap-2">
                      <FiPlus className="text-cyan-400" /> Create New Slot
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Start Time</label>
                        <input
                          type="datetime-local"
                          value={newSlot.start}
                          onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
                          className="w-full bg-[#111C2B] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all [color-scheme:dark]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">End Time</label>
                        <input
                          type="datetime-local"
                          value={newSlot.end}
                          onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
                          className="w-full bg-[#111C2B] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all [color-scheme:dark]"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={createSlotMutation.isPending}
                      className="w-full sm:w-auto px-8 py-3 bg-cyan-400 text-[#07121D] font-bold rounded-xl hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#0A111E] disabled:opacity-50 transition-colors shadow-[0_5px_20px_rgba(34,211,238,0.2)]"
                    >
                      {createSlotMutation.isPending ? "Creating..." : "Publish Slot"}
                    </button>
                  </form>

                  {/* Slots List */}
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-5">My Schedule</h3>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-10 bg-white/[0.02] rounded-2xl border border-white/[0.05]">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-t-cyan-400 border-white/10"></div>
                        <p className="mt-4 text-sm text-slate-400">Loading schedule...</p>
                      </div>
                    ) : mySlots.length === 0 ? (
                      <div className="text-center py-12 bg-white/[0.02] rounded-2xl border border-dashed border-white/[0.1]">
                        <FiClock className="h-10 w-10 mx-auto text-slate-500 mb-3" />
                        <p className="text-slate-400">No slots published yet.</p>
                      </div>
                    ) : (
                      mySlots.map((slot) => (
                        <div
                          key={slot._id}
                          className={`p-5 rounded-xl border transition-colors ${
                            slot.booked
                              ? "bg-rose-500/5 border-rose-500/20"
                              : "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div>
                              <p className="text-white font-medium mb-1">
                                {new Date(slot.start).toLocaleDateString()} 
                                <span className="text-slate-500 mx-2">•</span>
                                <span className="text-cyan-300">
                                  {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="text-slate-500 mx-1">-</span>
                                <span className="text-cyan-300">
                                  {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </p>
                              <p className={`text-xs font-bold uppercase tracking-wider ${slot.booked ? "text-rose-400" : "text-emerald-400"}`}>
                                {slot.booked ? "Unavailable" : "Open for booking"}
                              </p>
                            </div>
                            {slot.booked && (
                              <span className="inline-flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold px-3 py-1.5 rounded-lg">
                                <FiCheckCircle /> Reserved
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notifications Card */}
          <div className="flex-1 lg:max-w-md">
            <div 
              className={`rounded-[24px] border border-white/[0.09] transition-all duration-300 overflow-hidden backdrop-blur-md ${
                openSection === "notifications" ? "bg-white/[0.04]" : "bg-white/[0.02]"
              }`}
            >
              <div
                className="px-6 py-5 flex justify-between items-center font-semibold text-lg cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setOpenSection(openSection === "notifications" ? null : "notifications")}
              >
                <div className="flex items-center text-white relative">
                  <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mr-4">
                    <FiBell className="text-amber-400 h-5 w-5" />
                  </div>
                  Alerts
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 left-7 bg-amber-500 text-[#07121D] shadow-[0_0_10px_rgba(245,158,11,0.5)] text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </div>
                <span className="text-slate-400 text-sm font-mono">{openSection === "notifications" ? "CLOSE" : "OPEN"}</span>
              </div>

              {openSection === "notifications" && (
                <div className="p-6 pt-2 border-t border-white/[0.05]">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12 bg-white/[0.02] rounded-2xl border border-dashed border-white/[0.1]">
                      <FiBell className="h-10 w-10 mx-auto text-slate-500 mb-3" />
                      <p className="text-slate-400">No new bookings yet.</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {notifications.map((slot) => (
                        <li
                          key={slot._id}
                          className="p-5 border border-amber-500/20 bg-[#0A111E] rounded-2xl shadow-lg relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                          <div className="flex flex-col">
                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                              {slot.student.name} booked a session
                            </h4>
                            
                            <div className="space-y-2 bg-[#111C2B] border border-white/5 p-4 rounded-xl">
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Timing</span>
                                <span className="text-sm font-medium text-slate-300">
                                  {new Date(slot.start).toLocaleDateString()} • {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1 pt-1">
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Student Goals</span>
                                <p className="text-sm text-slate-300 italic bg-white/[0.02] p-2 rounded">"{slot.student.goals}"</p>
                              </div>
                              <div className="flex justify-between items-center pt-2">
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Contact</span>
                                <a href={`mailto:${slot.student.email}`} className="text-sm font-medium text-cyan-400 hover:underline">
                                  {slot.student.email}
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;