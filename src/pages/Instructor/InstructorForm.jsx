import React, { useState } from "react";
import {
  User,
  Award,
  Briefcase,
  Link,
  Image,
  CheckCircle,
  Plus,
  X,
  Upload,
} from "lucide-react";

const InstructorForm = ({ initialValues, onSubmit }) => {
  const [formData, setFormData] = useState(
    initialValues || {
      expertise: [""],
      experience: "",
      bio: "",
      socialLinks: {
        linkedin: "",
        twitter: "",
        github: "",
        portfolio: "",
      },
      certifications: [""],
      isVerified: false,
      profileImage: null,
    }
  );
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({
      ...prev,
      [field]: newArray,
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        [field]: newArray,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required";
    }

    if (!formData.profileImage) {
      newErrors.profileImage = "Profile image is required";
    }

    // Expertise validation
    if (formData.expertise.some((exp) => !exp.trim())) {
      newErrors.expertise = "All expertise fields must be filled";
    }

    // Certifications validation
    if (formData.certifications.some((cert) => !cert.trim())) {
      newErrors.certifications = "All certification fields must be filled";
    }

    // Bio length validation
    if (formData.bio.length > 1000) {
      newErrors.bio = "Bio must be 1000 characters or less";
    }

    // URL validation for social links
    const urlPattern = /^https?:\/\/.+/;
    Object.keys(formData.socialLinks).forEach((platform) => {
      const url = formData.socialLinks[platform];
      if (url && !urlPattern.test(url)) {
        newErrors[`socialLinks.${platform}`] = "Please enter a valid URL";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataObj = new FormData();

    Object.keys(formData).forEach((key) => {
      if (
        key === "socialLinks" ||
        key === "expertise" ||
        key === "certifications"
      ) {
        formDataObj.append(key, JSON.stringify(formData[key]));
      } else if (key === "profileImage") {
        formDataObj.append(key, formData.profileImage);
      } else {
        formDataObj.append(key, formData[key]);
      }
    });

    onSubmit(formDataObj);
  };

  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return <div className="text-red-500 text-sm mt-1">{error}</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Instructor Profile</h1>
            </div>
            <p className="mt-2 text-blue-100">
              Create your professional instructor profile
            </p>
          </div>

          <div className="p-8">
            {/* Main Grid Container */}
            <div className="">
              {/* Left Column - Profile Image */}
              {/* <div className="lg:col-span-1">
              
              </div> */}

              {/* Right Columns - Form Fields */}
              <div className="lg:col-span-2 space-y-8">
                <div className="flex item-center sticky top-8">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Image className="w-5 h-5 text-gray-600" />
                      <label className="text-lg font-semibold text-gray-800">
                        Profile Image
                      </label>
                    </div>

                    <div className="relative">
                      <div className="w-48 h-48 mx-auto rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                        {preview ? (
                          // Show the preview image (new upload)
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : initialValues?.profileImage ? (
                          // Show the existing profile image (from server)
                          <img
                            src={`${
                              import.meta.env.VITE_API_UPLOAD_URL
                            }/instructors/${initialValues.profileImage}`}
                            alt="Current"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          // Show the upload prompt
                          <div className="text-center">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">
                              Upload Photo
                            </p>
                          </div>
                        )}
                      </div>

                      <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                        <Upload className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <ErrorMessage error={errors.profileImage} />

                    {/* Verification Status */}
                    {/* <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isVerified}
                          onChange={(e) => handleInputChange('isVerified', e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700 font-medium">Verified Instructor</span>
                      </label>
                    </div> */}
                  </div>
                </div>
                {/* Experience Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Professional Experience
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience Level *
                      </label>
                      <input
                        type="text"
                        value={formData.experience}
                        onChange={(e) =>
                          handleInputChange("experience", e.target.value)
                        }
                        placeholder="e.g. 5+ years in cybersecurity"
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.experience
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white transition-all`}
                      />
                      <ErrorMessage error={errors.experience} />
                    </div>
                  </div>
                </div>

                {/* Expertise Section */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Areas of Expertise *
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.expertise.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleArrayChange(
                              "expertise",
                              index,
                              e.target.value
                            )
                          }
                          placeholder="e.g. Cybersecurity"
                          className={`flex-1 px-4 py-3 rounded-xl border ${
                            errors.expertise
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                          } bg-white transition-all`}
                        />
                        {formData.expertise.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem("expertise", index)}
                            className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <ErrorMessage error={errors.expertise} />

                  <button
                    type="button"
                    onClick={() => addArrayItem("expertise")}
                    className="mt-4 flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-100 rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Expertise
                  </button>
                </div>

                {/* Certifications Section */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Certifications *
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.certifications.map((cert, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={cert}
                          onChange={(e) =>
                            handleArrayChange(
                              "certifications",
                              index,
                              e.target.value
                            )
                          }
                          placeholder="e.g. OSCP"
                          className={`flex-1 px-4 py-3 rounded-xl border ${
                            errors.certifications
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                          } bg-white transition-all`}
                        />
                        {formData.certifications.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem("certifications", index)
                            }
                            className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <ErrorMessage error={errors.certifications} />

                  <button
                    type="button"
                    onClick={() => addArrayItem("certifications")}
                    className="mt-4 flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-100 rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Certification
                  </button>
                </div>

                {/* Bio Section */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-amber-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      About You
                    </h3>
                  </div>

                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={4}
                    placeholder="Tell us about your background, teaching philosophy, and what makes you unique..."
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.bio
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                    } bg-white transition-all resize-none`}
                  />

                  <div
                    className={`text-sm mt-1 ${
                      formData.bio.length > 1000
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {formData.bio.length}/1000 characters
                  </div>

                  <ErrorMessage error={errors.bio} />
                </div>

                {/* Social Links Section */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Link className="w-5 h-5 text-cyan-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Social Links
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(formData.socialLinks).map((platform) => (
                      <div key={platform}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {platform}
                        </label>
                        <input
                          type="url"
                          value={formData.socialLinks[platform]}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "socialLinks",
                              platform,
                              e.target.value
                            )
                          }
                          placeholder={`Your ${
                            platform.charAt(0).toUpperCase() + platform.slice(1)
                          } URL`}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors[`socialLinks.${platform}`]
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                          } bg-white transition-all`}
                        />
                        <ErrorMessage
                          error={errors[`socialLinks.${platform}`]}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {!initialValues ? " Create Profile" : "update Profile"}
              </button>
            </div>

            {/* Required Field Note */}
            <div className="mt-4 text-center text-gray-500 text-sm">
              * Required fields
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorForm;
