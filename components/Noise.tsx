'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export function Noise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkTheme = currentTheme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth / 1.5;
      canvas.height = window.innerHeight / 1.5;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() > 0.3) {
        data[i] = data[i + 1] = data[i + 2] = 0;
        data[i + 3] = 0;
        continue;
      }

      const value = isDarkTheme 
        ? Math.random() * 100  // Darker noise for dark theme
        : 155 + Math.random() * 100; // Brighter noise for light theme
      
      data[i] = data[i + 1] = data[i + 2] = value;
      data[i + 3] = 35; // Increased base opacity
    }

    ctx.putImageData(imageData, 0, 0);

    return () => window.removeEventListener('resize', resize);
  }, [isDarkTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 9999,
        opacity: .2,
        imageRendering: '-webkit-optimize-contrast',
        // Other options:
        // imageRendering: 'auto',
        // imageRendering: 'smooth', 
        // imageRendering: '-webkit-optimize-contrast',
        mixBlendMode: 'multiply',
      }}
    />
  );
} 