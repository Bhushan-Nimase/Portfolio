import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, CheckSquare } from 'lucide-react';

export default function Experience() {
  const experiences = [
    {
      title: "Full-Stack Developer (Project)",
      company: "SmartLedger AI — 2025 (In Progress)",
      bullets: [
        "Building a multi-tenant SaaS financial document processing platform",
        "Clean Architecture in .NET with ASP.NET Core, EF Core, PostgreSQL",
        "AI document intelligence via Semantic Kernel + Qdrant vector DB",
        "React frontend with role-based dashboards and real-time job tracking"
      ]
    }
  ];

  return (
    <section 
      id="experience" 
      className="py-24 px-4 md:px-12 border-t-3 border-neo-dark relative overflow-hidden bg-[#F5F0E8]"
    >
      {/* Huge Background Section Number */}
      <div className="absolute top-16 right-10 text-[20vw] font-black text-neo-dark opacity-5 pointer-events-none select-none font-display leading-none">
        03
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Heading */}
        <div className="flex items-center gap-4 mb-16">
          <div className="text-3xl md:text-5xl font-black bg-neo-dark text-white px-4 py-2 border-3 border-neo-dark shadow-[3px_3px_0px_#1A1A1A] font-display">
            EXPERIENCE
          </div>
          <div className="h-[3px] bg-neo-dark flex-grow" />
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 md:pl-20 py-4">
          {/* Spine - Vertical Timeline Line */}
          <div className="absolute left-2 md:left-8 top-0 bottom-0 w-1 md:w-1.5 bg-neo-dark" />

          {experiences.map((exp, idx) => (
            <motion.div 
              key={idx}
              className="relative mb-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
              {/* Timeline Connector Indicator (Square node) */}
              <div className="absolute -left-[23px] md:-left-[53px] top-6 w-5 h-5 bg-[#F0E040] border-3 border-neo-dark shadow-[2px_2px_0px_#1A1A1A] z-20 rotate-45" />

              {/* Experience Card */}
              <motion.div 
                className="bg-white border-3 border-neo-dark shadow-[5px_5px_0px_#1A1A1A] p-6 md:p-8 max-w-3xl relative"
                whileHover={{ 
                  scale: 1.01, 
                  x: 3, 
                  y: -2,
                  boxShadow: '8px 8px 0px #1A1A1A',
                  transition: { type: 'spring', stiffness: 350 }
                }}
              >
                {/* Header Tag Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-neo-dark pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="bg-neo-red text-white p-1.5 border-2 border-neo-dark">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black font-display tracking-wide">
                      {exp.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neo-yellow text-neo-dark font-mono font-black text-xs px-3 py-1 border-2 border-neo-dark shadow-[2px_2px_0px_#1A1A1A]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exp.company}</span>
                  </div>
                </div>

                {/* Bullets */}
                <ul className="space-y-3 text-sm md:text-base font-medium text-neo-dark/85" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5">
                      <CheckSquare className="w-5 h-5 text-neo-red shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Asymmetric sticker accent */}
                <div className="absolute -bottom-3 -right-3 bg-neo-dark text-[#F5F0E8] font-mono text-[10px] font-black tracking-widest px-2.5 py-1 border-2 border-neo-dark shadow-[2px_2px_0px_#F0E040] select-none rotate-2">
                  // STACK_DEV
                </div>

              </motion.div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
