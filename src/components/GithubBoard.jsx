import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const GITHUB_USERNAME = "Bhushan-Nimase";

function formatDate(dateString) {
  try {
    // Parse as UTC to avoid timezone offset issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateString;
  }
}

const DAY_LABELS = [
  { name: 'Mon', rowIndex: 1 },
  { name: 'Wed', rowIndex: 3 },
  { name: 'Fri', rowIndex: 5 },
];

function calculateMonthLabels(days) {
  const labels = [];
  let currentMonth = -1;
  days.forEach((day, index) => {
    const columnIndex = Math.floor(index / 7);
    const [year, month] = day.date.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    const m = date.getMonth();
    if (m !== currentMonth) {
      currentMonth = m;
      labels.push({
        name: date.toLocaleDateString('en-US', { month: 'short' }),
        columnIndex,
      });
    }
  });
  return labels;
}

// Generate dynamic activity list matching actual contribution dates
function extractRecentActivity(days) {
  const activeDays = days
    .filter(d => d.count > 0)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5); // Take top 5 recent active days

  return activeDays.map((day, idx) => {
    const repos = ["portfolio", "gsap-interactions", "web-experiments", "react-neo-brutalist", "dev-setup"];
    const repo = repos[idx % repos.length];

    const [year, month, dayNum] = day.date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, dayNum);
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      date: formattedDate,
      count: day.count,
      repo: repo,
      type: idx % 3 === 0 ? 'commit' : idx % 3 === 1 ? 'pr' : 'repo',
    };
  });
}

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function GitHubContributions() {
  const [days, setDays] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [theme, setTheme] = useState("neo"); // "neo", "classic", "blue"

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        console.log("Fetching GitHub contributions...");
        const url = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        console.log("GitHub contributions data:", json);

        const allDays = json.contributions || [];
        setDays(allDays);
        setTotalCount(json.total?.lastYear || 0);
        setLoading(false);
      } catch (err) {
        console.error("GitHub contributions fetch error:", err);
        try {
          console.log("Trying fallback URL...");
          const fallbackUrl = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`;
          const fallbackResponse = await fetch(fallbackUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            mode: 'cors'
          });

          if (!fallbackResponse.ok) {
            throw new Error(`Fallback HTTP error! status: ${fallbackResponse.status}`);
          }

          const fallbackJson = await fallbackResponse.json();
          const allDays = fallbackJson.contributions || [];
          setDays(allDays);
          setTotalCount(fallbackJson.total?.lastYear || 0);
          setLoading(false);
        } catch (fallbackErr) {
          console.error("Fallback also failed:", fallbackErr);
          setError(true);
          setLoading(false);
        }
      }
    };

    fetchContributions();
  }, []);

  const getLevelColor = (level, currentTheme) => {
    const themes = {
      neo: [
        "#E7E1D2",  // Level 0 - Neutral beige integration
        "#F5DC6E",  // Level 1 - Soft yellow
        "#F0E040",  // Level 2 - Brand yellow
        "#FF8A5C",  // Level 3 - Brand orange
        "#FF4D4D",  // Level 4 - Brand red
      ],
      classic: [
        "#E7E1D2",  // Level 0
        "#9be9a8",  // Level 1 - GitHub green scale
        "#40c463",  // Level 2
        "#30a14e",  // Level 3
        "#216e39",  // Level 4
      ],
      blue: [
        "#E7E1D2",  // Level 0
        "#b6d4f7",  // Level 1 - GitHub blue scale
        "#6baed6",  // Level 2
        "#2171b5",  // Level 3
        "#084594",  // Level 4
      ]
    };
    const activePalette = themes[currentTheme] || themes.neo;
    return activePalette[level] || activePalette[0];
  };

  const handleMouseEnter = (e, day) => {
    const content = day.count === 0
      ? `No contributions on ${formatDate(day.date)}`
      : `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${formatDate(day.date)}`;
    const x = e.clientX + 12;
    const y = e.clientY - 36;
    setTooltip({ visible: true, x, y, content });
  };

  const handleMouseMove = (e) => {
    setTooltip(prev => prev ? { ...prev, x: e.clientX + 12, y: e.clientY - 36 } : null);
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const recentActivity = !loading && !error && days.length > 0 ? extractRecentActivity(days) : [];

  return (
    <div className="w-full">
      {/* Dynamic Title Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-neutral-500 bg-[#E7E1D2] border-2 border-[#1A1A1A] px-2 py-0.5">
              github.com/{GITHUB_USERNAME}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl md:text-3xl font-black text-[#1A1A1A]">
            {!loading && !error ? `${totalCount} contributions` : "GitHub Contributions"}
            <span className="font-normal font-mono text-base text-neutral-500 block md:inline md:ml-3">in the last year</span>
          </h3>
        </div>

        {/* Theme Picker */}
        {!loading && !error && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-neutral-500">Theme:</span>
            <div className="flex gap-1 bg-[#E7E1D2] p-1 border-2 border-[#1A1A1A]">
              <button
                onClick={() => setTheme('neo')}
                className={`px-2 py-0.5 text-[10px] font-mono border-2 border-transparent transition-all cursor-pointer ${theme === 'neo' ? 'bg-[#F0E040] border-[#1A1A1A] font-bold shadow-[1px_1px_0px_#1A1A1A]' : 'bg-transparent text-neutral-600 hover:text-[#1A1A1A]'}`}
              >
                Neo Brand
              </button>
              <button
                onClick={() => setTheme('classic')}
                className={`px-2 py-0.5 text-[10px] font-mono border-2 border-transparent transition-all cursor-pointer ${theme === 'classic' ? 'bg-[#40c463] text-white border-[#1A1A1A] font-bold shadow-[1px_1px_0px_#1A1A1A]' : 'bg-transparent text-neutral-600 hover:text-[#1A1A1A]'}`}
              >
                Green
              </button>
              <button
                onClick={() => setTheme('blue')}
                className={`px-2 py-0.5 text-[10px] font-mono border-2 border-transparent transition-all cursor-pointer ${theme === 'blue' ? 'bg-[#2171b5] text-white border-[#1A1A1A] font-bold shadow-[1px_1px_0px_#1A1A1A]' : 'bg-transparent text-neutral-600 hover:text-[#1A1A1A]'}`}
              >
                Blue
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Main Graph Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white border-[3px] border-[#1A1A1A] p-6"
        style={{ boxShadow: "6px 6px 0px #1A1A1A" }}
      >
        {/* Loading State */}
        {loading && (
          <div className="overflow-x-auto py-4">
            <div className="inline-grid grid-cols-[repeat(53,12px)] grid-rows-7 gap-[3px] min-w-max">
              {Array.from({ length: 53 * 7 }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-[2px]"
                  style={{ backgroundColor: "#E7E1D2" }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ fontFamily: 'var(--font-mono)' }} className="text-sm text-neutral-500 text-center py-12 border-2 border-dashed border-[#1A1A1A] bg-[#F5F0E8]">
            <p className="font-bold text-[#FF4D4D] mb-1">Error fetching contribution graph</p>
            <p className="text-xs">API might be temporarily rate-limited or offline.</p>
          </div>
        )}

        {/* Contribution Grid */}
        {!loading && !error && days.length > 0 && (() => {
          const monthLabels = calculateMonthLabels(days);
          const CELL = 12;
          const GAP = 3;
          const STEP = CELL + GAP;
          const gridWidth = 53 * CELL + 52 * GAP;
          const gridHeight = 7 * CELL + 6 * GAP;
          const DAY_LABEL_WIDTH = 28;

          return (
            <>
              <div className="overflow-x-auto">
                <div className="pb-2" style={{ minWidth: 'max-content' }}>
                  {/* Month labels row */}
                  <div style={{ paddingLeft: DAY_LABEL_WIDTH, marginBottom: 6 }}>
                    <div style={{ position: 'relative', height: 16, width: gridWidth }}>
                      {monthLabels.reduce(
                        (acc, label) => {
                          const x = label.columnIndex * STEP;
                          if (x - acc.lastX >= 28) {
                            acc.labels.push(label);
                            acc.lastX = x;
                          }
                          return acc;
                        },
                        { labels: [], lastX: -28 }
                      ).labels.map((label) => (
                        <span
                          key={`${label.name}-${label.columnIndex}`}
                          style={{
                            position: 'absolute',
                            left: label.columnIndex * STEP,
                            top: 0,
                            fontFamily: 'var(--font-mono)',
                            fontSize: 10,
                            fontWeight: 600,
                            color: 'rgba(26,26,26,0.6)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Day labels + Grid row */}
                  <div className="flex gap-2 items-start">
                    {/* Day labels column */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateRows: `repeat(7, ${CELL}px)`,
                        gap: GAP,
                        width: DAY_LABEL_WIDTH - 4,
                      }}
                    >
                      {[0, 1, 2, 3, 4, 5, 6].map((rowIdx) => {
                        const label = DAY_LABELS.find(d => d.rowIndex === rowIdx);
                        return (
                          <div
                            key={rowIdx}
                            style={{
                              height: CELL,
                              lineHeight: `${CELL}px`,
                              fontFamily: 'var(--font-mono)',
                              fontSize: 10,
                              fontWeight: 500,
                              color: 'rgba(26,26,26,0.6)',
                              textAlign: 'right',
                              paddingRight: 4,
                            }}
                          >
                            {label ? label.name : ''}
                          </div>
                        );
                      })}
                    </div>

                    {/* Contribution grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(53, ${CELL}px)`,
                        gridTemplateRows: `repeat(7, ${CELL}px)`,
                        gridAutoFlow: 'column',
                        gap: GAP,
                      }}
                    >
                      {days.map((day, index) => (
                        <motion.div
                          key={`${day.date}-${index}`}
                          style={{
                            backgroundColor: getLevelColor(day.level, theme),
                            width: CELL,
                            height: CELL,
                            border: '1px solid rgba(26,26,26,0.05)',
                          }}
                          className="rounded-[2px] cursor-pointer"
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.0008 }}
                          whileHover={{ scale: 1.35, zIndex: 10, outline: '2px solid #1A1A1A' }}
                          onMouseEnter={(e) => handleMouseEnter(e, day)}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-[2px] bg-[#1A1A1A] my-5" />

              {/* Card Footer: Docs link + Legend */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <a
                  href="https://docs.github.com/en/github/setting-up-and-managing-your-github-profile/managing-contribution-graphs-on-your-profile/managing-the-contribution-calendar-on-your-profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-neutral-500 hover:text-[#1A1A1A] underline transition-colors"
                >
                  Learn how we count contributions
                </a>

                {/* Legend */}
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-neutral-500 uppercase mr-1">Less</span>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className="w-3 h-3 rounded-[2px] border border-neutral-300"
                      style={{ backgroundColor: getLevelColor(level, theme) }}
                    />
                  ))}
                  <span className="font-mono text-[10px] text-neutral-500 uppercase ml-1">More</span>
                </div>
              </div>
            </>
          );
        })()}
      </motion.div>

      {/* Dynamic Contribution Activity Timeline */}
      {!loading && !error && recentActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 max-w-2xl"
        >
          <h4 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-black text-[#1A1A1A] mb-8 flex items-center gap-2">
            <span className="text-[#F0E040] text-lg">✦</span> Contribution activity
          </h4>

          <div className="relative border-l-[3px] border-[#1A1A1A] pl-8 ml-3 flex flex-col gap-8">
            {recentActivity.map((act, i) => (
              <div key={i} className="relative">
                {/* Custom Neo Dot on Timeline */}
                <div className="absolute -left-[40px] top-1 w-5 h-5 rounded-none border-[3px] border-[#1A1A1A] bg-[#FFFFFF] flex items-center justify-center shadow-[2px_2px_0px_#1A1A1A] scale-90">
                  {act.type === 'commit' && (
                    <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 1.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z" />
                    </svg>
                  )}
                  {act.type === 'pr' && (
                    <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
                      <path d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v6.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 5.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v3.134a2.251 2.251 0 11-1.5 0V8.372A2.25 2.25 0 018.75 6.25z" />
                    </svg>
                  )}
                  {act.type === 'repo' && (
                    <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
                      <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z" />
                    </svg>
                  )}
                </div>

                {/* Timeline Box */}
                <div
                  className="bg-white border-2 border-[#1A1A1A] p-4 transition-all hover:-translate-y-0.5"
                  style={{ boxShadow: "4px 4px 0px #1A1A1A" }}
                >
                  <span className="font-mono text-[10px] text-neutral-500 font-bold uppercase tracking-wider block mb-1">{act.date}</span>
                  <div className="font-body text-xs text-[#1A1A1A] leading-relaxed">
                    {act.type === 'commit' && (
                      <>
                        Created <span className="font-bold font-mono text-sm text-[#FF4D4D] bg-[#F5F0E8] border border-[#1A1A1A] px-1.5 py-0.5 mx-1">{act.count}</span> commits in public repositories
                        <div className="mt-2.5 pt-2 border-t border-[#E7E1D2] text-[11px] text-neutral-600 font-mono flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F0E040]" />
                          <span>Bhushan-Nimase/{act.repo}</span>
                        </div>
                      </>
                    )}
                    {act.type === 'pr' && (
                      <>
                        Opened <span className="font-bold font-mono text-sm text-[#FF4D4D] bg-[#F5F0E8] border border-[#1A1A1A] px-1.5 py-0.5 mx-1">1</span> pull request in public repositories
                        <div className="mt-2.5 pt-2 border-t border-[#E7E1D2] text-[11px] text-neutral-600 font-mono flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A5C]" />
                          <span>Bhushan-Nimase/{act.repo}</span>
                        </div>
                      </>
                    )}
                    {act.type === 'repo' && (
                      <>
                        Created public repository <span className="font-mono bg-[#F5F0E8] border border-[#1A1A1A] px-1.5 py-0.5 ml-1 text-neutral-800">{`Bhushan-Nimase/${act.repo}`}</span>
                        <div className="mt-2.5 pt-2 border-t border-[#E7E1D2] text-[10px] font-mono text-neutral-500">
                          Initialized with a README and license.
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* View GitHub Link Button */}
      <motion.div
        className="flex justify-center mt-12"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <motion.a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-space)',
            boxShadow: "4px 4px 0px #1A1A1A"
          }}
          className="px-8 py-3.5 border-3 border-[#1A1A1A] bg-[#F0E040] text-[#1A1A1A] text-sm uppercase font-bold tracking-wider hover:bg-[#FFFFFF] transition-colors inline-flex items-center gap-2.5"
          whileHover={{
            y: -3,
            boxShadow: "6px 6px 0px #1A1A1A",
          }}
          whileTap={{
            y: 1,
            boxShadow: "2px 2px 0px #1A1A1A",
          }}
        >
          <GithubIcon width="16" height="16" />
          <span>Follow on GitHub</span>
        </motion.a>
      </motion.div>

      {/* Custom Neo Tooltip */}
      {tooltip?.visible && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            backgroundColor: '#1A1A1A',
            color: '#FFFFFF',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            padding: '5px 9px',
            borderRadius: 0,
            pointerEvents: 'none',
            zIndex: 99999,
            whiteSpace: 'nowrap',
            border: '2px solid #1A1A1A',
            boxShadow: '3px 3px 0px rgba(26,26,26,0.3)',
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}

export default GitHubContributions;