import React, { useState, useEffect } from "react";
import {
  useCreateBlogMutation,
  useGetBlogsQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "../../redux/blogApi";
import TiptapBlogWriter from "./TiptapBlogWriter";

const AdminBlog = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "poster",
    content: "",
    createdBy: "Admin",
  });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [initialContent, setInitialContent] = useState("");

  const { data: blogs, isLoading, isError } = useGetBlogsQuery();
  const [createBlog] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  // Set blog content from Tiptap
  const handleContentChange = (data) => {
    setForm((prev) => ({ ...prev, content: data }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("type", form.type);
    if (form.content) formData.append("content", form.content);
    formData.append("createdBy", form.createdBy);
    if (file) formData.append("file", file);

    try {
      if (editingId) {
        await updateBlog({ id: editingId, formData }).unwrap();
      } else {
        await createBlog(formData).unwrap();
      }
    } catch (err) {
      console.error("Blog submission failed", err);
    }

    // Reset form
    setForm({
      title: "",
      description: "",
      type: "poster",
      content: "",
      createdBy: "Admin",
    });
    setFile(null);
    setEditingId(null);
    setInitialContent(""); // Reset Tiptap content
  };

  const handleEdit = (blog) => {    
    setForm({
      title: blog.title,
      description: blog.description,
      type: blog.type,
      content: blog.content || "",
      createdBy: blog.createdBy,
    });
    setInitialContent(blog.content || "");
    setEditingId(blog._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      await deleteBlog(id);
    }
  };

  const BASE_URL = "http://localhost:8000";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        📝 {editingId ? "Edit Blog" : "Admin Blog Dashboard"}
      </h1>

      {/* Blog Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-10 space-y-4"
      >
        <input
          type="text"
          placeholder="Enter blog title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />

        <textarea
          placeholder="Enter blog description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="poster">Poster</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
        </select>

        <input
          type="file"
          accept={
            form.type === "poster"
              ? "image/*"
              : form.type === "video"
              ? "video/mp4,video/webm"
              : ".pdf,.doc,.docx"
          }
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
        />

        {/* Tiptap Editor */}
        <TiptapBlogWriter onSave={handleContentChange} initialContent={initialContent} />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {editingId ? "Update Blog" : "Create Blog"}
        </button>
      </form>

      {/* Blog List */}
      <h2 className="text-2xl font-semibold mb-4">📚 All Blogs</h2>
      {isLoading && <p>Loading blogs...</p>}
      {isError && <p className="text-red-500">Failed to load blogs</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs?.map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold mb-2">{blog.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{blog.description}</p>

            {blog.type === "poster" && (
              <img
                src={`${BASE_URL}${blog.fileUrl}`}
                alt={blog.title}
                className="rounded-lg w-full h-48 object-cover"
              />
            )}

            {blog.type === "video" && (
              <video
                controls
                className="w-full h-48 object-contain bg-black rounded-lg"
              >
                <source src={`${BASE_URL}${blog.fileUrl}`} type="video/mp4" />
              </video>
            )}

            {blog.type === "document" && (
              <a
                href={`${BASE_URL}${blog.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full h-48 flex items-center justify-center bg-gray-200 text-blue-600 font-semibold rounded-lg"
              >
                📄 View Document
              </a>
            )}

            {/* Blog Actions */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(blog)}
                className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlog;
