"use client";

import { useState, useEffect } from "react";

function generateDots() {
  return Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    size: `${2 + Math.random() * 4}px`,
  }));
}

export default function Sparkles() {
  const [dots, setDots] = useState<ReturnType<typeof generateDots>>([]);

  useEffect(() => {
    setDots(generateDots());
  }, []);

  return (
    <div className="sparkles">
      {dots.map((d) => (
        <div
          key={d.id}
          className="sparkle-dot"
          style={{
            left: d.left,
            top: d.top,
            animationDelay: d.delay,
            width: d.size,
            height: d.size,
          }}
        />
      ))}
    </div>
  );
}
