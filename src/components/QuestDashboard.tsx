import React, { useState, useEffect } from 'react';
import { MapPin, Camera, Brain, CheckCircle, Clock, Star, Trophy, Target, Navigation, MessageSquare, AlertCircle, ArrowRight, X, Play, Pause, RotateCcw, Zap, BookOpen, Users, Shield, Heart, Award, Flame, Calendar, ChevronRight, Eye, Upload, Send, CheckSquare, Timer, Compass, Search, Filter, MapIcon, ImageIcon, HelpCircle, Info, Badge, BarChart3, TrendingUp, Medal, Crown, ThumbsUp, Share2, MoreVertical, Copy, ExternalLink, Smile, Hash, AtSign, Plus, ArrowUp, ArrowDown, Lightbulb, Image, Edit3 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge as BadgeComponent } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useQuestManagement, Quest, QuestStep } from '../hooks/useQuestManagement';

// ==============================
// MAIN COMPONENT
// ==============================
interface QuestDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  activePersona: 'ancestra' | 'guardian';
  theme: any;
  userName: string;
  personality: string;
  questManagement: ReturnType<typeof useQuestManagement>;
}

export default function QuestDashboard({ 
  isOpen, 
  onClose, 
  activePersona, 
  theme, 
  userName, 
  personality,
  questManagement 
}: QuestDashboardProps) {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Geolocation state
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string>('');

  // Get persona-specific quests
  const availableQuestsForPersona = questManagement.availableQuests.filter(q => q.persona === activePersona);
  const activeQuestsForPersona = questManagement.getActiveQuestsByPersona(activePersona);
  const completedQuestsForPersona = questManagement.completedQuests.filter(q => q.persona === activePersona);

  // Get user location on mount
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationError('Location access denied. Some quest features may be limited.');
        }
      );
    }
  }, [isOpen]);

  // Handle quest acceptance
  const handleAcceptQuest = (quest: Quest) => {
    questManagement.acceptQuest(quest);
    setSelectedQuest({ ...quest, status: 'active', acceptedAt: new Date() });
  };

  // Handle step completion
  const handleStepComplete = (questId: string, stepId: string, evidence: any) => {
    questManagement.completeQuestStep(questId, stepId, evidence);
  };

  if (!isOpen) return null;

  // Persona-specific styling
  const isAncestra = activePersona === 'ancestra';
  const personaTitle = isAncestra ? "Chronicler's Legacy" : "Guardian's Journey";
  const personaIcon = isAncestra ? '🏛️' : '🛡️';
  const personaDescription = isAncestra 
    ? 'Discover the cultural heritage of St. Kitts & Nevis'
    : 'Master safety protocols and protective knowledge';

  // PURE BEACHY COLORS ONLY - NO BROWN ANYWHERE!
  const ancestraBeachyColors = {
    // 🌺 Primary coral colors
    primary: '#ef4444', // coral-500 
    primaryLight: '#f87171', // coral-400
    primaryDark: '#dc2626', // coral-600
    
    // 🌸 Pink accent colors  
    secondary: '#ec4899', // pink-500
    secondaryLight: '#f472b6', // pink-400
    
    // 🌊 Ocean blue colors
    ocean: '#0ea5e9', // ocean-500
    oceanLight: '#38bdf8', // ocean-400
    oceanDark: '#0284c7', // ocean-600
    
    // 🏖️ Light beachy backgrounds (NO BROWN)
    backgroundPrimary: '#fef7f7', // coral-50
    backgroundSecondary: '#fdf2f8', // pink-50  
    backgroundOcean: '#f0f9ff', // ocean-50
    
    // 🐚 Card colors
    cardBg: '#fee2e2', // coral-100
    cardBgLight: '#fce7f3', // pink-100
    
    // 🌴 Tropical accents  
    tropical: '#14b8a6', // tropical-500
    tropicalLight: '#2dd4bf', // tropical-400
    
    // Text colors (coral theme)
    textPrimary: '#dc2626', // coral-600
    textSecondary: '#be185d', // pink-700
    textLight: '#f87171', // coral-400
    
    // Border colors
    border: '#fca5a5', // coral-300
    borderLight: '#f9a8d4', // pink-300
  };

  const guardianColors = {
    primary: '#2563eb', // police-600
    primaryLight: '#3b82f6', // police-500
    secondary: '#64748b', // tactical-500
    ocean: '#0ea5e9',
    backgroundPrimary: '#f8fafc', // tactical-50
    backgroundSecondary: '#eff6ff', // police-50
    cardBg: '#dbeafe', // police-100
    textPrimary: '#1d4ed8', // police-700
    textSecondary: '#334155', // tactical-700
    border: '#93c5fd', // police-300
  };

  const colors = isAncestra ? ancestraBeachyColors : guardianColors;

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in ${isAncestra ? 'ancestra-theme' : 'guardian-theme'}`}>
      <div 
        className="w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-3xl shadow-2xl animate-scale-in border-2"
        style={{ 
          background: isAncestra 
            ? `linear-gradient(to bottom right, ${colors.backgroundPrimary}, ${colors.backgroundSecondary})`
            : `linear-gradient(to bottom right, ${colors.backgroundPrimary}, ${colors.backgroundSecondary})`,
          borderColor: colors.border
        }}
      >
        
        {/* PURE BEACHY HEADER - NO BROWN */}
        <div 
          className={`relative p-8 text-white overflow-hidden ${isAncestra ? 'quest-glow' : 'guardian-glow'}`}
          style={{
            background: isAncestra 
              ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.ocean})`
              : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`
          }}
        >
          
          {/* Beach-themed decorative elements */}
          <div className="absolute inset-0 opacity-15">
            {isAncestra ? (
              <>
                <div className="absolute top-6 right-6 text-8xl transform rotate-12 animate-float">🌺</div>
                <div className="absolute bottom-4 left-4 text-6xl transform -rotate-12 animate-float-delayed">🏖️</div>
                <div className="absolute top-1/2 left-1/3 text-5xl animate-pulse">🏛️</div>
                <div className="absolute top-1/4 right-1/3 text-4xl animate-bounce">🌴</div>
                <div className="absolute bottom-1/3 right-1/4 text-6xl opacity-50">🐚</div>
              </>
            ) : (
              <>
                <div className="absolute top-6 right-6 text-8xl transform rotate-12 animate-float">🚔</div>
                <div className="absolute bottom-4 left-4 text-6xl transform -rotate-12 animate-float-delayed">⚡</div>
                <div className="absolute top-1/2 left-1/3 text-5xl animate-pulse">🛡️</div>
              </>
            )}
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl animate-bounce drop-shadow-lg">
                  {personaIcon}
                </div>
                <div>
                  <h1 className={`text-3xl font-bold tracking-wide ${isAncestra ? 'font-serif' : 'font-mono'}`}>
                    {personaTitle}
                  </h1>
                  <p className="text-lg opacity-90 font-medium">
                    {personaDescription}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* User stats with pure beachy styling */}
            <div className={`grid grid-cols-5 gap-6 ${isAncestra ? 'font-serif' : 'font-mono'}`}>
              {[
                { value: questManagement.userStats.totalXP, label: 'Total XP', icon: '⭐' },
                { value: questManagement.userStats.level, label: 'Level', icon: isAncestra ? '🏆' : '🥇' },
                { value: questManagement.userStats.completedQuests, label: 'Completed', icon: '✅' },
                { value: activeQuestsForPersona.length, label: 'Active', icon: '🎯' },
                { value: questManagement.userStats.streak, label: 'Day Streak', icon: '🔥' }
              ].map((stat, index) => (
                <div key={index} className="text-center group cursor-default">
                  <div className="text-lg mb-1 group-hover:scale-125 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm opacity-90 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Level progress with coral colors */}
            {questManagement.userStats.level > 1 && (
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-3 font-medium">
                  <span className="flex items-center gap-2">
                    {isAncestra ? '🌺' : '🎖️'} Level {questManagement.userStats.level}
                  </span>
                  <span className="flex items-center gap-2">
                    Next: {questManagement.getNextLevelXP(questManagement.userStats.level)} XP {isAncestra ? '🏖️' : '⚡'}
                  </span>
                </div>
                <div className="relative h-4 bg-white/20 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${isAncestra ? 'shimmer' : 'guardian-ping'}`}
                    style={{ 
                      background: isAncestra 
                        ? `linear-gradient(to right, ${colors.primaryLight}, ${colors.secondaryLight})`
                        : `linear-gradient(to right, ${colors.primaryLight}, ${colors.secondary})`,
                      width: `${(questManagement.userStats.totalXP % questManagement.getNextLevelXP(questManagement.userStats.level)) / questManagement.getNextLevelXP(questManagement.userStats.level) * 100}%` 
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PURE BEACHY CONTENT AREA */}
        <div 
          className="flex-1 overflow-y-auto p-8"
          style={{ 
            background: isAncestra 
              ? `linear-gradient(to bottom right, ${colors.backgroundPrimary}, ${colors.backgroundSecondary}, ${colors.backgroundOcean})`
              : `linear-gradient(to bottom right, ${colors.backgroundPrimary}, ${colors.backgroundSecondary})`
          }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList 
              className="grid w-full grid-cols-4 mb-8 h-14 p-1 rounded-2xl border-2 shadow-lg backdrop-blur-sm"
              style={{ 
                backgroundColor: isAncestra ? `${colors.cardBg}80` : `${colors.cardBg}80`,
                borderColor: colors.border
              }}
            >
              {[
                { value: 'dashboard', label: 'Dashboard', icon: '📊' },
                { value: 'active', label: `Active (${activeQuestsForPersona.length})`, icon: '🎯' },
                { value: 'available', label: 'Available', icon: '🗺️' },
                { value: 'completed', label: 'Completed', icon: '🏆' }
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="text-base font-semibold px-6 py-3 rounded-xl transition-all duration-300 data-[state=active]:scale-105 hover:scale-102"
                  style={{
                    color: activeTab === tab.value ? 'white' : colors.textPrimary,
                    background: activeTab === tab.value 
                      ? `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`
                      : 'transparent'
                  }}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Dashboard Tab - Pure Beachy */}
            <TabsContent value="dashboard" className="space-y-8 animate-fade-in">
              {/* Quick Stats Cards - NO BROWN */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { 
                    icon: Target, 
                    title: 'Active Quests', 
                    value: activeQuestsForPersona.length,
                    emoji: '🎯',
                    gradient: isAncestra ? `from-coral-400 to-pink-400` : `from-police-500 to-tactical-500`
                  },
                  { 
                    icon: Trophy, 
                    title: 'Success Rate', 
                    value: `${questManagement.userStats.totalQuestsStarted > 0 
                      ? Math.round((questManagement.userStats.completedQuests / questManagement.userStats.totalQuestsStarted) * 100)
                      : 0}%`,
                    emoji: '📈',
                    gradient: isAncestra ? `from-ocean-400 to-coral-400` : `from-tactical-500 to-police-500`
                  },
                  { 
                    icon: Flame, 
                    title: 'Current Streak', 
                    value: `${questManagement.userStats.streak} days`,
                    emoji: '🔥',
                    gradient: isAncestra ? `from-pink-400 to-ocean-400` : `from-police-400 to-tactical-400`
                  }
                ].map((stat, index) => (
                  <Card 
                    key={index}
                    className="p-6 border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-default backdrop-blur-sm"
                    style={{
                      background: isAncestra 
                        ? `linear-gradient(to bottom right, ${colors.cardBg}, ${colors.cardBgLight})`
                        : `linear-gradient(to bottom right, ${colors.cardBg}, ${colors.backgroundSecondary})`,
                      borderColor: colors.border,
                      boxShadow: `0 4px 6px ${colors.primary}20`
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                        style={{
                          background: isAncestra 
                            ? `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`
                            : `linear-gradient(to bottom right, ${colors.primary}, ${colors.primaryLight})`
                        }}
                      >
                        <stat.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p 
                          className="text-sm font-medium opacity-80"
                          style={{ color: colors.textSecondary }}
                        >
                          {stat.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <p 
                            className="text-3xl font-bold group-hover:scale-110 transition-transform duration-300"
                            style={{ color: colors.textPrimary }}
                          >
                            {stat.value}
                          </p>
                          <span className="text-2xl group-hover:animate-bounce">{stat.emoji}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Recent Activity - Pure Beachy Theme */}
              <Card 
                className="p-8 border-2 backdrop-blur-sm"
                style={{
                  background: isAncestra 
                    ? `linear-gradient(to bottom right, ${colors.cardBg}90, ${colors.cardBgLight}90)`
                    : `linear-gradient(to bottom right, ${colors.cardBg}90, ${colors.backgroundSecondary}90)`,
                  borderColor: colors.border
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="p-3 rounded-xl"
                    style={{
                      background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`
                    }}
                  >
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 
                    className={`text-2xl font-bold ${isAncestra ? 'font-serif' : 'font-mono'}`}
                    style={{ color: colors.textPrimary }}
                  >
                    Recent Activity
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {/* Show recent completed quests */}
                  {completedQuestsForPersona.slice(0, 3).map((quest) => (
                    <div 
                      key={quest.id}
                      className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-102 hover:shadow-lg group"
                      style={{
                        background: isAncestra 
                          ? `linear-gradient(to right, ${colors.backgroundPrimary}, ${colors.backgroundSecondary})`
                          : `linear-gradient(to right, ${colors.backgroundPrimary}, ${colors.backgroundSecondary})`,
                        borderColor: colors.borderLight
                      }}
                    >
                      <div 
                        className="p-2 rounded-full"
                        style={{
                          background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`
                        }}
                      >
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p 
                          className="font-semibold group-hover:text-opacity-80 transition-colors"
                          style={{ color: colors.textPrimary }}
                        >
                          Completed "{quest.title.substring(0, 40)}..."
                        </p>
                        <p 
                          className="text-sm opacity-70"
                          style={{ color: colors.textSecondary }}
                        >
                          Earned {quest.xpReward} XP • {quest.completedAt ? new Date(quest.completedAt).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                      <div className="text-2xl group-hover:animate-bounce">
                        {isAncestra ? '🌺' : '🎖️'}
                      </div>
                    </div>
                  ))}
                  
                  {/* Show active quests */}
                  {activeQuestsForPersona.slice(0, 2).map((quest) => (
                    <div 
                      key={quest.id}
                      className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-102 hover:shadow-lg group cursor-pointer"
                      style={{
                        background: isAncestra 
                          ? `linear-gradient(to right, ${colors.backgroundPrimary}, ${colors.backgroundSecondary})`
                          : `linear-gradient(to right, ${colors.backgroundPrimary}, ${colors.backgroundSecondary})`,
                        borderColor: colors.borderLight
                      }}
                      onClick={() => setSelectedQuest(quest)}
                    >
                      <div 
                        className="p-2 rounded-full animate-pulse"
                        style={{
                          background: `linear-gradient(to bottom right, ${colors.ocean}, ${colors.primary})`
                        }}
                      >
                        <Play className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p 
                          className="font-semibold group-hover:text-opacity-80 transition-colors"
                          style={{ color: colors.textPrimary }}
                        >
                          In Progress: "{quest.title.substring(0, 40)}..."
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p 
                            className="text-sm opacity-70"
                            style={{ color: colors.textSecondary }}
                          >
                            Step {quest.currentStepIndex + 1} of {quest.steps.length} • {Math.round(quest.progress || 0)}% complete
                          </p>
                          <div className="ml-2 h-2 w-20 bg-white rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all duration-1000"
                              style={{ 
                                background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                                width: `${quest.progress || 0}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl group-hover:animate-bounce">
                        {isAncestra ? '🎯' : '⚡'}
                      </div>
                    </div>
                  ))}

                  {/* Empty state */}
                  {completedQuestsForPersona.length === 0 && activeQuestsForPersona.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-8xl mb-4 animate-bounce">
                        {isAncestra ? '🌺' : '🛡️'}
                      </div>
                      <h4 
                        className={`text-2xl font-bold mb-3 ${isAncestra ? 'font-serif' : 'font-mono'}`}
                        style={{ color: colors.textPrimary }}
                      >
                        Start Your Adventure!
                      </h4>
                      <p 
                        className="mb-6 max-w-md mx-auto opacity-80"
                        style={{ color: colors.textSecondary }}
                      >
                        Begin your journey by accepting your first quest from the Available tab and discover the wonders of St. Kitts & Nevis.
                      </p>
                      <Button 
                        onClick={() => setActiveTab('available')}
                        className="px-8 py-4 text-lg font-bold rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl text-white"
                        style={{
                          background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary}, ${colors.ocean})`
                        }}
                      >
                        <Target className="w-6 h-6 mr-3" />
                        Browse Available Quests
                        <ArrowRight className="w-6 h-6 ml-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Active Quests Tab */}
            <TabsContent value="active" className="space-y-6 animate-fade-in">
              {activeQuestsForPersona.length === 0 ? (
                <Card 
                  className="p-12 text-center border-2 backdrop-blur-sm"
                  style={{
                    background: isAncestra 
                      ? `linear-gradient(to bottom right, ${colors.cardBg}90, ${colors.cardBgLight}90)`
                      : `linear-gradient(to bottom right, ${colors.cardBg}90, ${colors.backgroundSecondary}90)`,
                    borderColor: colors.border
                  }}
                >
                  <div className="text-8xl mb-6 animate-bounce">
                    {isAncestra ? '🏖️' : '🎯'}
                  </div>
                  <h3 
                    className={`text-2xl font-bold mb-4 ${isAncestra ? 'font-serif' : 'font-mono'}`}
                    style={{ color: colors.textPrimary }}
                  >
                    No Active Quests
                  </h3>
                  <p 
                    className="mb-6 max-w-md mx-auto opacity-80"
                    style={{ color: colors.textSecondary }}
                  >
                    Start your adventure by accepting a quest from the available tab and explore the rich culture and heritage of St. Kitts & Nevis.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('available')}
                    className="px-8 py-4 text-lg font-bold rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl text-white"
                    style={{
                      background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary}, ${colors.ocean})`
                    }}
                  >
                    <Target className="w-6 h-6 mr-3" />
                    Browse Available Quests
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </Card>
              ) : (
                activeQuestsForPersona.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    activePersona={activePersona}
                    onSelect={() => setSelectedQuest(quest)}
                    onStepComplete={handleStepComplete}
                    onAbandon={questManagement.abandonQuest}
                    userLocation={userLocation}
                    showProgress={true}
                    colors={colors}
                    isAncestra={isAncestra}
                  />
                ))
              )}
            </TabsContent>

            {/* Available Quests Tab */}
            <TabsContent value="available" className="space-y-6 animate-fade-in">
              {availableQuestsForPersona.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  activePersona={activePersona}
                  onAccept={() => handleAcceptQuest(quest)}
                  onSelect={() => setSelectedQuest(quest)}
                  showProgress={false}
                  colors={colors}
                  isAncestra={isAncestra}
                />
              ))}
            </TabsContent>

            {/* Completed Quests Tab */}
            <TabsContent value="completed" className="space-y-6 animate-fade-in">
              {completedQuestsForPersona.length === 0 ? (
                <Card 
                  className="p-12 text-center border-2 backdrop-blur-sm"
                  style={{
                    background: isAncestra 
                      ? `linear-gradient(to bottom right, ${colors.cardBg}90, ${colors.cardBgLight}90)`
                      : `linear-gradient(to bottom right, ${colors.cardBg}90, ${colors.backgroundSecondary}90)`,
                    borderColor: colors.border
                  }}
                >
                  <div className="text-8xl mb-6 animate-bounce">
                    {isAncestra ? '🏆' : '🏅'}
                  </div>
                  <h3 
                    className={`text-2xl font-bold mb-4 ${isAncestra ? 'font-serif' : 'font-mono'}`}
                    style={{ color: colors.textPrimary }}
                  >
                    No Completed Quests Yet
                  </h3>
                  <p 
                    className="mb-6 max-w-md mx-auto opacity-80"
                    style={{ color: colors.textSecondary }}
                  >
                    Complete your first quest to see your achievements and earn rewards for exploring St. Kitts & Nevis!
                  </p>
                </Card>
              ) : (
                completedQuestsForPersona.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    activePersona={activePersona}
                    onSelect={() => setSelectedQuest(quest)}
                    showProgress={false}
                    isCompleted={true}
                    colors={colors}
                    isAncestra={isAncestra}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Quest Detail Modal */}
        {selectedQuest && (
          <QuestDetailModal
            quest={selectedQuest}
            activePersona={activePersona}
            onClose={() => setSelectedQuest(null)}
            onStepComplete={handleStepComplete}
            userLocation={userLocation}
            colors={colors}
            isAncestra={isAncestra}
          />
        )}
      </div>
    </div>
  );
}

// ==============================
// QUEST CARD COMPONENT - PURE BEACHY 
// ==============================
const QuestCard = ({ quest, activePersona, onAccept, onSelect, onStepComplete, onAbandon, userLocation, showProgress, isCompleted, colors, isAncestra }: any) => {
  const progressPercentage = quest.progress || 0;
  
  return (
    <Card 
      className="p-8 cursor-pointer transition-all duration-500 hover:scale-102 hover:shadow-2xl group border-2 backdrop-blur-sm"
      style={{
        background: isAncestra 
          ? `linear-gradient(to bottom right, ${colors.cardBg}90, ${colors.cardBgLight}90)`
          : `linear-gradient(to bottom right, ${colors.cardBg}90, ${colors.backgroundSecondary}90)`,
        borderColor: colors.border,
        boxShadow: `0 4px 6px ${colors.primary}20`,
        opacity: isCompleted ? 0.9 : 1
      }}
      onClick={() => onSelect && onSelect()}
    >
      <div className="flex items-start gap-6">
        {/* Quest Icon - Pure Beachy */}
        <div 
          className="p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 relative"
          style={{
            background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`
          }}
        >
          <div className="text-3xl">{quest.icon}</div>
          {isCompleted && (
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
              🏆
            </div>
          )}
        </div>

        {/* Quest Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 
                className={`text-2xl font-bold mb-2 group-hover:text-opacity-80 transition-colors ${isAncestra ? 'font-serif' : 'font-mono'}`}
                style={{ color: colors.textPrimary }}
              >
                {quest.title}
              </h3>
              <p 
                className="opacity-80 mb-4 leading-relaxed"
                style={{ color: colors.textSecondary }}
              >
                {quest.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <BadgeComponent 
                className="px-3 py-1 text-sm font-bold border-2"
                style={{
                  background: isAncestra ? colors.cardBgLight : colors.cardBg,
                  color: colors.textPrimary,
                  borderColor: colors.border
                }}
              >
                {'★'.repeat(quest.difficulty)}
              </BadgeComponent>
            </div>
          </div>

          {/* Quest Meta Information */}
          <div className="flex items-center gap-6 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: colors.textSecondary }} />
              <span style={{ color: colors.textSecondary }} className="opacity-80">{quest.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" style={{ color: colors.textSecondary }} />
              <span style={{ color: colors.textSecondary }} className="opacity-80">{quest.xpReward} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: colors.textSecondary }} />
              <span style={{ color: colors.textSecondary }} className="opacity-80">{quest.location}</span>
            </div>
          </div>

          {/* Progress Bar - Pure Beachy */}
          {showProgress && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: colors.textSecondary }} className="opacity-80">
                  Step {quest.currentStepIndex + 1} of {quest.steps.length}
                </span>
                <span style={{ color: colors.textSecondary }} className="opacity-80">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
              <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full transition-all duration-1000 ${isAncestra ? 'shimmer' : 'guardian-ping'}`}
                  style={{ 
                    background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                    width: `${progressPercentage}%`
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons - Pure Beachy */}
          <div className="flex items-center gap-4">
            {onAccept && (
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept();
                }}
                className="px-6 py-3 font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl text-white"
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`
                }}
              >
                <Play className="w-5 h-5 mr-2" />
                Accept Quest
              </Button>
            )}
            
            {onAbandon && (
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAbandon(quest.id);
                }}
                variant="outline"
                className="px-4 py-3 font-bold rounded-xl border-2 transition-all duration-300 hover:scale-105"
                style={{
                  borderColor: colors.border,
                  color: colors.textSecondary
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Abandon
              </Button>
            )}

            <Button 
              onClick={() => onSelect && onSelect()}
              variant="ghost"
              className="px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                color: colors.textSecondary
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// ==============================
// QUEST DETAIL MODAL - PURE BEACHY
// ==============================
const QuestDetailModal = ({ quest, activePersona, onClose, onStepComplete, userLocation, colors, isAncestra }: any) => {
  const [selectedStep, setSelectedStep] = useState<QuestStep | null>(null);
  const [evidence, setEvidence] = useState<string>('');

  const handleStepComplete = (step: QuestStep) => {
    if (step.type === 'text_input' && evidence.trim().length < 50) {
      alert('Please provide more detailed input (at least 50 characters)');
      return;
    }
    
    onStepComplete(quest.id, step.id, evidence || 'Completed');
    setSelectedStep(null);
    setEvidence('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div 
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl animate-scale-in border-2"
        style={{
          background: isAncestra 
            ? `linear-gradient(to bottom right, ${colors.backgroundPrimary}, ${colors.backgroundSecondary})`
            : `linear-gradient(to bottom right, ${colors.backgroundPrimary}, ${colors.backgroundSecondary})`,
          borderColor: colors.border
        }}
      >
        
        {/* Modal Header - Pure Beachy */}
        <div 
          className="p-8 text-white"
          style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{quest.icon}</div>
              <div>
                <h2 className={`text-3xl font-bold ${isAncestra ? 'font-serif' : 'font-mono'}`}>{quest.title}</h2>
                <p className="text-lg opacity-90">{quest.location} • {quest.estimatedTime} • {quest.xpReward} XP</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content - Pure Beachy */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Quest Description */}
          <div className="mb-8">
            <h3 
              className={`text-2xl font-bold mb-4 ${isAncestra ? 'font-serif' : 'font-mono'}`}
              style={{ color: colors.textPrimary }}
            >
              Quest Description
            </h3>
            <p className="leading-relaxed mb-4" style={{ color: colors.textSecondary }}>{quest.description}</p>
            
            {quest.lore && (
              <div 
                className="p-6 rounded-2xl border-2"
                style={{
                  background: isAncestra ? colors.cardBgLight : colors.cardBg,
                  borderColor: colors.border
                }}
              >
                <h4 
                  className={`text-lg font-bold mb-3 ${isAncestra ? 'font-serif' : 'font-mono'}`}
                  style={{ color: colors.textPrimary }}
                >
                  Cultural Context
                </h4>
                <p className="italic leading-relaxed" style={{ color: colors.textSecondary }}>{quest.lore}</p>
              </div>
            )}
          </div>

          {/* Quest Steps - Pure Beachy */}
          <div className="space-y-6">
            <h3 
              className={`text-2xl font-bold ${isAncestra ? 'font-serif' : 'font-mono'}`}
              style={{ color: colors.textPrimary }}
            >
              Quest Steps
            </h3>
            
            {quest.steps.map((step: QuestStep, index: number) => (
              <div 
                key={step.id}
                className="p-6 rounded-2xl border-2 transition-all duration-300"
                style={{
                  background: step.completed 
                    ? `${colors.cardBg}60`
                    : isAncestra ? colors.cardBgLight : colors.cardBg,
                  borderColor: colors.border,
                  opacity: step.completed ? 0.75 : 1
                }}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg"
                    style={{
                      backgroundColor: step.completed 
                        ? colors.primary
                        : index === quest.currentStepIndex
                          ? colors.ocean
                          : '#94a3b8'
                    }}
                  >
                    {step.completed ? '✓' : index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>{step.title}</h4>
                    <p className="mb-3" style={{ color: colors.textSecondary }}>{step.description}</p>
                    <p className="text-sm opacity-80 mb-4" style={{ color: colors.textSecondary }}>
                      <strong>Requirement:</strong> {step.requirement}
                    </p>

                    {/* Step Actions */}
                    {!step.completed && index === quest.currentStepIndex && (
                      <div className="flex items-center gap-3 mt-4">
                        <Button 
                          onClick={() => setSelectedStep(step)}
                          className="px-6 py-3 font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 text-white"
                          style={{
                            background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`
                          }}
                        >
                          {step.type === 'photo' ? <Camera className="w-5 h-5 mr-2" /> : 
                           step.type === 'text_input' ? <Edit3 className="w-5 h-5 mr-2" /> :
                           step.type === 'geolocation' ? <Navigation className="w-5 h-5 mr-2" /> :
                           <CheckCircle className="w-5 h-5 mr-2" />}
                          Complete Step
                        </Button>
                      </div>
                    )}

                    {step.completed && (
                      <div className="flex items-center gap-2 mt-4">
                        <CheckCircle className="w-5 h-5" style={{ color: colors.primary }} />
                        <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Completed!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Completion Modal - Pure Beachy */}
        {selectedStep && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 p-4">
            <div 
              className="w-full max-w-2xl rounded-2xl shadow-2xl p-8 border-2"
              style={{
                background: isAncestra 
                  ? `linear-gradient(to bottom right, ${colors.backgroundPrimary}, ${colors.backgroundSecondary})`
                  : `linear-gradient(to bottom right, ${colors.backgroundPrimary}, ${colors.backgroundSecondary})`,
                borderColor: colors.border
              }}
            >
              <h3 
                className={`text-2xl font-bold mb-4 ${isAncestra ? 'font-serif' : 'font-mono'}`}
                style={{ color: colors.textPrimary }}
              >
                Complete: {selectedStep.title}
              </h3>
              
              {selectedStep.type === 'text_input' && (
                <div className="mb-6">
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Your Response:
                  </label>
                  <textarea
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                    className="w-full h-32 p-4 border-2 rounded-xl resize-none focus:outline-none focus:ring-2"
                    style={{
                      borderColor: colors.border,
                      boxShadow: `0 0 0 3px ${colors.primary}20`
                    }}
                    placeholder="Share your thoughts, observations, or experiences..."
                  />
                  <p 
                    className="text-xs mt-2 opacity-70"
                    style={{ color: colors.textSecondary }}
                  >
                    Minimum 50 characters required • Current: {evidence.length}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <Button 
                  onClick={() => setSelectedStep(null)}
                  variant="outline"
                  className="px-6 py-3 rounded-xl border-2"
                  style={{
                    borderColor: colors.border,
                    color: colors.textSecondary
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleStepComplete(selectedStep)}
                  className="px-6 py-3 font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 text-white"
                  style={{
                    background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`
                  }}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Step
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};