import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Volume2, Home, Settings, Plus } from 'lucide-react';
import { getSidebarNavItems, getFeatureIcons } from './ChatConstants';
import { getPersonaAvatar } from './ChatHelpers';

// ==============================
// TYPING INDICATOR COMPONENT
// ==============================
interface TypingIndicatorProps {
  currentPersona: string;
  theme: any;
}

export function TypingIndicator({ currentPersona, theme }: TypingIndicatorProps) {
  const personaAvatar = getPersonaAvatar(currentPersona);
  
  return (
    <div className="flex justify-start mb-4">
      <div 
        className="px-6 py-4 rounded-2xl text-white flex items-center space-x-3 shadow-xl animate-pulse"
        style={{ 
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` 
        }}
      >
        <span className="text-2xl">{personaAvatar?.icon || '🤖'}</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span className="text-sm font-medium">Thinking...</span>
      </div>
    </div>
  );
}

// ==============================
// QUICKSTART BUTTONS COMPONENT
// ==============================
interface QuickstartButtonsProps {
  currentPersona: string;
  activeQuestCount: number;
  onButtonClick: (button: any) => void;
}

export function QuickstartButtons({ currentPersona, activeQuestCount, onButtonClick }: QuickstartButtonsProps) {
  const buttons = [
    { icon: <div className="w-4 h-4 text-blue-500">🌍</div>, text: "What is the history of St. Kitts?" },
    { icon: <div className="w-4 h-4 text-green-500">🧠</div>, text: "What local foods should I try?" },
    { icon: <div className="w-4 h-4 text-orange-500">🗺️</div>, text: "Tell me about the culture and festivals" }
  ];
  
  return (
    <div className="space-y-4">
      <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
        Quick start suggestions:
      </p>
      <div className="grid grid-cols-1 gap-3">
        {buttons.map((button, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start gap-3 h-auto p-4 text-left hover-lift"
            onClick={() => onButtonClick(button)}
          >
            {button.icon}
            <span className="text-sm">{button.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

// ==============================
// SIDEBAR HEADER COMPONENT
// ==============================
interface SidebarHeaderProps {
  currentPersona: string;
  theme: any;
  onNavigateToHomepage: () => void;
  voiceEnabled?: boolean;
  setVoiceEnabled?: (enabled: boolean) => void;
  onSettings: () => void;
}

export function SidebarHeader({ 
  currentPersona, 
  theme, 
  onNavigateToHomepage, 
  voiceEnabled = false, 
  setVoiceEnabled, 
  onSettings 
}: SidebarHeaderProps) {
  const currentPersonaAvatar = getPersonaAvatar(currentPersona);
  
  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onNavigateToHomepage}
          className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">St. Kitts Guide</span>
        </button>
        <div className="flex items-center gap-2">
          {setVoiceEnabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="h-8 w-8 p-0"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            className="h-8 w-8 p-0"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Persona Display */}
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg"
          style={{ 
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` 
          }}
        >
          {currentPersonaAvatar?.icon || '🤖'}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {currentPersonaAvatar?.name || currentPersona}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {currentPersonaAvatar?.description || 'AI Assistant'}
          </p>
        </div>
      </div>

      {/* New Chat Button */}
      <Button
        onClick={() => {/* TODO: Connect to new chat handler */}}
        className="w-full justify-start gap-2"
        variant="outline"
      >
        <Plus className="w-4 h-4" />
        New Chat
      </Button>
    </div>
  );
}

// ==============================
// ENHANCED SIDEBAR NAVIGATION COMPONENT
// ==============================
interface SidebarNavigationProps {
  currentPersona: string;
  activeQuestCount: number;
  onAction: (action: string) => void;
}

