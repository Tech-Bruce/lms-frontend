import React, { useEffect, useState } from 'react';
import api from '../../api';

const AssignCourseForm = ({ instructor_id }) => {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [role, setRole] = useState('Lead-Instructor');
  const [message, setMessage] = useState('');
   
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses/');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses', err);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!instructor_id || !courseId) {
      return alert("Instructor and course are required.");
    }

    try {
      const res = await api.post('/instructors/assign-course', {
        instructorId: instructor_id,
        courseId,
        role
      });
      setMessage('Course assigned successfully!');
      console.log(res)
    } catch (err) {
      console.error(err);
      setMessage('Failed to assign course.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Assign Course</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Course</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">-- Select Course --</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Role selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Lead-Instructor">Lead-Instructor</option>
            <option value="Assistant">Assistant</option>
            <option value="Guest-Lecturer">Guest-Lecturer</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Assign Course
        </button>

        {/* Message */}
        {message && <p className="text-center text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
};

export default AssignCourseForm;
