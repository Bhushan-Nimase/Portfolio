import React, { useState, useEffect, useRef } from 'react';
import { 
  GitCommit, Calendar, Award, BookOpen, Loader, AlertCircle, Search 
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Neo‑brutalist colour scale
const getColorClass = (count) => {
  if (count === 0) return 'bg-[#EBE7DE] border-[#EBE7DE]';
  if (count <= 2) return 'bg-[#C4BEB5] border-[#C4BEB5]';
  if (count <= 5) return 'bg-[#A39B8F] border-[#A39B8F]';
  if (count <= 8) return 'bg-[#F0E040] border-[#F0E040]';
  return 'bg-[#FF4D4D] border-[#FF4D4D]';
};

export default function GithubBoard() {
  const [username, setUsername] = useState('Bhushan-Nimase');
  const [inputVal, setInputVal] = useState('Bhushan-Nimase');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCommits: 0,
    activeDays: 0,
    bestDay: 0,
    publicRepos: 0,
  });
  const [gridData, setGridData] = useState([]);
  const [monthLabels, setMonthLabels] = useState([]);

  const gridRef = useRef(null);
  const statsRef = useRef(null);

  const fetchGithubData = async (targetUser) => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, eventsRes] = await Promise.all([
        fetch(`https://api.github.com/users/${targetUser}`),
        fetch(`https://api.github.com/users/${targetUser}/events?per_page=100`),
      ]);

      if (!profileRes.ok || !eventsRes.ok) {
        if (profileRes.status === 403 || eventsRes.status === 403) {
          throw new Error('API rate limit. Using preview.');
        }
        throw new Error('User not found');
      }

      const profile = await profileRes.json();
      const events = await eventsRes.json();

      const contributions = {};
      let totalCommits = 0;

      events.forEach(event => {
        if (event.type === 'PushEvent' && event.payload?.commits) {
          const dateStr = event.created_at.split('T')[0];
          const count = event.payload.commits.length;
          contributions[dateStr] = (contributions[dateStr] || 0) + count;
          totalCommits += count;
        }
      });

      const today = new Date();
      const tempGrid = [];
      let activeDays = 0;
      let bestDay = 0;

      for (let i = 111; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const count = contributions[dateStr] || 0;

        if (count > 0) activeDays++;
        if (count > bestDay) bestDay = count;

        tempGrid.push({
          date: dateStr,
          count,
          dayOfWeek: d.getDay(),
          month: d.getMonth(),
          year: d.getFullYear(),
        });
      }

      const labels = [];
      let lastMonth = null;
      tempGrid.forEach((cell, index) => {
        const monthKey = `${cell.year}-${cell.month}`;
        if (monthKey !== lastMonth) {
          labels.push({ index, month: cell.month, year: cell.year });
          lastMonth = monthKey;
        }
      });

      setStats({
        totalCommits,
        activeDays,
        bestDay,
        publicRepos: profile.public_repos || 0,
      });
      setGridData(tempGrid);
      setMonthLabels(labels);
    } catch (err) {
      console.warn(err);
      setError(err.message);
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const tempGrid = [];
    const today = new Date();
    let totalCommits = 0;
    let activeDays = 0;
    let bestDay = 0;

    for (let i = 111; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const rand = Math.random();
      let count = 0;
      if (rand > 0.65) {
        count = Math.floor(Math.random() * 4) + 1;
      } else if (rand > 0.96) {
        count = Math.floor(Math.random() * 6) + 5;
      }

      if (count > 0) activeDays++;
      if (count > bestDay) bestDay = count;
      totalCommits += count;

      tempGrid.push({
        date: dateStr,
        count,
        dayOfWeek: d.getDay(),
        month: d.getMonth(),
        year: d.getFullYear(),
      });
    }

    const labels = [];
    let lastMonth = null;
    tempGrid.forEach((cell, index) => {
      const monthKey = `${cell.year}-${cell.month}`;
      if (monthKey !== lastMonth) {
        labels.push({ index, month: cell.month, year: cell.year });
        lastMonth = monthKey;
      }
    });

    setStats({
      totalCommits,
      activeDays,
      bestDay,
      publicRepos: 18,
    });
    setGridData(tempGrid);
    setMonthLabels(labels);
  };

  useEffect(() => {
    fetchGithubData(username);
  }, [username]);

  // Animations
  useEffect(() => {
    if (gridData.length === 0) return;

    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 90%',
          },
        }
      );
    }

    if (gridRef.current) {
      const cells = gridRef.current.querySelectorAll('.heat-cell');
      if (cells.length > 0) {
        gsap.fromTo(
          cells,
          { opacity: 0, scale: 0.6, rotate: 5 },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            stagger: {
              each: 0.003,
              from: 'random',
            },
            duration: 0.35,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }
  }, [gridData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setUsername(inputVal.trim());
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto neo-card p-6 md:p-8 bg-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full neo-border neo-shadow bg-white flex items-center justify-center font-display font-black text-xl text-black uppercase">
            {username.charAt(0)}
          </div>
          <div>
            <span className="text-xs font-bold text-black/60 block tracking-wider uppercase">
              Contribution activity
            </span>
            <h4 className="text-2xl font-display font-black text-black tracking-tight">
              {username}
            </h4>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="flex items-center w-full sm:w-auto">
          <div className="relative flex items-center w-full sm:w-72 neo-border bg-white shadow-[3px_3px_0px_#1A1A1A]">
            <Search className="absolute left-3 w-4 h-4 text-black/50" />
            <input
              type="text"
              placeholder="github username"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full pl-10 pr-16 py-2 text-sm font-mono bg-transparent text-black placeholder-black/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-0 top-0 bottom-0 neo-btn neo-btn-primary !shadow-none !border-l-0 rounded-none px-4 py-1.5 text-xs font-bold tracking-wider"
            >
              {loading ? <Loader className="w-3 h-3 animate-spin" /> : 'Go'}
            </button>
          </div>
        </form>
      </div>

      {/* Stats Cards */}
      <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Commits', value: stats.totalCommits, icon: <GitCommit className="w-5 h-5" />, color: 'text-black' },
          { label: 'Active Days', value: stats.activeDays, icon: <Calendar className="w-5 h-5" />, color: 'text-black' },
          { label: 'Best Day', value: `${stats.bestDay} c`, icon: <Award className="w-5 h-5" />, color: 'text-black' },
          { label: 'Repos', value: stats.publicRepos, icon: <BookOpen className="w-5 h-5" />, color: 'text-black' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="neo-card p-4 flex items-center gap-3 bg-white hover:translate-y-[-2px] transition-transform duration-200"
          >
            <div className="bg-[#F5F0E8] neo-border !border-2 p-2 rounded-sm">
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/60">
                {stat.label}
              </p>
              <p className="text-lg font-display font-black text-black">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Contribution Graph */}
      <div className="neo-border bg-[#F5F0E8] p-4 overflow-x-auto">
        <div className="min-w-[700px]">
          
          <div className="flex">
            {/* Day Labels */}
            <div className="flex flex-col gap-[5px] mr-3 mt-[6px]">
              {['Mon', '', 'Wed', '', 'Fri', '', ''].map((day, i) => (
                <div
                  key={i}
                  className="text-[10px] font-bold text-black/60 h-[12px] leading-[12px]"
                  style={{ visibility: i % 2 === 0 ? 'visible' : 'hidden' }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Cells Grid */}
            <div ref={gridRef} className="flex-1">
              <div className="grid grid-flow-col grid-rows-7 gap-[5px]">
                {gridData.map((cell, idx) => (
                  <div key={idx} className="relative group heat-cell">
                    <div
                      className={`w-[12px] h-[12px] rounded-sm neo-border !border-[2px] transition-all duration-200 hover:scale-125 hover:z-10 hover:shadow-[2px_2px_0px_#1A1A1A] cursor-pointer ${getColorClass(cell.count)}`}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 hidden group-hover:block z-30 pointer-events-none">
                      <div className="neo-card bg-white p-2 text-xs shadow-[4px_4px_0px_#1A1A1A]">
                        <p className="font-bold text-black">{cell.count} commits</p>
                        <p className="text-black/60 font-mono mt-0.5 text-[10px]">{cell.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Month Labels */}
              <div className="relative h-5 mt-2">
                {monthLabels.map((m, i) => (
                  <span
                    key={i}
                    className="absolute text-[10px] font-bold text-black/60"
                    style={{
                      left: `calc(${(m.index / gridData.length) * 100}%)`,
                      transform: 'translateX(-10%)',
                    }}
                  >
                    {MONTH_NAMES[m.month]}
                  </span>
                ))}
              </div>

              {/* Legend & Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2 text-[11px] font-bold text-black/70">
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF4D4D] underline decoration-black/30 underline-offset-2 transition-colors"
                >
                  View GitHub profile →
                </a>
                <div className="flex items-center gap-2">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-[12px] h-[12px] rounded-sm neo-border !border-[2px] bg-[#EBE7DE]" />
                    <div className="w-[12px] h-[12px] rounded-sm neo-border !border-[2px] bg-[#C4BEB5]" />
                    <div className="w-[12px] h-[12px] rounded-sm neo-border !border-[2px] bg-[#A39B8F]" />
                    <div className="w-[12px] h-[12px] rounded-sm neo-border !border-[2px] bg-[#F0E040]" />
                    <div className="w-[12px] h-[12px] rounded-sm neo-border !border-[2px] bg-[#FF4D4D]" />
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-[#FF4D4D] mt-3 flex items-center gap-1.5 bg-white/50 neo-border !border-2 px-3 py-1.5 w-fit shadow-[2px_2px_0px_#1A1A1A]">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}