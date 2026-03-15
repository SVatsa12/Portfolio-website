"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function HeroScene() {

  const cubeRef = useRef();
useFrame((state) => {
  const t = state.clock.elapsedTime;

  cubeRef.current.rotation.y += 0.01;
  cubeRef.current.position.y = Math.sin(t) * 0.3 - 1;
});


  return (
    <>
      {/* Intro Text */}
      <Text
        fontSize={1}
        position={[0, 1.5, 0]}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        SHUBHAM
      </Text>

      <Text
        fontSize={0.4}
        position={[0, 0.5, 0]}
        color="white"
        anchorX="center"
      >
        Building AI & Scalable Systems
      </Text>

      {/* Rotating cube */}
      <mesh ref={cubeRef} position={[0, -1, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </>
  );
}
