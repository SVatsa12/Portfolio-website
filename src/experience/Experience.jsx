"use client";
import { Stars } from "@react-three/drei";

import { useFrame } from "@react-three/fiber";
import useScroll from "../hooks/useScroll";

import HeroScene from "../scenes/HeroScene";
import AboutScene from "../scenes/AboutScene";
import ProjectsScene from "../scenes/ProjectsScene";

export default function Experience() {

  const scroll = useScroll();

  useFrame(({ camera }) => {
  camera.position.y += (0 - scroll * 40 - camera.position.y) * 0.08;


  });

  return (
    <>
    <Stars
  radius={100}
  depth={50}
  count={5000}
  factor={4}
  saturation={0}
  fade
/>

      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 5]} />

      <HeroScene />
      <AboutScene />
      <ProjectsScene />
    </>
  );
}
