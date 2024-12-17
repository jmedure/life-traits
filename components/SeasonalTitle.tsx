'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function SeasonalTitle() {
    const getSeasonByMonth = () => {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'fall';
        return 'winter';
      };
      
      const [season, setSeason] = useState<'winter' | 'spring' | 'summer' | 'fall'>(getSeasonByMonth());
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isHovered) {
      setIsVisible(true);
    }
  }, [isHovered]);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation?: number;
      color?: string;
    }> = [];

    const createParticles = () => {
      const particleCount = 30;
      particles = [];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: -10,
          size: Math.random() * 3 + 2,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 + 1,
          rotation: Math.random() * 360,
          color: season === 'fall' 
            ? ['#FFB84C', '#F16767', '#A84448'][Math.floor(Math.random() * 3)]
            : season === 'spring'
            ? ['#90EE90', '#98FB98', '#3CB371'][Math.floor(Math.random() * 3)]
            : undefined
        });
      }
    };

    const animate = () => {
      if (!ctx || !canvas || !isVisible) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        if (season === 'winter' || season === 'spring' || season === 'fall') {
          ctx.save();
          if (season === 'winter') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = particle.color || 'white';
            ctx.translate(particle.x, particle.y);
            ctx.rotate((particle.rotation || 0) * Math.PI / 180);
            ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
          }
          ctx.restore();

          particle.y += particle.speedY;
          particle.x += particle.speedX;
          particle.rotation = ((particle.rotation || 0) + 1) % 360;

          if (particle.y > canvas.height) {
            particle.y = -10;
            particle.x = Math.random() * canvas.width;
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    createParticles();
    if (isVisible) {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, season]);

  return (
    <div 
      ref={titleRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <AnimatePresence
        onExitComplete={() => setIsVisible(false)}
      >
        {isHovered && (
          <motion.canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 9998 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 2, ease: "easeOut" }
            }}
            transition={{
              opacity: { duration: 0.5, ease: "easeIn" }
            }}
          />
        )}
      </AnimatePresence>
      <motion.h1 
        className={cn(
          "text-foreground/90 text-xl tracking-tight relative z-[51]",
          season === 'summer' && isHovered && "animate-subtle-heat-haze"
        )}
      >
        Your life happens in seasons
      </motion.h1>
    </div>
  );
} 