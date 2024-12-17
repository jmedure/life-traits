'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

const SEASON_ICONS = {
  spring: {
    light: '/spring-light.svg',
    dark: '/spring-dark.svg',
  },
  summer:{
    light: '/summer-light.svg',
    dark: '/summer-dark.svg',
    },
  fall: {
    light: '/fall-light.svg',
    dark: '/fall-dark.svg',
  },
  winter: {
    light: '/winter-light.svg',
    dark: '/winter-dark.svg',
  }
} as const;

function getCurrentSeason(): keyof typeof SEASON_ICONS {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  
  const springStart = new Date(now.getFullYear(), 2, 19);
  const summerStart = new Date(now.getFullYear(), 5, 20);
  const fallStart = new Date(now.getFullYear(), 8, 22);
  const winterStart = new Date(now.getFullYear(), 11, 21);
  
  if (now >= springStart && now < summerStart) return 'spring';
  if (now >= summerStart && now < fallStart) return 'summer';
  if (now >= fallStart && now < winterStart) return 'fall';
  return 'winter';
}

export function SeasonalFavicon() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    const updateFavicon = () => {
      if (!currentTheme) return; // Wait for theme to be available
      
      const season = getCurrentSeason();
      const icon = SEASON_ICONS[season];
      const iconPath = icon[currentTheme as 'light' | 'dark'];
      
      console.log('Debug info:', {
        season,
        currentTheme,
        iconPath,
        themeState: theme,
        systemTheme
      });

      // Remove existing favicons
      const existingFavicons = document.querySelectorAll("link[rel*='icon']");
      existingFavicons.forEach(favicon => document.head.removeChild(favicon));

      // Create and append new favicon
      const link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      link.href = iconPath;
      document.head.appendChild(link);
    };

    // Initial update
    updateFavicon();
    
    // Check for updates daily
    const interval = setInterval(updateFavicon, 1000 * 60 * 60 * 24);
    return () => clearInterval(interval);
  }, [currentTheme, theme, systemTheme]);

  return null;
} 