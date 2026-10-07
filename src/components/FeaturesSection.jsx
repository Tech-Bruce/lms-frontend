import React from 'react';
import { motion } from 'framer-motion';
import {
  FiLayers,
  FiCode,
  FiTool,
  FiBriefcase,
  FiShield,
  FiDollarSign,
} from 'react-icons/fi';
import bgImage from '../assets/bg.png';

const FeaturesSection = () => {
  const features = [
    {
      name: "Industry-Vetted Curriculum",
      description:
        "Our syllabus is built and constantly refreshed by active cybersecurity practitioners to mirror the latest global threat landscape.",
      icon: <FiLayers className="w-6 h-6 md:w-7 md:h-7" />,
    },
    {
      name: "Learn from Experts",
      description:
        "Engage directly with instructors in live online sessions. Get dedicated mentorship from verified professionals in the field.",
      icon: <FiCode className="w-6 h-6 md:w-7 md:h-7" />,
    },
    {
      name: "Hands-On Training",
      description:
        "Get practical with real security tools like Splunk, Wireshark, Metasploit, Nmap, and Burp Suite in our virtual sandboxes.",
      icon: <FiTool className="w-6 h-6 md:w-7 md:h-7" />,
    },
    {
      name: "Career Support",
      description:
        "From personalized mock interviews to resume optimization, we guide you to get placed as a security defender.",
      icon: <FiBriefcase className="w-6 h-6 md:w-7 md:h-7" />,
    },
    {
      name: "Real-World Projects",
      description:
        "Build a robust profile with realistic capstones and offensive/defensive scenarios simulating real hacking events.",
      icon: <FiShield className="w-6 h-6 md:w-7 md:h-7" />,
    },
    {
      name: "Affordable Education",
      description:
        "Premium content at accessible pricing - we believe high-caliber cybersecurity careers should be accessible to all.",
      icon: <FiDollarSign className="w-6 h-6 md:w-7 md:h-7" />,
    },
  ];

  return (
    <div className="py-24 md:py-32 relative bg-background overflow-hidden border-t border-white/5">
      {/* Background Mesh and Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[600px] bg-cyan-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-blue-900/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface/80 backdrop-blur-md border border-cyan-500/30 rounded-full shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-[0.2em]">Why Choose the Brigade</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            The Blueprint of <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Modern Cyber Defense
            </span>
          </h2>
          <p className="max-w-2xl text-gray-400 mx-auto text-lg md:text-xl font-medium leading-relaxed">
            We focus strictly on practical command line skills, security architectures, and realistic attack vectors required in the field.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative bg-surface/50 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 shadow-xl flex flex-col h-full overflow-hidden"
            >
              {/* Internal glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -inset-px bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-6 group-hover:scale-110 group-hover:bg-cyan-400 group-hover:text-background transition-all duration-300 shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-cyan-400 transition-colors duration-300">
                  {feature.name}
                </h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300 flex-1">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
