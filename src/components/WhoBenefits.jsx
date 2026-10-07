import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiBook, FiMonitor } from 'react-icons/fi';
import { VIDEOS } from '../constants/videos';

const WhoBenefits = () => {
  const learnerTypes = [
    {
      title: "Corporate Training",
      badge: "Enterprise",
      description:
        "Empower professionals to protect cloud systems and digital assets with expert threat intelligence.",
      details:
        "Equip security operations teams with state-of-the-art labs, incident response drills, and defense strategies.",
      icon: <FiBriefcase className="w-6 h-6" />
    },
    {
      title: "College & Grads",
      badge: "Higher Ed",
      description:
        "Equipping college students with certified, career-ready cybersecurity practices.",
      details:
        "Gain real-world lab experiences, build portfolios, and earn industry-recognized training to bridge graduation with security roles.",
      icon: <FiBook className="w-6 h-6" />
    },
    {
      title: "School Programs",
      badge: "Early Tech",
      description:
        "Instilling ethical computing and safety habits at an early age.",
      details:
        "Fun, engaging introduction to safe browsing, basic networking, and logical thinking for the next generation.",
      icon: <FiMonitor className="w-6 h-6" />
    },
  ];

  return (
    <div className="py-24 md:py-32 relative overflow-hidden bg-background">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-20"
      >
        <source src={VIDEOS.VIDEO_4} type="video/mp4" />
      </video>
      
      {/* Dark gradient at top and bottom to blend with other sections */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none z-0"></div>
      
      {/* Radial blur for readability */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-[400px] bg-background/80 blur-[100px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-6 relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface/80 backdrop-blur-md border border-cyan-500/30 rounded-full shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-[0.2em]">Custom Tracks</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Tailored <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Learning Paths</span>
          </h2>
          <p className="max-w-2xl text-gray-400 mx-auto text-lg md:text-xl font-medium leading-relaxed">
            Structured to optimize outcomes depending on your professional starting point. Choose the track built for your mission.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {learnerTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-surface/60 backdrop-blur-2xl p-8 border border-white/5 hover:border-cyan-500/30 shadow-xl transition-all duration-300 h-full"
            >
              {/* Card top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10 flex flex-col h-full space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-400 group-hover:text-background transition-all duration-300 shadow-inner">
                    {type.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 bg-background border border-white/10 rounded-lg text-cyan-400">
                    {type.badge}
                  </span>
                </div>
                
                <div className="space-y-4 flex-1">
                  <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors duration-300">
                    {type.title}
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    {type.description}
                  </p>
                </div>
                
                <div className="pt-6 border-t border-white/10 mt-auto">
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {type.details}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhoBenefits;
