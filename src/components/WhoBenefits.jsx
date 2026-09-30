import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiBook, FiMonitor } from 'react-icons/fi';
import { VIDEOS } from '../constants/videos';

const WhoBenefits = () => {
  const learnerTypes = [
    {
      title: "Corporate Training",
      badge: "🏢 Enterprise",
      description:
        "Empower professionals to protect cloud systems and digital assets with expert threat intelligence.",
      details:
        "Equip security operations teams with state-of-the-art labs, incident response drills, and defense strategies.",
      icon: <FiBriefcase className="w-7 h-7" />
    },
    {
      title: "College & Grads",
      badge: "🎓 Higher Ed",
      description:
        "Equipping college students with certified, career-ready cybersecurity practices.",
      details:
        "Gain real-world lab experiences, build portfolios, and earn industry-recognized training to bridge graduation with security roles.",
      icon: <FiBook className="w-7 h-7" />
    },
    {
      title: "School Programs",
      badge: "🏫 Early Tech",
      description:
        "Instilling ethical computing and safety habits at an early age.",
      details:
        "Fun, engaging introduction to safe browsing, basic networking, and logical thinking for the next generation.",
      icon: <FiMonitor className="w-7 h-7" />
    },
  ];

  return (
    <div 
      className="py-24 md:py-32 relative overflow-hidden bg-[#030712]"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      >
        <source src={VIDEOS.VIDEO_4} type="video/mp4" />
      </video>
      {/* Dark gradient at top and bottom to blend with other sections, leaving the middle clear */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-transparent to-[#030712] opacity-90 pointer-events-none z-0"></div>
      
      {/* Radial blur specifically behind the text to ensure readability against bright image spots */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-64 bg-black/70 blur-[80px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 space-y-6 relative"
        >
          <div className="inline-block px-5 py-2 bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-full shadow-2xl">
            <span className="text-cyan-400 font-black text-xs uppercase tracking-[0.25em]">Custom Tracks</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">
            Tailored Learning Paths
          </h2>
          <p className="max-w-2xl text-gray-300 mx-auto text-lg sm:text-xl font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Structured to optimize outcomes depending on your professional starting point.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {learnerTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -12 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#030712]/80 backdrop-blur-2xl p-8 lg:p-10 border border-white/10 hover:border-cyan-500/50 shadow-2xl transition-all duration-500 h-full"
            >
              <div className="relative z-10 flex flex-col h-full space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black group-hover:border-transparent group-hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-500">
                    {type.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-black/50 border border-white/10 rounded-full text-gray-200 shadow-inner">
                    {type.badge}
                  </span>
                </div>
                
                <div className="space-y-4 flex-1">
                  <h3 className="text-2xl lg:text-3xl font-black text-white group-hover:text-cyan-300 transition-colors duration-300 tracking-tight">
                    {type.title}
                  </h3>
                  <p className="text-gray-300 text-base leading-relaxed font-medium">
                    {type.description}
                  </p>
                </div>
                
                <div className="pt-6 border-t border-white/10 mt-auto">
                  <p className="text-gray-500 text-sm leading-relaxed italic font-medium">
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
