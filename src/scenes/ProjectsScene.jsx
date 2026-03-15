"use client";

import { Text } from "@react-three/drei";

export default function ProjectsScene() {
  return (
    <group position={[0, -40, 0]}>


      <Text
        fontSize={0.8}
        position={[0, 2, 0]}
        anchorX="center"
      >
        PROJECTS
      </Text>

      <Text
        fontSize={0.35}
        maxWidth={6}
        textAlign="center"
        position={[0, 0, 0]}
      >
        AI apps, backend architectures, and scalable systems
        built with modern technologies.
      </Text>

    </group>
  );
}
