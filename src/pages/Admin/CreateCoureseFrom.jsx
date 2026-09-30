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
    isNav: false
  }, 
  editMode = false, 
  onClose = () => {}, 
  onSuccess = () => {},
}) => {
  const [formData, setFormData] = useState(initialValues);
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
    <div className="max-w-4xl mx-auto p-6 bg-white border rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">
        {editMode ? 'Edit Course' : 'Create Course'}
      </h2>
      
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.submit}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Course title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full px-3 py-2 border rounded ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Course description"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || '')}
            className={`w-full px-3 py-2 border rounded ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="0.00"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Thumbnail */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={`w-full px-3 py-2 border rounded ${errors.thumbnail ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>}
          
          {preview && (
            <div className="mt-2 relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-24 object-cover border rounded"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Checkboxes */}
        <div className="md:col-span-2 flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
            />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isNav}
              onChange={(e) => handleInputChange('isNav', e.target.checked)}
            />
            Show in Navbar
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : editMode ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  );
};

export default CreateCourseForm;