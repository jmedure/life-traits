'use client';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { Noise } from '@/components/Noise';
import { SeasonalTitle } from '@/components/SeasonalTitle';

interface Skill {
  id: string;
  label: string;
  value: number;
}

const DEFAULT_SKILLS: Skill[] = [
  { id: '1', label: 'Mind', value: 5 },
  { id: '2', label: 'Body', value: 5 },
  { id: '3', label: 'Spirit', value: 5 },
];

export default function SkillPolygon() {
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [isShaking, setIsShaking] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(skills);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setSkills(items);
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setSkills(skills.map(skill => {
      if (skill.id === id) {
        return {
          ...skill,
          [field]: field === 'value' ? Number(value) : value
        };
      }
      return skill;
    }));
  };

  const MAX_SKILLS = 12;

  const handleAddClick = () => {
    if (skills.length >= MAX_SKILLS) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    addSkill();
  };

  const addSkill = () => {
    if (skills.length >= MAX_SKILLS) return;
    
    const newId = `${Date.now()}`;
    const newSkill: Skill = {
      id: newId,
      label: '',
      value: 5
    };
    setSkills([...skills, newSkill]);
    setLastAddedId(newId);
  };

  const MIN_SKILLS = 3;

  const removeSkill = (id: string) => {
    if (skills.length <= MIN_SKILLS) return;
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const Header = () => (
    <div className="fixed top-6 w-full px-6 flex items-center justify-between">
      <SeasonalTitle />
      <Tooltip content={`Edit (⌘E)`}>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={cn(
            "px-2 text tracking-tight rounded-lg",
            "border border-foreground/90",
            "active:bg-foreground",
            "focus:outline-none focus:ring-2 focus:ring-foreground/10",
            "transition-all duration-100",
            isEditing && "bg-foreground text-background"
          )}
        >
          Edit
        </button>
      </Tooltip>
    </div>
  );

  const getPolygonPointsString = (skills: Skill[]) => {
    const maxRadius = 200;

    return skills
      .map((skill, index) => {
        const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2;
        const radius = (skill.value / 10) * maxRadius;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(' ');
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'e' && e.metaKey) {
        e.preventDefault();
        setIsEditing(prev => !prev);
      }
      if (e.key === 'Enter' && e.metaKey && isEditing) {
        e.preventDefault();
        addSkill();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isEditing]);

  useEffect(() => {
    // Wait a bit to ensure theme is properly initialized
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (lastAddedId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
      setLastAddedId(null);
    }
  }, [lastAddedId]);

  const UnsupportedDeviceMessage = () => {
    return (
      <div className="fixed inset-0 items-center justify-center bg-background/80 backdrop-blur-sm max-[1200px]:flex hidden">
        <div className="bg-foreground/5 rounded-lg px-3 py-2 shadow-lg">
          <p className="text-foreground/80 tracking-tight">This tool is currently only supported on desktop</p>
        </div>
      </div>
    );
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <>
      <UnsupportedDeviceMessage />
      <Noise />
      <div className={cn(
        "min-h-screen transition-colors duration-300 min-[1200px]:block hidden",
        "bg-background text-foreground"
      )}>
        <Header />
        <div className={cn(
          "flex items-center min-h-screen transition-all duration-500 ease-out",
          "max-w-[1200px] mx-auto px-16",
          isEditing ? "justify-between" : "justify-center"
        )}>
          <motion.div
            className="relative"
            initial={{
              opacity: 0,
              filter: "blur(50px)",
              scale: 0.1
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              scale: 1
            }}
            transition={{
              
              type: "spring",
              stiffness: 200,
              damping: 50,
              mass: 1
              
            }}
          >
            <motion.div
              className="relative"
              animate={{
                x: isEditing ? -240 : 0,
                scale: isEditing ? 1.1 : 1.5
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 40
              }}
            >
              <div className="relative w-[700px] h-[700px]">
                <svg 
                  viewBox="-350 -350 700 700" 
                  className="w-full h-full"
                >
                  <circle
                    cx="0"
                    cy="0"
                    r="200"
                    className="fill-none stroke-guide-line"
                    strokeWidth="1"
                  />
                  
                  {skills.map((skill, index) => {
                    const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2;
                    const endX = 200 * Math.cos(angle);
                    const endY = 200 * Math.sin(angle);
                    
                    return (
                      <line
                        key={skill.id}
                        x1="0"
                        y1="0"
                        x2={endX}
                        y2={endY}
                        className="stroke-guide-line"
                        strokeWidth="1"
                      />
                    );
                  })}
                  
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0%" stopColor="rgb(var(--foreground))" />
                      <stop offset="100%" stopColor="rgb(var(--foreground) / 0.8)" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feFlood floodColor="rgb(var(--foreground))" floodOpacity="0.5" />
                      <feComposite in2="blur" operator="in" />
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  
                  <motion.polygon
                    initial={false}
                    key={skills.length}
                    animate={{
                      points: getPolygonPointsString(skills)
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    fill="url(#gradient)"
                    filter="url(#glow)"
                  />
                  
                  {skills.map((skill, index) => {
                    const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2;
                    const labelRadius = 260;
                    const x = labelRadius * Math.cos(angle);
                    const y = labelRadius * Math.sin(angle);
                    
                    let anchor;
                    let xOffset;
                    let yOffset = 0;
                    
                    if (angle > -Math.PI/4 && angle < Math.PI/4) {
                      anchor = "start";
                      xOffset = 15;
                    }
                    else if (angle < -3*Math.PI/4 || angle > 3*Math.PI/4) {
                      anchor = "end";
                      xOffset = -15;
                    }
                    else if (angle >= Math.PI/4 && angle <= 3*Math.PI/4) {
                      anchor = "middle";
                      xOffset = 0;
                      yOffset = -10;
                    }
                    else {
                      anchor = "middle";
                      xOffset = 0;
                      yOffset = 10;
                    }
                    
                    return (
                      <text
                        key={skill.id}
                        x={x + xOffset}
                        y={y + yOffset}
                        className="fill-foreground text-md tracking-tight"
                        textAnchor={anchor}
                        dominantBaseline="middle"
                      >
                        {skill.label}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </motion.div>
          </motion.div>
          
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, x: 380 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  ...(isShaking ? {
                    x: [0, -2, 2, -2, 2, 0],
                  } : {})
                }}
                exit={{ opacity: 0, x: 380 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 40,
                  // mass: 1,
                  duration: 0.2,
                  ...(isShaking ? {
                    duration: 0.4,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                  } : {})
                }}
                className="fixed top-16 right-6 rounded-2xl tracking-tight border border-foreground/50 p-4"
              >
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="skills">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {skills.map((skill, index) => {
                          return (
                            <Draggable key={skill.id} draggableId={skill.id} index={index}>
                              {(provided, dragSnapshot) => (
                                <motion.div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={cn(
                                    "flex items-center gap-3 p-2 rounded-lg",
                                    "bg-muted/50 backdrop-blur-sm",
                                    "group transition-colors"
                                  )}
                                >
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="w-4 h-4 text-foreground/40 group-hover:text-foreground/60" />
                                  </div>
                                  
                                  <input
                                    ref={skill.id === lastAddedId ? inputRef : undefined}
                                    type="text"
                                    value={skill.label}
                                    placeholder="New Skill"
                                    onChange={(e) => updateSkill(skill.id, 'label', e.target.value)}
                                    className={cn(
                                      "flex flex-grow bg-foreground/5 tracking-tight text-foreground",
                                      "focus:outline-none focus:ring-1 focus:ring-foreground/10",
                                      "rounded-md p-2",
                                      "placeholder:text-foreground/40"
                                    )}
                                  />
                                  
                                  <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={skill.value}
                                    onChange={(e) => {
                                      const value = Math.min(10, Math.max(0, Number(e.target.value)));
                                      updateSkill(skill.id, 'value', value.toString());
                                    }}
                                    onBlur={(e) => {
                                      if (e.target.value === '') {
                                        updateSkill(skill.id, 'value', '0');
                                      }
                                    }}
                                    className={cn(
                                      "w-13 p-2 bg-foreground/5 text-left text-foreground",
                                      "focus:outline-none focus:ring-1 focus:ring-foreground/10",
                                      "rounded-md",
                                      "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    )}
                                  />
                                  
                                  <button
                                    onClick={() => skills.length > MIN_SKILLS && removeSkill(skill.id)}
                                    className={cn(
                                      "w-6 h-6 p-4 text-xl flex items-center justify-center rounded-md",
                                      skills.length <= MIN_SKILLS 
                                        ? "text-foreground/10 cursor-not-allowed" 
                                        : "text-foreground/50 hover:text-foreground/90"
                                    )}
                                  >
                                    ×
                                  </button>
                                </motion.div>
                              )}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <motion.button
                  onClick={handleAddClick}
                  className={cn(
                    "w-full mt-4 py-2 rounded-lg bg-foreground text-background",
                    "border border-foreground",
                    "transition-all duration-100",
                    skills.length >= MAX_SKILLS
                      ? "text-foreground/30 bg-foreground/20 cursor-not-allowed border-foreground/5"
                      : "hover:border-foreground/20"
                  )}
                  animate={isShaking ? {
                    x: [0, -4, 4, -4, 4, 0],
                  } : {}}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                  }}
                >
                  Add +
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {skills.length === 0 && !isEditing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-foreground/40 text-center"
            >
              <p>No skills added yet</p>
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm underline hover:text-foreground/60 mt-2"
              >
                Click Edit to get started
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}