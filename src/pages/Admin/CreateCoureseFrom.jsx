import { useState, useEffect } from "react";
import api from "../../api";

const categories = [
  "Web Development",
  "Programming",
  "Design", 
  "Business",
  "Marketing",
  "Data Science",
];

const CreateCourseForm = ({ 
  initialValues = {
    title: '',
    category: '',
    description: '',
    price: '',
    status: 'draft',
    thumbnail: null,
    featured: false,
    isNav: false,
    syllabus: ['']
  }, 
  editMode = false, 
  onClose = () => {}, 
  onSuccess = () => {},
}) => {
  const [formData, setFormData] = useState({
    ...initialValues,
    syllabus: initialValues.syllabus?.length > 0 ? initialValues.syllabus : ['']
  });

  const handleSyllabusChange = (index, value) => {
    const newSyllabus = [...formData.syllabus];
    newSyllabus[index] = value;
    setFormData(prev => ({ ...prev, syllabus: newSyllabus }));
  };

  const handleAddSyllabus = () => {
    setFormData(prev => ({ ...prev, syllabus: [...prev.syllabus, ''] }));
  };

  const handleRemoveSyllabus = (index) => {
    setFormData(prev => ({ 
      ...prev, 
      syllabus: prev.syllabus.filter((_, i) => i !== index) 
    }));
  };
  const [preview, setPreview] = useState(
    initialValues.thumbnail ? `/uploads/${initialValues.thumbnail}` : null
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, thumbnail: "Please select an image file" }));
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, thumbnail: "File size must be less than 5MB" }));
        return;
      }

      // Clear any existing preview URL
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }

      handleInputChange('thumbnail', file);
      setPreview(URL.createObjectURL(file));
      
      // Clear thumbnail error if exists
      if (errors.thumbnail) {
        setErrors(prev => ({ ...prev, thumbnail: undefined }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Price must be positive";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append all form fields
      submitData.append('title', formData.title);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('status', formData.status);
      submitData.append('featured', formData.featured);
      submitData.append('isNav', formData.isNav);
      
      // Filter out empty syllabus items and append
      const cleanSyllabus = formData.syllabus?.filter(item => item.trim() !== '') || [];
      submitData.append('syllabus', JSON.stringify(cleanSyllabus));
      
      // Append file if it exists and is a File object
      if (formData.thumbnail && formData.thumbnail instanceof File) {
        submitData.append('thumbnail', formData.thumbnail);
      }

      let response;
      if (editMode) {
        // For edit mode, include the ID
        response = await api.put(`/courses/${initialValues._id}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await api.post('/courses', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      onSuccess(response.data);
      onClose();
    } catch (err) {
      console.error('Failed to save course:', err);
      
      // Handle specific error messages from server
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ submit: err.response?.data?.message || "Failed to save course" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    handleInputChange('thumbnail', null);
  };

  return (
    <div className="w-full text-white">
      {/* Title is handled by parent modal */}
      
      {errors.submit && (
        <div className="mb-4 p-3 bg-critical/10 border border-critical text-red-400 rounded-xl text-sm">
          {errors.submit}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-4 py-2 bg-background rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-cyan transition-colors ${errors.title ? 'border-critical' : 'border-white/10'}`}
            placeholder="Course title"
          />
          {errors.title && <p className="text-critical text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Category</label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full px-4 py-2 bg-background rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-cyan transition-colors [&>option]:bg-surface ${errors.category ? 'border-critical' : 'border-white/10'}`}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-critical text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-slate-300">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className={`w-full px-4 py-2 bg-background rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-cyan transition-colors resize-none ${errors.description ? 'border-critical' : 'border-white/10'}`}
            placeholder="Course description"
          />
          {errors.description && <p className="text-critical text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Price ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || '')}
            className={`w-full px-4 py-2 bg-background rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-cyan transition-colors ${errors.price ? 'border-critical' : 'border-white/10'}`}
            placeholder="0.00"
          />
          {errors.price && <p className="text-critical text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-4 py-2 bg-background border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-cyan transition-colors [&>option]:bg-surface"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Thumbnail */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-slate-300">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={`w-full px-4 py-2 bg-background rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-cyan transition-colors ${errors.thumbnail ? 'border-critical' : 'border-white/10'} file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/5 file:text-primary-cyan hover:file:bg-white/10`}
          />
          {errors.thumbnail && <p className="text-critical text-sm mt-1">{errors.thumbnail}</p>}
          
          {preview && (
            <div className="mt-4 relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-24 object-cover border border-white/10 rounded-xl shadow-sm"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-critical text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-500 shadow-md transition-colors"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Curriculum / Syllabus */}
        <div className="md:col-span-2 mt-4 bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-semibold text-slate-200">Course Curriculum (Modules & Lessons)</label>
            <button
              type="button"
              onClick={handleAddSyllabus}
              className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-lg hover:bg-cyan-500/30 transition-colors"
            >
              + Add Item
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.syllabus.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400 mt-1">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleSyllabusChange(index, e.target.value)}
                    placeholder="e.g., Module 1: Introduction to SOC Operations"
                    className="w-full px-4 py-2 bg-background rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-cyan transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSyllabus(index)}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-critical/10 text-red-400 rounded-xl hover:bg-critical hover:text-white transition-colors"
                  disabled={formData.syllabus.length === 1}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="md:col-span-2 flex gap-6 mt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="w-5 h-5 bg-background border-white/20 rounded accent-primary-cyan cursor-pointer"
              />
            </div>
            <span className="text-slate-300 group-hover:text-white transition-colors">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={formData.isNav}
                onChange={(e) => handleInputChange('isNav', e.target.checked)}
                className="w-5 h-5 bg-background border-white/20 rounded accent-primary-cyan cursor-pointer"
              />
            </div>
            <span className="text-slate-300 group-hover:text-white transition-colors">Show in Navbar</span>
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-slate-300 transition-colors font-medium"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-primary-cyan text-[#07121D] rounded-xl hover:bg-cyan-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-primary-cyan/10 hover:shadow-lg hover:shadow-primary-cyan/20"
        >
          {isSubmitting ? 'Saving...' : editMode ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  );
};

export default CreateCourseForm;