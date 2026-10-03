import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { FiArrowRight, FiBookOpen, FiStar, FiClock } from 'react-icons/fi';
import imgCinematic from "../assets/Cinematic .png";
import CourseCard from '../components/CourseCard';

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
    <div className="min-h-screen bg-background text-text-main relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden h-screen flex items-center pt-28 md:pt-32 pb-16 border-b border-gray-900/80">
        <div className="absolute inset-0 z-0">
          <img 
            src={imgCinematic} 
            alt="Academy Background" 
            className="absolute inset-0 w-full h-full object-cover object-center" 
          />
          <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-sm"></div>
          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col text-left space-y-6 lg:space-y-8 lg:max-w-3xl mt-8 md:mt-0">
            <div className="inline-flex items-center space-x-2 bg-primary-cyan/10 border border-primary-cyan/30 rounded-full px-4 py-1.5 text-primary-cyan text-sm font-semibold tracking-wider uppercase mb-2 w-max">
              <FiBookOpen className="w-4 h-4 text-primary-cyan" />
              <span>Cyber Security Academy</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-white">
              Master Elite <br className="hidden md:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-cyan to-primary-blue">
                Defensive Tactics.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
              Elevate your skills from foundational concepts to advanced practical operations. Train in realistic SOC environments and master the methodologies deployed by top-tier cybersecurity professionals.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          /* Course Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={course._id} className="h-[450px]">
                <CourseCard course={course} index={index} />
              </div>
            ))}
          </div>
        )}

        {/* CTA Banner */}
        {!isLoading && courses.length > 0 && (
          <div className="mt-24 relative rounded-3xl overflow-hidden border border-primary-blue/20 bg-surface2 p-10 md:p-14 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-blue/10 to-primary-cyan/10" />
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for your first mission?</h2>
              <p className="text-text-muted mb-8 max-w-xl text-lg">
                Work with alerts, logs, endpoints, and threat intelligence in a real defensive environment.
              </p>
              <Link
                to="/missions"
                className="px-8 py-4 rounded-xl text-background bg-primary-cyan hover:bg-cyan-300 shadow-[0_0_20px_rgba(37,217,255,0.3)] transition-all text-sm font-bold tracking-wider uppercase"
              >
                Explore Missions
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CoursesPage;
