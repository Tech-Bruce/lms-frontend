import React, { useEffect, useState } from "react";
import axios from "../../api";
import CreateCourseForm from "./CreateCoureseFrom";

const AdminCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/courses");
      setCourses(res.data);
    } catch {
      alert("Failed to load courses");
    }
  };

  const handleOpen = (course = null) => {
    setShowModal(true);
    if (course) {
      setEditMode(true);
      setCurrentCourse(course);
    } else {
      setEditMode(false);
      setCurrentCourse(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`/courses/${id}`);
      fetchCourses();
      alert("Course deleted successfully");
    } catch {
      alert("Failed to delete course");
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <input
          type="text"
          placeholder="Search courses..."
          className="border rounded px-4 py-2 w-80"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => handleOpen()}
        >
          + Add New Course
        </button>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Students</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="p-3 border">{c.title}</td>
                <td className="p-3 border">{c.category}</td>
                <td className="p-3 border">{c.students}</td>
                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      c.status === "published"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-3 border">${c.price}</td>
                <td className="p-3 border space-x-2">
                  <button
                    className="text-blue-600"
                    onClick={() => handleOpen(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No courses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl">
            <h3 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Course" : "Create New Course"}
            </h3>
            <CreateCourseForm
              initialValues={
                currentCourse || {
                  title: "",
                  category: "",
                  description: "",
                  price: "",
                  thumbnail: null,
                  status: "draft",
                  featured: false,
                  isNav: false,
                }
              }
              editMode={editMode}
              currentCourse={currentCourse}
              onClose={() => setShowModal(false)}
              onSuccess={() => {
                fetchCourses();
                setShowModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseManagement;
