import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mentor Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage your availability and view bookings</p>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Slot Booking Card */}
          <div className="flex-1">
            <div 
              className={`rounded-xl shadow-md border cursor-pointer transition-all duration-300 overflow-hidden ${
                openSection === "slots" ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
              }`}
            >
              <div
                className="px-5 py-4 flex justify-between items-center font-semibold text-lg bg-white"
                onClick={() => setOpenSection(openSection === "slots" ? null : "slots")}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Slot Booking
                </div>
                <span className="text-gray-500">{openSection === "slots" ? "▲" : "▼"}</span>
              </div>

              {openSection === "slots" && (
                <div className="p-5 bg-white">
                  {/* Slot Creation Form */}
                  <form
                    onSubmit={handleCreateSlot}
                    className="bg-gray-50 p-5 rounded-lg mb-6 border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Create New Slot</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                          type="datetime-local"
                          value={newSlot.start}
                          onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input
                          type="datetime-local"
                          value={newSlot.end}
                          onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={createSlotMutation.isPending}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    >
                      {createSlotMutation.isPending ? "Creating..." : "Create Slot"}
                    </button>
                  </form>

                  {/* Slots List */}
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">My Slots</h3>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-gray-600">Loading slots...</p>
                      </div>
                    ) : mySlots.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-2 text-gray-600">No slots created yet.</p>
                      </div>
                    ) : (
                      mySlots.map((slot) => (
                        <div
                          key={slot._id}
                          className={`p-4 rounded-lg border ${
                            slot.booked
                              ? "bg-red-50 border-red-200"
                              : "bg-green-50 border-green-200"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {new Date(slot.start).toLocaleDateString()} 
                                <span className="text-gray-500 mx-2">•</span>
                                {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <p className={`text-sm font-medium ${slot.booked ? "text-red-600" : "text-green-600"}`}>
                                {slot.booked ? "Booked" : "Available"}
                              </p>
                            </div>
                            {slot.booked && (
                              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                Reserved
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
          <div className="flex-1">
            <div 
              className={`rounded-xl shadow-md border cursor-pointer transition-all duration-300 overflow-hidden ${
                openSection === "notifications" ? "bg-yellow-50 border-yellow-200" : "bg-white border-gray-200"
              }`}
            >
              <div
                className="px-5 py-4 flex justify-between items-center font-semibold text-lg bg-white"
                onClick={() => setOpenSection(openSection === "notifications" ? null : "notifications")}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notifications
                  {notifications.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </div>
                <span className="text-gray-500">{openSection === "notifications" ? "▲" : "▼"}</span>
              </div>

              {openSection === "notifications" && (
                <div className="p-5 bg-white">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                      </svg>
                      <p className="mt-2 text-gray-600">No bookings yet.</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {notifications.map((slot) => (
                        <li
                          key={slot._id}
                          className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg shadow-sm"
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-gray-900">{slot.student.name} booked a session</p>
                              <p className="text-sm text-gray-500">
                                {new Date(slot.start).toLocaleDateString()} • {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <p className="mt-1 text-sm">
                                <span className="font-medium">Goals:</span> {slot.student.goals}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Contact:</span> {slot.student.email}
                              </p>
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