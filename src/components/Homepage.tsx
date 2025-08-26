import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import AncestraSection from './AncestraSection';
import GuardianSection from './GuardianSection';
import ProfileDropdown from './ProfileDropdown';
import QuestSystem from './QuestSystem';
import { 
  Waves, Sun, Palm, Anchor, Navigation, Star, Users, 
  Globe, Coffee, Camera, Sparkles, Heart, Award, ChevronDown, Scroll, Shield
} from 'lucide-react';

interface HomepageProps {
  onStartChat: (persona: 'Ancestra' | 'The Guardian', userName?: string) => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  theme: any;
  currentPersona?: 'Ancestra' | 'The Guardian';
  currentUser?: { name: string; email: string } | null;
  onLogout?: () => void;
  onSwitchAccount?: () => void;
  onSettings?: () => void;
  personaTone?: string;
}

export default function Homepage({ 
  onStartChat, 
  onNavigate, 
  currentPage, 
  darkMode, 
  onToggleDarkMode,
  theme,
  currentPersona = 'Ancestra',
  currentUser,
  onLogout,
  onSwitchAccount,
  onSettings,
  personaTone = 'Auto-Detect'
}: HomepageProps) {
  const [userName, setUserName] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<'Ancestra' | 'The Guardian' | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [questSystemOpen, setQuestSystemOpen] = useState(false);
  const [activeQuestMode, setActiveQuestMode] = useState<'ancestra' | 'guardian'>('ancestra');
  
  // Smooth wave animation
  const [waveOffset, setWaveOffset] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handlePersonaSelect = (persona: 'Ancestra' | 'The Guardian') => {
    setSelectedPersona(persona);
    setShowWelcome(true);
    setTimeout(() => setShowWelcome(false), 4000);
  };

  const handleStartChat = (persona: 'Ancestra' | 'The Guardian') => {
    const userNameToPass = userName.trim() || undefined;
    onStartChat(persona, userNameToPass);
  };

  const handleOpenQuestSystem = (mode: 'ancestra' | 'guardian') => {
    setActiveQuestMode(mode);
    setQuestSystemOpen(true);
  };

  const ancestraData = {
    title: "Ancestra",
    bulletPoints: [
      "Historical insights and captivating storytelling",
      "Cultural wisdom and local traditions",
      "Hidden gems and authentic experiences", 
      "Food, festivals, and island celebrations"
    ]
  };

  const guardianData = {
    title: "The Guardian",
    bulletPoints: [
      "Safety tips and travel precautions",
      "Emergency contacts and procedures",
      "Transportation and navigation guidance",
      "Health, security, and wellness advice"
    ]
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Profile Dropdown - Show when logged in */}
      {currentUser && (
        <div className="absolute top-6 right-6 z-20">
          <ProfileDropdown
            currentUser={currentUser}
            theme={theme}
            onLogout={onLogout || (() => {})}
            onSwitchAccount={onSwitchAccount}
            onSettings={onSettings}
            currentPersona={currentPersona}
            personaTone={personaTone}
          />
        </div>
      )}

      {/* Dark Mode Toggle */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          onClick={onToggleDarkMode}
          variant="ghost"
          size="sm"
          className="w-12 h-12 rounded-full backdrop-blur-md border hover:scale-110 transition-all duration-300"
          style={{
            backgroundColor: `${theme.cardBg}e6`,
            borderColor: theme.borderColor,
            color: theme.text
          }}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </Button>
      </div>

      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 transition-all duration-500"
          style={{ background: theme.bgGradient }}
        ></div>
        
        {/* Floating Elements - Theme Aware */}
        <div 
          className="absolute top-10 left-10 w-20 h-20 rounded-full animate-float opacity-30"
          style={{ 
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            filter: currentPersona === 'The Guardian' ? 'hue-rotate(0deg)' : 'none'
          }}
        ></div>
        <div 
          className="absolute top-32 right-20 w-16 h-16 rounded-full animate-float-delayed opacity-30"
          style={{ 
            background: `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})`,
            filter: currentPersona === 'The Guardian' ? 'hue-rotate(120deg)' : 'none'
          }}
        ></div>
        <div 
          className="absolute bottom-20 left-20 w-24 h-24 rounded-full animate-float opacity-30"
          style={{ 
            background: `radial-gradient(circle, ${theme.primary}40, ${theme.secondary}40)`,
            filter: currentPersona === 'The Guardian' ? 'hue-rotate(240deg)' : 'none'
          }}
        ></div>
        <div 
          className="absolute bottom-40 right-10 w-12 h-12 rounded-full animate-float-delayed opacity-30"
          style={{ 
            background: `conic-gradient(from 0deg, ${theme.primary}, ${theme.secondary}, ${theme.primary})`,
            filter: currentPersona === 'The Guardian' ? 'hue-rotate(180deg)' : 'none'
          }}
        ></div>
        
        {/* Animated Waves */}
        <svg 
          className="absolute bottom-0 w-full h-32" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d={`M0,60 C300,${80 + Math.sin(waveOffset * 0.02) * 10} 600,${40 + Math.sin(waveOffset * 0.03) * 15} 900,${60 + Math.sin(waveOffset * 0.025) * 12} 1200,50 L1200,120 L0,120 Z`}
            fill="url(#wave-gradient)"
            className="opacity-20"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#67e8f9" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="max-w-7xl mx-auto w-full">
            
            {/* Hero Header */}
            <div className="text-center mb-16">
              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="text-6xl animate-bounce">🏝️</div>
                <div className="text-6xl animate-bounce" style={{ animationDelay: '0.2s' }}>🤖</div>
                <div className="text-6xl animate-bounce" style={{ animationDelay: '0.4s' }}>✨</div>
              </div>
              
              <h1 
                className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent leading-tight"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary}, ${theme.primary})`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text'
                }}
              >
                St. Kitts AI Assistant
              </h1>
              
              <p className="text-2xl md:text-3xl mb-8 max-w-4xl mx-auto leading-relaxed" style={{ color: theme.text }}>
                Your personal guide to the magic, culture, and safe exploration of 
                <span className="font-bold" style={{ color: theme.primary }}> St. Kitts & Nevis</span>
              </p>

              {/* User Name Input */}
              <div className="max-w-md mx-auto mb-12">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="What's your name? (optional)"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full py-4 px-6 text-lg text-center rounded-2xl
                             backdrop-blur-sm border-2 transition-all duration-300"
                    style={{
                      backgroundColor: `${theme.cardBg}`,
                      borderColor: theme.borderColor,
                      color: theme.text
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.primary;
                      e.target.style.boxShadow = `0 0 0 4px ${theme.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.borderColor;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="text-2xl">👋</div>
                  </div>
                </div>
                {userName && (
                  <p className="mt-3 font-medium animate-fade-in" style={{ color: theme.primary }}>
                    Nice to meet you, {userName}! 🌺
                  </p>
                )}
              </div>
            </div>

            {/* Welcome Message */}
            {showWelcome && selectedPersona && (
              <div className="max-w-2xl mx-auto mb-8 animate-slide-in">
                <Card 
                  className="p-6 border-2 shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}20)`,
                    borderColor: theme.primary
                  }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <Sparkles className="w-6 h-6 animate-spin" style={{ color: theme.primary }} />
                    <p className="text-lg font-bold" style={{ color: theme.text }}>
                      Welcome{userName ? ` ${userName}` : ''}! You've chosen <span style={{ color: theme.primary }}>{selectedPersona}</span> as your guide! 🎉
                    </p>
                    <Sparkles className="w-6 h-6 animate-spin" style={{ color: theme.primary }} />
                  </div>
                </Card>
              </div>
            )}

            {/* Persona Selection */}
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
              <div className="animate-slide-in stagger-1 hover-lift">
                <AncestraSection
                  {...ancestraData}
                  onStartChat={() => handleStartChat('Ancestra')}
                  isSelected={selectedPersona === 'Ancestra'}
                  theme={theme}
                />
              </div>
              
              <div className="animate-slide-in-right stagger-2 hover-lift">
                <GuardianSection
                  {...guardianData}
                  onStartChat={() => handleStartChat('The Guardian')}
                  isSelected={selectedPersona === 'The Guardian'}
                  theme={theme}
                />
              </div>
            </div>

            {/* Quest System Entry Points */}
            <div className="text-center mb-16 animate-fade-in stagger-3">
              <h3 className="text-3xl font-bold mb-4" style={{ color: theme.text }}>Unlock Your Adventure</h3>
              <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: theme.text, opacity: 0.8 }}>
                Embark on guided quests to discover hidden gems, earn rewards, and become a true St. Kitts explorer!
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Ancestra Quest Button */}
                <div className="animate-scale-in stagger-4">
                  <Button
                    onClick={() => handleOpenQuestSystem('ancestra')}
                    size="lg"
                    className="w-full py-8 px-6 text-lg font-bold text-white border-none shadow-xl
                             transform transition-all duration-200 hover:scale-105 group relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #f87171, #ec4899)',
                      borderRadius: '4px',
                      fontFamily: 'Lora, serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444, #db2777)';
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f87171, #ec4899)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    aria-label="Open the Chronicler's Legacy Quest System"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Scroll className="w-8 h-8 group-hover:rotate-12 transition-transform duration-200" />
                      <div className="text-left">
                        <div className="text-xl font-bold">Chronicler's Legacy</div>
                        <div className="text-sm opacity-90">Heritage & Cultural Quests</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                  </Button>
                </div>
                
                {/* Guardian Quest Button */}
                <div className="animate-scale-in stagger-5">
                  <Button
                    onClick={() => handleOpenQuestSystem('guardian')}
                    size="lg"
                    className="w-full py-8 px-6 text-lg font-bold text-white border-none shadow-xl
                             transform transition-all duration-200 hover:scale-105 group relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #00B8D4, #2563eb)',
                      borderRadius: '8px',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #00A1B8, #1d4ed8)';
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 184, 212, 0.4)';
                      e.currentTarget.style.transform = 'scale(0.98)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #00B8D4, #2563eb)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    aria-label="Open the Guardian's Journey Quest System"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <div className="relative">
                        <Shield className="w-8 h-8" />
                        <div className="absolute inset-0 w-8 h-8">
                          <div className="w-full h-0.5 bg-cyan-300 absolute top-1/2 left-0 
                                          animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-bold">Guardian's Journey</div>
                        <div className="text-sm opacity-90">Safety & Security Quests</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent 
                                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300"></div>
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="text-center mb-16 animate-fade-in stagger-6">
              <h3 className="text-3xl font-bold mb-8" style={{ color: theme.text }}>Not sure where to start?</h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="animate-scale-in stagger-7">
                  <Button
                    onClick={() => handleStartChat('Ancestra')}
                    size="lg"
                    className="py-6 px-8 text-lg font-bold text-white border-none shadow-xl
                             transform transition-all duration-300 hover:scale-105 hover-glow"
                    style={{
                      background: 'linear-gradient(135deg, #f87171, #ec4899)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444, #db2777)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f87171, #ec4899)';
                    }}
                  >
                    <Coffee className="w-6 h-6 mr-3" />
                    Explore Culture & History
                  </Button>
                </div>
                
                <div className="animate-scale-in stagger-8">
                  <Button
                    onClick={() => handleStartChat('The Guardian')}
                    size="lg"
                    className="py-6 px-8 text-lg font-bold text-white border-none shadow-xl
                             transform transition-all duration-300 hover:scale-105 guardian-color-morph hover-glow"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                    }}
                  >
                    <Navigation className="w-6 h-6 mr-3" />
                    Get Safety & Travel Tips
                  </Button>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-center mb-12" style={{ color: theme.text }}>
                What Makes Us Special
              </h3>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                  { 
                    icon: <Sparkles className="w-12 h-12" />, 
                    title: "AI-Powered Insights", 
                    desc: "Advanced AI that learns your preferences and adapts to your travel style",
                    color: "from-coral-400 to-pink-500"
                  },
                  { 
                    icon: <Globe className="w-12 h-12" />, 
                    title: "Local Expertise", 
                    desc: "Authentic knowledge from real locals who know St. Kitts inside and out",
                    color: "from-ocean-400 to-blue-500"
                  },
                  { 
                    icon: <Heart className="w-12 h-12" />, 
                    title: "Personalized Experience", 
                    desc: "Every conversation is tailored to your interests and travel goals",
                    color: "from-teal-400 to-cyan-500"
                  }
                ].map(({ icon, title, desc, color }, index) => (
                  <Card 
                    key={index} 
                    className="p-8 text-center backdrop-blur-sm border-2 hover:shadow-2xl hover:scale-105 transition-all duration-500 group"
                    style={{
                      backgroundColor: theme.cardBg,
                      borderColor: theme.borderColor
                    }}
                  >
                    <div 
                      className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-white shadow-xl
                                 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                      }}
                    >
                      {icon}
                    </div>
                    <h4 className="text-xl font-bold mb-4" style={{ color: theme.text }}>{title}</h4>
                    <p className="leading-relaxed" style={{ color: theme.text, opacity: 0.8 }}>{desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <Card 
              className="max-w-4xl mx-auto p-8 text-white text-center"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                ...(currentPersona === 'The Guardian' && { 
                  animation: 'guardianColorShift 8s ease-in-out infinite' 
                })
              }}
            >
              <h3 className="text-3xl font-bold mb-8">Join Thousands of Happy Travelers</h3>
              <div className="grid grid-cols-3 gap-8">
                <div className="group cursor-default">
                  <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">10K+</div>
                  <div className="text-lg opacity-90">Happy Visitors</div>
                </div>
                <div className="group cursor-default">
                  <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">500K+</div>
                  <div className="text-lg opacity-90">Questions Answered</div>
                </div>
                <div className="group cursor-default">
                  <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">98%</div>
                  <div className="text-lg opacity-90">Satisfaction Rate</div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>

      {/* Quest System Modal */}
      <QuestSystem
        isOpen={questSystemOpen}
        onClose={() => setQuestSystemOpen(false)}
        activeMode={activeQuestMode}
        personality="scholar"
        theme={theme}
      />
    </div>
  );
}