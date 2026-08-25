"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const getCinematicX = (scroll) => {
  const progress = ((scroll % 4.4) + 4.4) % 4.4;

  if (progress < 1.1) return -2.8 + (progress / 1.1) * 1.9;
  if (progress < 2.2) return -0.9 + ((progress - 1.1) / 1.1) * 2.8;
  if (progress < 3.3) return 1.9 - ((progress - 2.2) / 1.1) * 2.8;
  return -0.9 + ((progress - 3.3) / 1.1) * 3.2;
};

function FloatingGeometry({ pointer, scroll }) {
  const rootRef = useRef();
  const ringRef = useRef();
  const accentRef = useRef();

  const shapes = useMemo(
    () => [
      {
        type: "sphere",
        position: [-2.5, 1.2, -0.7],
        scale: 0.88,
        color: "#6d28d9",
        rotation: [0.5, 0.3, 0.2],
        speed: 0.52,
      },
      {
        type: "sphere",
        position: [-0.3, 2.0, 0.8],
        scale: 0.74,
        color: "#a21caf",
        rotation: [0.4, 0.8, 0.5],
        speed: 0.7,
      },
      {
        type: "sphere",
        position: [2.0, 1.3, 0.2],
        scale: 0.66,
        color: "#c084fc",
        rotation: [0.2, 0.6, 0.1],
        speed: 0.9,
      },
      {
        type: "cylinder",
        position: [1.5, -1.2, -0.6],
        scale: 0.98,
        color: "#d946ef",
        rotation: [0.8, 0.4, 0.9],
        speed: 0.48,
      },
      {
        type: "cone",
        position: [-1.8, -1.6, 0.8],
        scale: 0.9,
        color: "#f472b6",
        rotation: [0.6, 0.2, 0.5],
        speed: 0.58,
      },
      {
        type: "torus",
        position: [0.4, 0.2, -0.8],
        scale: 1.2,
        color: "#8b5cf6",
        rotation: [1.1, 0, 0.7],
        speed: 0.42,
      },
      {
        type: "icosa",
        position: [2.8, -0.3, 0.5],
        scale: 0.58,
        color: "#7c3aed",
        rotation: [0.4, 1.1, 0.8],
        speed: 0.95,
      },
      {
        type: "ring",
        position: [-2.9, -0.2, -0.3],
        scale: 0.9,
        color: "#c084fc",
        rotation: [0.7, 0.3, 1.1],
        speed: 0.6,
      },
      {
        type: "box",
        position: [2.6, 2.0, -0.4],
        scale: 0.62,
        color: "#d946ef",
        rotation: [0.2, 0.8, 0.9],
        speed: 0.75,
      },
    ],
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const group = rootRef.current;
    if (!group) return;

    const scrollDrift = getCinematicX(scroll * 1.8);
    const targetX = pointer.x * 0.55 + scrollDrift * 0.42;
    const targetY = pointer.y * 0.5 + Math.sin(t * 0.7) * 0.25;
    const depthDrift = scroll * 2.2 + Math.sin(t * 0.8) * 0.77;

    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      targetY * 0.9 + scroll * 0.5 + Math.cos(t * 0.6) * 0.12,
      2.8,
      delta,
    );
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      targetX * 1.2 + t * 0.12 + scroll * 1.1 + Math.sin(t * 0.5) * 0.15,
      2.8,
      delta,
    );
    group.rotation.z = THREE.MathUtils.damp(
      group.rotation.z,
      scroll * 0.9 + pointer.x * 0.25 + Math.sin(t * 0.9) * 0.12,
      2.5,
      delta,
    );
    group.position.x = THREE.MathUtils.damp(
      group.position.x,
      targetX + Math.sin(t * 0.8) * 0.18,
      2.6,
      delta,
    );
    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      targetY - scroll * 0.2 + Math.cos(t * 0.95) * 0.2,
      2.6,
      delta,
    );
    group.position.z = THREE.MathUtils.damp(
      group.position.z,
      -1.8 + depthDrift,
      2.6,
      delta,
    );

    group.children.forEach((child, index) => {
      const data = shapes[index];
      if (!data) return;

      child.rotation.x += data.speed * delta * 0.65;
      child.rotation.y += data.speed * 0.8 * delta;
      child.position.y += Math.sin(t * (1.15 + index * 0.18) + index) * 0.003;
      child.position.x += Math.cos(t * (1.0 + index * 0.12) + index) * 0.0027;
    });

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.55 + scroll * 2.1;
      ringRef.current.rotation.x = 1.1 + pointer.y * 0.35;
      ringRef.current.rotation.y = scroll * 1.1 + pointer.x * 0.3;
      ringRef.current.position.z = -0.8 + scroll * 1.2;
    }

    if (accentRef.current) {
      accentRef.current.rotation.y = -(t * 0.5 + scroll * 2.5);
      accentRef.current.rotation.x = 0.8 + pointer.x * 0.35;
      accentRef.current.position.z = -0.5 + scroll * 1.5;
    }
  });

  const renderShape = (shape) => {
    const sharedProps = {
      key: `${shape.type}-${shape.position.join("-")}`,
      position: shape.position,
      rotation: shape.rotation,
      scale: shape.scale,
    };

    switch (shape.type) {
      case "sphere":
        return (
          <mesh {...sharedProps}>
            <sphereGeometry args={[1, 28, 28]} />
            <meshStandardMaterial
              color={shape.color}
              emissive={shape.color}
              emissiveIntensity={0.38}
              metalness={0.32}
              roughness={0.28}
            />
          </mesh>
        );
      case "cylinder":
        return (
          <mesh {...sharedProps}>
            <cylinderGeometry args={[0.9, 1.1, 2, 26]} />
            <meshStandardMaterial
              color={shape.color}
              emissive={shape.color}
              emissiveIntensity={0.32}
              metalness={0.24}
              roughness={0.28}
            />
          </mesh>
        );
      case "cone":
        return (
          <mesh {...sharedProps}>
            <coneGeometry args={[1.1, 2.0, 28]} />
            <meshStandardMaterial
              color={shape.color}
              emissive={shape.color}
              emissiveIntensity={0.28}
              metalness={0.18}
              roughness={0.32}
            />
          </mesh>
        );
      case "torus":
        return (
          <mesh {...sharedProps}>
            <torusGeometry args={[1.5, 0.28, 18, 90]} />
            <meshStandardMaterial
              color={shape.color}
              emissive={shape.color}
              emissiveIntensity={0.38}
              metalness={0.65}
              roughness={0.18}
            />
          </mesh>
        );
      case "icosa":
        return (
          <mesh {...sharedProps}>
            <icosahedronGeometry args={[0.8, 1]} />
            <meshStandardMaterial
              color={shape.color}
              emissive={shape.color}
              emissiveIntensity={0.36}
              metalness={0.42}
              roughness={0.22}
            />
          </mesh>
        );
      case "ring":
        return (
          <mesh
            {...sharedProps}
            rotation={[
              shape.rotation[0],
              shape.rotation[1],
              shape.rotation[2] + 0.7,
            ]}
          >
            <torusGeometry args={[1.1, 0.16, 14, 84]} />
            <meshStandardMaterial
              color={shape.color}
              emissive={shape.color}
              emissiveIntensity={0.46}
              metalness={0.7}
              roughness={0.18}
            />
          </mesh>
        );
      case "box":
        return (
          <mesh {...sharedProps}>
            <boxGeometry args={[1.1, 1.1, 1.1]} />
            <meshStandardMaterial
              color={shape.color}
              emissive={shape.color}
              emissiveIntensity={0.34}
              metalness={0.26}
              roughness={0.2}
            />
          </mesh>
        );
      default:
        return null;
    }
  };

  return (
    <group ref={rootRef}>
      <group ref={ringRef}>
        <mesh position={[0, 0, -1.8]} rotation={[Math.PI / 2.1, 0, 0]}>
          <torusGeometry args={[2.6, 0.05, 16, 180]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive="#7c3aed"
            emissiveIntensity={0.28}
            metalness={0.5}
            roughness={0.18}
          />
        </mesh>
      </group>

      <group ref={accentRef} position={[0.2, 0.6, -0.6]}>
        <mesh rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 3.2, 24]} />
          <meshStandardMaterial
            color="#6ee7f9"
            emissive="#6ee7f9"
            emissiveIntensity={0.34}
            metalness={0.2}
            roughness={0.22}
          />
        </mesh>
      </group>

      {shapes.map(renderShape)}
    </group>
  );
}

function SceneContent() {
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const scrollTarget = useRef(0);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      pointer.current.x = x;
      pointer.current.y = y;
    };

    const handleScroll = () => {
      scrollTarget.current =
        window.scrollY / Math.max(window.innerHeight * 1.8, 1);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useFrame((state, delta) => {
    scroll.current = THREE.MathUtils.damp(
      scroll.current,
      scrollTarget.current,
      2.2,
      delta,
    );
  });

  return (
    <>
      <fog attach="fog" args={["#070b17", 7.5, 20]} />
      <ambientLight intensity={0.72} color="#dbeafe" />
      <directionalLight color="#ffffff" position={[4, 6, 3]} intensity={1.15} />
      <pointLight
        position={[-4, -2, 4]}
        intensity={12}
        color="#8b5cf6"
        distance={18}
      />
      <pointLight
        position={[5, 2, 2]}
        intensity={10}
        color="#ec4899"
        distance={16}
      />
      <pointLight
        position={[-3, 4, -2]}
        intensity={9}
        color="#06b6d4"
        distance={14}
      />
      <FloatingGeometry pointer={pointer.current} scroll={scroll.current} />
    </>
  );
}

export default function Canvas3D() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 7], fov: 40 }}
        style={{ background: "transparent" }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
