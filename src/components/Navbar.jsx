import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar({ activeSection, scrollToSection }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'about',          label: 'About' },
    { id: 'projects',       label: 'Projects' },
    { id: 'skills',         label: 'Skills' },
    { id: 'contact',        label: 'Contact' },
  ];

  const handleNav = (id) => {
    setMobileOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#F5F0E8] border-b-3 border-[#1A1A1A] h-16 md:h-20 flex items-center justify-between px-4 md:px-12">

        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); handleNav('hero'); }}
          className="text-lg md:text-xl font-black bg-[#F0E040] py-1.5 px-3 border-3 border-[#1A1A1A] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1A1A1A] transition-all duration-200"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          BN.dev
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-xs font-black uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => { e.preventDefault(); handleNav(item.id); }}
                className="relative py-1 text-[#1A1A1A] hover:text-[#FF4D4D] transition-colors duration-150"
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-2 bg-[#F0E040] border-t-2 border-b border-x border-[#1A1A1A]"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 border-2 border-[#1A1A1A] bg-white hover:bg-[#F0E040] transition-colors duration-150"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-30 bg-[#1A1A1A]/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.nav
              className="fixed top-16 left-0 right-0 z-[35] bg-[#F5F0E8] border-b-3 border-[#1A1A1A] flex flex-col"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              {navItems.map((item, i) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => { e.preventDefault(); handleNav(item.id); }}
                    className={`flex items-center justify-between px-6 py-4 border-b-2 border-[#1A1A1A]/10 font-black text-sm uppercase tracking-widest transition-colors duration-150 ${isActive ? 'bg-[#F0E040] text-[#1A1A1A]' : 'text-[#1A1A1A] hover:bg-[#F0E040]/50'}`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-[10px] text-[#1A1A1A]/30">
                      0{i + 2}
                    </span>
                  </motion.a>
                );
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
