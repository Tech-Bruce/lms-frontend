import React, { useEffect, useMemo, useState } from "react";
import axios from "../api";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

const courseMap = {
  "6875fe6491444202a0b0ee5d": "React Development",
  // Add more if needed
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users");
        setUsers(res.data.users || res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter by role
  const filteredUsers = useMemo(() => {
    if (roleFilter === "all") return users;
    return users.filter((user) => user.role === roleFilter);
  }, [users, roleFilter]);

  // Table Columns
  const columns = useMemo(
    () => [
      {
        header: "Role",
        accessorKey: "role",
        cell: (info) => {
          const role = info.getValue();
          return (
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                role === "student"
                  ? "bg-blue-100 text-blue-800"
                  : role === "instructor"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          );
        },
      },
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
   {
        header: "Active Status",
        accessorKey: "isActive",
        cell: (info) => {
          const isActive = info.getValue();
          return (
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredUsers,
    columns,
    state: { globalFilter },
    pagination: {
      pageIndex: 0,
      pageSize: 20
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">User Management</h1>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>

        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search users..."
          className="p-2 border border-gray-300 rounded-md w-full max-w-xs"
        />
      </div>

      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : table.getRowModel().rows.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        setEditUser(row.original);
                        setIsEditOpen(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
     {isEditOpen && editUser && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
      <h2 className="text-xl font-semibold mb-4">Edit User</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const updatedData = {
              name: editUser.name,
              email: editUser.email,
              role: editUser.role,
              course: editUser.course,
              strike: Number(editUser.strike),
              isActive: !!editUser.isActive,
            };
            if (editUser.password?.trim()) {
              updatedData.password = editUser.password;
            }

            await axios.put(`/users/${editUser._id}`, updatedData);

            const res = await axios.get("/users");
            setUsers(res.data.users || res.data);
            setIsEditOpen(false);
          } catch (error) {
            console.error("Error updating user:", error);
          }
        }}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={editUser.name}
            onChange={(e) =>
              setEditUser({ ...editUser, name: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={editUser.email}
            onChange={(e) =>
              setEditUser({ ...editUser, email: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">
            Password{" "}
            <span className="text-xs text-gray-500">
              (Leave blank to keep current password)
            </span>
          </label>
          <input
            type="password"
            value={editUser.password || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, password: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Role</label>
          <select
            value={editUser.role}
            onChange={(e) =>
              setEditUser({ ...editUser, role: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Strike</label>
          <input
            type="number"
            value={editUser.strike}
            onChange={(e) =>
              setEditUser({ ...editUser, strike: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Fixed Active Status block */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Active Status</label>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!editUser.isActive}
                onChange={(e) =>
                  setEditUser({ ...editUser, isActive: e.target.checked })
                }
                className="sr-only"
              />
              <span
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                  editUser.isActive ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                    editUser.isActive ? "translate-x-4" : ""
                  }`}
                />
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsEditOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default UserManagement;
