import React, { useEffect, useRef, useState } from 'react';

/**
 * AtmosphericCanvas
 * An organic, seductive ambient light atmosphere.
 * Replaces mechanical/sci-fi grids with warm golden caustic refraction,
 * subtle chromatic dispersion, and interactive light dust that responds
 * smoothly to cursor movement.
 */
export const AtmosphericCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smooth interpolation (lerp)
    const mouse = {
      x: width * 0.5,
      y: height * 0.3,
      targetX: width * 0.5,
      targetY: height * 0.3,
      active: false,
    };

    // Ambient floating particles (golden bokeh dust)
    const particleCount = isReducedMotion ? 12 : 36;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      radius: Math.random() * 2.2 + 0.8,
      baseAlpha: Math.random() * 0.25 + 0.08,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.35 ? '#F6C453' : Math.random() > 0.5 ? '#19D3F3' : '#FF2E93',
    }));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.targetX = width * 0.5;
      mouse.targetY = height * 0.3;
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    let frame = 0;
    const render = () => {
      frame++;
      // Lerp mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // 1. Base deep luxury gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#070A17');
      bgGrad.addColorStop(0.5, '#090E22');
      bgGrad.addColorStop(1, '#050711');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Interactive golden light aura following cursor
      if (!isReducedMotion) {
        const glowRadius = Math.min(width, height) * 0.55;
        const radial = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          glowRadius
        );
        radial.addColorStop(0, 'rgba(246, 196, 83, 0.08)');
        radial.addColorStop(0.3, 'rgba(246, 196, 83, 0.035)');
        radial.addColorStop(0.7, 'rgba(25, 211, 243, 0.015)');
        radial.addColorStop(1, 'rgba(7, 10, 23, 0)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Static top-right golden atmospheric beam
      const ambientBeam = ctx.createRadialGradient(
        width * 0.85,
        height * 0.1,
        0,
        width * 0.85,
        height * 0.1,
        width * 0.5
      );
      ambientBeam.addColorStop(0, 'rgba(246, 196, 83, 0.07)');
      ambientBeam.addColorStop(0.5, 'rgba(255, 46, 147, 0.025)');
      ambientBeam.addColorStop(1, 'rgba(7, 10, 23, 0)');
      ctx.fillStyle = ambientBeam;
      ctx.fillRect(0, 0, width, height);

      // 4. Subtle floating luminous dust particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!isReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.phase += 0.015;

          // Wrap edges smoothly
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Gentle attraction/push from cursor
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 10) {
            const force = (180 - dist) / 180 * 0.4;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
          }
        }

        const alpha = p.baseAlpha + Math.sin(p.phase) * 0.08;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra soft halo for golden particles
        if (p.color === '#F6C453' && !isReducedMotion) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(246, 196, 83, 0.04)';
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 select-none opacity-90 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
};
