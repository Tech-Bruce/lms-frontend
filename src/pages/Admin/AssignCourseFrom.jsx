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
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Course selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Select Course</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-cyan text-white transition-all [&>option]:bg-surface"
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
          <label className="block text-sm font-medium text-slate-300 mb-1">Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-cyan text-white transition-all [&>option]:bg-surface"
          >
            <option value="Lead-Instructor">Lead-Instructor</option>
            <option value="Assistant">Assistant</option>
            <option value="Guest-Lecturer">Guest-Lecturer</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 px-4 py-2 bg-primary-cyan hover:bg-cyan-300 text-[#07121D] rounded-xl font-bold transition-colors"
        >
          Assign Course
        </button>

        {/* Message */}
        {message && <p className="text-center text-sm text-primary-cyan mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default AssignCourseForm;
