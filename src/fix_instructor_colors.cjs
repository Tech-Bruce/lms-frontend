const fs = require('fs');
const file = '/Users/nivi/Desktop/Projects/gesdemn/LMS/Frontend/src/pages/InstructorDetails.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace columns
content = content.replace(/const columns = useMemo\([\s\S]*?\],\s*\[\]\s*\);/, `const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => {
          const name = info.getValue();
          const role = info.row.original.role;
          return (
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{name}</div>
                <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{role}</div>
              </div>
            </div>
          );
        }
      },
      {
        header: "Email Address",
        accessorKey: "email",
        cell: (info) => <span className="text-sm font-medium text-slate-400">{info.getValue()}</span>
      },
      {
        header: "Role Category",
        accessorKey: "role",
        cell: (info) => {
          const role = info.getValue();
          return (
            <span
              className={\`inline-flex px-2.5 py-0.5 text-xs font-bold rounded-lg border \${
                role === "student"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : role === "instructor"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-purple-500/10 text-purple-400 border-purple-500/20"
              }\`}
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
              className={\`inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-lg border \${
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
              }\`}
            >
              <span className={\`w-1.5 h-1.5 rounded-full mr-1.5 \${isActive ? "bg-emerald-400" : "bg-rose-400"}\`} />
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },
    ],
    []
  );`);

// Replace return block
content = content.replace(/return \(\s*<div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">[\s\S]*\);\s*};\s*export default UserManagement;/m, `return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 bg-background text-text-main p-6 sm:p-8 rounded-[2rem] border border-white/5">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            User Directory
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            Monitor accounts, adjust security authorization roles, and toggle platform activation parameters
          </p>
        </div>
      </div>

      {/* Filter and search controls */}
      <div className="bg-surface rounded-2xl border border-white/5 shadow-sm p-4 sm:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search directory by name or email..."
            className="w-full pl-11 pr-4 py-2.5 bg-background border border-white/10 focus:bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 text-white font-medium placeholder-slate-500"
          />
        </div>

        {/* Role Selector */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-44 px-4 py-2.5 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 focus:bg-background transition-all duration-200 font-semibold text-sm"
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
        <div className="py-12 text-center text-slate-500 font-medium bg-surface border border-white/5 rounded-2xl">
          Syncing records database...
        </div>
      ) : table.getRowModel().rows.length === 0 ? (
        <div className="py-12 text-center text-slate-500 font-medium bg-surface border border-white/5 rounded-2xl">
          No matching records registered in this partition
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-white/5 shadow-sm overflow-hidden transition-all duration-200">
          <div className="px-6 py-4.5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-white">Directory Records</h2>
            </div>
            <span className="text-cyan-400 text-xs font-semibold">
              {table.getRowModel().rows.length} User Records Listed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-white/[0.02] border-b border-white/5">
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
              <tbody className="divide-y divide-white/5 bg-transparent">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
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
                        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
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
          <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-t border-white/5">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 text-xs font-bold bg-background border border-white/10 hover:bg-white/5 rounded-xl text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              className="px-4 py-2 text-xs font-bold bg-background border border-white/10 hover:bg-white/5 rounded-xl text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit User Modal Overlay */}
      {isEditOpen && editUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-surface rounded-3xl border border-white/10 shadow-2xl max-w-md w-full overflow-hidden relative p-6 space-y-6 transition-transform duration-200">
            
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-white pr-8">
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

                  await axios.put(\`/users/\${editUser._id}\`, updatedData);

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
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Password{" "}
                  <span className="text-[10px] text-slate-500 font-medium normal-case">
                    (Leave blank to keep current)
                  </span>
                </label>
                <input
                  type="password"
                  value={editUser.password || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, password: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 placeholder-slate-600"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Role Category</label>
                  <select
                    value={editUser.role}
                    onChange={(e) =>
                      setEditUser({ ...editUser, role: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 font-semibold text-xs"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Account Strikes</label>
                  <input
                    type="number"
                    value={editUser.strike}
                    onChange={(e) =>
                      setEditUser({ ...editUser, strike: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Active Toggle Switch */}
              <div className="flex items-center justify-between p-3.5 bg-background rounded-xl border border-white/5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Active Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editUser.isActive}
                    onChange={(e) =>
                      setEditUser({ ...editUser, isActive: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-transparent after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold transition-all duration-150 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-background px-5 py-2.5 rounded-xl font-bold shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-[0.98] transition-all duration-150 text-xs"
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
`);

fs.writeFileSync(file, content);
console.log("Updated InstructorDetails colors");
