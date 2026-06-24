import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data); // assuming axios or similar
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            🚀 Explore Our Cybersecurity Courses
          </h1>
          <p className="mt-4 text-lg text-blue-300">
            Hands-on programs to launch or grow your career in cybersecurity and tech.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-xl shadow-lg p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-semibold text-white">{course.title}</h2>
                  <span className="bg-green-500 text-sm font-medium px-3 py-1 rounded-full">
                    ${course.price}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-4 line-clamp-4">
                  {course.description}
                </p>

                <div className="mb-4">
                  <span className="inline-block text-xs font-semibold text-blue-400 bg-blue-900 px-3 py-1 rounded-full uppercase tracking-wide">
                    {course.category}
                  </span>
                  {course.featured && (
                    <span className="inline-block ml-2 text-xs font-semibold text-yellow-400 bg-yellow-900 px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700 flex justify-between items-center mt-4">
                {/* <span className="text-sm text-gray-400">ID: {course._id.slice(-6)}</span> */}
                <Link
                  to={`/courses/${course._id}`}
                  className="text-blue-400 hover:underline text-sm"
                >
                  Learn more →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold mb-4">Need Help Choosing?</h2>
          <p className="text-gray-300 mb-6">
            Our experts can guide you to the right course based on your goals.
          </p>
          <Link
            to="/contact"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