export function SidebarNavigation({ currentPersona, activeQuestCount, onAction }: SidebarNavigationProps) {
  const navItems = getSidebarNavItems(currentPersona, activeQuestCount);
  const isAncestra = currentPersona === 'Ancestra';
  
  return (
    <div className="flex-1 p-4 space-y-3">
      {navItems.map((item, index) => (
        <Button
          key={index}
          variant="ghost"
          className={`
            w-full justify-start gap-3 relative overflow-hidden transition-all duration-300 hover:scale-105
            ${item.isQuest 
              ? `${isAncestra ? 'quest-glow hover:shadow-coral-500/30' : 'guardian-glow hover:shadow-police-500/30'} border` 
              : ''
            }
            ${item.isQuest && isAncestra ? 'border-coral-200 hover:border-coral-300' : ''}
            ${item.isQuest && !isAncestra ? 'border-police-200 hover:border-police-300' : ''}
          `}
          onClick={() => onAction(item.action)}
          style={item.isQuest ? {
            background: isAncestra 
              ? 'linear-gradient(45deg, rgba(248, 113, 113, 0.08), rgba(236, 72, 153, 0.08))'
              : 'linear-gradient(45deg, rgba(37, 99, 235, 0.08), rgba(100, 116, 139, 0.08))',
            ...(item.gradient && {
              backgroundImage: `linear-gradient(135deg, var(--color-${item.gradient.split(' ')[0].replace('from-', '')}) 0%, var(--color-${item.gradient.split(' ')[2].replace('to-', '')}) 100%)`
            })
          } : undefined}
        >
          {/* Icon */}
          <div className={`
            relative
            ${item.isQuest 
              ? `p-1 rounded-lg ${isAncestra ? 'bg-coral-100 dark:bg-coral-900' : 'bg-police-100 dark:bg-police-900'}` 
              : ''
            }
          `}>
            {item.icon}
            {item.isQuest && (
              <div className="absolute -top-1 -right-1 text-lg animate-bounce">
                {item.emoji}
              </div>
            )}
          </div>

          {/* Label and Subtitle */}
          <div className="flex-1 text-left">
            <div className={`font-medium ${item.isQuest ? (isAncestra ? 'text-coral-700 dark:text-coral-300' : 'text-police-700 dark:text-police-300') : ''}`}>
              {item.label}
            </div>
            {item.subtitle && (
              <div className={`text-xs opacity-75 ${isAncestra ? 'text-coral-600 dark:text-coral-400' : 'text-police-600 dark:text-police-400'}`}>
                {item.subtitle}
              </div>
            )}
          </div>

          {/* Active Quest Count Badge */}
          {item.isQuest && item.activeCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`
                  text-xs px-2 py-1 font-bold
                  ${isAncestra 
                    ? 'bg-coral-200 text-coral-800 dark:bg-coral-800 dark:text-coral-200' 
                    : 'bg-police-200 text-police-800 dark:bg-police-800 dark:text-police-200'
                  }
                `}
              >
                {item.activeCount} Active
              </Badge>
              <div className={`w-2 h-2 rounded-full animate-pulse ${isAncestra ? 'bg-coral-400' : 'bg-police-400'}`}></div>
            </div>
          )}

          {/* Hover Gradient Overlay */}
          {item.isQuest && (
            <div className={`
              absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300
              bg-gradient-to-r ${isAncestra ? 'from-coral-500/10 via-pink-500/10 to-coral-500/10' : 'from-police-500/10 via-tactical-500/10 to-police-500/10'}
              rounded-lg
            `}></div>
          )}
        </Button>
      ))}
    </div>
  );
}

// ==============================
// CHAT HEADER COMPONENT
// ==============================
interface ChatHeaderProps {
  currentPersona: string;
  theme: any;
  currentPath: string;
  currentEmotion: string;
}

