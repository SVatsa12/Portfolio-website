// HeroScene.jsx
"use client";

import { Text, MeshDistortMaterial, Stars, OrbitControls, Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// ─── Particle field ──────────────────────────────────────────────────────────
function Particles({ count = 180 }) {
  const mesh = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    mesh.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#818cf8" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// ─── Orbit ring ───────────────────────────────────────────────────────────────
function OrbitRing({ radius, speed, tilt, color, opacity = 1 }) {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.z = state.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 16, 120]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.9}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

// ─── The main 3D centerpiece ──────────────────────────────────────────────────
// A cluster of three connected octahedra — like an atomic/data structure model
function CenterPiece() {
  const groupRef = useRef();
  const coreRef  = useRef();
  const sat1Ref  = useRef();
  const sat2Ref  = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Whole cluster: slow y-axis spin + gentle breathing bob
    groupRef.current.rotation.y = t * 0.18;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.12 - 2.2;

    // Core: slow independent roll
    coreRef.current.rotation.x = t * 0.3;
    coreRef.current.rotation.z = t * 0.2;

    // Satellites: counter-spin for visual interest
    sat1Ref.current.rotation.x = -t * 0.5;
    sat1Ref.current.rotation.y = -t * 0.4;
    sat2Ref.current.rotation.x =  t * 0.6;
    sat2Ref.current.rotation.z = -t * 0.3;
  });

  const coreMaterial = (
    <MeshDistortMaterial
      color="#6d28d9"
      emissive="#3b0764"
      emissiveIntensity={0.5}
      metalness={1.0}
      roughness={0.05}
      distort={0.08}
      speed={1.5}
    />
  );

  const satelliteMaterial = (
    <meshStandardMaterial
      color="#818cf8"
      emissive="#4c1d95"
      emissiveIntensity={0.4}
      metalness={0.9}
      roughness={0.1}
      wireframe={false}
    />
  );

  const wireMaterial = (
    <meshStandardMaterial
      color="#a78bfa"
      emissive="#6d28d9"
      emissiveIntensity={0.6}
      wireframe
      transparent
      opacity={0.35}
    />
  );

  return (
    <group ref={groupRef} position={[0, -2.2, 0]}>

      {/* Connector rods between core and satellites */}
      {/* rod 1 */}
      <mesh rotation={[0, 0, Math.PI / 4]} position={[0.62, 0.62, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.72, 8]} />
        <meshStandardMaterial color="#4c1d95" emissive="#6d28d9" emissiveIntensity={0.5} />
      </mesh>
      {/* rod 2 */}
      <mesh rotation={[0, 0, -Math.PI / 4]} position={[-0.62, 0.62, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.72, 8]} />
        <meshStandardMaterial color="#4c1d95" emissive="#6d28d9" emissiveIntensity={0.5} />
      </mesh>

      {/* Core octahedron — large, distorted */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.72, 0]} />
        {coreMaterial}
      </mesh>

      {/* Core ghost wireframe shell */}
      <mesh>
        <octahedronGeometry args={[0.78, 0]} />
        {wireMaterial}
      </mesh>

      {/* Satellite 1 — upper right */}
      <mesh ref={sat1Ref} position={[1.28, 1.28, 0]}>
        <octahedronGeometry args={[0.34, 0]} />
        {satelliteMaterial}
      </mesh>

      {/* Satellite 2 — upper left */}
      <mesh ref={sat2Ref} position={[-1.28, 1.28, 0]}>
        <octahedronGeometry args={[0.28, 0]} />
        {satelliteMaterial}
      </mesh>

    </group>
  );
}

// ─── Grid floor ───────────────────────────────────────────────────────────────
function GridFloor() {
  return (
    <gridHelper
      args={[40, 40, "#3b0764", "#1e1b4b"]}
      position={[0, -4.0, 0]}
    />
  );
}

// ─── Main scene ──────────────────────────────────────────────────────────────
export default function HeroScene() {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Entire scene: ultra-subtle sway — viewer barely notices it's moving
    groupRef.current.rotation.y = Math.sin(t * 0.07) * 0.04;
  });

  return (
    <>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]}   intensity={1.4} color="#c4b5fd" />
      <pointLight position={[-5, 2, -3]} intensity={0.9} color="#6366f1" />
      <pointLight position={[0, -2, 4]}  intensity={0.6} color="#818cf8" />
      <spotLight
        position={[0, 8, 2]}
        intensity={2.0}
        color="#e0e7ff"
        angle={0.4}
        penumbra={1}
        castShadow={false}
      />

      {/* ── Deep space backdrop ── */}
      <Stars radius={80} depth={50} count={2500} factor={2.5} fade speed={0.4} />

      <group ref={groupRef}>

        {/* ── Text block — occupies y: 1.0 → 2.4 ── */}
        <Text
          fontSize={0.88}
          position={[0, 2.3, 0]}
          color="#f5f3ff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.14}
        >
          SHUBHAM VATSA
        </Text>

        <Text
          fontSize={0.27}
          position={[0, 1.62, 0]}
          color="#a78bfa"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.07}
        >
          AI Engineer · Scalable Systems
        </Text>

        {/* Glowing divider */}
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[3.2, 0.004, 0.001]} />
          <meshStandardMaterial color="#6d28d9" emissive="#7c3aed" emissiveIntensity={2} />
        </mesh>

        <Text
          fontSize={0.17}
          position={[0, 1.05, 0]}
          color="#6d28d9"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
        >
          scroll to explore ↓
        </Text>

        {/* ── Clear vertical gap: y 1.0 down to y -0.8 = 1.8 units of air ── */}

        {/* ── 3D centerpiece lives at y ≈ -2.2, well below text ── */}
        <CenterPiece />

        {/* ── Orbit rings centered on the 3D object ── */}
        <group position={[0, -2.2, 0]}>
          <OrbitRing radius={2.1} speed={0.25}  tilt={Math.PI / 5}    color="#818cf8" opacity={0.8} />
          <OrbitRing radius={2.6} speed={-0.16} tilt={Math.PI / 3}    color="#a78bfa" opacity={0.6} />
          <OrbitRing radius={3.0} speed={0.1}   tilt={Math.PI / 2.2}  color="#6d28d9" opacity={0.5} />
        </group>

        {/* ── Background particles ── */}
        <Particles count={180} />

        {/* ── Grid floor ── */}
        <GridFloor />

      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 1.9}
        minPolarAngle={Math.PI / 3.5}
        autoRotate
        autoRotateSpeed={0.35}
      />
    </>
  );
}