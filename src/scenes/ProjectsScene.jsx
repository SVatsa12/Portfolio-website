// ProjectsScene.jsx
"use client";

import { Html, Float, Text, Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

// ─── Project data from your GitHub ──────────────────────────────────────────
const PROJECTS = [
  {
    id: 0,
    title: "TICE",
    subtitle: "Threat Intelligence Correlation Engine",
    description:
      "OSINT-powered IP analysis platform. Multi-source threat correlation (AbuseIPDB, Shodan, IPInfo), AI attribution reports, 0–100 risk scoring, and a 3D geolocation globe.",
    tech: ["Python", "FastAPI", "React", "MongoDB", "Three.js", "Gemini AI"],
    type: "CYBERSECURITY · AI",
    accent: "#22d3ee",   // cyan
    github: "https://github.com/SVatsa12/IP-Information-Retriever",
  },
  {
    id: 1,
    title: "StandNote.AI",
    subtitle: "Real-time Meeting Intelligence",
    description:
      "Chrome extension that captures live meeting audio, generates real-time transcripts, and auto-summarises key points. JWT auth, WebSocket streaming, cross-platform.",
    tech: ["React", "Python", "FastAPI", "WebSockets", "SQLite", "Chrome API"],
    type: "AI · PRODUCTIVITY",
    accent: "#a78bfa",   // violet
    github: "https://github.com/SVatsa12/StandNote",
  },
  {
    id: 2,
    title: "AI Task Manager",
    subtitle: "Intelligent Project Allocation System",
    description:
      "Full-stack platform with AI-powered task allocation engine. Skill-match weighting, workload balancing, Kanban boards, real-time Socket.io updates, and CSV import.",
    tech: ["Node.js", "Express", "MongoDB", "Socket.io", "React", "TailwindCSS"],
    type: "AI · FULLSTACK",
    accent: "#34d399",   // emerald
    github: "https://github.com/SVatsa12/AI-Project-Manager",
  },
];

// ─── Single flip card ─────────────────────────────────────────────────────────
function ProjectCard({ project, position, rotation }) {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();
  const flipRef  = useRef(0);

  useFrame(() => {
    const target = flipped ? Math.PI : 0;
    flipRef.current += (target - flipRef.current) * 0.12;
    if (groupRef.current) {
      groupRef.current.style.transform = `rotateY(${flipRef.current}rad)`;
    }
  });

  const { title, subtitle, description, tech, type, accent, github } = project;

  const cardStyle = {
    width: "260px",
    height: "340px",
    fontFamily: "'Courier New', monospace",
    borderRadius: "2px",
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
  };

  const frontStyle = {
    ...cardStyle,
    background: "rgba(6, 4, 20, 0.92)",
    border: `1px solid ${hovered ? accent : "#1e1b4b"}`,
    boxShadow: hovered ? `0 0 30px ${accent}33, inset 0 0 40px ${accent}08` : "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
    padding: "24px 22px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backfaceVisibility: "hidden",
  };

  const backStyle = {
    ...cardStyle,
    background: "rgba(6, 4, 20, 0.96)",
    border: `1px solid ${accent}`,
    boxShadow: `0 0 40px ${accent}22`,
    padding: "24px 22px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    position: "absolute",
    top: 0,
    left: 0,
    transform: "rotateY(180deg)",
    backfaceVisibility: "hidden",
  };

  return (
    <group position={position} rotation={rotation}>
      <Float speed={0.8} floatIntensity={0.2} rotationIntensity={0}>
        <Html center transform distanceFactor={5} occlude>
          {/* Outer preserve-3d wrapper */}
          <div
            style={{ width: "260px", height: "340px", perspective: "1000px", cursor: "pointer" }}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onClick={() => setFlipped(!flipped)}
          >
            <div ref={groupRef} style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d" }}>

              {/* ── FRONT ── */}
              <div style={frontStyle}>
                {/* Type badge */}
                <div style={{
                  fontSize: "9px",
                  color: accent,
                  letterSpacing: "0.2em",
                  borderBottom: `1px solid ${accent}44`,
                  paddingBottom: "10px",
                }}>
                  {type}
                </div>

                {/* Title */}
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#f5f3ff", letterSpacing: "0.08em", lineHeight: 1.1 }}>
                  {title}
                </div>

                {/* Subtitle */}
                <div style={{ fontSize: "11px", color: "#c4b5fd", lineHeight: 1.5, opacity: 0.9 }}>
                  {subtitle}
                </div>

                {/* Accent bar */}
                <div style={{ height: "2px", background: accent, width: "40px", opacity: 0.7 }} />

                {/* Tech tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "auto" }}>
                  {tech.map(t => (
                    <span key={t} style={{
                      fontSize: "9px",
                      color: accent,
                      border: `1px solid ${accent}55`,
                      padding: "2px 8px",
                      background: `${accent}0d`,
                      letterSpacing: "0.06em",
                    }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Flip hint */}
                <div style={{ fontSize: "9px", color: "#4c1d95", letterSpacing: "0.12em", textAlign: "right" }}>
                  click to flip ↻
                </div>
              </div>

              {/* ── BACK ── */}
              <div style={backStyle}>
                <div style={{ fontSize: "9px", color: accent, letterSpacing: "0.2em", borderBottom: `1px solid ${accent}44`, paddingBottom: "10px" }}>
                  {title} — README
                </div>

                <div style={{ fontSize: "11px", color: "#e0e7ff", lineHeight: 1.75, flex: 1 }}>
                  {description}
                </div>

                {/* GitHub button */}
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "9px",
                    border: `1px solid ${accent}`,
                    color: accent,
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                    textDecoration: "none",
                    background: `${accent}10`,
                    transition: "background 0.2s",
                  }}
                >
                  VIEW ON GITHUB →
                </a>

                <div style={{ fontSize: "9px", color: "#4c1d95", letterSpacing: "0.12em", textAlign: "right" }}>
                  click to flip ↻
                </div>
              </div>

            </div>
          </div>
        </Html>
      </Float>
    </group>
  );
}

