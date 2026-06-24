import React, { useState } from "react";
import {
  useGetModulesQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
} from "../../redux/moduleApi";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, PlusCircle, X } from "lucide-react";
import ModuleForm from "./ModuleForm";

const ModuleList = () => {
  const { courseId } = useParams();
  const Navigate = useNavigate();
  const { data: modules = [], isLoading } = useGetModulesQuery(courseId);
  const [createModule] = useCreateModuleMutation();
  const [updateModule] = useUpdateModuleMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  if (!courseId) return <p>No course selected</p>;
  if (isLoading) return <p>Loading...</p>;
const handleNavigate = ({moduleId}) => {
    Navigate(`/lession/${moduleId}/builder`);
  };
  const handleCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (module) => {
    setEditData(module);
    setModalOpen(true);
  };
const handleDelete = async (moduleId) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
        // await updateModule({ moduleId });
    }
  };
  const handleSubmit = async (values) => {
    if (editData) {
      await updateModule({ moduleId: editData._id, ...values });
    } else {
      await createModule({ courseId, ...values });
    }
    setModalOpen(false);
  };
  return (
    <div className="p-4 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Modules</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <PlusCircle size={18} /> Add Module
        </button>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((m) => (
       <div
  key={m._id}
  className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
>
  {/* Top Actions */}
  <div className="absolute top-3 right-3 flex gap-2">
    <button
      onClick={() => handleEdit(m)}
      className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition"
    >
      <Pencil size={16} />
    </button>

    <button
      onClick={()=>handleNavigate({moduleId: m._id})}
      className="px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium transition"
    >
      Build Lesson
    </button>

    <button
      onClick={() => handleDelete(m._id)}
      className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition"
    >
      <X size={16} />
    </button>
  </div>

  {/* Content */}
  <h3 className="text-lg font-semibold mb-2 text-gray-800 hover:text-blue-600 transition">
    {m.title}
  </h3>
  <p className="text-gray-600 text-sm mb-3">{m.description}</p>

  {/* Footer Info */}
  <div className="flex items-center justify-between text-xs text-gray-500 mt-4 border-t pt-3">
    <span>Order: {m.order}</span>
    <span>Created: {new Date(m.createdAt).toLocaleDateString()}</span>
  </div>
</div>



        ))}
      </div>

      {/* Form Modal */}
      {modalOpen && (
        <ModuleForm
          initialValues={
            editData || { title: "", description: "", order: 1 }
          }
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ModuleList;
