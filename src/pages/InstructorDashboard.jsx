import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import InstructorForm from './Instructor/InstructorForm';
import MentorDashboard from './Instructor/MentorshipDashboard';
import StudentEnrollmentPage from './Instructor/StudentEnrollmentPage';

const InstructorDashboard = () => {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('myCourses');
  const [profile, setProfile] = useState(undefined);
  const user = useSelector((state) => state?.lms_auth?.user);
  const navigate = useNavigate();
// console.log(user  ,"udrt");

  const fetchCourses = async () => {
    try {
      const response = await api.get(`/instructors/get-courses/${user.id}`);
      setAssignedCourses(response.data.courses || []);

    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };
  const fetchProfile = async () => {
    try {
      
      const res = await api.get(`/instructors/profile/${user.id}`); 
      if(res.data.data){
        setActiveTab('myCourses');
        setProfile(res.data.data);
      }
      else{
        setActiveTab('profile');
      }
    } catch (error) {

      console.error('Error fetching profile:', error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        await fetchCourses();
        await fetchProfile();
      }
    };
    fetchData();
  }, [user?.id]);

  const createProfile = async (formData) => {
    // console.log(formData);
    formData.append('userId', user.id);
    const res = await api.post('/instructors/create-profile', formData)
  };
  const updateProfile = async (formData) => {
    // console.log(formData);
    formData.append('userId', user.id);
    const res = await api.post('/instructors/update-profile', formData)
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Instructor Dashboard</h2>

        <div
          className={`flex items-center p-3 mb-2 rounded cursor-pointer ${
            activeTab === 'myCourses' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('myCourses')}
        >
          <span>My Courses</span>
        </div>

        <div
          className={`flex items-center p-3 mb-2 rounded cursor-pointer ${
            activeTab === 'students' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('students')}
        >
          <span>Students Enrolled</span>
        </div>

        <div
          className={`flex items-center p-3 mb-2 rounded cursor-pointer ${
            activeTab === 'profile' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          <span>Profile</span>
        </div>

        {/* FIX: Navigate to Mentor Dashboard */}
         <div
          className={`flex items-center p-3 mb-2 rounded cursor-pointer ${
            activeTab === "mentorDashboard" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("mentorDashboard")}
        >
          <span>Mentor Dashboard</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === 'myCourses' && (
          <>
            <h1 className="text-2xl font-bold mb-6">My Courses</h1>
            {assignedCourses.length === 0 ? (
              <p className="text-gray-600">No courses assigned yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignedCourses.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white shadow rounded-lg p-4 border border-gray-200"
                  >
                    <h2 className="text-lg font-semibold text-blue-700 mb-1">
                      {item.courseId?.title || 'Untitled'}
                    </h2>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Category:</strong> {item.courseId?.category}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Price:</strong> ₹{item.courseId?.price}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Status:</strong> {item.courseId?.status}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Role:</strong> {item.role}
                    </p>
                    <p className="text-xs text-gray-400">
                      Assigned on: {new Date(item.assignedDate).toLocaleDateString()}
                    </p>
                    <div className="mt-4">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        onClick={() => {
                          window.location.href = `/courses/module/builder/${item.courseId._id}`;
                        }}
                      >
                        Build Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'students' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Students Enrolled</h1>
<StudentEnrollmentPage  courses={assignedCourses}/>
          </div>
        )}

        {activeTab === 'profile' && <InstructorForm initialValues={profile} onSubmit={profile?updateProfile:createProfile} />}
        {activeTab === 'mentorDashboard' && <MentorDashboard />}
      </div>
    </div>
  );
};

export default InstructorDashboard;
