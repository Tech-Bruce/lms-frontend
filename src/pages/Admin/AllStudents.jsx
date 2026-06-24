// src/pages/AllStudents.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AllStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});

  // 🔎 search, course filter, pagination states
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsRes = await axios.get(
          "http://localhost:8000/api/v1/admin/students"
        );
        const allStudents = studentsRes.data.students || [];

        const merged = await Promise.all(
          allStudents.map(async (student) => {
            try {
              const enrollmentsRes = await axios.get(
                `http://localhost:8000/api/v1/students/enrollments/${student._id}`
              );
              const studentEnrollments = enrollmentsRes.data.enrollments || [];

              return {
                ...student,
                courses: studentEnrollments.map((en) => ({
                  title: en.courseId?.title || "Unknown",
                  category: en.courseId?.category || "N/A",
                  status: en.courseId?.status || "N/A",
                  paymentStatus: en.paymentStatus || "N/A",
                  progress: en.progress ?? 0,
                  completed: en.completed ? "Yes" : "No",
                  enrolledAt: new Date(en.enrolledAt).toLocaleDateString(),
                })),
              };
            } catch {
              return { ...student, courses: [] };
            }
          })
        );

        setStudents(merged);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 🔎 build list of all unique courses for filter dropdown
  const allCourses = [
    ...new Set(students.flatMap((s) => s.courses.map((c) => c.title))),
  ];

  // 🔎 filter + search logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());

    const matchesCourse =
      courseFilter === "All"
        ? true
        : s.courses.some((c) => c.title === courseFilter);

    return matchesSearch && matchesCourse;
  });

  // 📑 pagination logic
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🎓 All Students</h1>

      {/* 🔎 Search + Course Filter controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
        />

        <select
          value={courseFilter}
          onChange={(e) => {
            setCourseFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/4 px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
        >
          <option value="All">All Courses</option>
          {allCourses.map((course, i) => (
            <option key={i} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500 animate-pulse">Loading students...</p>
        </div>
      )}
      {error && (
        <p className="text-red-500 text-center font-medium">{error}</p>
      )}

      {!loading && !error && paginatedStudents.length === 0 && (
        <p className="text-gray-500 text-center">No students found</p>
      )}

      {/* student cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedStudents.map((student) => (
          <div
            key={student._id}
            className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition duration-200"
          >
            <div className="p-5 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {student.name}
              </h2>
              <p className="text-sm text-gray-600">{student.email}</p>
              <span className="inline-block mt-2 px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">
                {student.role}
              </span>
            </div>

            <div className="p-5">
              <button
                onClick={() => toggleExpand(student._id)}
                className="w-full text-left text-sm font-medium text-blue-600 hover:underline focus:outline-none"
              >
                {expanded[student._id]
                  ? "▼ Hide Enrolled Courses"
                  : "▶ View Enrolled Courses"}
              </button>

              {expanded[student._id] && (
                <div className="mt-3">
                  {student.courses && student.courses.length > 0 ? (
                    <ul className="space-y-3">
                      {student.courses.map((course, i) => (
                        <li
                          key={i}
                          className="border rounded-xl p-3 bg-gray-50 hover:bg-gray-100 transition"
                        >
                          <p className="font-medium text-gray-800">
                            {course.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            {course.category} • {course.status}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-600">
                              Payment:{" "}
                              <span
                                className={
                                  course.paymentStatus === "Paid"
                                    ? "text-green-600 font-medium"
                                    : "text-red-600 font-medium"
                                }
                              >
                                {course.paymentStatus}
                              </span>
                            </span>
                            <span className="text-xs text-gray-600">
                              {course.progress}% progress
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Completed: {course.completed} • Enrolled:{" "}
                            {course.enrolledAt}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm mt-2">
                      No courses enrolled
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 📑 Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-lg bg-white shadow-sm disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-lg bg-white shadow-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
