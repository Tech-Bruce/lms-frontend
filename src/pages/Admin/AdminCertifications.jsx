import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    skillsAssessed: '',
    format: '',
    duration: '',
    prerequisites: '',
    status: 'Active',
    overview: '',
    assessmentStructure: '',
    practicalComponents: '',
    preparation: '',
    attemptInfo: ''
  });

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const response = await api.get('/certifications');
      setCertifications(response.data);
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (cert = null) => {
    if (cert) {
      setEditingCert(cert);
      setFormData({
        title: cert.title || '',
        skillsAssessed: cert.skillsAssessed?.join(', ') || '',
        format: cert.format || '',
        duration: cert.duration || '',
        prerequisites: cert.prerequisites?.join(', ') || '',
        status: cert.status || 'Active',
        overview: cert.overview || '',
        assessmentStructure: cert.assessmentStructure || '',
        practicalComponents: cert.practicalComponents?.join(', ') || '',
        preparation: cert.preparation || '',
        attemptInfo: cert.attemptInfo || ''
      });
    } else {
      setEditingCert(null);
      setFormData({
        title: '',
        skillsAssessed: '',
        format: '',
        duration: '',
        prerequisites: '',
        status: 'Active',
        overview: '',
        assessmentStructure: '',
        practicalComponents: '',
        preparation: '',
        attemptInfo: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skillsAssessed: formData.skillsAssessed.split(',').map(s => s.trim()),
        prerequisites: formData.prerequisites.split(',').map(s => s.trim()),
        practicalComponents: formData.practicalComponents.split(',').map(s => s.trim()),
      };

      if (editingCert) {
        await api.put(`/certifications/${editingCert._id}`, payload);
      } else {
        await api.post('/certifications', payload);
      }
      fetchCertifications();
      closeModal();
    } catch (error) {
      console.error('Error saving certification:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        await api.delete(`/certifications/${id}`);
        fetchCertifications();
      } catch (error) {
        console.error('Error deleting certification:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Certifications</h1>
        <button 
          onClick={() => openModal()}
          className="bg-cyan-600 text-white px-4 py-2 rounded shadow hover:bg-cyan-500 transition-colors"
        >
          Add Certification
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-[#050B14] border border-white/10 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 font-semibold text-slate-300">Title</th>
                <th className="p-4 font-semibold text-slate-300">Status</th>
                <th className="p-4 font-semibold text-slate-300">Duration</th>
                <th className="p-4 font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certifications.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No certifications found. Click "Add Certification" to create one.
                  </td>
                </tr>
              ) : (
                certifications.map(cert => (
                  <tr key={cert._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-slate-200">{cert.title}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        cert.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                        cert.status === 'Coming Soon' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                        'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{cert.duration}</td>
                    <td className="p-4">
                      <button onClick={() => openModal(cert)} className="text-cyan-400 hover:text-cyan-300 mr-4 font-medium">Edit</button>
                      <button onClick={() => handleDelete(cert._id)} className="text-red-400 hover:text-red-300 font-medium">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col text-white">
            <div className="p-6 md:p-8 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{editingCert ? 'Edit Certification' : 'New Certification'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
              <form id="cert-form" onSubmit={handleSubmit} className="space-y-8">
                
                {/* Basic Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4 border-b border-white/5 pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-300">Title</label>
                      <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-gray-950/50 border border-gray-800 p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-300">Status</label>
                      <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-gray-950/50 border border-gray-800 p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 text-white transition-colors">
                        <option value="Active">Active</option>
                        <option value="Coming Soon">Coming Soon</option>
                        <option value="Retired">Retired</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1.5 text-gray-300">Overview</label>
                      <textarea name="overview" value={formData.overview} onChange={handleInputChange} required className="w-full bg-gray-950/50 border border-gray-800 p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" rows="2"></textarea>
                    </div>
                  </div>
                </div>

                {/* Logistics Section */}
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4 border-b border-white/5 pb-2">Logistics & Format</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-300">Format</label>
                      <input type="text" name="format" value={formData.format} onChange={handleInputChange} required placeholder="e.g. Practical Assessment" className="w-full bg-gray-950/50 border border-gray-800 p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-300">Duration</label>
                      <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} required placeholder="e.g. 2 Hours" className="w-full bg-gray-950/50 border border-gray-800 p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1.5 text-gray-300">Attempt Information</label>
                      <textarea name="attemptInfo" value={formData.attemptInfo} onChange={handleInputChange} placeholder="Details about retakes or passing score..." className="w-full bg-gray-950/50 border border-gray-800 p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" rows="2"></textarea>
                    </div>
                  </div>
                </div>

                {/* Assessment Details Section */}
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4 border-b border-white/5 pb-2">Assessment Details</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-300">Assessment Structure</label>
                      <textarea name="assessmentStructure" value={formData.assessmentStructure} onChange={handleInputChange} required className="w-full bg-gray-950/50 border border-gray-800 p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" rows="3"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-300">Skills Assessed <span className="text-gray-500 font-normal">(comma separated)</span></label>
                        <input type="text" name="skillsAssessed" value={formData.skillsAssessed} onChange={handleInputChange} required className="w-full bg-gray-950/50 border border-gray-800 p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-300">Practical Components <span className="text-gray-500 font-normal">(comma separated)</span></label>
                        <input type="text" name="practicalComponents" value={formData.practicalComponents} onChange={handleInputChange} className="w-full bg-gray-950/50 border border-gray-800 p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements Section */}
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4 border-b border-white/5 pb-2">Requirements & Prep</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-300">Prerequisites <span className="text-gray-500 font-normal">(comma separated)</span></label>
                      <input type="text" name="prerequisites" value={formData.prerequisites} onChange={handleInputChange} className="w-full bg-gray-950/50 border border-gray-800 p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1.5 text-gray-300">Preparation Recommendations</label>
                      <textarea name="preparation" value={formData.preparation} onChange={handleInputChange} className="w-full bg-gray-950/50 border border-gray-800 p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" rows="2"></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 md:p-8 bg-gray-900 border-t border-white/10 flex justify-end gap-4">
              <button type="button" onClick={closeModal} className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium">Cancel</button>
              <button type="submit" form="cert-form" className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">Save Certification</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertifications;
