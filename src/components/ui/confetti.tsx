"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#00B5C8", "#C9A96E", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
}

export function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const idCounter = useRef(0);

  const fire = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      newParticles.push({
        id: ++idCounter.current,
        x: randomBetween(10, 90),
        y: randomBetween(-10, 10),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: randomBetween(0, 360),
        scale: randomBetween(0.5, 1.2),
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2500);
  }, []);

  useEffect(() => {
    const handler = () => fire();
    window.addEventListener("confetti:play", handler);
    return () => window.removeEventListener("confetti:play", handler);
  }, [fire]);

  return (
    <div className="fixed inset-0 z-[300] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              x: `${p.x}vw`,
              y: `${p.y}vh`,
              rotate: p.rotation,
              scale: p.scale,
              opacity: 1,
            }}
            animate={{
              y: "110vh",
              rotate: p.rotation + 720,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: randomBetween(1.5, 2.5), ease: "easeIn" }}
            className="absolute w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: p.color }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
