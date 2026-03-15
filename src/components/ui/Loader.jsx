"use client";

import { useEffect, useRef, useState } from "react";

export default function Loader({ onComplete }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    // Particle layers (depth-based)
    const particleLayers = Array.from({ length: 3 }, (_, layer) => 
      Array.from({ length: 50 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * (0.2 + layer * 0.15),
        vy: (Math.random() - 0.5) * (0.2 + layer * 0.15),
        r: Math.random() * (1 + layer * 0.8),
        depth: layer / 2,
        alpha: 0.3 + layer * 0.2,
      }))
    );

    let start = performance.now();
    const duration = 2600;

    const draw = (t) => {
      const elapsed = t - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);

      setProgress(Math.floor(eased * 100));

      // Background: deep gradient
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, "#050510");
      grad.addColorStop(0.5, "#0a0615");
      grad.addColorStop(1, "#05051a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;

      // ── Receding grid floor ──────────────────────────────────────────────
      ctx.strokeStyle = `rgba(109, 40, 217, ${0.15 * eased})`;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < 12; i++) {
        const perspective = 1 - i / 12;
        const scale = perspective * 0.8 + 0.2;
        const y = cy + (i - 6) * 40 * scale;
        const x1 = cx - 300 * scale;
        const x2 = cx + 300 * scale;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      }

      // ── Multi-layered particle field with depth ──────────────────────────
      particleLayers.forEach((layer, layerIdx) => {
        layer.forEach((pt) => {
          pt.x += pt.vx;
          pt.y += pt.vy;

          if (pt.x < 0) pt.x = W;
          if (pt.x > W) pt.x = 0;
          if (pt.y < 0) pt.y = H;
          if (pt.y > H) pt.y = 0;

          const colorIntensity = 0.7 + layerIdx * 0.15;
          ctx.fillStyle = `rgba(167, 139, 250, ${pt.alpha * colorIntensity * eased})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
          ctx.fill();

          // Glow effect
          ctx.shadowColor = `rgba(167, 139, 250, 0.8)`;
          ctx.shadowBlur = pt.r * 3;
          ctx.stroke();
          ctx.shadowBlur = 0;
        });
      });

      // ── Rotating 3D octahedron wireframe ─────────────────────────────────
      const time = elapsed / 1000;
      const rotX = time * 0.5;
      const rotY = time * 0.8;
      const rotZ = time * 0.3;

      // Octahedron vertices (3D)
      const scale = 60;
      const vertices = [
        [1, 0, 0], [-1, 0, 0],
        [0, 1, 0], [0, -1, 0],
        [0, 0, 1], [0, 0, -1],
      ].map(v => rotateVertex(v, rotX, rotY, rotZ));

      // Project to 2D
      const projected = vertices.map(v => {
        const z = Math.max(0.5, 1 + v[2] * 0.3);
        return [cx + v[0] * scale / z, cy + v[1] * scale / z, v[2]];
      }).sort((a, b) => a[2] - b[2]);

      // Draw edges with depth-based coloring
      const edges = [
        [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 4], [2, 5], [3, 4], [3, 5],
      ];

      edges.forEach(([i, j]) => {
        const depth = (projected[i][2] + projected[j][2]) / 2;
        const hue = 200 + depth * 60;
        const brightness = eased * (0.6 + depth * 0.4);
        ctx.strokeStyle = `hsla(${hue}, 100%, ${brightness * 60}%, ${brightness})`;
        ctx.lineWidth = 1.5 + depth * 0.5;
        ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(projected[i][0], projected[i][1]);
        ctx.lineTo(projected[j][0], projected[j][1]);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // ── Concentric rotating rings ────────────────────────────────────────
      const rings = [
        { r: 100, speed: 1, color: "#7c3aed" },
        { r: 140, speed: -0.7, color: "#a78bfa" },
        { r: 180, speed: 0.5, color: "#6d28d9" },
      ];

      rings.forEach(({ r, speed, color }, idx) => {
        const angle = eased * Math.PI * speed * 4;
        
        // Outer arc
        ctx.beginPath();
        ctx.arc(cx, cy, r, angle, angle + Math.PI * 1.2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.stroke();

        // Glowing dots on arc
        for (let i = 0; i < 3; i++) {
          const a = angle + (i / 3) * Math.PI * 1.2;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.shadowBlur = 0;

      // ── Center glow orb ──────────────────────────────────────────────────
      const gradOrb = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50);
      gradOrb.addColorStop(0, `rgba(196, 181, 253, ${0.8 * eased})`);
      gradOrb.addColorStop(0.5, `rgba(124, 58, 237, ${0.4 * eased})`);
      gradOrb.addColorStop(1, `rgba(109, 40, 217, 0)`);
      ctx.fillStyle = gradOrb;
      ctx.shadowColor = "#a78bfa";
      ctx.shadowBlur = 40;
      ctx.beginPath();
      ctx.arc(cx, cy, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (p < 1) {
        requestAnimationFrame(draw);
      } else {
        setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, 700);
      }
    };

    requestAnimationFrame(draw);

    return () => window.removeEventListener("resize", resize);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "'Courier New', monospace",
        color: "white",
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />

      <div
        style={{
          fontSize: "88px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textShadow: "0 0 30px rgba(196, 181, 253, 0.8), 0 0 60px rgba(124, 58, 237, 0.4)",
        }}
      >
        {progress}%
      </div>

      <div
        style={{
          marginTop: "24px",
          fontSize: "16px",
          color: "#c4b5fd",
          letterSpacing: "0.25em",
          textShadow: "0 0 20px rgba(167, 139, 250, 0.6)",
        }}
      >
        SHUBHAM VATSA
      </div>

      <div
        style={{
          marginTop: "12px",
          fontSize: "11px",
          color: "#7c3aed",
          letterSpacing: "0.2em",
        }}
      >
        INITIALIZING EXPERIENCE
      </div>
    </div>
  );
}

// Helper: Rotate 3D vertex
function rotateVertex(v, rx, ry, rz) {
  let [x, y, z] = v;

  // Rotate X
  let y1 = y * Math.cos(rx) - z * Math.sin(rx);
  let z1 = y * Math.sin(rx) + z * Math.cos(rx);
  [y, z] = [y1, z1];

  // Rotate Y
  let x2 = x * Math.cos(ry) + z * Math.sin(ry);
  let z2 = -x * Math.sin(ry) + z * Math.cos(ry);
  [x, z] = [x2, z2];

  // Rotate Z
  let x3 = x * Math.cos(rz) - y * Math.sin(rz);
  let y3 = x * Math.sin(rz) + y * Math.cos(rz);
  [x, y] = [x3, y3];

  return [x, y, z];
}