import React, { useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Users,
  BookOpen,
  Filter,
} from 'lucide-react';
import { groupBy } from 'lodash';
import api from '../../api';

const StudentEnrollmentPage = ({ courses }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  
  // New state for course filter
  const [courseFilter, setCourseFilter] = useState('');

  const getCourseIds = (courses) => courses.map(c => c.courseId._id);

  const fetchStudentEnrollmentsByCourseId = async () => {
    setLoading(true);
    try {
      const courseIds = getCourseIds(courses);
      const response = await api.post('/instructors/enrollments-by-course-ids', { courseIds });
      
      if (response.data.success) {
        const enrollments = response.data.data || [];
        
        // Flatten data: one entry per student with course info
        const flatStudents = enrollments
          .map(course =>
            course.students.map(student => ({
              studentId: student._id,
              name: student.name,
              email: student.email,
              courseName: course.courseName,
              courseId: course.courseId,
              strike: student.strike,
              role: student.role,
            }))
          ).flat();
        
        setStudents(flatStudents);
      }
    } catch (error) {
      console.error('Error fetching student enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courses && courses.length > 0) {
      fetchStudentEnrollmentsByCourseId();
    }
  }, [courses]);

  // Unique course names for dropdown
  const courseOptions = useMemo(() => {
    return Array.from(new Set(students.map(s => s.courseName))).sort();
  }, [students]);

  // When courseFilter changes, update the columnFilters
  useEffect(() => {
    if (courseFilter) {
      setColumnFilters([{ id: 'courseName', value: courseFilter }]);
    } else {
      setColumnFilters([]);
    }
  }, [courseFilter]);

  // Create table columns
  const columnHelper = createColumnHelper();
  
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Student Name',
        cell: (info) => (
          <div className="font-medium text-gray-900">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => (
          <div className="text-gray-600">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('courseName', {
        header: 'Course',
        cell: (info) => (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <BookOpen className="w-3 h-3 mr-1" />
            {info.getValue()}
          </div>
        ),
        filterFn: (row, columnId, filterValue) => {
          return row.getValue(columnId) === filterValue;
        },
      }),
      columnHelper.accessor('strike', {
        header: 'Strikes',
        cell: (info) => {
          const strikes = info.getValue();
          return (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              strikes === 0 
                ? 'bg-green-100 text-green-800' 
                : strikes <= 2 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {strikes}
            </div>
          );
        },
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: (info) => (
          <div className="text-gray-600 capitalize">
            {info.getValue()}
          </div>
        ),
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
      columnFilters,
      sorting,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const filteredStudents = table.getFilteredRowModel().rows.map(row => row.original);
    const totalStudents = filteredStudents.length;
    const uniqueStudents = new Set(filteredStudents.map(s => s.studentId)).size;
    const coursesWithStudents = groupBy(filteredStudents, 'courseName');
    const totalCourses = Object.keys(coursesWithStudents).length;
    
    return {
      totalEnrollments: totalStudents,
      uniqueStudents,
      totalCourses,
    };
  }, [table.getFilteredRowModel().rows]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading student enrollments...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Enrollments</h1>
          <p className="text-gray-600">Manage and view student enrollments across courses</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unique Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.uniqueStudents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between space-y-4 md:space-y-0 md:space-x-4">
            {/* Global search */}
            <div className="flex-1 max-w-md">
              <label htmlFor="global-search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Students
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="global-search"
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by name, email..."
                />
              </div>
            </div>

            {/* Course dropdown filter */}
            <div className="w-full md:w-64">
              <label htmlFor="course-filter" className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                Filter by Course
              </label>
              <select
                id="course-filter"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Courses</option>
                {courseOptions.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear filters button */}
            {(globalFilter || courseFilter) && (
              <div className="w-full md:w-auto">
                <button
                  onClick={() => {
                    setGlobalFilter('');
                    setCourseFilter('');
                  }}
                  className="w-full md:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center space-x-1">
                          <span>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {{
                            asc: <ChevronUp className="h-4 w-4" />,
                            desc: <ChevronDown className="h-4 w-4" />,
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Users className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium">No students found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {table.getRowModel().rows.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                      )}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronsLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <button
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      disabled={!table.getCanNextPage()}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronsRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentEnrollmentPage;
