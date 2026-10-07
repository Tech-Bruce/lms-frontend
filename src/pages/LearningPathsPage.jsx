import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiArrowRight, FiUser, FiShield, FiCrosshair, FiCpu } from 'react-icons/fi';
import imgHeroBg from '../assets/Cinematic .png';

const pathsData = [
  {
    id: 'soc',
    title: 'SOC Analyst',
    description: 'From first alert to confident investigation.',
    icon: FiUser,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
    borderColor: 'hover:border-blue-500/50',
    features: [
      'Security fundamentals',
      'Alert triage',
      'Log analysis',
      'Threat intelligence',
      'Incident escalation'
    ]
  },
  {
    id: 'ir',
    title: 'Incident Responder',
    description: 'When the alert becomes an incident.',
    icon: FiShield,
    iconColor: 'text-red-400',
    iconBg: 'bg-red-400/10',
    borderColor: 'hover:border-red-500/50',
    features: [
      'Incident identification',
      'Containment',
      'Eradication',
      'Recovery',
      'Incident reporting'
    ]
  },
  {
    id: 'hunter',
    title: 'Threat Hunter',
    description: 'Find what others miss.',
    icon: FiCrosshair,
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-400/10',
    borderColor: 'hover:border-cyan-500/50',
    features: [
      'Hunting methodology',
      'Hypothesis development',
      'KQL / SPL',
      'MITRE ATT&CK',
      'Hunting missions'
    ]
  },
  {
    id: 'detection',
    title: 'Detection Engineer',
    description: 'Turn behavior into detections.',
    icon: FiCpu,
    iconColor: 'text-green-400',
    iconBg: 'bg-green-400/10',
    borderColor: 'hover:border-green-500/50',
    features: [
      'Detection fundamentals',
      'Sigma / KQL / SPL',
      'Detection validation',
      'Tuning and optimization',
      'Real-world detection labs'
    ]
  }
];

const LearningPathsPage = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-text-main font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            src={imgHeroBg} 
            alt="Learning Paths Background" 
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-screen" 
          />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/90 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/50"></div> */}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <span className="text-cyan-400 font-bold tracking-widest text-sm uppercase mb-4 block">
              LEARNING PATHS
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Choose your path. <br />
              <span className="text-cyan-400">Build your capability.</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Structured learning journeys for every defensive role. Each path combines theory, practical exercises and hands-on missions.
            </p>
          </div>
          
          <div className="hidden lg:flex justify-end relative">
            {/* Mountain Graph / Constellation Visual Approximation */}
            <div className="relative w-80 h-80 flex flex-col items-center justify-center">
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-80">
                <path d="M40 160 L100 40 L160 100" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5,5" />
                <circle cx="40" cy="160" r="6" fill="#22d3ee" />
                <circle cx="100" cy="40" r="6" fill="#22d3ee" />
                <circle cx="160" cy="100" r="6" fill="#22d3ee" />
              </svg>
              <div className="absolute top-8 right-16 text-cyan-200 text-xs font-bold uppercase tracking-widest">Validate</div>
              <div className="absolute top-1/2 right-0 text-cyan-200 text-xs font-bold uppercase tracking-widest">Practice</div>
              <div className="absolute bottom-6 left-12 text-cyan-200 text-xs font-bold uppercase tracking-widest">Grow</div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pathsData.map((path, index) => {
              const Icon = path.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  key={path.id}
                  className={`bg-[#0A1122] border border-white/10 rounded-2xl p-8 group transition-all duration-300 ${path.borderColor}`}
                >
                  <div className="flex gap-5 mb-8">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/5 ${path.iconBg} ${path.iconColor}`}>
                      <Icon className="text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                        {path.title}
                      </h2>
                      <p className="text-sm text-gray-400">
                        {path.description}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {path.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                        <FiCheck className="text-cyan-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="text-cyan-400 font-semibold text-sm flex items-center gap-2 group-hover:text-cyan-300 transition-colors">
                    View Path <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearningPathsPage;
