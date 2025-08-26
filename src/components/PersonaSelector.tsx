import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  AVAILABLE_PERSONAS, 
  getMainPersonas, 
  getSpecializedPersonas 
} from '../utils/constants';
import { 
  getPersonaInfo, 
  PersonaConfig 
} from '../utils/personaEngine';
import { 
  Users, 
  Shield, 
  Baby, 
  Zap, 
  BookOpen, 
  GraduationCap, 
  Smartphone, 
  Heart, 
  Lightbulb, 
  TreePine, 
  Coffee, 
  Sparkles, 
  Crown,
  UserCheck,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';

interface PersonaSelectorProps {
  currentPersona: string;
  onPersonaSelect: (personaId: string) => void;
  darkMode: boolean;
  className?: string;
}

export default function PersonaSelector({ currentPersona, onPersonaSelect, darkMode, className }: PersonaSelectorProps) {
  // Get all personas from constants and enhance with UI-specific data
  const personas = AVAILABLE_PERSONAS.map(persona => {
    const basePersonaData = {
      id: persona.id,
      name: persona.name,
      emoji: persona.emoji || '🤖',
      description: persona.description,
      color: persona.color || '#6b7280',
      guardianMode: persona.guardianMode || false,
    };

    // Add UI-specific data for each persona
    switch (persona.id) {
      case 'Ancestra':
        return {
          ...basePersonaData,
          role: 'Cultural Storyteller',
          specialty: 'History & Heritage',
          tone: 'Warm & Respectful',
          animationClass: 'hover-lift'
        };
      case 'The Guardian':
        return {
          ...basePersonaData,
          role: 'Safety Advisor',
          specialty: 'Risk Assessment',
          tone: 'Protective & Clear',
          animationClass: 'hover-glow'
        };
      case 'The Infant':
        return {
          ...basePersonaData,
          role: 'Family Planner',
          specialty: 'Child Safety & Fun',
          tone: 'Gentle & Nurturing',
          animationClass: 'infant-hover'
        };
      case 'The Teen':
        return {
          ...basePersonaData,
          emoji: '🎸',
          role: 'Trend Spotter',
          specialty: 'Social & Nightlife',
          tone: 'Energetic & Cool',
          animationClass: 'teen-hover'
        };
      case 'The Scholar':
        return {
          ...basePersonaData,
          role: 'Knowledge Source',
          specialty: 'Education & Facts',
          tone: 'Scholarly & Precise',
          animationClass: 'scholar-hover'
        };
      case 'The Dialect':
        return {
          ...basePersonaData,
          role: 'Local Insider',
          specialty: 'Culture & Authenticity',
          tone: 'Warm & Authentic',
          animationClass: 'dialect-hover'
        };
      case 'The Gen Z Vibe':
        return {
          ...basePersonaData,
          role: 'Social Influencer',
          specialty: 'Social Media & Trends',
          tone: 'Trendy & Digital',
          animationClass: 'genz-hover'
        };
      case 'The Confidant':
        return {
          ...basePersonaData,
          role: 'Quiet Companion',
          specialty: 'Support & Reflection',
          tone: 'Calm & Supportive',
          animationClass: 'confidant-hover'
        };
      case 'the-spark':
        return {
          ...basePersonaData,
          name: 'The Spark',
          emoji: '💡',
          role: 'Idea Generator',
          specialty: 'Creative & Spontaneous',
          tone: 'Inspiring & Imaginative',
          color: '#f39c12',
          animationClass: 'hover-lift'
        };
      case 'the-rambler':
        return {
          ...basePersonaData,
          name: 'The Rambler',
          emoji: '🥾',
          role: 'Adventure Guide',
          specialty: 'Outdoor & Storytelling',
          tone: 'Adventurous & Engaging',
          color: '#27ae60',
          animationClass: 'hover-lift'
        };
      case 'the-sloth':
        return {
          ...basePersonaData,
          name: 'The Sloth',
          emoji: '☕',
          role: 'Comfort Expert',
          specialty: 'Relaxation & Accessibility',
          tone: 'Relaxed & Accommodating',
          color: '#95a5a6',
          animationClass: 'hover-lift'
        };
      case 'the-firecracker':
        return {
          ...basePersonaData,
          name: 'The Firecracker',
          emoji: '🎆',
          role: 'Energy Booster',
          specialty: 'High-Energy & Nightlife',
          tone: 'Energetic & Exciting',
          color: '#e74c3c',
          animationClass: 'hover-lift'
        };
      case 'the-sweetheart':
        return {
          ...basePersonaData,
          name: 'The Sweetheart',
          emoji: '💕',
          role: 'Romantic Planner',
          specialty: 'Romance & Relationships',
          tone: 'Romantic & Thoughtful',
          color: '#e91e63',
          animationClass: 'hover-lift'
        };
      default:
        return {
          ...basePersonaData,
          role: 'AI Assistant',
          specialty: 'General Help',
          tone: 'Friendly & Helpful',
          animationClass: 'hover-lift'
        };
    }
  });

  // Get persona-specific styling
  const getPersonaCardStyle = (persona: any, isSelected: boolean) => {
    const baseStyle = `
      p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 
      ${persona.animationClass} relative overflow-hidden
    `;
    
    if (isSelected) {
      return `${baseStyle} border-[${persona.color}] bg-gradient-to-br from-[${persona.color}]/10 to-[${persona.color}]/5 
               shadow-lg shadow-[${persona.color}]/20`;
    }
    
    return `${baseStyle} border-gray-200 dark:border-gray-700 hover:border-[${persona.color}] 
             hover:shadow-md hover:shadow-[${persona.color}]/10`;
  };

  // Add persona-specific animation when selected
  const getPersonaAnimation = (personaId: string) => {
    const animations = {
      'The Infant': 'infant-soft-pulse',
      'The Teen': 'teen-glow-pulse', 
      'The Scholar': 'scholar-thoughtful',
      'The Dialect': 'dialect-cultural-ripple',
      'The Gen Z Vibe': 'genz-vibe-glitch',
      'The Confidant': 'confidant-breathing'
    };
    
    return animations[personaId as keyof typeof animations] || '';
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* Header with enhanced description */}
      <div className="text-center pb-4">
        <h3 className="text-xl font-semibold mb-2">Choose Your AI Companion</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Each persona has unique personality traits, communication styles, and specialized knowledge
        </p>
      </div>

      {/* Enhanced persona grid - no internal scrolling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personas.map((persona, index) => {
          const isSelected = currentPersona === persona.id;
          const animationDelay = `stagger-${(index % 5) + 1}`;
          
          return (
            <div
              key={persona.id}
              className={`
                ${getPersonaCardStyle(persona, isSelected)}
                ${animationDelay} animate-fade-in
                ${isSelected ? getPersonaAnimation(persona.id) : ''}
              `}
              onClick={() => onPersonaSelect(persona.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onPersonaSelect(persona.id);
                }
              }}
              aria-label={`Select ${persona.name} persona`}
            >
              {/* Persona header with emoji and name */}
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className={`
                    text-3xl flex-shrink-0 p-2 rounded-full 
                    ${isSelected ? `bg-[${persona.color}]/20` : 'bg-gray-100 dark:bg-gray-800'}
                    transition-all duration-300
                  `}
                >
                  {persona.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">
                    {persona.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {persona.role}
                  </p>
                </div>
                {isSelected && (
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                )}
              </div>

              {/* Enhanced persona details */}
              <div className="space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {persona.description}
                </p>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">Specialty:</span>
                    <span className={`font-medium ${isSelected ? `text-[${persona.color}]` : 'text-gray-700 dark:text-gray-300'}`}>
                      {persona.specialty}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">Tone:</span>
                    <span className={`font-medium ${isSelected ? `text-[${persona.color}]` : 'text-gray-700 dark:text-gray-300'}`}>
                      {persona.tone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${persona.color}10 0%, ${persona.color}05 100%)`,
                    border: `2px solid ${persona.color}40`
                  }}
                />
              )}

              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Selected persona info panel */}
      {currentPersona && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">
              {personas.find(p => p.id === currentPersona)?.emoji}
            </div>
            <div>
              <h4 className="font-semibold text-lg">
                {personas.find(p => p.id === currentPersona)?.name} Active
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {personas.find(p => p.id === currentPersona)?.role}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Communication Style:</span>
              <p className="font-medium">{personas.find(p => p.id === currentPersona)?.tone}</p>
            </div>
            <div>
              <span className="text-gray-500">Expertise:</span>
              <p className="font-medium">{personas.find(p => p.id === currentPersona)?.specialty}</p>
            </div>
            <div>
              <span className="text-gray-500">Mode:</span>
              <p className="font-medium">
                <span className="inline-flex items-center gap-1">
                  Regular
                  <Info className="w-3 h-3" />
                </span>
              </p>
            </div>
          </div>

          {/* Guardian mode availability indicator */}
          {['The Infant', 'The Teen', 'The Scholar', 'The Dialect', 'The Gen Z Vibe', 'The Confidant', 'the-spark', 'the-rambler', 'the-sloth', 'the-firecracker', 'the-sweetheart'].includes(currentPersona) && (
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-blue-700 dark:text-blue-300">
                  Guardian mode available for enhanced safety and support
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick facts about persona system */}
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Dynamic Persona Switching
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Your AI companion can automatically switch personas based on your needs and conversation context for the most helpful experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}