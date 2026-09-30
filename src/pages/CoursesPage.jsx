import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { FiArrowRight, FiBookOpen, FiStar, FiClock } from 'react-icons/fi';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#070B14] text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 inset-x-0 h-[500px] w-full bg-gradient-to-b from-cyan-900/20 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-6">
            <FiBookOpen className="w-4 h-4 animate-pulse" />
            <span>Premium Training</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Cybersecurity Courses</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400">
            Hands-on, immersive programs designed by industry experts to launch or accelerate your career in offensive and defensive security.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          /* Course Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course._id}
                className="group relative flex flex-col justify-between bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(34,211,238,0.15)]"
              >
                {/* Highlight line on hover */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div className="p-8 pb-0">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center text-xs font-bold text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 rounded-full uppercase tracking-wider">
                        {course.category}
                      </span>
                      {course.featured && (
                        <span className="inline-flex items-center text-xs font-bold text-yellow-300 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full uppercase tracking-wider">
                          <FiStar className="w-3 h-3 mr-1" /> Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2">
                    {course.title}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {course.description}
                  </p>
                </div>

                <div className="p-8 pt-6 mt-auto">
                  <div className="flex items-center justify-between border-t border-white/10 pt-6">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">Enrollment Fee</span>
                      <span className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">
                        ${course.price}
                      </span>
                    </div>
                    
                    <Link
                      to={`/courses/${course._id}`}
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 group-hover:bg-cyan-500 group-hover:border-cyan-500 group-hover:text-black transition-all duration-300 shadow-lg"
                      title="View Course Details"
                    >
                      <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Banner */}
        {!isLoading && courses.length > 0 && (
          <div className="mt-24 relative rounded-3xl overflow-hidden border border-blue-500/20 bg-blue-900/10 p-10 md:p-14 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-400/10" />
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Unsure where to begin?</h2>
              <p className="text-slate-400 mb-8 max-w-xl text-lg">
                Schedule a call with our academic advisors to map out the perfect learning path for your career goals.
              </p>
              <Link
                to="/contact"
                className="px-8 py-4 rounded-xl text-black bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all text-sm font-bold tracking-wider uppercase"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CoursesPage;
