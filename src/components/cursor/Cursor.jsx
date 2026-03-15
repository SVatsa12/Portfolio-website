"use client";

import { useEffect, useRef } from "react";
import "../../styles/cursor.css";

export default function Cursor() {
  const cursorRef = useRef(null);
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(pointer: coarse)");
    if (mediaQuery.matches) {
      return undefined;
    }

    const TRAIL_LIFETIME = 450;
    const MAX_POINTS = 70;

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setCanvasSize();

    const moveCursor = (e) => {
      const { clientX, clientY } = e;
      const now = performance.now();

      if (cursorRef.current) {
        cursorRef.current.style.left = `${clientX}px`;
        cursorRef.current.style.top = `${clientY}px`;
      }

      const points = pointsRef.current;
      const lastPoint = points[points.length - 1];

      if (!lastPoint || Math.hypot(clientX - lastPoint.x, clientY - lastPoint.y) > 2) {
        points.push({ x: clientX, y: clientY, t: now });
      }

      if (points.length > MAX_POINTS) {
        points.splice(0, points.length - MAX_POINTS);
      }
    };

    const renderTrail = () => {
      const now = performance.now();
      const points = pointsRef.current;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      while (points.length && now - points[0].t > TRAIL_LIFETIME) {
        points.shift();
      }

      if (points.length > 1) {
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        for (let i = 1; i < points.length; i += 1) {
          const p0 = points[i - 1];
          const p1 = points[i];
          const age = now - p1.t;
          const life = Math.max(0, 1 - age / TRAIL_LIFETIME);

          if (life <= 0) {
            continue;
          }

          ctx.strokeStyle = `rgba(255, 255, 255, ${life * 0.92})`;
          ctx.lineWidth = 1 + life * 2.4;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
      }

      rafRef.current = window.requestAnimationFrame(renderTrail);
    };

    rafRef.current = window.requestAnimationFrame(renderTrail);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("resize", setCanvasSize);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("resize", setCanvasSize);
      pointsRef.current = [];
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />
      <div ref={cursorRef} className="cursor" />
    </>
  );
}
