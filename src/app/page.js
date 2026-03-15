"use client";

import { Canvas } from "@react-three/fiber";
import Experience from "../experience/Experience";
import Cursor from "../components/cursor/Cursor";
import ScrollManager from "../components/scroll/ScrollManager";

export default function Home() {
  return (
    <>
      <Cursor />
      <ScrollManager />

      <main style={{ height: "400vh", width: "100vw" }}>
        <Canvas
          style={{
            position: "fixed",
            top: 0,
            left: 0
          }}
          camera={{ position: [0, 0, 5] }}
        >
          <Experience />
        </Canvas>
      </main>
    </>
  );
}
