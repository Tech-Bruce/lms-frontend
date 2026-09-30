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
    <div 
      className="py-24 md:py-32 relative bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Heavy overlay to ensure content is readable against the background image while keeping the texture */}
      <div className="absolute inset-0 bg-[#030712]/60 pointer-events-none"></div>

      {/* Radial glow in the center for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 space-y-6"
        >
          <div className="inline-block px-5 py-2 bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-full shadow-2xl">
            <span className="text-cyan-400 font-black text-xs uppercase tracking-[0.25em]">Why Choose the Brigade</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-xl">
            The Blueprint of Modern <br className="hidden sm:block" /> Cyber Defense
          </h2>
          <p className="max-w-3xl text-gray-300 mx-auto text-lg sm:text-xl font-medium leading-relaxed drop-shadow-md">
            We focus strictly on the practical command line skills, security architectures, and compliance models required in the field.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white/[0.02] backdrop-blur-2xl rounded-3xl p-8 lg:p-10 border border-white/10 hover:border-cyan-500/50 transition-all duration-500 shadow-2xl hover:shadow-[0_10px_40px_rgba(34,211,238,0.15)] flex flex-col h-full"
            >
              {/* Internal top ambient glow on hover */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0 bg-cyan-500/20 blur-[50px] group-hover:h-32 transition-all duration-700 rounded-full"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-black/40 border border-white/10 text-cyan-400 mb-8 group-hover:bg-cyan-500 group-hover:text-black group-hover:border-transparent transition-all duration-500 shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-cyan-300 transition-colors duration-300">
                  {feature.name}
                </h3>
                <p className="text-gray-400 text-base leading-relaxed font-medium group-hover:text-gray-300 transition-colors duration-300 flex-1">
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
