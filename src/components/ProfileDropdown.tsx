import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Users, 
  Settings, 
  LogOut, 
  User, 
  ChevronDown,
  Palette,
  Globe,
  Bot
} from 'lucide-react';

interface ProfileDropdownProps {
  currentUser: { name: string; email: string } | null;
  theme: any;
  onLogout: () => void;
  onSwitchAccount?: () => void;
  onSettings?: () => void;
  currentPersona?: string;
  personaTone?: string;
}

export default function ProfileDropdown({
  currentUser,
  theme,
  onLogout,
  onSwitchAccount,
  onSettings,
  currentPersona = 'Ancestra',
  personaTone = 'Auto-Detect'
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) {
    return null;
  }

  const getPersonaEmoji = (persona: string) => {
    if (persona.includes('Guardian')) return '🛡️';
    return '🌺';
  };

  const getToneEmoji = (tone: string) => {
    const toneEmojis: Record<string, string> = {
      'Auto-Detect': '🎯',
      'The Infant - Gentle Nurturer': '👶',
      'The Teen - Cool Confidant': '🎸',
      'The Scholar - Learned Educator': '📚',
      'The Dialect - Authentic Islander': '🎭',
      'The Gen Z Vibe - Digital Native': '📱',
      'The Confidant - Quiet Companion': '🤝',
      'The Spark - Creative Inspiration': '💡',
      'The Rambler - Detailed Storyteller': '🗣️',
      'The Sloth - Relaxed Guide': '😴',
      'The Firecracker - High Energy': '🎆',
      'The Sweetheart - Extra Caring': '💕'
    };
    return toneEmojis[tone] || '🎯';
  };

  const formatToneName = (tone: string) => {
    if (tone === 'Auto-Detect') return 'Auto-Detect';
    return tone.split(' - ')[0] || tone;
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        className="flex items-center space-x-3 p-3 rounded-2xl backdrop-blur-md border hover:scale-105 transition-all duration-300"
        style={{ 
          backgroundColor: `${theme.cardBg || theme.bg}e6`, 
          borderColor: theme.borderColor || theme.primary,
          color: theme.text
        }}
      >
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
        >
          <Users className="w-5 h-5" />
        </div>
        <div className="text-left">
          <p className="font-medium text-sm" style={{ color: theme.text }}>
            {currentUser.name}
          </p>
          <p className="text-xs opacity-60" style={{ color: theme.text }}>
            Profile
          </p>
        </div>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: theme.text }} 
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <Card 
            className="absolute top-full right-0 mt-2 w-80 shadow-2xl border-2 z-50 animate-scale-in"
            style={{
              backgroundColor: theme.cardBg || theme.bg,
              borderColor: theme.borderColor || theme.primary
            }}
          >
            <div className="p-4 space-y-4">
              {/* User Info Section */}
              <div className="flex items-center space-x-3 pb-3 border-b" style={{ borderColor: theme.borderColor || theme.primary }}>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                >
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-base" style={{ color: theme.text }}>
                    {currentUser.name}
                  </p>
                  <p className="text-sm opacity-70" style={{ color: theme.text }}>
                    {currentUser.email}
                  </p>
                </div>
              </div>

              {/* Current Settings Display */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4" style={{ color: theme.primary }} />
                    <span className="text-sm font-medium" style={{ color: theme.text }}>
                      Current Mode
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="flex items-center space-x-1"
                    style={{ 
                      borderColor: theme.primary,
                      color: theme.primary,
                      backgroundColor: `${theme.primary}10`
                    }}
                  >
                    <span>{getPersonaEmoji(currentPersona)}</span>
                    <span>{currentPersona}</span>
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4" style={{ color: theme.secondary }} />
                    <span className="text-sm font-medium" style={{ color: theme.text }}>
                      Communication
                    </span>
                  </div>
                  <Badge 
                    variant="outline"
                    className="flex items-center space-x-1"
                    style={{ 
                      borderColor: theme.secondary,
                      color: theme.secondary,
                      backgroundColor: `${theme.secondary}10`
                    }}
                  >
                    <span>{getToneEmoji(personaTone)}</span>
                    <span className="text-xs">{formatToneName(personaTone)}</span>
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t" style={{ borderColor: theme.borderColor || theme.primary }}>
                {onSettings && (
                  <Button
                    onClick={() => {
                      onSettings();
                      setIsOpen(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start space-x-2 hover:bg-opacity-10"
                    style={{ color: theme.text }}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings & Preferences</span>
                  </Button>
                )}

                {onSwitchAccount && (
                  <Button
                    onClick={() => {
                      onSwitchAccount();
                      setIsOpen(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start space-x-2 hover:bg-opacity-10"
                    style={{ color: theme.text }}
                  >
                    <Users className="w-4 h-4" />
                    <span>Switch Account</span>
                  </Button>
                )}

                <Button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start space-x-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>

              {/* Quick Stats */}
              <div 
                className="mt-4 p-3 rounded-xl border"
                style={{ 
                  backgroundColor: `${theme.primary}08`,
                  borderColor: `${theme.primary}20`
                }}
              >
                <div className="text-center">
                  <p className="text-xs font-medium mb-1" style={{ color: theme.text }}>
                    🌴 Ready to explore St. Kitts & Nevis! 🌴
                  </p>
                  <p className="text-xs opacity-70" style={{ color: theme.text }}>
                    Your AI assistants are ready to help
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}