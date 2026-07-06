import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);

  // Position motion values for inner and outer cursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth trail config for the outer ring
  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only activate custom cursor on hover-enabled devices (desktops)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) {
      return;
    }

    setHidden(false);
    document.body.classList.add('custom-cursor-active');

    const moveCursor = (e) => {
      // Align cursor center on client coordinates
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === 'A' || 
        target.closest('a') || 
        target.tagName === 'BUTTON' || 
        target.closest('button') ||
        target.closest('.interactive-hover') ||
        target.getAttribute('role') === 'button';
      
      setHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [cursorX, cursorY]);

  if (hidden) return null;

  return (
    <>
      {/* Outer Cursor - Smooth trailing ring that morphs into a neo-brutalist square on interactive hover */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] border-2 border-neo-dark"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          width: 32,
          height: 32,
          borderRadius: hovered ? '0px' : '50%',
        }}
        animate={{
          scale: hovered ? 1.6 : 1,
          borderColor: hovered ? '#FF4D4D' : '#1A1A1A',
          backgroundColor: hovered ? 'rgba(240, 224, 64, 0.25)' : 'rgba(0, 0, 0, 0)',
          rotate: hovered ? 45 : 0,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      />

      {/* Inner Cursor - Instant solid dot for highly precise clicking feel */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-neo-red rounded-full pointer-events-none z-[10000] border border-neo-dark"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: hovered ? 0.6 : 1,
          backgroundColor: hovered ? '#1A1A1A' : '#FF4D4D',
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      />
    </>
  );
}
