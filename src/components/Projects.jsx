import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ExternalLink, Folder } from 'lucide-react';

function ProjectCard({ project }) {
  // Motion values for tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map mouse positions to rotational angles
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { damping: 15, stiffness: 200 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { damping: 15, stiffness: 200 });

  const handleMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Get mouse position relative to center of the card
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Normalize values between -0.5 and 0.5
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        whileHover={{
          y: -8,
          boxShadow: '8px 8px 0px #1A1A1A'
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        className="bg-white border-3 border-neo-dark shadow-[5px_5px_0px_#1A1A1A] p-6 h-full flex flex-col justify-between relative overflow-hidden"
      >
        {/* Accent Top Border */}
        <div 
          className="absolute top-0 left-0 right-0 h-[6px]"
          style={{ backgroundColor: project.accentColor }}
        />

        <div className="pt-2">
          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2 mb-5 font-mono text-[10px] md:text-xs">
            {project.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="bg-neo-yellow text-neo-dark px-2 py-0.5 border-2 border-neo-dark font-black tracking-wide select-none"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Project Title */}
          <h3 className="text-xl md:text-2xl font-black mb-3 text-neo-dark font-display flex items-center gap-2">
            <Folder className="w-5 h-5 shrink-0" style={{ color: project.accentColor }} />
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm md:text-base text-neo-dark/75 leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            {project.description}
          </p>
        </div>

        {/* View Project Button */}
        <div className="pt-2 mt-auto border-t-2 border-dashed border-neo-dark/20">
          <motion.a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn bg-white hover:bg-neo-yellow text-xs font-black w-full flex items-center justify-center gap-1.5 py-2"
            whileHover={{ y: -2, boxShadow: '4px 4px 0px #1A1A1A' }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View Project</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}

export default function Projects() {
  const projectList = [
    {
      title: "SmartLedger AI",
      tags: [".NET", "React", "PostgreSQL", "Semantic Kernel", "AI"],
      description: "Multi-tenant SaaS platform for financial document processing. Built with Clean Architecture, RAG pipelines, and real-time job queuing via Hangfire.",
      accentColor: "#FF4D4D", // Red
      githubUrl: "https://github.com/Bhushan-Nimase?tab=repositories"
    },
    {
      title: "SmartHire",
      tags: ["ASP.NET Core", "React", "EF Core", "ML.NET", "SQL Server"],
      description: "Resume screening platform. REST API backend with .NET 8, ML.NET for candidate scoring, and a React JS dashboard for recruiters.",
      accentColor: "#F0E040", // Yellow
      githubUrl: "https://github.com/Bhushan-Nimase?tab=repositories"
    },
    {
      title: "Movie-Db (CineVault)",
      tags: ["React", "Vite", "TMDB API", "JavaScript"],
      description: "Cinematic movie discovery app built with React 19, React Router, and the TMDB API. Features a noir/amber UI design with HBO-style layout.",
      accentColor: "#1A1A1A", // Black
      githubUrl: "https://github.com/Bhushan-Nimase/Movie-Db"
    },
    {
      title: "Netflix Clone",
      tags: ["HTML5", "CSS3", "JavaScript", "Responsive UI"],
      description: "Fully responsive Netflix home page clone with modern layout, hover animations, slider interactions, and video popups.",
      accentColor: "#FF4D4D", // Red
      githubUrl: "https://github.com/Bhushan-Nimase/Netflix-clone"
    },
    {
      title: "CoffeeShop",
      tags: ["HTML5", "CSS3", "Responsive design", "Flexbox"],
      description: "Clean neo-brutalist landing page for a local coffee shop featuring interactive product grids, menu pricing, and contact layouts.",
      accentColor: "#F0E040", // Yellow
      githubUrl: "https://github.com/Bhushan-Nimase/CoffeeShop"
    }
  ];

  return (
    <section 
      id="projects" 
      className="py-24 px-4 md:px-12 border-t-3 border-neo-dark bg-white relative overflow-hidden"
    >
      {/* Decorative Grid Lines */}
      <div className="absolute left-[33%] top-0 bottom-0 w-[1px] bg-neo-dark/5 pointer-events-none hidden lg:block" />
      <div className="absolute left-[66%] top-0 bottom-0 w-[1px] bg-neo-dark/5 pointer-events-none hidden lg:block" />

      {/* Decorative Section Number */}
      <div className="absolute top-16 left-10 text-[20vw] font-black text-neo-dark opacity-5 pointer-events-none select-none font-display leading-none">
        03
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Heading */}
        <div className="flex items-center gap-4 mb-16">
          <div className="text-3xl md:text-5xl font-black bg-neo-dark text-white px-4 py-2 border-3 border-neo-dark shadow-[3px_3px_0px_#1A1A1A] font-display">
            MY PROJECTS
          </div>
          <div className="h-[3px] bg-neo-dark flex-grow" />
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectList.map((project, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: 'spring', damping: 20, stiffness: 120, delay: idx * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        {/* GitHub Repositories Link CTA */}
        <div className="flex justify-center mt-16">
          <motion.a
            href="https://github.com/Bhushan-Nimase?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn bg-neo-yellow text-neo-dark hover:bg-white text-sm font-black flex items-center justify-center gap-2 py-3 px-8 border-3 border-neo-dark shadow-[5px_5px_0px_#1A1A1A]"
            whileHover={{ y: -4, boxShadow: '8px 8px 0px #1A1A1A' }}
            whileTap={{ scale: 0.98 }}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span>Explore All Repositories</span>
            <ExternalLink className="w-4.5 h-4.5" />
          </motion.a>
        </div>

      </div>
    </section>
  );
}
