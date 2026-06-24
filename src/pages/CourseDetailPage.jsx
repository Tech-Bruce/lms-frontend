import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api'; // Ensure axios baseURL is correctly set here
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state?.lms_auth.user);
  const uploadurl = import.meta.env.VITE_API_UPLOAD_URL ;

 const handleEnroll = (course) => async () => {
  try {
    const response = await api.post(`/students/enrollments/${user.id}`, {
      courseId: course._id,
    });


    // Check if enrollment was successful
    if (response.data?.message === 'Enrolled successfully') {
      toast.success('Enrolled successfully!');
    } else {
      toast.error(response.data?.message || 'Failed to enroll in the course.');
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || 'Something went wrong. Please try again.'
    );
  }
};

  // Fetch courses and set the one matching the URL
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get(`/courses/${courseId}`); // Adjust endpoint if needed
        setCourse(res.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [courseId]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-white">Loading...</div>;
  }

  if (!course) {
    return <div className="min-h-screen flex justify-center items-center text-white">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gray-700 px-6 py-8">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <img src={uploadurl + "/course/" + course.thumbnail} alt={course.title} className="mt-4 w-full h-48 object-cover rounded-lg" />
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {course.level}
              </span>
              <span className="text-gray-300">{course.duration} program</span>
              <span className="text-xl font-bold text-green-400">${course.price}</span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Course Description</h2>
                <p className="text-gray-300 mb-8">{course.description}</p>

                <h2 className="text-2xl font-bold mb-4">Syllabus</h2>
                <ul className="space-y-4">
                  {course.syllabus?.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">{index + 1}.</div>
                      <p className="ml-3 text-gray-300">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Course Features</h3>
                  <ul className="space-y-3">
                    {course.features?.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button onClick={handleEnroll(course)} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
                    Enroll Now
                  </button>

                  <div className="mt-6 pt-6 border-t border-gray-600">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Have questions?</h4>
                    <Link to="/contact" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      Contact our admissions team
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default CourseDetailPage;
