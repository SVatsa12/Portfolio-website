"use client";

import { useMemo } from "react";

export default function ScrollWheel() {
  const maxSections = 4;

  const getTarget = useMemo(() => {
    return () => {
      const currentY = window.scrollY;
      const sectionHeight = window.innerHeight;
      const nextSection = Math.min(
        Math.floor(currentY / sectionHeight) + 1,
        maxSections - 1
      );
      return nextSection * sectionHeight;
    };
  }, []);

  const handleScrollDown = () => {
    window.scrollTo({
      top: getTarget(),
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      className="scroll-wheel"
      onClick={handleScrollDown}
      aria-label="Scroll down"
      title="Scroll down"
    >
      <span className="scroll-wheel-track" aria-hidden="true">
        <span className="scroll-wheel-dot" />
      </span>
      <span className="scroll-wheel-text">SCROLL</span>
    </button>
  );
}
