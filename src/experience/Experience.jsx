"use client";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import useScroll from "../hooks/useScroll";

import HeroScene from "../scenes/HeroScene";
import AboutScene from "../scenes/AboutScene";
import ProjectsScene from "../scenes/ProjectsScene";

// Particles that each move independently across the full scene height
function DynamicParticles({ count = 1200 }) {
  const attrRef = useRef();

  const { positions, velocities } = useMemo(() => {
    const positions  = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 40;   // x spread
      positions[i * 3 + 1] = Math.random() * -46;           // y: full scene depth
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22;   // z depth

      velocities[i * 3]     = (Math.random() - 0.5) * 0.005; // slow x drift
      velocities[i * 3 + 1] = Math.random() * 0.007 + 0.001; // upward float
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005; // slow z drift
    }
    return { positions, velocities };
  }, [count]);

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
    camera.position.y += (0 - scroll * 40 - camera.position.y) * 0.08;
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
