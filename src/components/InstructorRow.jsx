import React, { useState } from 'react';

const InstructorRow = ({ instructor }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!instructor) return null;

  return (
    <>
      <tr className="hover:bg-gray-50">
        {/* ✅ ROLE COLUMN */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Instructor
          </span>
        </td>

        {/* ✅ NAME COLUMN */}
        <td className="px-6 py-4 whitespace-nowrap text-gray-900 text-sm font-medium">
          {instructor.name}
        </td>

        {/* ✅ EMAIL */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {instructor.email}
        </td>

        {/* ✅ COURSE */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            {instructor.course || 'N/A'}
          </span>
        </td>

        {/* ✅ ACTIONS */}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            {showDetails ? 'Hide' : 'View'} Details
          </button>
        </td>
      </tr>

      {/* ✅ EXPANDED DETAILS */}
      {showDetails && (
        <tr className="bg-gray-100">
          <td colSpan="5">
            <div className="p-4 text-sm text-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Bio:</strong> {instructor.bio || 'Experienced in modern web technologies.'}</p>
                  <p><strong>Subjects:</strong> {instructor.subjects?.join(', ') || 'Web Development, JavaScript'}</p>
                  <p><strong>Active Students:</strong> {instructor.activeStudents || 45}</p>
                  <p><strong>One-on-One Slots:</strong> {instructor.oneOnOneSlots || 'Mon, Wed - 3PM to 5PM'}</p>
                </div>
                <div>
                  <p><strong>Average Rating:</strong> {instructor.rating || 4.5} / 5 ⭐</p>
                  <p><strong>% Course Completion:</strong> {instructor.completionRate || 85}%</p>
                  <p><strong>Sessions Delivered:</strong> {instructor.sessions || 120}</p>
                  <p><strong>Joined:</strong> {new Date(instructor.joinedDate || Date.now()).toDateString()}</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default InstructorRow;
