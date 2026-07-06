import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Send, CheckCircle2, Copy, Check } from 'lucide-react';

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    handle: '@Bhushan-Nimase',
    url: 'https://github.com/Bhushan-Nimase',
    color: '#F0E040',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    handle: '/bhushan-nimase',
    url: 'https://linkedin.com/in/bhushan-nimase',
    color: '#0EA5E9',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

const EMAIL = 'nimasebhushan20@gmail.com';

/* ─── Terminal Line component ─────────────────────────────────────────────── */
function TermLine({ prefix, text, dim, yellow, delay = 0 }) {
  return (
    <motion.p
      className="font-mono text-xs md:text-sm leading-relaxed"
      initial={{ opacity: 0, x: -6 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.3 }}
    >
      {prefix && (
        <span className={yellow ? 'text-neo-yellow font-black' : 'text-white/40'}>
          {prefix}{' '}
        </span>
      )}
      <span className={dim ? 'text-white/50' : 'text-white/90'}>{text}</span>
    </motion.p>
  );
}

/* ─── Copy Button ──────────────────────────────────────────────────────────── */
function CopyBtn({ value }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handle}
      title="Copy email"
      className="p-1.5 rounded border border-white/20 text-white/50 hover:text-neo-yellow hover:border-neo-yellow transition-colors duration-150"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────────── */
