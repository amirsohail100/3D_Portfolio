"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  MeshDistortMaterial,
  Sparkles,
  PerspectiveCamera,
  Float,
  Stars,
} from "@react-three/drei";
import {
  ArrowLeft,
  Sliders,
  Sparkles as SparklesIcon,
  RefreshCw,
  Box,
  Layers,
  Cpu,
} from "lucide-react";

function PlaygroundMesh({ geometryType, distortSpeed, distortAmount, wireframe, color }) {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.3;
      meshRef.current.rotation.y = t * 0.4;
    }
  });

  const renderGeometry = () => {
    switch (geometryType) {
      case "torusKnot":
        return <torusKnotGeometry args={[1, 0.35, 128, 32]} />;
      case "dodecahedron":
        return <dodecahedronGeometry args={[1.3, 0]} />;
      case "octahedron":
        return <octahedronGeometry args={[1.4, 0]} />;
      default:
        return <icosahedronGeometry args={[1.2, 64]} />;
    }
  };

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <mesh ref={meshRef}>
        {renderGeometry()}
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.15}
          metalness={0.85}
          distort={distortAmount}
          speed={distortSpeed}
          wireframe={wireframe}
        />
      </mesh>
    </Float>
  );
}

export default function Playground() {
  const [geometryType, setGeometryType] = useState("icosahedron");
  const [distortSpeed, setDistortSpeed] = useState(2.5);
  const [distortAmount, setDistortAmount] = useState(0.4);
  const [wireframe, setWireframe] = useState(false);
  const [color, setColor] = useState("#06b6d4");
  const [sparkleCount, setSparkleCount] = useState(250);

  const colors = [
    { name: "Cyan Core", hex: "#06b6d4" },
    { name: "Neon Purple", hex: "#a855f7" },
    { name: "Laser Pink", hex: "#ec4899" },
    { name: "Emerald Cyber", hex: "#10b981" },
    { name: "Amber Fusion", hex: "#f59e0b" },
  ];

  return (
    <div className="relative w-screen h-screen bg-[#070913] text-slate-100 overflow-hidden select-none font-sans">
      
      {/* 3D Canvas Container */}
      <div className="absolute inset-0 z-0">
        <Canvas gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={3} color={color} />
          <pointLight position={[-10, -10, -10]} intensity={1.5} color="#a855f7" />
          <Stars radius={50} count={3000} factor={4} fade speed={1} />
          <Sparkles count={sparkleCount} scale={[12, 12, 12]} size={3} speed={0.5} color={color} />
          
          <PlaygroundMesh
            geometryType={geometryType}
            distortSpeed={distortSpeed}
            distortAmount={distortAmount}
            wireframe={wireframe}
            color={color}
          />

          <OrbitControls enableZoom={true} maxDistance={10} minDistance={2} rotateSpeed={0.8} />
        </Canvas>
      </div>

      {/* Header Overlay */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6 flex items-center justify-between pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto glass-panel px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="glass-panel px-4 py-2 rounded-xl text-xs font-mono text-cyan-300 border border-cyan-500/20 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400 animate-spin" />
          <span>WebGL 3D Shader Sandbox & Real-Time Engine</span>
        </div>
      </header>

      {/* Control Panel Sidebar HUD */}
      <aside className="absolute bottom-6 left-6 top-24 z-10 w-80 glass-panel rounded-3xl p-6 border border-cyan-500/30 flex flex-col justify-between overflow-y-auto pointer-events-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-sm text-white uppercase tracking-wider">Shader Controls</h2>
          </div>

          {/* Geometry Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
              <Box className="w-3.5 h-3.5 text-cyan-400" />
              <span>Primitive Geometry</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "icosahedron", label: "Icosahedron" },
                { id: "torusKnot", label: "Torus Knot" },
                { id: "dodecahedron", label: "Dodecahedron" },
                { id: "octahedron", label: "Octahedron" },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGeometryType(g.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                    geometryType === g.id
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                      : "bg-white/5 text-slate-400 border-white/5 hover:text-white"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Emissive Hue</span>
            </label>
            <div className="flex items-center gap-2">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    color === c.hex ? "scale-125 border-white shadow-[0_0_10px]" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c.hex, boxShadow: color === c.hex ? `0 0 12px ${c.hex}` : "none" }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Distort Amount Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Vertex Distortion</span>
              <span className="text-cyan-300">{distortAmount.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={distortAmount}
              onChange={(e) => setDistortAmount(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Distort Speed Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Noise Speed</span>
              <span className="text-purple-300">{distortSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8"
              step="0.5"
              value={distortSpeed}
              onChange={(e) => setDistortSpeed(parseFloat(e.target.value))}
              className="w-full accent-purple-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Sparkles Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Particle Density</span>
              <span className="text-emerald-300">{sparkleCount}</span>
            </div>
            <input
              type="range"
              min="50"
              max="600"
              step="50"
              value={sparkleCount}
              onChange={(e) => setSparkleCount(parseInt(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Wireframe Toggle */}
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`w-full py-3 rounded-xl text-xs font-mono font-semibold border flex items-center justify-center gap-2 transition-all ${
              wireframe
                ? "bg-purple-500/20 text-purple-300 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            <span>Wireframe Mesh: {wireframe ? "ON" : "OFF"}</span>
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            setGeometryType("icosahedron");
            setDistortSpeed(2.5);
            setDistortAmount(0.4);
            setWireframe(false);
            setColor("#06b6d4");
            setSparkleCount(250);
          }}
          className="mt-6 w-full py-2.5 rounded-xl glass-panel text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Parameters</span>
        </button>
      </aside>

      {/* Orbit Helper Badge */}
      <div className="absolute bottom-6 right-6 z-10 glass-panel px-4 py-2 rounded-full text-xs font-mono text-slate-400 border border-white/10 pointer-events-none">
        <span>Click + Drag to Rotate • Scroll to Zoom</span>
      </div>
    </div>
  );
}
