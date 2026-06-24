import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  useGetMentorsQuery,
  useBookSlotMutation,
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

const localizer = momentLocalizer(moment);

const StudentMentorship = () => {
  const { data, isLoading, isError } = useGetMentorsQuery();
  const [bookSlot] = useBookSlotMutation();

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

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading mentors...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-full inline-flex mb-4">
            <FiX className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-lg text-gray-700">Error fetching mentors</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  const mentors = data?.slots || [];

  // Filter out booked slots and only keep available ones
  const availableSlots = mentors.filter((slot) => !slot.booked);

  // Group available slots by mentor
  const groupedSlots = availableSlots.reduce((acc, slot) => {
    const mentorId = slot.mentor?._id || "unknown";
    if (!acc[mentorId]) {
      acc[mentorId] = {
        mentor: slot.mentor,
        slots: [],
      };
    }
    acc[mentorId].slots.push(slot);
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
    return slots.filter((slot) => !slot.booked).length;
  };

  // Open booking modal directly with the slot
  const handleRequestMentorship = (slot) => {
    if (!slot) return;
    setSelectedMentor(slot.mentor || null);
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

    if (!selectedSlot?._id) {
      alert("Please select a valid slot.");
      return;
    }

    try {
      await bookSlot({
        slotId: selectedSlot._id,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              One-to-One Mentorship Program
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Get personalized guidance from experienced cybersecurity
            professionals
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="flex items-center text-gray-600">
              <FiUser className="mr-2 text-blue-500" />
              <span>Industry Experts</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiClock className="mr-2 text-blue-500" />
              <span>Flexible Scheduling</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiTarget className="mr-2 text-blue-500" />
              <span>Career-Focused</span>
            </div>
          </div>
        </div>

        {/* Mentor Cards Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center relative">
            <span className="relative inline-block">Available Mentors</span>
          </h2>

          {Object.keys(groupedSlots).length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Available Sessions
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Currently, all mentorship sessions are booked. Please check back
                later for new availability.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Object.values(groupedSlots).map((mentorGroup, idx) => {
                const mentor = mentorGroup.mentor;
                const slots = mentorGroup.slots;
                const availableSlots = countAvailableSlots(slots);
                const mentorId = mentor?._id || `mentor-${idx}`; // ✅ fallback key
                const isExpanded = expandedMentors[mentorId];
                const initials =
                  mentor?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "M";

                return (
                  <div
                    key={mentorId}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100"
                  >
                    <div className="p-6">
                      {/* Mentor Header */}
                      <div className="flex items-center mb-6">
                        <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-sm">
                          <span className="text-white font-bold text-lg">
                            {initials}
                          </span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-bold text-gray-900">
                            {mentor?.name || "Unnamed Mentor"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {mentor?.role || "Cybersecurity Mentor"}
                          </p>
                          <p className="text-sm text-blue-600 font-medium mt-1">
                            {availableSlots} available slot
                            {availableSlots !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      {/* Slot Details (shown when expanded) */}
                      {isExpanded && (
                        <div className="space-y-3 mb-4">
                          {slots.map((slot) => (
                            <div
                              key={slot._id || Math.random()}
                              className="p-3 rounded-lg border bg-blue-50 border-blue-200"
                            >
                              <div className="flex items-center mb-1">
                                <FiCalendar className="text-blue-500 mr-2" />
                                <span className="text-sm font-medium text-gray-700">
                                  {formatDate(slot.start)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <FiClock className="text-blue-500 mr-2" />
                                  <span className="text-sm text-gray-600">
                                    {moment(slot.end).diff(
                                      moment(slot.start),
                                      "minutes"
                                    )}{" "}
                                    minutes
                                  </span>
                                </div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Available
                                </span>
                              </div>

                              <button
                                onClick={() => handleRequestMentorship(slot)}
                                className="w-full mt-2 px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Book This Slot
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Quick Action Button */}
                      <button
                        onClick={() => toggleMentorExpansion(mentorId)}
                        className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        {isExpanded
                          ? "Hide Available Times"
                          : "View Available Times"}
                        {isExpanded ? (
                          <FiChevronUp className="ml-2" />
                        ) : (
                          <FiChevronDown className="ml-2" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                1. Choose a Mentor
              </h3>
              <p className="text-gray-600">
                Select from our industry experts based on your learning goals.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                2. Book a Session
              </h3>
              <p className="text-gray-600">
                Pick a time slot that works for your schedule.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                3. Level Up
              </h3>
              <p className="text-gray-600">
                Get personalized guidance to advance your cybersecurity career.
              </p>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">
                          Book Mentorship Session
                        </h3>
                        <button
                          onClick={closeModal}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <FiX className="h-6 w-6" />
                        </button>
                      </div>

                      {!bookingConfirmed ? (
                        <>
                          <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <h4 className="font-medium text-blue-800 mb-2">
                              Session Details
                            </h4>
                            <p className="text-sm text-gray-700">
                              With:{" "}
                              <span className="font-semibold">
                                {selectedMentor?.name || "Unknown"}
                              </span>
                            </p>
                            <p className="text-sm text-gray-700">
                              When:{" "}
                              <span className="font-semibold">
                                {selectedSlot?.start
                                  ? formatDate(selectedSlot.start)
                                  : "N/A"}
                              </span>
                            </p>
                            <p className="text-sm text-gray-700">
                              Duration:{" "}
                              <span className="font-semibold">
                                {selectedSlot?.end && selectedSlot?.start
                                  ? moment(selectedSlot.end).diff(
                                      moment(selectedSlot.start),
                                      "minutes"
                                    )
                                  : 0}{" "}
                                minutes
                              </span>
                            </p>
                          </div>

                          <form
                            onSubmit={handleBookingSubmit}
                            className="space-y-4"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FiUser className="inline mr-2 text-gray-500" />
                                Your Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={studentDetails.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your full name"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FiMail className="inline mr-2 text-gray-500" />
                                Your Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={studentDetails.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email address"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FiTarget className="inline mr-2 text-gray-500" />
                                Your Goals
                              </label>
                              <textarea
                                name="goals"
                                value={studentDetails.goals}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="What do you hope to achieve from this session?"
                              />
                            </div>

                            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                              <button
                                type="button"
                                onClick={closeModal}
                                className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                              >
                                Confirm Booking
                                <FiArrowRight className="ml-2" />
                              </button>
                            </div>
                          </form>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <FiCheck className="h-8 w-8 text-green-600" />
                          </div>
                          <h3 className="text-xl font-medium text-gray-900 mb-2">
                            Booking Confirmed!
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Your session with {selectedMentor?.name || "Unknown"}{" "}
                            has been successfully booked. You will receive a
                            confirmation email shortly.
                          </p>
                          <button
                            onClick={closeModal}
                            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMentorship;
