import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { ExternalLink, MapPin, Zap, Code2, Database, Brain } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GithubBoard from './GithubBoard';

gsap.registerPlugin(ScrollTrigger);

/* ── constants ─────────────────────────────────────────────────────────────── */
const GITHUB_USER = 'Bhushan-Nimase';
const GITHUB_URL  = `https://github.com/${GITHUB_USER}`;
const AVATAR_URL  = `https://github.com/${GITHUB_USER}.png`;

const STATS = [
  { value: 20,   suffix: '',  label: 'Years Old' },
  { value: 3,    suffix: '+', label: 'Years Coding' },
  { value: 15,   suffix: '+', label: 'Projects Built' },
  { value: 100,  suffix: '%', label: 'Passion' },
];

const FOCUS_ITEMS = [
  { num: '01', icon: <Code2 className="w-5 h-5" />,     title: 'Full-Stack Dev',         desc: 'React/Vite frontends paired with robust ASP.NET Core APIs.' },
  { num: '02', icon: <Zap className="w-5 h-5" />,       title: 'Backend Architecture',   desc: 'Clean Architecture web services in ASP.NET Core & C#.' },
  { num: '03', icon: <Database className="w-5 h-5" />,  title: 'Database Design',         desc: 'Schema design, stored procedures & query tuning in SQL.' },
  { num: '04', icon: <Brain className="w-5 h-5" />,     title: 'AI Integration',          desc: 'LLMs, prompt pipelines, vector DBs & Semantic Kernel.' },
];

const TAGS = ['.NET / C#', 'React.js', 'PostgreSQL', 'ASP.NET Core', 'Semantic Kernel', 'Docker', 'TypeScript', 'Python'];

/* ── Animated counter ──────────────────────────────────────────────────────── */
function Counter({ target, suffix, duration = 1.4 }) {
  const ref      = useRef(null);
  const inView   = useInView(ref, { once: true, margin: '-40px' });
  const motVal   = useMotionValue(0);
  const display  = useSpring(motVal, { duration: duration * 1000, bounce: 0 });
  const [num, setNum] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const unsub = display.on('change', (v) => setNum(Math.round(v)));
    animate(motVal, target, { duration, ease: 'easeOut' });
    return unsub;
  }, [inView]);

  return <span ref={ref}>{num}{suffix}</span>;
}

