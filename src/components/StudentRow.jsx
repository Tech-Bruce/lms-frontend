import React from 'react';

const StudentRow = ({ student }) => {
  const handleView = () => {
    alert(`Viewing profile of: ${student.name}`);
  };

  const handleDelete = () => {
    alert(`Deleting student: ${student.name}`);
  };

  return (
    <tr className="hover:bg-gray-50 transition duration-150">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 capitalize">
        {student.role}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        {student.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {student.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {student.course || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <button
          onClick={handleView}
          className="text-indigo-600 hover:text-indigo-900 mr-4"
        >
          View
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default StudentRow;
