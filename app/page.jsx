"use client";

import { useState, useEffect } from "react";
import Canvas3D from "../components/Canvas3D";
import OverlayUI from "../components/OverlayUI";
import { Eye, MousePointerClick } from "lucide-react";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [interactiveMode, setInteractiveMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "projects", "skills", "contact"];
      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#070913] overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* 3D WebGL Canvas Layer */}
      <div className={`fixed inset-0 z-0 transition-opacity duration-700 ${interactiveMode ? "pointer-events-auto" : "pointer-events-none"}`}>
        <Canvas3D
          activeSection={activeSection}
          interactiveMode={interactiveMode}
          controlsEnabled={interactiveMode}
        />
      </div>

      {/* Interactive Mode Toggle Badge */}
      <div className="fixed bottom-6 left-6 z-50 pointer-events-auto">
        <button
          onClick={() => setInteractiveMode(!interactiveMode)}
          className={`glass-panel px-4 py-2.5 rounded-full text-xs font-mono flex items-center gap-2 border transition-all ${
            interactiveMode
              ? "bg-cyan-500/30 text-cyan-300 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              : "text-slate-300 border-white/10 hover:border-cyan-500/40 hover:text-white"
          }`}
        >
          {interactiveMode ? (
            <>
              <MousePointerClick className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>3D Orbit Mode: ACTIVE (Drag to Rotate)</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-purple-400" />
              <span>Enable 3D Orbit Control</span>
            </>
          )}
        </button>
      </div>

      {/* HTML Overlay Content */}
      <OverlayUI activeSection={activeSection} setActiveSection={setActiveSection} />
    </main>
  );
}
