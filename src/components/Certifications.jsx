import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, ArrowRightLeft, ExternalLink } from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// ✏️  EDIT YOUR CERTIFICATIONS HERE
//     Each entry can have:
//       title       : Name of the certificate
//       issuer      : Issuing organisation
//       date        : Month + Year issued
//       credentialId: Your ID / course code
//       link        : (optional) URL to verify the cert
//       accent      : Hex colour for the top accent band
// ──────────────────────────────────────────────────────────────────────────────
const CERTIFICATIONS = [
  {
    title: "Full-Stack Python Development",
    issuer: "Questech, Thane",
    date: "2025",
    credentialId: "FSPD-2025",
    link: "", // paste your badge/verify URL here
    accent: "#F0E040",
  },
  {
    title: "Web Development Certificate",
    issuer: "V2V EdTech",
    date: "2023",
    credentialId: "WD-2023",
    link: "",
    accent: "#FF4D4D",
  },
  // ── Add more certificates below ──
  // {
  //   title: "Your Certificate Name",
  //   issuer: "Issuer Name",
  //   date: "Month Year",
  //   credentialId: "CRED-ID",
  //   link: "https://...",
  //   accent: "#F0E040",
  // },
];
// ──────────────────────────────────────────────────────────────────────────────

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="py-24 px-4 md:px-12 border-t-3 border-neo-dark bg-white relative overflow-hidden"
    >
      {/* Decorative section number */}
      <div className="absolute top-16 left-10 text-[20vw] font-black text-neo-dark opacity-5 pointer-events-none select-none font-display leading-none">
        05
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">

        {/* Section Heading */}
        <div className="flex items-center gap-4 mb-16">
          <div className="text-3xl md:text-5xl font-black bg-neo-dark text-white px-4 py-2 border-3 border-neo-dark shadow-[3px_3px_0px_#1A1A1A] font-display">
            CERTIFICATIONS
          </div>
          <div className="h-[3px] bg-neo-dark flex-grow" />
        </div>

        {/* Scroll Helper Prompt */}
        <div className="flex items-center justify-between mb-6 font-mono text-xs font-black text-neo-dark/60">
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <ArrowRightLeft className="w-4 h-4 text-neo-red animate-pulse" />
            Scroll horizontally to view all
          </span>
          <span className="hidden sm:inline">[{CERTIFICATIONS.length} Credentials Verified]</span>
        </div>

        {/* Horizontal Scroll Row */}
        <div
          className="flex overflow-x-auto gap-8 pb-8 pt-2 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CERTIFICATIONS.map((cert, idx) => (
            <motion.div
              key={idx}
              className="min-w-[280px] sm:min-w-[350px] max-w-[400px] flex-shrink-0 snap-start"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', damping: 20, stiffness: 100, delay: idx * 0.1 }}
            >
              <motion.div
                className="bg-white border-3 border-neo-dark shadow-[5px_5px_0px_#1A1A1A] p-6 h-64 flex flex-col justify-between relative overflow-hidden select-none"
                whileHover={{
                  y: -6,
                  scale: 1.01,
                  boxShadow: '8px 8px 0px #1A1A1A',
                  transition: { type: 'spring', stiffness: 350, damping: 15 },
                }}
              >
                {/* Accent Color Band */}
                <div
                  className="absolute top-0 left-0 right-0 h-2"
                  style={{ backgroundColor: cert.accent }}
                />

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-black bg-neo-yellow text-neo-dark px-2 py-0.5 border-2 border-neo-dark shadow-[1.5px_1.5px_0px_#1A1A1A]">
                      {cert.issuer}
                    </span>
                    <ShieldCheck className="w-5 h-5" style={{ color: cert.accent === '#1A1A1A' ? '#FF4D4D' : cert.accent }} />
                  </div>

                  <h3 className="text-lg md:text-xl font-black text-neo-dark font-display leading-tight mb-2">
                    {cert.title}
                  </h3>
                </div>

                <div className="flex items-end justify-between border-t-2 border-dashed border-neo-dark/10 pt-4 font-mono">
                  <div className="text-left">
                    <span className="block text-[10px] text-neo-dark/50 uppercase">ID / Code</span>
                    <span className="text-xs font-bold text-neo-dark">{cert.credentialId}</span>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="block text-[10px] text-neo-dark/50 uppercase">Issued</span>
                    <span className="text-xs font-bold text-neo-dark">{cert.date}</span>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] font-black text-neo-dark bg-neo-yellow px-1.5 py-0.5 border border-neo-dark mt-1 hover:bg-neo-dark hover:text-neo-yellow transition-colors duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Verify
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
