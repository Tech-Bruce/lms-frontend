import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiLock, FiArrowRight, FiShield } from 'react-icons/fi';
import { VIDEOS } from '../constants/videos';

/* ------------------------------------------------------------------ */
/*  Styles (fonts + keyframes) – no extra dependencies or config      */
/* ------------------------------------------------------------------ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&display=swap');

.fc-root { font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif; }
.fc-display { font-family: 'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif; }

@keyframes fc-grid   { to { background-position: 0 64px; } }
@keyframes fc-spin   { from { transform: rotateX(0) rotateY(0) rotateZ(0); } to { transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg); } }
@keyframes fc-float  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-28px); } }
@keyframes fc-drift  { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-30px) scale(1.15); } }
@keyframes fc-shine  { from { transform: translateX(-120%) skewX(-20deg); } to { transform: translateX(320%) skewX(-20deg); } }

.fc-floor {
  background-image:
    linear-gradient(rgba(34,211,238,.28) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34,211,238,.28) 1px, transparent 1px);
  background-size: 64px 64px;
  animation: fc-grid 2.4s linear infinite;
  -webkit-mask-image: linear-gradient(to top, #000 10%, transparent 85%);
          mask-image: linear-gradient(to top, #000 10%, transparent 85%);
}

@media (prefers-reduced-motion: reduce) {
  .fc-anim, .fc-floor { animation: none !important; }
}
`;

/* ------------------------------------------------------------------ */
/*  3D background                                                      */
/* ------------------------------------------------------------------ */
const Cube = ({ size, duration, delay = 0, className = '' }) => {
  const h = size / 2;
  const faces = [
    `rotateY(0deg) translateZ(${h}px)`,
    `rotateY(90deg) translateZ(${h}px)`,
    `rotateY(180deg) translateZ(${h}px)`,
    `rotateY(-90deg) translateZ(${h}px)`,
    `rotateX(90deg) translateZ(${h}px)`,
    `rotateX(-90deg) translateZ(${h}px)`,
  ];
  return (
    <div
      className={`fc-anim absolute ${className}`}
      style={{ perspective: 900, animation: `fc-float ${duration * 0.7}s ease-in-out ${delay}s infinite` }}
    >
      <div
        className="fc-anim"
        style={{
          width: size,
          height: size,
          transformStyle: 'preserve-3d',
          animation: `fc-spin ${duration}s linear ${delay}s infinite`,
        }}
      >
        {faces.map((t) => (
          <span
            key={t}
            className="absolute inset-0 border border-cyan-300/30 bg-cyan-400/[0.04]"
            style={{ transform: t, backfaceVisibility: 'visible' }}
          />
        ))}
      </div>
    </div>
  );
};

const Background = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* Background Video */}
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
    >
      <source src={VIDEOS.VIDEO_2} type="video/mp4" />
    </video>
    
    {/* glow orbs */}
    <div
      className="fc-anim absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full blur-3xl"
      style={{ background: 'radial-gradient(circle, rgba(34,211,238,.20), transparent 65%)', animation: 'fc-drift 18s ease-in-out infinite' }}
    />
    <div
      className="fc-anim absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full blur-3xl"
      style={{ background: 'radial-gradient(circle, rgba(124,92,255,.22), transparent 65%)', animation: 'fc-drift 24s ease-in-out infinite reverse' }}
    />

    {/* perspective floor */}
    <div className="absolute inset-x-0 bottom-0 h-[70%]" style={{ perspective: 600, perspectiveOrigin: '50% 0%' }}>
      <div
        className="fc-floor absolute left-[-50%] h-[200%] w-[200%]"
        style={{ transform: 'rotateX(72deg)', transformOrigin: '50% 0%', top: 0 }}
      />
    </div>

    {/* floating wireframe cubes */}
    <Cube size={90} duration={26} className="left-[6%] top-[14%] hidden sm:block" />
    <Cube size={54} duration={20} delay={2} className="right-[9%] top-[10%]" />
    <Cube size={70} duration={32} delay={4} className="left-[42%] top-[4%] hidden lg:block opacity-70" />
    <Cube size={110} duration={38} delay={1} className="right-[4%] bottom-[16%] hidden md:block" />
    <Cube size={44} duration={22} delay={3} className="left-[10%] bottom-[12%]" />

    {/* vignette so content stays readable */}
    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, #05060d 90%)' }} />
    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#05060d] to-transparent" />
    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05060d] to-transparent" />
  </div>
);

/* ------------------------------------------------------------------ */
/*  Course card with mouse-driven 3D tilt                              */
/* ------------------------------------------------------------------ */
const CourseCard = ({ course, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: 'easeOut' }}
      className="h-full relative group"
    >
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
              src={course.thumbnail}
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
        <div className="relative z-20 mt-auto flex items-center justify-between gap-4 border-t border-white/5 p-6">
          <div className="fc-display text-2xl font-extrabold tracking-tight text-white">₹{course.price}</div>
          <Link
            to={`/courses/${course._id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-sm font-semibold text-[#04060d] shadow-[0_8px_30px_-8px_rgba(34,211,238,.7)] transition-all duration-300 hover:shadow-[0_12px_40px_-6px_rgba(34,211,238,.95)] hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0d18]"
          >
            View details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                   */
/* ------------------------------------------------------------------ */
const Skeleton = () => (
  <div className="animate-pulse space-y-5 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
    <div className="h-44 rounded-2xl bg-white/[0.06]" />
    <div className="h-5 w-3/4 rounded-lg bg-white/[0.08]" />
    <div className="h-16 rounded-lg bg-white/[0.05]" />
    <div className="h-12 rounded-xl bg-white/[0.08]" />
  </div>
);

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
const FeaturedCourses = ({ courses }) => {
  return (
    <section className="fc-root relative isolate overflow-hidden bg-[#05060d] py-24 md:py-32">
      <style>{css}</style>
      <Background />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-auto mb-20 flex max-w-4xl flex-col items-center justify-center space-y-7 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 text-sm font-medium text-cyan-200 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            Industry-Recognized Certifications
          </div>

          <h2 className="fc-display bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-4xl font-extrabold leading-[1.1] tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            Enterprise-Grade <br className="hidden sm:block" /> Security Tracks
          </h2>


        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 xl:gap-12 w-full mt-12">
          {courses && courses.length > 0
            ? courses.slice(0, 4).map((course, i) => <CourseCard key={course._id} course={course} index={i} />)
            : [...Array(4)].map((_, i) => <Skeleton key={i} />)}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Link
            to="/courses"
            className="group inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-9 py-4 text-base font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:shadow-[0_0_50px_-10px_rgba(34,211,238,.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            Explore all courses
            <FiArrowRight className="h-5 w-5 text-cyan-300 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCourses;