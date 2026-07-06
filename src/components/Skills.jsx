// src/components/Skills/Skills.jsx
import { motion as m } from 'framer-motion'
import { useState } from 'react'
import '../styles/components.css'

/* ─── All skills from resume + additional ───────────────── */
const allSkills = [
  // Languages
  "C#", "JavaScript (ES6+)", "Python", "SQL", "HTML5", "CSS3",
  // Frontend
  "React.js", "Bootstrap 5", "Axios", "Responsive UI Design",
  // Backend
  "ASP.NET Core", "Entity Framework Core", "REST API Design", "OpenAPI", "JWT Authentication", "Django",
  // Databases
  "SQL Server", "MySQL", "Schema Design", "Stored Procedures", "EF Migrations",
  // Tools & DevOps
  "Git", "GitHub", "Visual Studio", "VS Code", "Postman", "npm"
]

// Distribute evenly across 3 rows
const skillsPerRow = Math.ceil(allSkills.length / 3)
const marqueeRows = [
  { chips: allSkills.slice(0, skillsPerRow), dir: "left" },
  { chips: allSkills.slice(skillsPerRow, skillsPerRow * 2), dir: "right" },
  { chips: allSkills.slice(skillsPerRow * 2), dir: "left" }
]

/* ─── Tool tiles from resume ─────────────────────────────── */
const tools = [
  { name: "C#",           abbr: "C#", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
  { name: "ASP.NET Core", abbr: ".NET", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg" },
  { name: "React.js",     abbr: "RE", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "JavaScript",   abbr: "JS", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "SQL Server",   abbr: "SQL", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg" },
  { name: "Entity Framework", abbr: "EF", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg" },
  { name: "Python",       abbr: "PY", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Django",       abbr: "DJ", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
  { name: "MySQL",        abbr: "MY", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "Git",          abbr: "GT", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "GitHub",       abbr: "GH", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "Postman",      abbr: "PM", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
]

function ToolTile({ tool, index }) {
  const [imgError, setImgError] = useState(false)
  
  return (
    <m.div
      className="tool-tile"
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 + index * 0.05 }}
    >
      {tool.img && !imgError ? (
        <img 
          src={tool.img} 
          alt={tool.name} 
          style={{ width: "28px", height: "28px", objectFit: "contain" }}
          onError={() => setImgError(true)} 
        />
      ) : (
        <span style={{ fontSize: "14px", fontWeight: 900 }}>
          {tool.abbr}
        </span>
      )}
      <span style={{ fontSize: "9px", textAlign: "center", textTransform: "uppercase", lineHeight: 1.2 }}>
        {tool.name}
      </span>
    </m.div>
  )
}

/* ─── Single marquee row ─────────────────────────────────── */
function MarqueeRow({ chips, dir }) {
  // Triple for seamless loop
  const tripled = [...chips, ...chips, ...chips]
  const animClass = dir === "left" ? "marquee-left" : "marquee-right"

  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div
        className={animClass}
        style={{ 
          display: "flex",
          gap: "12px",
          width: "max-content"
        }}
      >
        {tripled.map((chip, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "12px",
              fontWeight: 700,
              backgroundColor: "var(--bg, #F5F0E8)",
              color: "var(--fg, #1A1A1A)",
              border: "2px solid var(--fg, #1A1A1A)",
              padding: "6px 16px",
              borderRadius: 0,
              display: "inline-block",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease"
            }}
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────── */
export function Skills() {
  return (
    <section 
      id="skills" 
      style={{ 
        paddingTop: "80px", 
        paddingBottom: "80px",
        scrollMarginTop: "80px",
        background: "var(--bg, #F5F0E8)"
      }}
    >
      {/* Marquee keyframes */}
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        .marquee-left {
          animation: marquee-left 30s linear infinite;
        }
        .marquee-right {
          animation: marquee-right 30s linear infinite;
        }
        .marquee-left:hover,
        .marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Section Header */}
      <div 
        style={{ 
          maxWidth: "1280px", 
          margin: "0 auto", 
          padding: "0 16px",
          marginBottom: "48px",
          position: "relative"
        }}
      >
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative "04" */}
          <div style={{
            position: 'absolute',
            left: '-1rem',
            top: '-5rem',
            fontFamily: 'var(--font-serif, serif)',
            fontSize: '140px',
            fontWeight: 900,
            lineHeight: 1,
            opacity: 0.06,
            userSelect: 'none',
            zIndex: 0,
            color: 'var(--fg, #1A1A1A)',
          }}>
            04
          </div>

          <h2 
            style={{ 
              fontFamily: 'var(--font-serif, serif)',
              fontWeight: 900,
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              marginBottom: '1.5rem',
              color: 'var(--fg, #1A1A1A)',
              lineHeight: 1,
              position: 'relative',
              zIndex: 10
            }}
          >
            Skills
          </h2>
        </m.div>
      </div>

      {/* PART 1 — Full-width marquee (3 rows) */}
      <m.div
        className="skills-marquee-container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {marqueeRows.map((row, i) => (
          <MarqueeRow key={i} chips={row.chips} dir={row.dir} />
        ))}
      </m.div>

      {/* PART 2 — Icon grid below */}
      <div 
        style={{ 
          maxWidth: "1280px", 
          margin: "0 auto", 
          padding: "0 16px"
        }}
      >
        <m.div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "16px"
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {tools.map((tool, index) => (
            <ToolTile key={index} tool={tool} index={index} />
          ))}
        </m.div>
      </div>
    </section>
  )
}

export default Skills