import React, { useState, useEffect } from "react";
import {
  useCreateBlogMutation,
  useGetBlogsQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "../../redux/blogApi";
import TiptapBlogWriter from "./TiptapBlogWriter";
import { 
  FileText, 
  UploadCloud, 
  Edit3, 
  Trash2, 
  Compass, 
  File, 
  Video, 
  Image, 
  Globe, 
  Plus,
  Eye,
  CheckCircle 
} from "lucide-react";

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
        alert("Blog updated successfully");
      } else {
        await createBlog(formData).unwrap();
        alert("Blog created successfully");
      }
    } catch (err) {
      console.error("Blog submission failed", err);
      alert("Submission failed");
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      await deleteBlog(id);
    }
  };

  const BASE_URL = import.meta.env.VITE_API_UPLOAD_URL.replace('/uploads', '');

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200/85 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-950">
            {editingId ? "Edit Blog Publication" : "Blog Publication Centre"}
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Draft, format, compile and publish rich-text articles or multimedia posters to the student blog
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-50/60 border border-indigo-100/50 px-4 py-2 rounded-2xl shadow-sm text-indigo-700 font-semibold text-xs uppercase tracking-wider">
          <Globe className="w-4 h-4 mr-1 animate-spin" />
          <span>Publish Live</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Editor & Metadata Form: takes 2/3 cols on lg screens */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200/65 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200 p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
              Article Composer
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Blog Title</label>
                <input
                  type="text"
                  placeholder="e.g. Navigating React Server Components in 2026"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Short Description</label>
                <textarea
                  placeholder="Enter a brief summary overview of the post..."
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Publication Media Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => {
                      setForm({ ...form, type: e.target.value });
                      setFile(null); // Clear incompatible file preview on type swap
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="poster">Poster (Image file)</option>
                    <option value="video">Video (MP4/WebM file)</option>
                    <option value="document">Document (PDF/Word file)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Media Attachment</label>
                  <div className="relative group">
                    <input
                      type="file"
                      id="blog-media-upload"
                      accept={
                        form.type === "poster"
                          ? "image/*"
                          : form.type === "video"
                          ? "video/mp4,video/webm"
                          : ".pdf,.doc,.docx"
                      }
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label
                      htmlFor="blog-media-upload"
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-dashed border-slate-300 hover:border-indigo-500 rounded-xl text-slate-600 hover:text-indigo-600 cursor-pointer transition-all duration-200"
                    >
                      <span className="text-sm font-semibold truncate">
                        {file ? file.name : `Choose ${form.type}...`}
                      </span>
                      <UploadCloud className="w-5 h-5 flex-shrink-0 ml-2" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Rich Editor Integration */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 p-2">
              <TiptapBlogWriter onSave={handleContentChange} initialContent={initialContent} />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {editingId ? "Save Changes" : "Publish Article"}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      title: "",
                      description: "",
                      type: "poster",
                      content: "",
                      createdBy: "Admin",
                    });
                    setFile(null);
                    setEditingId(null);
                    setInitialContent("");
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-3 rounded-xl font-semibold active:scale-[0.98] transition-all duration-150 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Publications List: takes 1/3 cols */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/65 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center">
                <Compass className="w-5 h-5 mr-2 text-violet-600" />
                Live Articles
              </div>
              <span className="text-xs bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full">
                {blogs?.length || 0} Posts
              </span>
            </h2>

            {isLoading && (
              <div className="py-12 text-center text-slate-400 font-medium">
                Syncing index...
              </div>
            )}
            {isError && (
              <div className="py-12 text-center text-rose-500 font-medium">
                Failed to sync publications.
              </div>
            )}

            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-1 pt-4">
              {blogs?.map((blog) => {
                let TypeIcon = File;
                if (blog.type === "poster") TypeIcon = Image;
                if (blog.type === "video") TypeIcon = Video;

                return (
                  <div
                    key={blog._id}
                    className="border border-slate-100 rounded-xl p-4 space-y-3 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all duration-200 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100/30 flex items-center">
                          <TypeIcon className="w-2.5 h-2.5 mr-1" />
                          {blog.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{blog.createdBy}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-normal">
                        {blog.description}
                      </p>
                    </div>

                    {blog.fileUrl && (
                      <div className="relative rounded-lg overflow-hidden h-28 bg-slate-100 border border-slate-100 flex items-center justify-center">
                        {blog.type === "poster" && (
                          <img
                            src={`${BASE_URL}${blog.fileUrl}`}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {blog.type === "video" && (
                          <video
                            controls
                            className="w-full h-full object-cover bg-black"
                          >
                            <source src={`${BASE_URL}${blog.fileUrl}`} type="video/mp4" />
                          </video>
                        )}

                        {blog.type === "document" && (
                          <a
                            href={`${BASE_URL}${blog.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full h-full flex flex-col items-center justify-center text-indigo-600 font-semibold text-xs space-y-1 bg-slate-100 hover:bg-indigo-50 transition-colors"
                          >
                            <File className="w-5 h-5 text-indigo-500" />
                            <span>View Document</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Blog Actions */}
                    <div className="flex justify-end items-center space-x-3 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="inline-flex items-center text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminBlog;
