"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import useScroll from "../hooks/useScroll";

import HeroScene from "../scenes/HeroScene";
import AboutScene from "../scenes/AboutScene";
import ProjectsScene from "../scenes/ProjectsScene";

// Particles that each move independently across the full scene height
function DynamicParticles({ count = 1200 }) {
  const attrRef = useRef();
  const positionsRef = useRef(new Float32Array(count * 3));
  const velocitiesRef = useRef(new Float32Array(count * 3));
  const initializedRef = useRef(false);

  // Initialize particles only once, client-side, after hydration
  if (!initializedRef.current) {
    const positions = positionsRef.current;
    const velocities = velocitiesRef.current;
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 40;   // x spread
      positions[i * 3 + 1] = Math.random() * -46;           // y: full scene depth
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22;   // z depth

      velocities[i * 3]     = (Math.random() - 0.5) * 0.005; // slow x drift
      velocities[i * 3 + 1] = Math.random() * 0.007 + 0.001; // upward float
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005; // slow z drift
    }
    initializedRef.current = true;
  }

  const positions = positionsRef.current;
  const velocities = velocitiesRef.current;

  useFrame(() => {
    const attr = attrRef.current;
    if (!attr) return;
    const pos = attr.array;

    for (let i = 0; i < count; i++) {
      pos[i * 3]     += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];

      // Respawn at bottom when particle floats past the top
      if (pos[i * 3 + 1] > 2) {
        pos[i * 3 + 1] = -45;
        pos[i * 3]     = (Math.random() - 0.5) * 40;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 22;
      }
    }

    attr.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          ref={attrRef}
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.055} color="#a78bfa" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

export default function Experience() {

  const scroll = useScroll();

  useFrame(({ camera }) => {
    // Y scroll: navigate through sections (0 → -40)
    camera.position.y += (0 - scroll * 40 - camera.position.y) * 0.08;

    // Z zoom: breathing parallax effect
    // scroll 0→1 creates: 3 → 5.5 → 3 (zoom in at edges, out at middle)
    const zoomPhase = Math.sin(scroll * Math.PI * 2) * 0.5 + 0.5; // 0 to 1 sinusoidal
    const targetZ = 3.2 + zoomPhase * 2.3; // 3.2 (zoomed) to 5.5 (out)
    camera.position.z += (targetZ - camera.position.z) * 0.06;

    // FOV: dramatic effect paired with Z
    // scroll 0→1 creates: 50 → 75 → 50 (wide at middle, tight at edges)
    const targetFOV = 50 + zoomPhase * 25;
    camera.fov += (targetFOV - camera.fov) * 0.05;
    camera.updateProjectionMatrix();
  });

  return (
    <>
      <DynamicParticles count={1200} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 5]} />

      <HeroScene />
      <AboutScene />
      <ProjectsScene />
    </>
  );
}