export default function Contact({ scrollToSection }) {
  const [sent, setSent] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(formRef.current);
    const subject = encodeURIComponent(`Portfolio Contact: ${data.get('subject') || 'Hello'}`);
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
    );
    window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`, '_blank');
    setSent(true);
    formRef.current?.reset();
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section
      id="contact"
      className="bg-neo-dark text-white border-t-3 border-neo-dark relative overflow-hidden"
    >
      {/* ── subtle dot grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #F5F0E8 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── ghost section number ── */}
      <div className="absolute top-12 right-8 text-[18vw] font-black text-white opacity-[0.03] pointer-events-none select-none font-display leading-none">
        06
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-12 py-20 md:py-28">

        {/* ── HEADER ── */}
        <div className="mb-14">
          <motion.span
            className="font-mono text-xs text-neo-yellow/80 uppercase tracking-widest mb-3 block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            // section_06
          </motion.span>
          <motion.h2
            className="text-4xl md:text-7xl font-black font-display uppercase leading-none tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Let's
            <span className="text-neo-yellow"> Build</span>
            <br />
            Something.
          </motion.h2>
        </div>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-start">

          {/* ── LEFT: Terminal panel ── */}
          <motion.div
            className="border-2 border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Terminal title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.04]">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="font-mono text-[10px] text-white/30 ml-2 tracking-widest">contact.sh</span>
            </div>

            {/* Terminal body */}
            <div className="px-5 py-6 space-y-2.5">
              <TermLine prefix="$" text="whoami" yellow delay={0.05} />
              <TermLine text="bhushan-nimase · developer · dombivli, IN" dim delay={0.1} />

              <div className="my-4 border-t border-white/5" />

              <TermLine prefix="$" text="cat availability.txt" yellow delay={0.15} />
              <TermLine text="✓  Open to internships" delay={0.2} />
              <TermLine text="✓  Open to collabs & freelance" delay={0.25} />
              <TermLine text="✓  Open to cool ideas" delay={0.3} />

              <div className="my-4 border-t border-white/5" />

              <TermLine prefix="$" text="echo $EMAIL" yellow delay={0.35} />
              <div className="flex items-center gap-2 pl-0">
                <motion.a
                  href={`mailto:${EMAIL}`}
                  className="font-mono text-xs md:text-sm text-neo-yellow font-black hover:underline underline-offset-4 break-all"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  {EMAIL}
                </motion.a>
                <CopyBtn value={EMAIL} />
              </div>

              <div className="my-4 border-t border-white/5" />

              <TermLine prefix="$" text="ls ./socials" yellow delay={0.45} />
              <div className="flex flex-col gap-3 pt-1">
                {SOCIAL_LINKS.map((s, i) => (
                  <motion.a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.48 + i * 0.08 }}
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-white/50 group-hover:text-white transition-colors" style={{ color: s.color }}>
                      {s.icon}
                    </span>
                    <span className="font-mono text-xs text-white/60 group-hover:text-white transition-colors">
                      {s.label}
                    </span>
                    <span className="font-mono text-xs text-neo-yellow/80 ml-auto">
                      {s.handle}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-neo-yellow transition-colors" />
                  </motion.a>
                ))}
              </div>

              {/* blinking cursor */}
              <div className="pt-4 flex items-center gap-1 font-mono text-xs text-white/30">
                <span>$</span>
                <motion.span
                  className="w-2 h-4 bg-neo-yellow/70 inline-block ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Message form ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-6">
              // Send a message
            </p>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  className="flex flex-col items-center justify-center gap-4 border-2 border-neo-yellow/40 bg-neo-yellow/5 py-16 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-neo-yellow" />
                  <p className="font-display font-black text-xl text-white">Message composed!</p>
                  <p className="font-mono text-xs text-white/50">Your mail client should open now.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Row: Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5">
                      <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Name</span>
                      <input
                        name="name"
                        required
                        placeholder="Your name"
                        className="bg-white/[0.05] border-2 border-white/10 focus:border-neo-yellow/60 outline-none text-white font-mono text-sm px-4 py-3 placeholder:text-white/20 transition-colors duration-200"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Email</span>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="your@email.com"
                        className="bg-white/[0.05] border-2 border-white/10 focus:border-neo-yellow/60 outline-none text-white font-mono text-sm px-4 py-3 placeholder:text-white/20 transition-colors duration-200"
                      />
                    </label>
                  </div>

                  {/* Subject */}
                  <label className="flex flex-col gap-1.5">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Subject</span>
                    <input
                      name="subject"
                      placeholder="What's this about?"
                      className="bg-white/[0.05] border-2 border-white/10 focus:border-neo-yellow/60 outline-none text-white font-mono text-sm px-4 py-3 placeholder:text-white/20 transition-colors duration-200"
                    />
                  </label>

                  {/* Message */}
                  <label className="flex flex-col gap-1.5">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Message</span>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell me about your project, idea, or just say hey..."
                      className="bg-white/[0.05] border-2 border-white/10 focus:border-neo-yellow/60 outline-none text-white font-mono text-sm px-4 py-3 placeholder:text-white/20 transition-colors duration-200 resize-none"
                    />
                  </label>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    className="group flex items-center justify-center gap-3 bg-neo-yellow text-neo-dark font-black font-display text-base uppercase tracking-wider px-6 py-4 border-3 border-neo-yellow shadow-[5px_5px_0px_rgba(240,224,64,0.25)] hover:shadow-[7px_7px_0px_rgba(240,224,64,0.35)] transition-shadow duration-200 mt-1"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    Send Message
                    <ArrowUpRight className="w-5 h-5 opacity-60" />
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── FOOTER ── */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => scrollToSection('hero')}
              className="font-mono text-xs text-white/40 hover:text-neo-yellow border border-white/10 hover:border-neo-yellow/40 px-3 py-1.5 transition-all duration-200 uppercase tracking-wider"
              whileHover={{ y: -1 }}
            >
              ↑ Back to Top
            </motion.button>
          </div>
          <div className="font-mono text-[10px] md:text-xs text-white/30 text-center md:text-right space-y-0.5">
            <p>© {new Date().getFullYear()} Bhushan Nimase — Built with React &amp; Framer Motion</p>
            <p className="text-neo-yellow/30 uppercase tracking-widest">// Dombivli, Maharashtra, India</p>
          </div>
        </div>

      </div>
    </section>
  );
}