export function ChatHeader({ currentPersona, theme, currentPath, currentEmotion }: ChatHeaderProps) {
  const currentPersonaAvatar = getPersonaAvatar(currentPersona);
  
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` 
            }}
          >
            <span className="text-sm">{currentPersonaAvatar?.icon}</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white">
              {currentPersonaAvatar?.name || currentPersona}
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {currentPath}
            </p>
          </div>
        </div>
        
        {currentEmotion && (
          <div className="text-sm text-gray-600 dark:text-gray-400 italic">
            {currentEmotion}
          </div>
        )}
      </div>
    </div>
  );
}

// ==============================
// MESSAGE BUBBLE COMPONENT
// ==============================
interface MessageBubbleProps {
  message: any;
  theme: any;
  voiceEnabled?: boolean;
  onPlayAudio?: (message: any) => void;
  validateContent: (content: any) => string;
}

export function MessageBubble({ message, theme, voiceEnabled, onPlayAudio, validateContent }: MessageBubbleProps) {
  const currentPersonaAvatar = getPersonaAvatar(message.persona || 'Default');
  
  return (
    <div
      className={`max-w-[80%] ${
        message.sender === 'user'
          ? 'bg-blue-500 text-white rounded-2xl rounded-br-sm'
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl rounded-bl-sm'
      } px-6 py-4 shadow-lg relative`}
      style={message.sender === 'bot' ? {
        background: `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}20)`,
        border: `1px solid ${theme.primary}30`
      } : {}}
    >
      {message.sender === 'bot' && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{message.avatar || currentPersonaAvatar?.icon}</span>
          <span className="text-sm font-medium opacity-80">
            {currentPersonaAvatar?.name || message.persona}
          </span>
        </div>
      )}
      
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {validateContent(message.content).split('\n').map((line, lineIndex) => (
          <p key={lineIndex} className="mb-2 last:mb-0 leading-relaxed">
            {line}
          </p>
        ))}
      </div>
      
      <div className="text-xs opacity-60 mt-3 flex items-center justify-between">
        <span>{message.timestamp.toLocaleTimeString()}</span>
        {message.sender === 'bot' && voiceEnabled && onPlayAudio && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPlayAudio(message)}
            className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
          >
            <Volume2 className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ==============================
// FLOATING BACKGROUND ELEMENTS
// ==============================
interface FloatingElementsProps {
  theme: any;
  currentPersona: string;
  waveOffset: number;
  floatingOffset: number;
}

export function FloatingBackgroundElements({ theme, currentPersona, waveOffset, floatingOffset }: FloatingElementsProps) {
  return (
    <>
      {/* Theme-Aware Floating Elements */}
      <div 
        className="absolute w-20 h-20 rounded-full opacity-20"
        style={{ 
          top: '10%', 
          left: '10%',
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
          transform: `translateY(${Math.sin(floatingOffset * 0.02) * 20}px)`,
          filter: currentPersona === 'The Guardian' ? 'hue-rotate(0deg)' : 'none'
        }}
      ></div>
      <div 
        className="absolute w-16 h-16 rounded-full opacity-20"
        style={{ 
          top: '20%', 
          right: '15%',
          background: `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})`,
          transform: `translateY(${Math.sin(floatingOffset * 0.025) * 15}px)`,
          filter: currentPersona === 'The Guardian' ? 'hue-rotate(120deg)' : 'none'
        }}
      ></div>
      <div 
        className="absolute w-24 h-24 rounded-full opacity-20"
        style={{ 
          bottom: '25%', 
          left: '20%',
          background: `radial-gradient(circle, ${theme.primary}, ${theme.secondary})`,
          transform: `translateY(${Math.sin(floatingOffset * 0.018) * 25}px)`,
          filter: currentPersona === 'The Guardian' ? 'hue-rotate(240deg)' : 'none'
        }}
      ></div>
      <div 
        className="absolute w-12 h-12 rounded-full opacity-20"
        style={{ 
          bottom: '15%', 
          right: '10%',
          background: `conic-gradient(from 0deg, ${theme.primary}, ${theme.secondary}, ${theme.primary})`,
          transform: `translateY(${Math.sin(floatingOffset * 0.03) * 12}px)`,
          filter: currentPersona === 'The Guardian' ? 'hue-rotate(180deg)' : 'none'
        }}
      ></div>
    </>
  );
}