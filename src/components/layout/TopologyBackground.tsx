'use client';

import React, { useEffect, useRef } from 'react';

interface TopologyNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export function TopologyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = 0;
    let height = 0;
    let nodes: TopologyNode[] = [];

    const initNodes = () => {
      nodes = [];
      const count = Math.min(Math.floor((width * height) / 25000), 45);
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          r: Math.random() * 2 + 1.2,
        });
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const strokePrefix = isDark ? 'rgba(99, 102, 241,' : 'rgba(79, 70, 229,';
      const nodeColor = isDark ? '#818CF8' : '#6366F1';

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.18;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `${strokePrefix} ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div className="bg-topology" aria-hidden="true">
      <div className="bg-grid" />
      <canvas ref={canvasRef} className="bg-canvas" />
    </div>
  );
}
