import React, { useEffect, useMemo, useState } from "react";
import axios from "../api";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { 
  Users, 
  Search, 
  SlidersHorizontal, 
  Edit3, 
  X, 
  Check, 
  AlertTriangle 
} from "lucide-react";

const courseMap = {
  "6875fe6491444202a0b0ee5d": "React Development",
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
        header: "Name",
        accessorKey: "name",
        cell: (info) => {
          const name = info.getValue();
          const role = info.row.original.role;
          return (
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 border border-indigo-100/50 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">{name}</div>
                <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{role}</div>
              </div>
            </div>
          );
        }
      },
      {
        header: "Email Address",
        accessorKey: "email",
        cell: (info) => <span className="text-sm font-medium text-slate-500">{info.getValue()}</span>
      },
      {
        header: "Role Category",
        accessorKey: "role",
        cell: (info) => {
          const role = info.getValue();
          return (
            <span
              className={`inline-flex px-2.5 py-0.5 text-xs font-bold rounded-lg border ${
                role === "student"
                  ? "bg-blue-50 text-blue-700 border-blue-100/40"
                  : role === "instructor"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100/40"
                  : "bg-indigo-50 text-indigo-700 border-indigo-100/40"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          );
        },
      },
      {
        header: "Active Status",
        accessorKey: "isActive",
        cell: (info) => {
          const isActive = info.getValue();
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-lg border ${
                isActive 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100/40" 
                  : "bg-rose-50 text-rose-700 border-rose-100/40"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
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
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200/80 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-950">
            User Directory
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Monitor accounts, adjust security authorization roles, and toggle platform activation parameters
          </p>
        </div>
      </div>

      {/* Filter and search controls */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 sm:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search directory by name or email..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-slate-850 font-medium"
          />
        </div>

        {/* Role Selector */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-44 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200 font-semibold text-sm"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 font-medium bg-white border border-slate-200/60 rounded-2xl">
          Syncing records database...
        </div>
      ) : table.getRowModel().rows.length === 0 ? (
        <div className="py-12 text-center text-slate-450 font-medium bg-white border border-slate-200/60 rounded-2xl">
          No matching records registered in this partition
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
          <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Directory Records</h2>
            </div>
            <span className="text-slate-400 text-xs font-semibold">
              {table.getRowModel().rows.length} User Records Listed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-slate-50/50 border-b border-slate-200/80">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => {
                          setEditUser(row.original);
                          setIsEditOpen(true);
                        }}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-900 font-semibold transition-colors"
                      >
                        <Edit3 className="w-4 h-4 mr-1.5" />
                        Edit Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200/80">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-xs text-slate-400 font-bold">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit User Modal Overlay */}
      {isEditOpen && editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-2xl max-w-md w-full overflow-hidden relative p-6 space-y-6 transition-transform duration-200">
            
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-655 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 pr-8">
              Adjust User Account
            </h3>

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
                  alert("User profile updated successfully");
                } catch (error) {
                  console.error("Error updating user:", error);
                  alert("Failed to save profile changes");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Password{" "}
                  <span className="text-[10px] text-slate-400 font-medium normal-case">
                    (Leave blank to keep current)
                  </span>
                </label>
                <input
                  type="password"
                  value={editUser.password || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, password: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role Category</label>
                  <select
                    value={editUser.role}
                    onChange={(e) =>
                      setEditUser({ ...editUser, role: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 font-semibold text-xs"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Account Strikes</label>
                  <input
                    type="number"
                    value={editUser.strike}
                    onChange={(e) =>
                      setEditUser({ ...editUser, strike: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Active Toggle Switch */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Account Active Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editUser.isActive}
                    onChange={(e) =>
                      setEditUser({ ...editUser, isActive: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-505 bg-gray-300 peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold transition-all duration-150 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] transition-all duration-150 text-xs"
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
