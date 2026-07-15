import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Custom SVG for the viewfinder crosshair target
function CrosshairSVG({ color, size }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      style={{ display: 'block', transition: 'stroke 0.2s ease' }}
    >
      {/* Four directional tick marks pointing inward */}
      <line x1="12" y1="2" x2="12" y2="5.5" />
      <line x1="12" y1="18.5" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5.5" y2="12" />
      <line x1="18.5" y1="12" x2="22" y2="12" />
      {/* Small central hub ring */}
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  );
}

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(true);

  // Position motion values for the cursor layers
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring config for the mid-layer crosshair (light lag)
  const springConfigMid = { damping: 22, stiffness: 260 };
  const cursorXSpringMid = useSpring(cursorX, springConfigMid);
  const cursorYSpringMid = useSpring(cursorY, springConfigMid);

  // Spring config for the outer dashed ring (heavier trailing lag)
  const springConfigOuter = { damping: 26, stiffness: 150 };
  const cursorXSpringOuter = useSpring(cursorX, springConfigOuter);
  const cursorYSpringOuter = useSpring(cursorY, springConfigOuter);

  useEffect(() => {
    // Only activate custom cursor on hover-enabled devices (desktops)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) {
      return;
    }

    setHidden(false);
    document.body.classList.add('custom-cursor-active');

    const moveCursor = (e) => {
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

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [cursorX, cursorY]);

  if (hidden) return null;

  return (
    <>
      {/* 1. Outer Dashed Ring - Long lag trail, spins clockwise */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] flex items-center justify-center"
        style={{
          x: cursorXSpringOuter,
          y: cursorYSpringOuter,
          translateX: '-50%',
          translateY: '-50%',
          width: 36,
          height: 36,
        }}
        animate={{
          scale: clicked ? 0.7 : (hovered ? 1.4 : 1),
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      >
        <motion.div
          className="w-full h-full rounded-full border-2 border-dashed"
          style={{ borderColor: '#1A1A1A' }}
          animate={{
            rotate: 360,
            borderColor: hovered ? '#FF4D4D' : '#1A1A1A',
          }}
          transition={{
            rotate: {
              repeat: Infinity,
              duration: hovered ? 2.5 : 8,
              ease: "linear",
            },
            borderColor: { duration: 0.2 }
          }}
        />
      </motion.div>

      {/* 2. Middle Target Crosshair - Medium lag trail, spins counter-clockwise */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          x: cursorXSpringMid,
          y: cursorYSpringMid,
          translateX: '-50%',
          translateY: '-50%',
          width: 22,
          height: 22,
        }}
        animate={{
          scale: clicked ? 0.6 : (hovered ? 1.35 : 1),
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 26 }}
      >
        <motion.div
          className="flex items-center justify-center"
          animate={{ rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: hovered ? 3 : 10,
            ease: "linear",
          }}
        >
          <CrosshairSVG
            color={hovered ? '#F0E040' : '#1A1A1A'}
            size={22}
          />
        </motion.div>
      </motion.div>

      {/* 3. Inner Point Dot - Instant movement */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full border border-[#1A1A1A]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: 8,
          height: 8,
          backgroundColor: '#FF4D4D', // Brand Red
        }}
        animate={{
          scale: clicked ? 0.5 : (hovered ? 0.75 : 1),
          backgroundColor: hovered ? '#1A1A1A' : '#FF4D4D',
        }}
        transition={{ type: 'spring', stiffness: 550, damping: 28 }}
      />
    </>
  );
}
