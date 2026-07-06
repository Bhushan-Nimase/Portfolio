import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Terminal, Cpu, Layers, Zap, ChevronDown } from 'lucide-react';
import gsap from 'gsap';

/* ══════════════════════════════════════════════════════════════════════════════
   HERO — "Exploded Stack" v4
   Signature: the layers of the full stack (AI → Frontend → Backend → Database)
   sit collapsed like a deck of cards and fan open on hover/tap — a literal,
   interactive read on "full-stack developer" instead of a decorative card.
══════════════════════════════════════════════════════════════════════════════ */

/* ── Magnetic CTA ─────────────────────────────────────────────────────────── */
function MagneticBtn({ children, className, onClick }) {
  const ref = useRef(null);
  const x   = useMotionValue(0);
  const y   = useMotionValue(0);
  const sx  = useSpring(x, { stiffness: 220, damping: 20 });
  const sy  = useSpring(y, { stiffness: 220, damping: 20 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.25);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* ── Looping typed boot line ──────────────────────────────────────────────── */
function TypingText({ texts, className = '' }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const current = texts[idx];
    if (typing) {
      if (displayed.length < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 45);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setTyping(false), 1300);
      return () => clearTimeout(t);
    }
    if (displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 25);
      return () => clearTimeout(t);
    }
    setIdx((i) => (i + 1) % texts.length);
    setTyping(true);
  }, [displayed, typing, idx, texts]);

  return (
    <span className={className}>
      {displayed}
      <motion.span
        className="inline-block w-[2px] h-3 bg-current ml-0.5 align-middle"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   EXPLODED STACK TOWER — the signature element
══════════════════════════════════════════════════════════════════════════════ */
const STACK_LAYERS = [
  { id: 'ai',       label: 'AI / LLM',    sub: 'Semantic Kernel · Python', bg: '#FF4D4D', text: '#FFFFFF', icon: Zap,      rotate: -3 },
  { id: 'frontend', label: 'Frontend',    sub: 'React 19 · Vite · Tailwind', bg: '#F0E040', text: '#1A1A1A', icon: Layers,   rotate: 2  },
  { id: 'backend',  label: 'Backend API', sub: 'ASP.NET Core · C#', bg: '#1A1A1A', text: '#FFFFFF', icon: Terminal, rotate: -2 },
  { id: 'data',     label: 'Database',    sub: 'PostgreSQL · Redis', bg: '#FFFFFF', text: '#1A1A1A', icon: Cpu,      rotate: 3  },
];

function StackTower() {
  const [spread, setSpread] = useState(false);
  const COLLAPSED_STEP = 24;
  const SPREAD_STEP    = 108;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-[280px] sm:w-[340px] h-[440px] select-none cursor-pointer"
        onMouseEnter={() => setSpread(true)}
        onMouseLeave={() => setSpread(false)}
        onClick={() => setSpread((s) => !s)}
      >
        {STACK_LAYERS.map((layer, idx) => {
          const Icon = layer.icon;
          const top = spread ? idx * SPREAD_STEP : idx * COLLAPSED_STEP;
          return (
            <motion.div
              key={layer.id}
              className="absolute left-0 right-0 border-3 border-[#1A1A1A] shadow-[5px_5px_0px_#1A1A1A] px-5 py-4 flex items-center gap-3"
              style={{ background: layer.bg, color: layer.text, zIndex: STACK_LAYERS.length - idx }}
              initial={{ opacity: 0, y: -140, rotate: layer.rotate }}
              animate={{
                opacity: 1,
                y: 0,
                top: `${top}px`,
                rotate: spread ? 0 : layer.rotate,
              }}
              transition={{
                opacity: { duration: 0.4, delay: 0.5 + idx * 0.1 },
                y:       { duration: 0.4, delay: 0.5 + idx * 0.1 },
                top:     { type: 'spring', stiffness: 170, damping: 20 },
                rotate:  { type: 'spring', stiffness: 170, damping: 20 },
              }}
            >
              <div
                className="w-10 h-10 shrink-0 border-2 flex items-center justify-center"
                style={{ borderColor: layer.text }}
              >
                <Icon className="w-5 h-5" style={{ color: layer.text }} />
              </div>
              <div className="min-w-0">
                <div className="font-display font-black text-base leading-none mb-1">{layer.label}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider opacity-80 truncate">{layer.sub}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Hint */}
      <motion.div
        className="mt-5 flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A]/45"
        animate={{ opacity: spread ? 0.15 : [0.45, 0.9, 0.45] }}
        transition={{ duration: 1.8, repeat: spread ? 0 : Infinity }}
      >
        <ChevronDown className="w-3.5 h-3.5" />
        Hover to explode the stack
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN HERO
══════════════════════════════════════════════════════════════════════════════ */
export default function Hero({ scrollToSection }) {
  const sectionRef = useRef(null);
  const badgeRef   = useRef(null);
  const eyebrowRef = useRef(null);
  const nameRef    = useRef(null);
  const markRef    = useRef(null);
  const chipRef    = useRef(null);
  const bioRef     = useRef(null);
  const ctaRef     = useRef(null);

  const mvX = useMotionValue(50);
  const mvY = useMotionValue(50);

  /* ── Ambient cursor spotlight (kept subtle, no color/theme change) ────── */
  useEffect(() => {
    const el = sectionRef.current;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      mvX.set(((e.clientX - r.left) / r.width) * 100);
      mvY.set(((e.clientY - r.top) / r.height) * 100);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, [mvX, mvY]);

  /* ── GSAP entrance ──────────────────────────────────────────────────── */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (prefersReduced) {
        gsap.set([badgeRef.current, eyebrowRef.current, nameRef.current, chipRef.current, bioRef.current, ctaRef.current], { opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)' });
        return;
      }

      tl.from(badgeRef.current, { opacity: 0, y: -16, duration: 0.4 }, 0);
      tl.from(eyebrowRef.current, { opacity: 0, y: 10, duration: 0.35 }, 0.1);

      tl.fromTo(
        nameRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power4.out' },
        0.2
      );

      tl.fromTo(
        markRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: 'power2.out', transformOrigin: 'left center' },
        1.0
      );

      tl.from(chipRef.current, { opacity: 0, x: -16, duration: 0.4 }, 1.1);
      tl.from(bioRef.current, { opacity: 0, y: 16, duration: 0.4 }, 1.2);
      tl.from(ctaRef.current, { opacity: 0, y: 16, duration: 0.4 }, 1.3);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen bg-[#F5F0E8] overflow-hidden flex flex-col"
    >
      {/* ── Dot grid ─────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #1A1A1A 1.2px, transparent 1.2px)',
          backgroundSize: '34px 34px',
          opacity: 0.045,
        }}
      />

      {/* ── Cursor spotlight overlay ─────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(500px circle at ${mvX.get()}% ${mvY.get()}%, rgba(26,26,26,0.05), transparent 60%)`,
        }}
      />

      {/* ── Ghost watermark ─────────────────────────────────────────────── */}
      <div
        className="absolute z-0 select-none pointer-events-none font-black leading-none text-[#1A1A1A]"
        style={{
          fontSize: 'clamp(140px, 24vw, 340px)',
          opacity: 0.028,
          right: '-2%',
          top: '-4%',
          fontFamily: 'Syne, sans-serif',
        }}
      >
        BN
      </div>

      {/* ══════════════ MAIN GRID ══════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 flex items-center w-full max-w-[1400px] mx-auto px-5 sm:px-10 md:px-14 pt-28 pb-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 xl:gap-20 items-center">

          {/* ══ LEFT column ══════════════════════════════════════════════ */}
          <div className="flex flex-col items-start">

            {/* Availability badge */}
            <div ref={badgeRef} className="mb-6">
              <motion.div
                className="inline-flex items-center gap-2 bg-[#FF4D4D] text-white font-mono font-black text-xs px-4 py-2 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] uppercase tracking-wider"
                style={{ rotate: -1.5 }}
                whileHover={{ rotate: 0, scale: 1.04, transition: { type: 'spring', stiffness: 300 } }}
              >
                <motion.span
                  className="w-2 h-2 rounded-full bg-white"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                ⚡ Available for Internship
              </motion.div>
            </div>

            {/* Boot-sequence eyebrow */}
            <div ref={eyebrowRef} className="mb-3">
              <TypingText
                className="font-mono text-xs md:text-sm font-black text-[#1A1A1A]/50 uppercase tracking-[0.2em]"
                texts={['> whoami --full-stack', '> cat role.txt', '> echo "building things"']}
              />
            </div>

            {/* ── NAME: single line, clip-path reveal ─────────────────── */}
            <h1
              ref={nameRef}
              className="font-display font-black leading-[0.92] tracking-tight text-[#1A1A1A] mb-1 w-full"
              style={{ fontSize: 'clamp(2.6rem, 7.2vw, 6.2rem)' }}
            >
              BHUSHAN
            </h1>
            <h1
              className="relative inline-block font-display font-black leading-[0.92] tracking-tight text-[#1A1A1A] mb-6"
              style={{ fontSize: 'clamp(2.6rem, 7.2vw, 6.2rem)' }}
            >
              <span
                ref={markRef}
                className="absolute left-0 right-0 bottom-[6%] h-[38%] bg-[#F0E040] -z-10"
                aria-hidden="true"
              />
              NIMASE
            </h1>

            {/* Role chips */}
            <div ref={chipRef} className="flex flex-wrap gap-2 mb-5">
              {[
                { label: 'Full-Stack Dev', bg: '#1A1A1A', text: 'white' },
                { label: 'AI Integrator',  bg: 'white',   text: '#1A1A1A', border: true },
                { label: '.NET / C#',      bg: 'white',   text: '#1A1A1A', border: true },
                { label: 'React.js',       bg: 'white',   text: '#1A1A1A', border: true },
              ].map(({ label, bg, text }) => (
                <span
                  key={label}
                  className="font-mono font-black text-[11px] md:text-xs px-3 py-1.5 uppercase tracking-widest border-2 border-[#1A1A1A]"
                  style={{ background: bg, color: text }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Meta strip */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6 font-mono text-[11px] text-[#1A1A1A]/50 font-bold uppercase tracking-wider">
              <span>📍 Dombivli, MH</span>
              <span className="opacity-30">|</span>
              <span>🎓 Computer Engg · 3rd Year</span>
            </div>

            {/* Bio */}
            <p
              ref={bioRef}
              className="text-[#1A1A1A]/70 text-base md:text-lg leading-relaxed max-w-lg mb-8"
              style={{ fontFamily: "'Inter',sans-serif" }}
            >
              I design and ship{' '}
              <span className="font-bold text-[#1A1A1A] underline decoration-[3px] decoration-[#FF4D4D] underline-offset-4">
                full-stack web apps
              </span>{' '}
              and{' '}
              <span className="font-bold text-[#1A1A1A] underline decoration-[3px] decoration-[#FF4D4D] underline-offset-4">
                scalable SaaS platforms
              </span>{' '}
              — turning complex ideas into clean, working software with .NET, React &amp; Python.
            </p>

            {/* CTA */}
            <div ref={ctaRef} className="flex flex-row flex-wrap gap-4">
              <MagneticBtn
                onClick={() => scrollToSection('projects')}
                className="group flex items-center gap-2.5 bg-[#F0E040] text-[#1A1A1A] font-black text-sm uppercase tracking-wider px-7 py-4 border-3 border-[#1A1A1A] shadow-[5px_5px_0px_#1A1A1A] hover:shadow-[8px_8px_0px_#1A1A1A] transition-shadow duration-200 cursor-pointer"
              >
                View Projects
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </MagneticBtn>

              <MagneticBtn
                onClick={() => scrollToSection('contact')}
                className="group flex items-center gap-2.5 bg-white text-[#1A1A1A] font-black text-sm uppercase tracking-wider px-7 py-4 border-3 border-[#1A1A1A] shadow-[5px_5px_0px_#1A1A1A] hover:shadow-[8px_8px_0px_#1A1A1A] transition-shadow duration-200 cursor-pointer"
              >
                Get In Touch
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </MagneticBtn>
            </div>
          </div>

          {/* ══ RIGHT column — exploded stack tower ══════════════════════ */}
          <div className="flex items-center justify-center py-8 lg:py-0">
            <StackTower />
          </div>

        </div>
      </div>

      {/* ── Dual-row opposite-direction ticker ─────────────────────────── */}
      <div className="relative z-10 bg-[#1A1A1A] border-t-3 border-[#1A1A1A] overflow-hidden shrink-0">
        {[
          { dir: ['0%', '-50%'], duration: 24, list: ['Full-Stack Dev', 'ASP.NET Core', 'React.js', 'PostgreSQL', 'Semantic Kernel'] },
          { dir: ['-50%', '0%'], duration: 28, list: ['AI Integration', 'Docker', 'Python', 'TypeScript', 'C#'] },
        ].map((row, r) => (
          <motion.div
            key={r}
            className={`flex gap-0 whitespace-nowrap py-2.5 ${r === 1 ? 'border-t border-white/10' : ''}`}
            animate={{ x: row.dir }}
            transition={{ duration: row.duration, ease: 'linear', repeat: Infinity }}
          >
            {[...row.list, ...row.list, ...row.list, ...row.list].map((t, i) => (
              <span key={i} className="font-mono font-black text-xs uppercase tracking-widest text-white/50 px-6 border-r border-white/10">
                <span className="text-[#F0E040] mr-2">✦</span>{t}
              </span>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}