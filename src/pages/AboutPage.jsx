import React from 'react';
import { Link } from 'react-router-dom';

const Icon = ({ name, className = 'h-6 w-6' }) => {
  const paths = {
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    terminal: (
      <>
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="m7 9 3 3-3 3M13 15h4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),
    cloud: (
      <>
        <path d="M20 16.6A5 5 0 0 0 17.5 7a6 6 0 0 0-11.3 2A4 4 0 0 0 7 17h12a3 3 0 0 0 1-5.8" />
        <path d="m10 13 2 2 3-4" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4M8 11h6M11 8v6" />
      </>
    ),
    layers: (
      <>
        <path d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};

const strengths = [
  {
    number: '01',
    icon: 'users',
    title: 'Mentorship that feels personal',
    description:
      'Learn with guidance from people who understand the challenges you face at every stage of your journey.',
  },
  {
    number: '02',
    icon: 'terminal',
    title: 'Practice beyond the classroom',
    description:
      'Apply what you learn through hands-on labs, realistic exercises, and practical security workflows.',
  },
  {
    number: '03',
    icon: 'target',
    title: 'Skills with a clear purpose',
    description:
      'Build a strong foundation, explore security roles, and focus on skills you can explain and demonstrate.',
  },
];

const disciplines = [
  {
    icon: 'shield',
    title: 'Security Operations',
    detail: 'Monitoring, detection, and incident response',
    tag: 'BLUE TEAM',
  },
  {
    icon: 'target',
    title: 'Offensive Security',
    detail: 'Ethical hacking and vulnerability assessment',
    tag: 'RED TEAM',
  },
  {
    icon: 'cloud',
    title: 'Cloud Security',
    detail: 'Protecting modern infrastructure and applications',
    tag: 'CLOUD',
  },
  {
    icon: 'search',
    title: 'Digital Forensics',
    detail: 'Investigation, analysis, and threat understanding',
    tag: 'ANALYSIS',
  },
];

const approach = [
  'Industry-focused learning paths',
  'Live guidance and meaningful feedback',
  'Hands-on labs and realistic scenarios',
  'Portfolio and career preparation',
];

const AboutPage = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070B14] text-white">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 h-[650px] w-[850px] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[110px]" />
        <div className="absolute right-[-200px] top-[650px] h-[600px] w-[600px] rounded-full bg-blue-600/[0.07] blur-[120px]" />
      </div>

      {/* Hero */}
      <section className="relative border-b border-white/[0.07]">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-10 lg:pb-28 lg:pt-40">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
              About Cyber Security Brigade
            </div>

            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-[4.5rem]">
              The next generation of
              <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                cyber defenders
              </span>
              starts here.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              We make cybersecurity education practical and approachable.
              Through guided learning, real-world exercises, and a supportive
              community, we help learners turn curiosity into capability.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/courses"
                className="group inline-flex items-center gap-3 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-bold text-[#07121D] shadow-[0_12px_35px_rgba(34,211,238,0.18)] transition hover:-translate-y-0.5 hover:bg-cyan-300"
              >
                Explore Courses
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </Link>
              <a
                href="#our-approach"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/[0.04]"
              >
                How we teach
                <span aria-hidden="true">↘</span>
              </a>
            </div>
          </div>

          {/* Cyber dashboard visual; pure CSS/SVG, no image dependency */}
          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-cyan-500/[0.06] blur-3xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-cyan-300/15 bg-[#0C1423] p-4 shadow-[0_35px_100px_rgba(0,0,0,0.4)] sm:p-6">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    'linear-gradient(#67e8f9 1px, transparent 1px), linear-gradient(90deg, #67e8f9 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />
              <div className="relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.16em] text-slate-500 sm:text-xs">
                    CSB // LEARNING ENVIRONMENT
                  </span>
                </div>

                <div className="flex flex-col items-center py-9 text-center sm:py-12">
                  <div className="relative flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44">
                    <div className="absolute inset-0 rounded-full border border-cyan-400/15" />
                    <div className="absolute inset-4 rounded-full border border-dashed border-cyan-400/30" />
                    <div className="absolute inset-8 rounded-full bg-cyan-400/[0.08] shadow-[0_0_55px_rgba(34,211,238,0.15)]" />
                    <Icon
                      name="shield"
                      className="relative h-16 w-16 text-cyan-300 sm:h-20 sm:w-20"
                    />
                    <span className="absolute right-0 top-7 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_#67e8f9]" />
                    <span className="absolute bottom-3 left-5 h-1.5 w-1.5 rounded-full bg-blue-400" />
                  </div>
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-300">
                    Learn. Practice. Defend.
                  </p>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    Skills built for the real world
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    ['01', 'Learn'],
                    ['02', 'Practice'],
                    ['03', 'Grow'],
                  ].map(([number, label]) => (
                    <div
                      key={number}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-3 sm:p-4"
                    >
                      <span className="font-mono text-xs text-cyan-400">
                        {number}
                      </span>
                      <p className="mt-2 text-xs font-medium text-slate-200 sm:text-sm">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-2 hidden items-center gap-3 rounded-xl border border-cyan-400/20 bg-[#101F2C] px-4 py-3 shadow-xl sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                <Icon name="check" className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium text-slate-200">
                Practical learning, every step
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Why we're different */}
      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
            Why we're different
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Built for people who want to{' '}
            <span className="text-cyan-300">actually do the work.</span>
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-400">
            Cybersecurity is best learned by asking questions, testing ideas,
            and working through challenges with the right support.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {strengths.map((item) => (
            <article
              key={item.number}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.035] p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-cyan-400/[0.055] sm:p-8"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300">
                  <Icon name={item.icon} />
                </div>
                <span className="font-mono text-xs text-slate-600">
                  /{item.number}
                </span>
              </div>
              <h3 className="mt-9 text-xl font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                {item.description}
              </p>
              <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent transition group-hover:via-cyan-400/50" />
            </article>
          ))}
        </div>
      </section>

      {/* Approach */}
      <section
        id="our-approach"
        className="relative border-y border-white/[0.07] bg-[#0A111E]"
      >
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-24 lg:px-10 lg:py-28">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              Our approach
            </p>
            <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              From learning the concepts to applying them with confidence.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-slate-400">
              We connect strong fundamentals with hands-on practice. Whether
              you're exploring your first security role or expanding your
              existing skills, your learning should have a clear direction.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] p-5 sm:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                <Icon name="layers" className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-300">
                The CSB learning framework
              </span>
            </div>

            <div className="space-y-3">
              {approach.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-[#0D1725] px-4 py-4 sm:px-5"
                >
                  <span className="font-mono text-xs text-cyan-400">
                    0{index + 1}
                  </span>
                  <span className="h-5 w-px bg-white/10" />
                  <p className="text-sm font-medium text-slate-200 sm:text-base">
                    {item}
                  </p>
                  <Icon
                    name="check"
                    className="ml-auto h-4 w-4 shrink-0 text-cyan-400"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Areas of expertise */}
      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              What you'll explore
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Explore the world of security.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-slate-400">
            Discover the disciplines that protect people, systems, and
            organizations every day.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {disciplines.map((item) => (
            <article
              key={item.title}
              className="group rounded-2xl border border-white/[0.09] bg-gradient-to-b from-[#111C2B] to-[#0B1320] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/35"
            >
              <div className="mb-14 flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/[0.09] text-cyan-300">
                  <Icon name={item.icon} />
                </span>
                <span className="rounded border border-white/10 px-2 py-1 font-mono text-[9px] tracking-[0.14em] text-slate-500">
                  {item.tag}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-400">
                {item.detail}
              </p>
              <div className="mt-7 h-px bg-gradient-to-r from-cyan-400/40 to-transparent" />
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-cyan-400/20 bg-gradient-to-br from-[#0E3040] via-[#10263B] to-[#10162B] px-7 py-14 text-center sm:px-12 lg:py-20">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle, #67e8f9 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
              Your next step starts here
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Ready to build your future in cybersecurity?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-300">
              Find a learning path that matches your goals and start building
              skills you can put to work.
            </p>
            <Link
              to="/courses"
              className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-cyan-400 px-7 py-4 text-sm font-bold text-[#07121D] transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              View Our Courses
              <Icon
                name="arrow"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;