// ─── Thin horizontal accent line ─────────────────────────────────────────────
function AccentLine() {
  return (
    <mesh position={[0, -0.85, 0]}>
      <boxGeometry args={[10, 0.004, 0.001]} />
      <meshStandardMaterial color="#4c1d95" emissive="#6d28d9" emissiveIntensity={1.5} />
    </mesh>
  );
}

// ─── Main scene ──────────────────────────────────────────────────────────────
export default function ProjectsScene() {
  const sceneRef = useRef();

  useFrame((state) => {
    sceneRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.06) * 0.03;
  });

  // Arc layout: left card, center card, right card
  const cardPositions = [
    { position: [-3.6, -1.8, -0.6], rotation: [0, 0.28, 0] },
    { position: [0,    -1.6,  0.4], rotation: [0, 0,    0] },
    { position: [3.6,  -1.8, -0.6], rotation: [0, -0.28, 0] },
  ];

  return (
    <group ref={sceneRef} position={[0, -40, 0]}>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 4, 4]}    intensity={1.2} color="#c4b5fd" />
      <pointLight position={[-6, 0, 0]}   intensity={0.8} color="#22d3ee" />
      <pointLight position={[6, 0, 0]}    intensity={0.8} color="#34d399" />
      <pointLight position={[0, -3, 2]}   intensity={0.5} color="#818cf8" />

      <Stars radius={70} depth={40} count={1800} factor={2.5} fade speed={0.3} />

      {/* Section heading */}
      <Text
        fontSize={0.75}
        position={[0, 2.2, 0]}
        color="#f5f3ff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.16}
      >
        PROJECTS
      </Text>

      <Text
        fontSize={0.22}
        position={[0, 1.6, 0]}
        color="#6d28d9"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        click any card to explore
      </Text>

      <AccentLine />

      {/* Grid floor */}
      <gridHelper args={[40, 40, "#3b0764", "#1e1b4b"]} position={[0, -4.2, 0]} />

      {/* Project cards */}
      {PROJECTS.map((project, i) => (
        <ProjectCard
          key={project.id}
          project={project}
          position={cardPositions[i].position}
          rotation={cardPositions[i].rotation}
        />
      ))}
    </group>
  );
}