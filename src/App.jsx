import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'framer-motion';

// Import components
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Contact from './components/Contact';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Helper: run the two-stripe wipe animation
function runWipeTransition(overlayTlRef) {
  const overlay = document.getElementById('gsap-section-overlay');
  const stripe = document.getElementById('gsap-section-overlay-stripe');
  if (!overlay || !stripe) return;

  // Kill any in-progress animation
  if (overlayTlRef.current) overlayTlRef.current.kill();

  const tl = gsap.timeline();
  overlayTlRef.current = tl;

  // Start both panels fully hidden (off to the right)
  gsap.set([overlay, stripe], { clipPath: 'inset(0 100% 0 0)' });

  // 1) Dark panel sweeps in from the left
  tl.to(overlay, { clipPath: 'inset(0 0% 0 0)', duration: 0.3, ease: 'power3.inOut' });

  // 2) Yellow stripe follows right behind
  tl.to(stripe, { clipPath: 'inset(0 0% 0 0)', duration: 0.22, ease: 'power3.inOut' }, '-=0.12');

  // 3) Dark panel exits to the right
  tl.to(overlay, { clipPath: 'inset(0 0% 0 100%)', duration: 0.28, ease: 'power3.inOut' }, '+=0.05');

  // 4) Yellow stripe exits right behind it
  tl.to(stripe, { clipPath: 'inset(0 0% 0 100%)', duration: 0.22, ease: 'power3.inOut' }, '-=0.18');
}

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const shouldReduceMotion = useReducedMotion();
  const overlayTlRef = useRef(null);

  // scrollToSection — the ONLY place that fires the wipe animation (nav link clicks)
  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (!element) return;

    // Fire wipe only on explicit nav clicks, not on scroll
    if (!shouldReduceMotion) {
      runWipeTransition(overlayTlRef);
    }

    const offset = 80;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const offsetPosition = (elementRect - bodyRect) - offset;

    // Small delay so the wipe plays before the scroll jumps
    setTimeout(() => {
      window.scrollTo({
        top: offsetPosition,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
    }, shouldReduceMotion ? 0 : 80);
  }, [shouldReduceMotion]);

  // ScrollSpy — updates navbar highlight only, NO animation triggered here
  useEffect(() => {
    const sections = ['hero', 'about', 'projects', 'skills', 'certifications', 'contact'];
    const observers = [];

    sections.forEach((sectionId) => {
      const el = document.getElementById(sectionId);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(sectionId);
        },
        { rootMargin: '-40% 0px -50% 0px' }
      );

      observer.observe(el);
      observers.push({ observer, el });
    });

    return () => observers.forEach(({ observer, el }) => observer.unobserve(el));
  }, []);

  // GSAP scroll progress bar
  useEffect(() => {
    const prog = gsap.to('.gsap-scroll-progress', {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    });

    return () => {
      prog.scrollTrigger?.kill();
      prog.kill();
    };
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-neo-red selection:text-white select-none">
      <CustomCursor />

      {/* GSAP Section Transition Overlays — triggered only by nav link clicks */}
      <div id="gsap-section-overlay-stripe" />
      <div id="gsap-section-overlay" />

      {/* Scroll Progress Bar */}
      <div
        className="gsap-scroll-progress fixed top-0 left-0 h-[6px] bg-neo-red z-50 border-b-2 border-neo-dark"
        style={{ width: '0%' }}
      />

      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />

      <main className="flex flex-col">
        <Hero scrollToSection={scrollToSection} />
        <About />
        <Projects />
        <Skills />
        <Certifications />
        <Contact scrollToSection={scrollToSection} />
      </main>
    </div>
  );
}
