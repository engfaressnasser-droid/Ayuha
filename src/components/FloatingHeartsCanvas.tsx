import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  swaySpeed: number;
  swayOffset: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  type: 'heart' | 'sparkle' | 'petal';
}

export const FloatingHeartsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(244, 63, 94, ',   // rose-500
      'rgba(251, 113, 133, ', // rose-400
      'rgba(225, 29, 72, ',   // rose-600
      'rgba(192, 132, 252, ', // purple-400
      'rgba(244, 114, 182, ', // pink-400
      'rgba(253, 186, 116, ', // amber-300 warm glow
    ];

    const particleCount = Math.min(50, Math.floor(width / 30));
    const particles: Particle[] = [];

    const createParticle = (initialY?: number): Particle => {
      const typeRand = Math.random();
      const type: 'heart' | 'sparkle' | 'petal' = 
        typeRand < 0.65 ? 'heart' : typeRand < 0.85 ? 'petal' : 'sparkle';

      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : height + Math.random() * 50,
        size: type === 'heart' ? 12 + Math.random() * 18 : type === 'petal' ? 8 + Math.random() * 10 : 3 + Math.random() * 5,
        speedY: 0.6 + Math.random() * 1.2,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: 0.2 + Math.random() * 0.55,
        swaySpeed: 0.01 + Math.random() * 0.02,
        swayOffset: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        type,
      };
    };

    // Pre-populate particles distributed across screen
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(Math.random() * height));
    }

    // Interactive burst on mouse move / touch
    const addInteractiveParticle = (x: number, y: number) => {
      if (particles.length > 80) return;
      for (let i = 0; i < 2; i++) {
        const p = createParticle(y);
        p.x = x + (Math.random() - 0.5) * 40;
        p.size = 14 + Math.random() * 10;
        p.speedY = 1.2 + Math.random() * 1.5;
        p.opacity = 0.8;
        particles.push(p);
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (Math.random() > 0.75) {
        addInteractiveParticle(e.clientX, e.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0] && Math.random() > 0.75) {
        addInteractiveParticle(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Draw heart path on canvas
    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(x, y + topCurveHeight);
      c.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
      c.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.4, x, y + size);
      c.bezierCurveTo(x, y + (size + topCurveHeight) / 1.4, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
      c.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
      c.closePath();
      c.fill();
    };

    // Draw delicate petal
    const drawPetal = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.beginPath();
      c.ellipse(x, y, size * 0.4, size * 0.8, 0, 0, Math.PI * 2);
      c.closePath();
      c.fill();
    };

    // Draw sparkle star
    const drawSparkle = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.beginPath();
      c.arc(x, y, size * 0.5, 0, Math.PI * 2);
      c.closePath();
      c.fill();
    };

    let time = 0;
    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.y -= p.speedY;
        p.x += Math.sin(time + p.swayOffset) * 0.8 + p.speedX;
        p.rotation += p.rotationSpeed;

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = `${p.color}${p.opacity})`;

        if (p.type === 'heart') {
          drawHeart(ctx, -p.size / 2, -p.size / 2, p.size);
        } else if (p.type === 'petal') {
          drawPetal(ctx, 0, 0, p.size);
        } else {
          drawSparkle(ctx, 0, 0, p.size);
        }

        ctx.restore();

        // Respawn if out of screen
        if (p.y < -40 || p.x < -30 || p.x > width + 30) {
          if (particles.length > particleCount) {
            particles.splice(i, 1);
          } else {
            particles[i] = createParticle();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
      aria-hidden="true"
    />
  );
};
