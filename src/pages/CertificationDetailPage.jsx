import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiTarget, FiTool, FiArrowRight, FiShield, FiFileText, FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../api';

const CertificationDetailPage = () => {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const response = await api.get(`/certifications/${id}`);
        setCert(response.data);
      } catch (error) {
        console.error('Error fetching certification:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex justify-center items-center">
        <p>Certification not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-gray-300 font-sans pb-20">
      
      {/* Header */}
      <div className="pt-32 pb-16 px-4 bg-gradient-to-b from-[#050B14] to-[#020617] border-b border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full">
            Practical Assessment
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-6 mb-4">{cert.title}</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">{cert.format} • {cert.duration}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><FiTarget className="text-cyan-400"/> Overview</h2>
            <p className="leading-relaxed text-gray-400">{cert.overview}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><FiTool className="text-cyan-400"/> Skills Assessed</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cert.skillsAssessed?.map((skill, index) => (
                <li key={index} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                  <FiCheckCircle className="text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-sm">{skill}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><FiFileText className="text-cyan-400"/> Assessment Structure</h2>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <p className="leading-relaxed text-gray-400 whitespace-pre-line">{cert.assessmentStructure}</p>
            </div>
          </section>
          
          {cert.practicalComponents?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Practical Components</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                {cert.practicalComponents.map((comp, idx) => (
                  <li key={idx}>{comp}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Assessment Flow */}
          <section className="bg-cyan-950/20 border border-cyan-500/20 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-white mb-6">Assessment Flow</h2>
            <div className="flex flex-col sm:flex-row justify-between items-center text-center gap-4 text-sm font-semibold text-gray-400">
              <div className="flex-1"><div className="w-10 h-10 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-2">1</div>Instructions</div>
              <FiArrowRight className="hidden sm:block text-gray-600"/>
              <div className="flex-1"><div className="w-10 h-10 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-2">2</div>Env Check</div>
              <FiArrowRight className="hidden sm:block text-gray-600"/>
              <div className="flex-1"><div className="w-10 h-10 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-2">3</div>Assessment</div>
              <FiArrowRight className="hidden sm:block text-gray-600"/>
              <div className="flex-1"><div className="w-10 h-10 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-2">4</div>Results</div>
            </div>
          </section>

          {/* Certificate View Demo */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><FiAward className="text-cyan-400"/> Sample Certificate</h2>
            <div className="border border-white/10 rounded-2xl p-8 bg-gradient-to-br from-gray-900 to-gray-950 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-bl-lg">DEMO</div>
              <FiShield className="text-6xl text-cyan-500 mb-4 opacity-50" />
              <h3 className="text-3xl font-serif text-white mb-2">Certificate of Capability</h3>
              <p className="text-gray-400 mb-6">This certifies that</p>
              <h4 className="text-2xl font-bold text-cyan-400 border-b border-cyan-400/30 pb-2 px-12 mb-6">[Candidate Name]</h4>
              <p className="text-gray-400 mb-2">has successfully completed the practical assessment for</p>
              <p className="text-lg text-white font-semibold mb-8">{cert.title}</p>
              
              <div className="w-full flex justify-between text-xs text-gray-500 border-t border-white/5 pt-4">
                <span>Date: [Issue Date]</span>
                <span>ID: [Credential ID]</span>
                <span>Verify: [URL]</span>
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#050B14] border border-white/10 rounded-2xl p-6 sticky top-24 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Start Assessment</h3>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Duration</span>
                <span className="text-white font-medium">{cert.duration}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Format</span>
                <span className="text-white font-medium">{cert.format}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 font-medium">{cert.status}</span>
              </div>
            </div>

            <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] mb-4">
              Begin Now
            </button>
            <p className="text-xs text-center text-gray-500">Make sure you have an uninterrupted environment before starting.</p>
          </div>

          {(cert.prerequisites?.length > 0 || cert.preparation) && (
            <div className="bg-[#050B14] border border-white/10 rounded-2xl p-6">
              {cert.prerequisites?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Prerequisites</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    {cert.prerequisites.map((req, idx) => (
                      <li key={idx} className="flex gap-2"><FiClock className="mt-0.5 flex-shrink-0 text-cyan-500"/> {req}</li>
                    ))}
                  </ul>
                </div>
              )}
              {cert.preparation && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Preparation</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{cert.preparation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificationDetailPage;
