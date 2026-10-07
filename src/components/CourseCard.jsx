import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiLock, FiShield } from 'react-icons/fi';

const courseCardCss = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&display=swap');
.fc-display { font-family: 'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif; }
@keyframes fc-shine  { from { transform: translateX(-120%) skewX(-20deg); } to { transform: translateX(320%) skewX(-20deg); } }
`;

const CourseCard = ({ course, index }) => {
  return (
    <>
      <style>{courseCardCss}</style>
      <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: 'easeOut' }}
      className="h-full relative group"
    >
      <Link to={`/courses/${course._id}`} className="block h-full relative">
        {/* Background shadow layer that reveals on hover */}
        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 group-hover:translate-x-3 group-hover:translate-y-3"></div>
        
        {/* Decorative backplate border that stays behind */}
        <div className="absolute inset-0 rounded-[28px] border border-cyan-500/50 bg-[#05060d] opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-4 group-hover:translate-y-4"></div>

        {/* The Front Card that lifts up */}
        <div className="relative h-full flex flex-col overflow-hidden rounded-[27px] bg-[#0a0d18]/90 backdrop-blur-xl border border-white/10 transition-all duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2 z-10 group-hover:border-cyan-400/50">
          
          {/* Media Section */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#101830] to-[#0a0d18]">
            {course.thumbnail ? (
              <img
                src={course.thumbnail.startsWith('http') ? course.thumbnail : `${import.meta.env.VITE_API_UPLOAD_URL || 'http://localhost:8000/uploads'}/course/${course.thumbnail}`}
                alt={course.title}
                loading="lazy"
                className="h-full w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_40px_-8px_rgba(34,211,238,.6)]">
                  <FiLock className="h-8 w-8 text-cyan-300" />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d18] via-[#0a0d18]/30 to-transparent" />
            {/* Light sweep on hover */}
            <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 group-hover:[animation:fc-shine_1.1s_ease-out]" />
            <span className="absolute bottom-4 left-5 inline-flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-[#05060d]/90 px-3 py-1 text-xs font-semibold text-cyan-200 backdrop-blur-md">
              <FiShield className="h-3 w-3" />
              {course.category}
            </span>
          </div>

          {/* Body Section */}
          <div className="flex flex-1 flex-col gap-3 p-6 z-20">
            <h3 className="fc-display text-xl font-bold leading-snug text-white transition-colors duration-300 group-hover:text-cyan-200 md:text-[22px]">
              {course.title}
            </h3>
            <p className="line-clamp-3 text-sm leading-relaxed text-slate-400">{course.description}</p>
          </div>

          {/* Footer Section */}
          <div className="relative z-20 mt-auto flex items-center justify-center p-6 border-t border-white/5">
            <div
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-sm font-semibold text-[#04060d] shadow-[0_8px_30px_-8px_rgba(34,211,238,.7)] transition-all duration-300 group-hover:shadow-[0_12px_40px_-6px_rgba(34,211,238,.95)] group-hover:brightness-110"
            >
              View details
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
    </>
  );
};

export default CourseCard;
