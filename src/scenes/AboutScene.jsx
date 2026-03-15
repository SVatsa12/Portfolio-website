"use client";

import { Text } from "@react-three/drei";

export default function AboutScene() {
  return (
  <group position={[0, -20, 0]}>



      <Text
        fontSize={0.8}
        position={[0, 2, 0]}
        anchorX="center"
      >
        ABOUT
      </Text>

      <Text
        fontSize={0.35}
        maxWidth={6}
        textAlign="center"
        position={[0, 0, 0]}
      >
        Backend developer building scalable systems, APIs,
        and AI powered applications.
      </Text>

    </group>
  );
}
