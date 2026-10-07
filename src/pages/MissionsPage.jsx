import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiClock, FiArrowRight, FiLock, FiTerminal, FiMail, FiActivity, FiShield, FiAlertTriangle } from 'react-icons/fi';
import imgHeroBg from '../assets/Midnight Cyan Communications Nexus.png'; // Using a tech background from assets

const missionsData = [
  {
    id: '001',
    title: 'Suspicious Sign-In',
    description: 'A user reports unusual activity on their account. Investigate the authentication activity.',
    difficulty: 'Intermediate',
    duration: '45 min',
    icon: FiLock,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-500/10',
    iconBorder: 'border-red-500/30'
  },
  {
    id: '002',
    title: 'Something Executed',
    description: 'An endpoint has triggered a suspicious PowerShell alert. Determine what happened.',
    difficulty: 'Intermediate',
    duration: '60 min',
    icon: FiTerminal,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
    iconBorder: 'border-blue-400/30'
  },
  {
    id: '003',
    title: 'Phishing Campaign',
    description: 'Analyze a suspicious email, trace the infrastructure and identify compromised accounts.',
    difficulty: 'Beginner',
    duration: '30 min',
    icon: FiMail,
    iconColor: 'text-green-400',
    iconBg: 'bg-green-400/10',
    iconBorder: 'border-green-400/30'
  },
  {
    id: '004',
    title: 'Lateral Movement',
    description: 'Investigate unusual internal activity and determine the attacker\'s path.',
    difficulty: 'Advanced',
    duration: '75 min',
    icon: FiActivity,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-400/10',
    iconBorder: 'border-purple-400/30'
  },
  {
    id: '005',
    title: 'Data Exfiltration',
    description: 'Identify data exfiltration activity using multiple data sources.',
    difficulty: 'Advanced',
    duration: '60 min',
    icon: FiShield,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    iconBorder: 'border-blue-500/30'
  },
  {
    id: '006',
    title: 'Ransomware Incident',
    description: 'Investigate a ransomware attack from initial access to encryption.',
    difficulty: 'Advanced',
    duration: '90 min',
    icon: FiAlertTriangle,
    iconColor: 'text-red-400',
    iconBg: 'bg-red-400/10',
    iconBorder: 'border-red-400/30'
  }
];

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'Advanced': return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
};

const MissionsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All Missions');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['All Missions', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="min-h-screen bg-[#020617] text-text-main font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            src={imgHeroBg} 
            alt="SOC Background" 
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-screen" 
          />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div> */}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl">
            <span className="text-cyan-400 font-bold tracking-widest text-sm uppercase mb-4 block">
              MISSIONS
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              This is where the <br />
              <span className="text-cyan-400">learning gets real.</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
              Investigate realistic security scenarios, work with real evidence and develop the skills used by modern defenders.
            </p>
          </div>
          {/* We rely on the background image for the right side "SOC" visual as seen in the mockup */}
        </div>
      </section>

      {/* Controls Section */}
    

      {/* Grid Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missionsData.map((mission, index) => {
              const Icon = mission.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  key={mission.id}
                  className="bg-[#0A1122] border border-white/10 rounded-2xl p-6 flex flex-col h-full group hover:border-cyan-500/50 hover:bg-[#0C162C] transition-all duration-300 relative overflow-hidden"
                >
                  {/* Subtle Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex gap-5 mb-5 relative z-10">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border ${mission.iconBg} ${mission.iconColor} ${mission.iconBorder}`}>
                      <Icon className="text-2xl" />
                    </div>
                    <div>
                      <span className="text-xs font-bold tracking-wider text-cyan-500/80 uppercase block mb-1">
                        MISSION {mission.id}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {mission.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-6 relative z-10">
                    {mission.description}
                  </p>

                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${getDifficultyColor(mission.difficulty)}`}>
                      {mission.difficulty}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                      <FiClock /> {mission.duration}
                    </span>
                  </div>

                  <button className="w-full bg-[#101A30] border border-white/5 text-cyan-400 font-semibold py-3 px-4 rounded-xl flex items-center justify-between group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300 relative z-10">
                    <span>Start Investigation</span>
                    <FiArrowRight className="transition-transform group-hover:translate-x-1" />
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

export default MissionsPage;
