// AboutScene.jsx
"use client";

import { Html, Float, MeshDistortMaterial, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

// Floating skill orb — a small labeled sphere orbiting the scene
function SkillOrb({ label, radius, speed, offset, color }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = Math.sin(t * 0.6) * 0.5;
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
        />
      </mesh>
      <Html center distanceFactor={6}>
        <div style={{
          color: color,
          fontSize: "10px",
          fontFamily: "'Courier New', monospace",
          letterSpacing: "0.08em",
          whiteSpace: "nowrap",
          textShadow: `0 0 8px ${color}`,
          userSelect: "none",
          pointerEvents: "none",
        }}>
          {label}
        </div>
      </Html>
    </group>
  );
}

// Thin ring plane — decorative accent
function AccentRing({ y, radius, color }) {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.z = state.clock.elapsedTime * 0.08;
  });
  return (
    <mesh ref={ref} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.006, 8, 80]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} transparent opacity={0.5} />
    </mesh>
  );
}

// The main about card rendered via Html
function AboutCard() {
  const [hovered, setHovered] = useState(false);
  const [bioHovered, setBioHovered] = useState(false);

  const stats = [
    { label: "Systems Built", value: "12+" },
    { label: "APIs Shipped", value: "30+" },
    { label: "Years Active", value: "4" },
  ];

  const stack = ["Python", "Go", "Postgres", "Redis", "Kafka", "Docker", "K8s", "AWS"];

  return (
    <Html
      center
      transform
      distanceFactor={5}
      occlude
    >
      <div
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        style={{
          width: "480px",
          background: "rgba(9, 4, 26, 0.85)",
          border: `1px solid ${hovered ? "#7c3aed" : "#2d1b69"}`,
          borderRadius: "2px",
          padding: "36px 40px",
          fontFamily: "'Courier New', monospace",
          backdropFilter: "blur(16px)",
          boxShadow: hovered
            ? "0 0 40px rgba(124,58,237,0.35), inset 0 0 60px rgba(124,58,237,0.04)"
            : "0 0 20px rgba(76,29,149,0.2)",
          transition: "border-color 0.4s ease, box-shadow 0.4s ease",
          cursor: "default",
        }}
      >
        {/* Terminal chrome bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "28px",
          paddingBottom: "16px",
          borderBottom: "1px solid #1e1044",
        }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
          <span style={{ marginLeft: "auto", fontSize: "10px", color: "#4c1d95", letterSpacing: "0.15em" }}>
            ~/about/shubham.md
          </span>
        </div>

        {/* Prompt line */}
        <div style={{ fontSize: "11px", color: "#6d28d9", marginBottom: "20px", letterSpacing: "0.06em" }}>
          <span style={{ color: "#a78bfa" }}>❯</span> cat profile
        </div>

        {/* Name block */}
        <div style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "#f5f3ff",
          letterSpacing: "0.18em",
          marginBottom: "4px",
          fontFamily: "'Courier New', monospace",
        }}>
          SHUBHAM VATSA
        </div>
        <div style={{
          fontSize: "11px",
          color: "#7c3aed",
          letterSpacing: "0.25em",
          marginBottom: "24px",
        }}>
          BACKEND · AI · DISTRIBUTED SYSTEMS
        </div>

        {/* Bio — wraps on hover, collapses to one line otherwise */}
        <p
          onPointerEnter={() => setBioHovered(true)}
          onPointerLeave={() => setBioHovered(false)}
          style={{
            fontSize: "13px",
            lineHeight: "1.85",
            color: bioHovered ? "#e9d5ff" : "#c4b5fd",
            marginBottom: "28px",
            borderLeft: `2px solid ${bioHovered ? "#7c3aed" : "#4c1d95"}`,
            paddingLeft: "14px",
            cursor: "text",
            /* wrap/unwrap */
            whiteSpace: bioHovered ? "normal" : "nowrap",
            overflow: "hidden",
            textOverflow: bioHovered ? "clip" : "ellipsis",
            maxHeight: bioHovered ? "200px" : "1.85em",
            transition: "max-height 0.45s ease, color 0.3s ease, border-color 0.3s ease, white-space 0s",
          }}
        >
          Building the infrastructure that doesn't make headlines —
          the APIs, pipelines, and AI systems that quietly scale.
          I care about correctness, latency, and architectures that survive contact with reality.
        </p>

        {/* Stats row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1px",
          background: "#1e1044",
          border: "1px solid #1e1044",
          marginBottom: "28px",
        }}>
          {stats.map(({ label, value }) => (
            <div key={label} style={{
              background: "rgba(9,4,26,0.9)",
              padding: "14px 12px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.04em" }}>
                {value}
              </div>
              <div style={{ fontSize: "9px", color: "#5b21b6", letterSpacing: "0.15em", marginTop: "3px" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Stack tags */}
        <div style={{ fontSize: "10px", color: "#4c1d95", letterSpacing: "0.1em", marginBottom: "12px" }}>
          ❯ tech --list
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {stack.map((tech) => (
            <span key={tech} style={{
              fontSize: "10px",
              color: "#a78bfa",
              border: "1px solid #3b0764",
              padding: "3px 10px",
              letterSpacing: "0.08em",
              background: "rgba(76,29,149,0.1)",
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Html>
  );
}

export default function AboutScene() {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.08) * 0.06;
  });

  const skills = [
    { label: "distributed", radius: 3.8, speed: 0.22, offset: 0,    color: "#818cf8" },
    { label: "event-driven", radius: 3.4, speed: -0.18, offset: 1.2, color: "#a78bfa" },
    { label: "zero-latency", radius: 4.2, speed: 0.15, offset: 2.5,  color: "#7c3aed" },
    { label: "ai-infra",     radius: 3.6, speed: -0.25, offset: 3.8, color: "#c4b5fd" },
    { label: "rest/grpc",    radius: 4.0, speed: 0.2,   offset: 5.1, color: "#6d28d9" },
  ];

  return (
    <group position={[0, -20, 0]} ref={groupRef}>
      {/* Ambient + accent lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 3]} intensity={1.4} color="#7c3aed" />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color="#4338ca" />

      {/* Decorative geometry: small glowing icosahedron top-left */}
      <Float speed={1.2} rotationIntensity={0.8} floatIntensity={0.4}>
        <mesh position={[-4.5, 1.5, -1]}>
          <icosahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial
            color="#4c1d95"
            emissive="#6d28d9"
            emissiveIntensity={0.6}
            wireframe
          />
        </mesh>
      </Float>

      {/* Decorative geometry: octahedron bottom-right */}
      <Float speed={0.9} rotationIntensity={1.2} floatIntensity={0.5}>
        <mesh position={[4.5, -1.5, -1]}>
          <octahedronGeometry args={[0.3]} />
          <meshStandardMaterial
            color="#3b0764"
            emissive="#7c3aed"
            emissiveIntensity={0.5}
            wireframe
          />
        </mesh>
      </Float>

      {/* Accent rings */}
      <AccentRing y={-0.5} radius={2.8} color="#4c1d95" />
      <AccentRing y={0.2}  radius={3.2} color="#6d28d9" />

      {/* Orbiting skill labels */}
      {skills.map((s) => (
        <SkillOrb key={s.label} {...s} />
      ))}

      {/* Main card */}
      <Float speed={0.6} floatIntensity={0.15} rotationIntensity={0}>
        <AboutCard />
      </Float>
    </group>
  );
}