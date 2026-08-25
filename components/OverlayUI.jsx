"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Code2,
  Sparkles,
  Cpu,
  Layers,
  Mail,
  Send,
  Terminal,
  CheckCircle2,
  ChevronRight,
  Globe,
  ArrowUpRight,
  Box,
  Laptop,
  Zap,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projectsData } from "../data/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Localized Interactive 3D Parallax Tilt Card Component
function TiltCard3D({ children, className = "", onClick }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [glowStyle, setGlowStyle] = useState({ opacity: 0, x: "50%", y: "50%" });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Reduce tilt intensity for subtler motion
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    setTransformStyle(`perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`);
    // Lower glow opacity for less visual weight
    setGlowStyle({ opacity: 0.18, x: `${(x / rect.width) * 100}%`, y: `${(y / rect.height) * 100}%` });
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlowStyle({ opacity: 0, x: "50%", y: "50%" });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: transformStyle,
        transition: "transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)",
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* 3D Mouse Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-200 rounded-2xl z-10"
        style={{
          opacity: glowStyle.opacity,
          background: `radial-gradient(500px circle at ${glowStyle.x} ${glowStyle.y}, rgba(6, 182, 212, 0.25), rgba(168, 85, 247, 0.15), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

export default function OverlayUI({ activeSection, setActiveSection }) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const heroTextRef = useRef(null);
  const projectsGridRef = useRef(null);
  const dragState = useRef({ isDragging: false, startX: 0, dragOffset: 0 });

  useEffect(() => {
    if (heroTextRef.current) {
      // Softer entrance animation
      gsap.fromTo(
        heroTextRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (!selectedProject) {
      setModalVisible(false);
      return;
    }

    const frame = requestAnimationFrame(() => setModalVisible(true));
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setModalVisible(false);
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedProject]);

  // GSAP ScrollTrigger stagger animation for project cards
  useEffect(() => {
    if (typeof window === "undefined" || !projectsGridRef.current) return;

    const ctx = gsap.context(() => {
      // Reduced motion for project cards
      gsap.fromTo(
        ".project-card-item",
        { opacity: 0, y: 28, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: projectsGridRef.current,
            start: "top 85%",
          },
        }
      );
    }, projectsGridRef);

    return () => ctx.revert();
  }, [activeTab]);

  const skillCategories = [
    {
      title: "3D & WebGL Engine",
      icon: <Box className="w-5 h-5 text-cyan-400" />,
      skills: ["Three.js", "React Three Fiber", "GLSL Shaders", "WebGL 2.0", "Blender Pipeline", "Mesh Instancing"],
    },
    {
      title: "Full-Stack Architecture",
      icon: <Laptop className="w-5 h-5 text-purple-400" />,
      skills: ["Next.js 14 (App Router)", "TypeScript / JS ES2024", "React 18+", "Node.js & Express", "GraphQL & REST APIs", "Tailwind CSS"],
    },
    {
      title: "Performance & Creative Coding",
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      skills: ["GSAP & ScrollTrigger", "Web Workers & WASM", "Post-Processing Pipeline", "UI/UX Micro-Interactions", "State Management (Zustand)", "Vite / Webpack Optimizations"],
    },
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: "", email: "", message: "" });
      }, 5000);
    }
  };

  const filteredProjects = activeTab === "all" 
    ? projectsData 
    : projectsData.filter(p => p.type === activeTab || p.category.toLowerCase().includes(activeTab));

  useEffect(() => {
    setGalleryIndex(0);
    setDragOffset(0);
    dragState.current = { isDragging: false, startX: 0, dragOffset: 0 };
  }, [activeTab]);

  return (
    <div className="relative z-10 w-full min-h-screen text-slate-100 flex flex-col justify-between pointer-events-none">
      
      {/* HEADER / NAVIGATION */}
      <header className="pointer-events-auto fixed left-1/2 top-4 z-50 w-[calc(100%-1.5rem)] max-w-7xl -translate-x-1/2 transition-all md:top-6">
        <div className="glass-panel flex items-center justify-between gap-4 rounded-full border border-cyan-500/20 px-3 py-2.5 shadow-[0_10px_30px_rgba(15,23,42,0.7)] backdrop-blur-xl md:px-5 md:py-3">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all md:w-10 md:h-10">
              <div className="w-full h-full bg-[#070913] rounded-[11px] flex items-center justify-center">
                <Code2 className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300 md:w-5 md:h-5" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent md:text-lg">
                ALEX VANCE
              </span>
              <span className="block text-[9px] tracking-[0.26em] text-cyan-400 font-mono uppercase md:text-[10px]">
                WebGL Architect
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex md:hidden items-center gap-1.5 overflow-x-auto scrollbar-hide rounded-full border border-cyan-500/10 bg-black/10 px-1.5 py-1.5">
            {['hero', 'projects', 'skills', 'contact'].map((sec) => (
              <button
                key={sec + '-mob'}
                onClick={() => {
                  setActiveSection(sec);
                  const el = document.getElementById(sec);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`min-w-[82px] flex-shrink-0 rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] transition-all ${
                  activeSection === sec ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                {sec}
              </button>
            ))}
          </nav>

          <nav className="hidden items-center gap-1 md:flex">
            {["hero", "projects", "skills", "contact"].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setActiveSection(sec);
                  const el = document.getElementById(sec);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-all ${
                  activeSection === sec
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                }`}
              >
                {sec}
              </button>
            ))}
          </nav>

          {/* CTA & Playground Link */}
          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/playground"
              className="glass-button text-[10px] font-semibold uppercase tracking-[0.14em] px-4 py-2 rounded-full flex items-center gap-2 text-cyan-300 hover:text-white transition-all shadow-lg"
            >
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>3D Playground</span>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER CONTENT */}
      <main className="pointer-events-auto">
        
        {/* HERO SECTION */}
        <section id="hero" className="min-h-[calc(100vh-80px)] flex flex-col justify-center max-w-7xl mx-auto px-6 py-12 relative">
          <div ref={heroTextRef} className="max-w-3xl space-y-6">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Available for Lead WebGL & Senior Full-Stack Engineering</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-none">
              Crafting <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent glow-text-cyan">Immersive</span> 3D Digital Experiences
            </h1>

            <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed">
              Senior Full-Stack Architect combining cutting-edge WebGL graphics, custom GLSL shaders, React Three Fiber, and robust Next.js backends to build high-performance interactive visual platforms.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => {
                  const el = document.getElementById("projects");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold text-sm tracking-wide text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <span>View Selected Work</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <Link
                href="/playground"
                className="px-6 py-3.5 rounded-xl glass-panel border border-cyan-500/30 font-semibold text-sm tracking-wide text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/60 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Launch Interactive Shader Sandbox</span>
              </Link>
            </div>

            {/* Key Metrics Strip */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Years Experience", val: "8+" },
                { label: "3D Web Applications", val: "25+" },
                { label: "FPS Performance", val: "60 FPS" },
                { label: "Code Quality", val: "100%" },
              ].map((stat, i) => (
                <TiltCard3D key={i} className="glass-panel-interactive p-4 rounded-2xl border border-white/5">
                  <div className="text-2xl font-black text-white font-mono bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.val}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </TiltCard3D>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-24 max-w-7xl mx-auto px-6 border-t border-cyan-500/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Portfolio Highlights</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white">
                Featured 3D & WebGL Projects
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 glass-panel p-1.5 rounded-xl border border-cyan-500/20">
              {[
                { id: "all", label: "All Projects" },
                { id: "ml", label: "ML" },
                { id: "dl", label: "DL" },
                { id: "gen-ai", label: "Gen AI" },
                { id: "web", label: "Web Dev" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
                    activeTab === tab.id
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div
            ref={projectsGridRef}
            className="relative mt-10 h-[420px] w-full overflow-hidden md:h-[520px]"
            onWheel={(event) => {
              event.preventDefault();
              setGalleryIndex((current) => {
                const direction = event.deltaY > 0 ? 1 : -1;
                return Math.min(Math.max(current + direction, 0), Math.max(filteredProjects.length - 1, 0));
              });
            }}
            onPointerDown={(event) => {
              dragState.current.isDragging = true;
              dragState.current.startX = event.clientX;
              dragState.current.dragOffset = 0;
            }}
            onPointerMove={(event) => {
              if (!dragState.current.isDragging) return;
              dragState.current.dragOffset = event.clientX - dragState.current.startX;
              setDragOffset(dragState.current.dragOffset);
            }}
            onPointerUp={() => {
              if (!dragState.current.isDragging) return;

              const threshold = 90;
              if (Math.abs(dragState.current.dragOffset) > threshold) {
                const direction = dragState.current.dragOffset < 0 ? 1 : -1;
                setGalleryIndex((current) => Math.min(Math.max(current + direction, 0), Math.max(filteredProjects.length - 1, 0)));
              }

              dragState.current.isDragging = false;
              dragState.current.dragOffset = 0;
              setDragOffset(0);
            }}
            onPointerLeave={() => {
              if (!dragState.current.isDragging) return;
              dragState.current.isDragging = false;
              dragState.current.dragOffset = 0;
              setDragOffset(0);
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center [perspective:1800px]">
              {filteredProjects.map((project, index) => {
                const relativeIndex = index - galleryIndex;
                const distance = Math.abs(relativeIndex);
                const cardX = relativeIndex * 270 + dragOffset;
                const translateY = distance === 0 ? 0 : distance * 18;
                const rotateY = relativeIndex * -26;
                const rotateX = distance === 0 ? 0 : 12;
                const scale = distance === 0 ? 1.04 : 1 - distance * 0.09;
                const z = distance === 0 ? 140 : 80 - distance * 20;
                const opacity = distance > 3 ? 0.28 : 1;

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="project-card-item absolute flex h-[290px] w-[260px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60 text-left shadow-[0_25px_60px_rgba(15,23,42,0.65)] backdrop-blur-xl transition-all duration-500 hover:border-cyan-400/40 hover:shadow-[0_28px_70px_rgba(34,211,238,0.22)] hover:-translate-y-1 md:h-[360px] md:w-[320px]"
                    style={{
                      transform: `translate3d(${cardX}px, ${translateY}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity,
                      zIndex: distance === 0 ? 30 : 20 - distance,
                    }}
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900 md:h-56">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 260px, 320px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-transparent to-transparent opacity-80" />
                      <div className="absolute right-4 top-4 rounded-full border border-cyan-400/30 bg-[#070913]/80 px-2.5 py-1 text-[10px] font-mono text-cyan-300 backdrop-blur-md">
                        {project.stats}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-4 md:p-5">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-purple-300">
                          <span>{project.category}</span>
                          {project.featured && (
                            <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[8px] text-cyan-200">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white md:text-2xl">{project.title}</h3>
                        <p className="text-xs leading-relaxed text-slate-300 md:text-sm">{project.description}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[9px] font-mono text-slate-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedProject && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setSelectedProject(null)}
              />

              <div className={`relative z-10 w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/10 bg-[#090f1d]/90 shadow-[0_25px_80px_rgba(0,0,0,0.65)] transition-all duration-300 ease-out ${modalVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10"
                >
                  Close
                </button>

                <div className="grid md:grid-cols-[1.15fr_0.85fr]">
                  <div className="relative h-72 w-full overflow-hidden bg-slate-950 md:h-[520px]">
                    <Image
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                  </div>

                  <div className="space-y-6 p-6 md:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-300">{selectedProject.category}</span>
                      <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-cyan-200">
                        {selectedProject.stats}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-extrabold text-white md:text-3xl">{selectedProject.title}</h3>
                      <p className="mt-4 text-sm leading-relaxed text-slate-300">{selectedProject.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <a
                        href={selectedProject.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/10"
                      >
                        <GithubIcon className="w-4 h-4" />
                        <span>View Source</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="py-24 max-w-7xl mx-auto px-6 border-t border-cyan-500/10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>Technical Capabilities</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              Engineering Matrix
            </h2>
            <p className="text-slate-300 text-sm md:text-base">
              Specialized in combining high-throughput web frontends with real-time 3D WebGL rendering, GLSL shading shaders, and robust full-stack microservice architectures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skillCategories.map((cat, i) => (
              <TiltCard3D key={i} className="glass-panel-interactive p-8 rounded-3xl border border-cyan-500/20 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{cat.title}</h3>
                </div>

                <ul className="space-y-3">
                  {cat.skills.map((skill, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </TiltCard3D>
            ))}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 max-w-7xl mx-auto px-6 border-t border-cyan-500/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column Info */}
            <div className="space-y-6">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Initiate Signal</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                Let’s Build Something <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Extraordinary</span>
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                Whether you need a custom 3D web application, complex WebGL shader studio, or a high-impact Senior Full-Stack Lead, my inbox is open.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 glass-panel-interactive p-4 rounded-2xl border border-white/10">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-xs text-slate-400">Direct Email</div>
                    <a href="mailto:alex.vance.dev@gmail.com" className="text-sm font-semibold text-white hover:text-cyan-300">
                      alex.vance.dev@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 glass-panel-interactive p-4 rounded-2xl border border-white/10">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-xs text-slate-400">Location & Availability</div>
                    <div className="text-sm font-semibold text-white">San Francisco, CA • Remote Worldwide</div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 pt-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl glass-panel-interactive text-slate-300 hover:text-cyan-300 border border-white/10 transition-all"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl glass-panel-interactive text-slate-300 hover:text-purple-300 border border-white/10 transition-all"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Right Column Form */}
            <div className="glass-panel-interactive p-8 rounded-3xl border border-cyan-500/30">
              {formSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Transmission Received</h3>
                  <p className="text-sm text-slate-300">
                    Thank you for reaching out. I will respond to your message within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-white mb-2">Send Direct Message</h3>
                  
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Connor"
                      className="w-full bg-[#070913]/80 border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sarah@cyberdyne.io"
                      className="w-full bg-[#070913]/80 border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-2">Project Details</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your 3D or Full-Stack project requirements..."
                      className="w-full bg-[#070913]/80 border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold text-sm tracking-wide text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Transmit Message</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/10 py-8 bg-[#070913]/90 backdrop-blur-md pointer-events-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div>
            © {new Date().getFullYear()} Alex Vance. Built with Next.js, Three.js & Tailwind CSS.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              WebGL 2.0 Active
            </span>
            <span>60 FPS Render Pipeline</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
