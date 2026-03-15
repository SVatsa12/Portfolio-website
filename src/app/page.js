"use client";

import { Canvas } from "@react-three/fiber";
import Experience from "../experience/Experience";
import Cursor from "../components/cursor/Cursor";
import ScrollManager from "../components/scroll/ScrollManager";
import ScrollWheel from "../components/scroll/ScrollWheel";
import Loader from "../components/ui/Loader";

export default function Home() {
  return (
    <>
      <Cursor />
      <ScrollManager />
      <ScrollWheel />
      <Loader onComplete={() => console.log("Portfolio loaded")} />

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