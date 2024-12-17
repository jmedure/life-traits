'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  contrast: number;
  onContrastChange: (contrast: number) => void;
  noise: number;
  onNoiseChange: (noise: number) => void;
  presetColors?: string[];
}

const DEFAULT_PRESETS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
  '#D4A5A5', '#9B5DE5', '#F15BB5', '#00BBF9', '#00F5D4',
];

const sliderThumbStyles = {
  default: `
    appearance-none
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:bg-foreground
    [&::-webkit-slider-thumb]:h-4
    [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:cursor-pointer
    [&::-webkit-slider-thumb]:transition-transform
    [&::-webkit-slider-thumb]:duration-100
  `,
  dragging: `
    [&::-webkit-slider-thumb]:scale-125
    [&::-webkit-slider-thumb]:bg-foreground/90
  `
};

export function ColorPicker({ 
  value, 
  onChange,
  contrast, 
  onContrastChange,
  noise,
  onNoiseChange,
  presetColors = DEFAULT_PRESETS 
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      // If clicking the button or inside the menu, don't do anything
      if (
        containerRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node) ||
        isDragging
      ) {
        return;
      }
      
      // Otherwise, close the menu
      setIsOpen(false);
    };

    // Use mousedown instead of click
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, isDragging]);

  const handleSliderMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    setIsDragging(true);
    
    const updateValue = (clientX: number) => {
      const percentage = Math.max(0, Math.min(100, 
        ((clientX - rect.left) / rect.width) * 100
      ));
      
      if (slider.id === 'contrast-slider') {
        onContrastChange(getContrastValue(percentage));
      } else {
        onNoiseChange(percentage / 100);
      }
    };

    // Update on initial click
    updateValue(e.clientX);
    
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      updateValue(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleSliderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (value: number) => void) => {
    e.stopPropagation();
    callback(Number(e.target.value));
  };

  const MIN_CONTRAST = 0.4;
  const MAX_CONTRAST = 1.0;

  const getSliderValue = (contrast: number) => {
    return ((contrast - MIN_CONTRAST) / (MAX_CONTRAST - MIN_CONTRAST)) * 100;
  };

  const getContrastValue = (sliderValue: number) => {
    return MIN_CONTRAST + (sliderValue / 100) * (MAX_CONTRAST - MIN_CONTRAST);
  };

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg",
          "border border-foreground/10",
          "hover:bg-foreground/[0.02] active:bg-foreground/[0.05]",
          "focus:outline-none focus:ring-2 focus:ring-foreground/10"
        )}
      >
        <div
          className="w-4 h-4 rounded-full border border-foreground/10"
          style={{ backgroundColor: value }}
        />
        <div className="text-xs text-foreground/60">
          {value.toUpperCase()}
        </div>
        <ChevronDown className="w-3 h-3 text-foreground/40" />
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute top-full right-0 mt-2 p-3 rounded-lg shadow-lg bg-background border border-foreground/10 w-[280px]"
        >
          <div className="mb-3 pb-3 border-b border-foreground/10">
            <div className="text-xs font-medium mb-2 text-foreground/60">
              Background Contrast
            </div>
            <input
              id="contrast-slider"
              type="range"
              min="0"
              max="100"
              value={getSliderValue(contrast)}
              onMouseDown={handleSliderMouseDown}
              className={cn(
                "w-full h-2 bg-foreground/10 rounded-lg cursor-pointer",
                "appearance-none",
                "[&::-webkit-slider-thumb]:appearance-none",
                "[&::-webkit-slider-thumb]:bg-foreground",
                "[&::-webkit-slider-thumb]:h-4",
                "[&::-webkit-slider-thumb]:w-4",
                "[&::-webkit-slider-thumb]:rounded-full",
                "[&::-webkit-slider-thumb]:cursor-grab",
                isDragging && "[&::-webkit-slider-thumb]:cursor-grabbing",
                isDragging && "[&::-webkit-slider-thumb]:scale-110"
              )}
            />
          </div>

          <div className="mb-3 pb-3 border-b border-foreground/10">
            <div className="text-xs font-medium mb-2 text-foreground/60">
              Noise Intensity
            </div>
            <input
              id="noise-slider"
              type="range"
              min="0"
              max="100"
              value={noise * 100}
              onMouseDown={handleSliderMouseDown}
              className={cn(
                "w-full h-2 bg-foreground/10 rounded-lg cursor-pointer",
                "appearance-none",
                "[&::-webkit-slider-thumb]:appearance-none",
                "[&::-webkit-slider-thumb]:bg-foreground",
                "[&::-webkit-slider-thumb]:h-4",
                "[&::-webkit-slider-thumb]:w-4",
                "[&::-webkit-slider-thumb]:rounded-full",
                "[&::-webkit-slider-thumb]:cursor-grab",
                isDragging && "[&::-webkit-slider-thumb]:cursor-grabbing",
                isDragging && "[&::-webkit-slider-thumb]:scale-110"
              )}
            />
          </div>

          <div className="grid grid-cols-5 gap-1">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => onChange(color)}
                className="w-full pt-[100%] rounded-md border border-foreground/10 relative"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 