/* ── GithubIcon / LinkedinIcon ─────────────────────────────────────────────── */
const GithubIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
const LinkedinIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function About() {
  const [imgError, setImgError]   = useState(false);
  const sectionRef  = useRef(null);
  const headingRef  = useRef(null);
  const imageRef    = useRef(null);
  const rightRef    = useRef(null);
  const statsRef    = useRef(null);
  const boardRef    = useRef(null);
  const tickerRef   = useRef(null);

  /* ── GSAP animations ──────────────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {

      /* 1. Heading word-by-word reveal */
      const words = headingRef.current?.querySelectorAll('.word');
      if (words?.length) {
        gsap.from(words, {
          scrollTrigger: { trigger: headingRef.current, start: 'top 82%', once: true },
          opacity: 0,
          y: 48,
          skewY: 4,
          duration: 0.7,
          stagger: 0.07,
          ease: 'power3.out',
        });
      }

      /* 2. Image parallax drift */
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
        y: -60,
        ease: 'none',
      });

      /* 3. Right column stagger fade-in */
      const rightItems = rightRef.current?.querySelectorAll('.anim-item');
      if (rightItems?.length) {
        gsap.from(rightItems, {
          scrollTrigger: { trigger: rightRef.current, start: 'top 80%', once: true },
          opacity: 0,
          x: 36,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out',
        });
      }

      /* 4. Stats counter row slide up */
      const statCards = statsRef.current?.querySelectorAll('.stat-card');
      if (statCards?.length) {
        gsap.from(statCards, {
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%', once: true },
          opacity: 0,
          y: 40,
          duration: 0.55,
          stagger: 0.08,
          ease: 'back.out(1.5)',
        });
      }

      /* 5. Horizontal ticker */
      const ticker = tickerRef.current;
      if (ticker) {
        const inner = ticker.querySelector('.ticker-inner');
        if (inner) {
          const totalW = inner.scrollWidth / 2;
          gsap.to(inner, {
            x: -totalW,
            duration: 22,
            ease: 'none',
            repeat: -1,
          });
        }
      }

      /* 6. Board fade in */
      gsap.from(boardRef.current, {
        scrollTrigger: { trigger: boardRef.current, start: 'top 88%', once: true },
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-[#F5F0E8] border-t-3 border-[#1A1A1A] overflow-hidden"
    >
      {/* ── faint grid watermark ──────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(#1A1A1A 1px,transparent 1px),linear-gradient(90deg,#1A1A1A 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ════════════════════════════════════════════════════════════════════
          HEADER BAND — full width, dark
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#1A1A1A] px-6 md:px-16 py-10 md:py-14 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">

          {/* Section label */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-[#F0E040]/60 uppercase tracking-[0.3em]">
              // 02 &nbsp;·&nbsp; ABOUT
            </span>
            <div className="h-px w-10 bg-[#F0E040]/20" />
          </div>

          {/* Big heading */}
          <h2
            ref={headingRef}
            className="font-display font-black text-[clamp(2.8rem,7vw,6rem)] text-white leading-none uppercase tracking-tight overflow-hidden"
            aria-label="About Me"
          >
            {'About Me'.split(' ').map((w, i) => (
              <span key={i} className="inline-block overflow-hidden mr-4">
                <span className="word inline-block">{w}</span>
              </span>
            ))}
          </h2>

          {/* Location pill */}
          <div className="flex items-center gap-2 text-white/40 font-mono text-xs self-start md:self-end pb-1">
            <MapPin className="w-3.5 h-3.5 text-[#F0E040]/60" />
            Dombivli, Maharashtra, IN
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          STATS ROW — full-bleed yellow band
      ════════════════════════════════════════════════════════════════════ */}
      <div ref={statsRef} className="bg-[#F0E040] border-y-3 border-[#1A1A1A] px-6 md:px-16 py-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="stat-card flex flex-col items-center py-4 px-2 border-r-2 border-[#1A1A1A] last:border-r-0 md:border-r-2"
              style={{ borderRight: i === 1 ? (window.innerWidth < 768 ? 'none' : '') : '' }}
            >
              <span className="font-display font-black text-[clamp(2rem,4vw,3.5rem)] text-[#1A1A1A] leading-none">
                <Counter target={s.value} suffix={s.suffix} />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#1A1A1A]/60 mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          MAIN BODY — two columns
      ════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 lg:gap-20 relative z-10 items-start">

        {/* ── LEFT: Image + socials ────────────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Image card */}
          <div
            ref={imageRef}
            className="relative border-3 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] overflow-hidden bg-[#1A1A1A] will-change-transform"
          >
            {!imgError ? (
              <img
                src={AVATAR_URL}
                alt="Bhushan Nimase"
                className="w-full object-cover block"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full aspect-square bg-[#F0E040] flex items-center justify-center">
                <span className="font-display font-black text-6xl text-[#1A1A1A] select-none">BN</span>
              </div>
            )}

            {/* Overlay badge */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#1A1A1A]/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
              <span className="font-mono font-black text-[#F0E040] text-xs">@{GITHUB_USER}</span>
              <motion.span
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {/* Corner accent */}
            <div className="absolute top-3 right-3 bg-[#F0E040] border-2 border-[#1A1A1A] px-2 py-0.5">
              <span className="font-mono text-[9px] font-black text-[#1A1A1A] uppercase tracking-widest">Available</span>
            </div>
          </div>

          {/* Social links */}
          {[
            {
              href: GITHUB_URL,
              icon: <GithubIcon className="w-5 h-5" />,
              platform: 'GitHub',
              handle: `/${GITHUB_USER}`,
              dark: true,
            },
            {
              href: 'https://linkedin.com/in/bhushan-nimase',
              icon: <LinkedinIcon className="w-5 h-5" />,
              platform: 'LinkedIn',
              handle: '/bhushan-nimase',
              dark: false,
            },
          ].map((s) => (
            <motion.a
              key={s.platform}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-4 py-3.5 border-2 border-[#1A1A1A] group transition-all duration-200
                ${s.dark
                  ? 'bg-[#1A1A1A] text-white shadow-[4px_4px_0px_#F0E040] hover:shadow-[6px_6px_0px_#F0E040]'
                  : 'bg-white text-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] hover:bg-[#F0E040] hover:shadow-[6px_6px_0px_#1A1A1A]'
                }`}
              whileHover={{ y: -3, x: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={s.dark ? 'text-white group-hover:text-[#F0E040] transition-colors' : 'text-[#0077B5]'}>
                {s.icon}
              </span>
              <div className="min-w-0">
                <p className={`font-mono text-[9px] uppercase tracking-widest leading-none mb-0.5 ${s.dark ? 'text-white/40' : 'text-[#1A1A1A]/40'}`}>
                  {s.platform}
                </p>
                <p className={`font-mono font-bold text-sm truncate ${s.dark ? 'text-[#F0E040]' : 'text-[#1A1A1A]'}`}>
                  {s.handle}
                </p>
              </div>
              <ExternalLink className={`w-4 h-4 ml-auto shrink-0 transition-opacity ${s.dark ? 'opacity-30 group-hover:opacity-100' : 'opacity-30 group-hover:opacity-100'}`} />
            </motion.a>
          ))}
        </div>

        {/* ── RIGHT: Bio + focus cards ─────────────────────────────────── */}
        <div ref={rightRef} className="flex flex-col gap-8">

          {/* Bio paragraphs */}
          <div className="anim-item">
            <p className="text-[1.05rem] md:text-lg leading-[1.85] text-[#1A1A1A]/85 font-[Inter,sans-serif]">
              I'm a{' '}
              <span className="font-black text-[#1A1A1A] bg-[#F0E040] px-1">20-year-old Computer Engineering</span>
              {' '}student at the University of Mumbai with a prior Diploma in IT. I build at the intersection of AI and web applications, designing everything from high-performance backend APIs to responsive frontends.
            </p>
          </div>

          <div className="anim-item">
            <p className="text-[1.05rem] md:text-lg leading-[1.85] text-[#1A1A1A]/85 font-[Inter,sans-serif]">
              I focus on{' '}
              <span className="font-semibold border-b-2 border-[#1A1A1A]">clean, modular, and developer-friendly code</span>
              . I enjoy tackling complex architectural problems and packaging them into user-first software products.
            </p>
          </div>

          {/* Divider */}
          <div className="anim-item h-px bg-[#1A1A1A]/10" />

          {/* Focus cards — 2×2 grid */}
          <div className="anim-item grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FOCUS_ITEMS.map((item, i) => (
              <motion.div
                key={item.num}
                className="group border-2 border-[#1A1A1A]/15 bg-white/60 p-5 cursor-default relative overflow-hidden transition-all duration-200 hover:border-[#1A1A1A] hover:shadow-[4px_4px_0px_#1A1A1A] hover:bg-white"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              >
                {/* accent bar on hover */}
                <div className="absolute top-0 left-0 h-0.5 w-0 bg-[#F0E040] group-hover:w-full transition-all duration-300 ease-out" />

                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] text-[#1A1A1A]/30 font-black">{item.num}</span>
                  <span className="text-[#1A1A1A]/50 group-hover:text-[#1A1A1A] transition-colors">{item.icon}</span>
                </div>
                <h3 className="font-display font-black text-[1rem] text-[#1A1A1A] mb-1.5 leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-[#1A1A1A]/60 leading-relaxed font-[Inter,sans-serif]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Tech tags */}
          <div className="anim-item flex flex-wrap gap-2">
            {TAGS.map((tag, i) => (
              <motion.span
                key={tag}
                className="font-mono font-bold text-[11px] px-3 py-1.5 border-2 border-[#1A1A1A] bg-white text-[#1A1A1A] cursor-default select-none shadow-[2px_2px_0px_#1A1A1A] hover:bg-[#F0E040] hover:shadow-[3px_3px_0px_#1A1A1A] transition-all duration-150"
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 300 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          TICKER BAND
      ════════════════════════════════════════════════════════════════════ */}
      <div
        ref={tickerRef}
        className="bg-[#1A1A1A] border-y-3 border-[#1A1A1A] py-3.5 overflow-hidden relative z-10"
      >
        <div className="ticker-inner flex gap-0 whitespace-nowrap will-change-transform">
          {[...TAGS, ...TAGS, ...TAGS, ...TAGS].map((tag, i) => (
            <span key={i} className="font-mono font-black text-xs uppercase tracking-widest text-white/60 px-6 border-r border-white/10">
              <span className="text-[#F0E040] mr-2">✦</span>{tag}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          GITHUB BOARD
      ════════════════════════════════════════════════════════════════════ */}
      <div ref={boardRef} className="max-w-7xl mx-auto px-6 md:px-16 py-12 md:py-16 relative z-10">
        <GithubBoard />
      </div>
    </section>
  );
}