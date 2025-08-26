import React, { useState, useEffect } from 'react';
import { Star, MapPin, Shield, Trophy, Check, Clock, Camera, Mic, Download, BookOpen, QrCode, ChevronRight, Globe, MessageCircle, Settings, User, Volume2, VolumeX, Scroll, Heart, Award, Target, TrendingUp, Users, Medal, Flame, Calendar, Crown, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// ==============================
// QUEST DATA & CONFIGURATION
// ==============================
const personalities = {
  infant: { tone: "gentle", emoji: "👶", description: "Soft, nurturing guidance" },
  teen: { tone: "cool", emoji: "😎", description: "Hip, trendy communication" },
  scholar: { tone: "learned", emoji: "🎓", description: "Academic, informative style" },
  dialect: { tone: "authentic", emoji: "🏝️", description: "Local Kittitian dialect" },
  genZ: { tone: "digital", emoji: "📱", description: "Social media savvy" },
  confidant: { tone: "quiet", emoji: "🤫", description: "Intimate, personal tone" },
  rambler: { tone: "detailed", emoji: "📝", description: "Comprehensive explanations" },
  jon: { tone: "sophisticated", emoji: "🧐", description: "Refined, cultured approach" },
  tejh: { tone: "youngGenZ", emoji: "✨", description: "Fresh, vibrant energy" },
  rudy: { tone: "rude", emoji: "😏", description: "Sarcastic, edgy humor" },
  ari: { tone: "playful", emoji: "🐾", description: "Fun, lighthearted spirit" },
  spicy18: { tone: "spicy", emoji: "🌶️", description: "Bold, provocative style" },
};

const modes = {
  ancestra: { description: "Heritage tourism focus", emoji: "🏛️", color: "emerald" },
  guardian: { description: "Safety & guidance", emoji: "🛡️", color: "blue" },
};

const allQuests = {
  ancestra: [
    { id: 'q-ank-001', mode: 'ancestra', title: 'Daily Check-in', description: "Tap 'I'm here' to keep your travel streak alive.", xp: 5, effort: 'low', verify_type: 'one-tap' },
    { id: 'q-ank-002', mode: 'ancestra', title: 'Local Phrase Practice', description: 'Listen to a Kittitian greeting and send a short audio clip saying it back.', xp: 8, effort: 'low', verify_type: 'audio' },
    { id: 'q-ank-003', mode: 'ancestra', title: 'Mini History Read', description: 'Read a short island history snippet and answer one question.', xp: 6, effort: 'low', verify_type: 'quiz' },
    { id: 'q-ank-004', mode: 'ancestra', title: 'Virtual Museum Visit', description: 'Watch a short 3-4 minute museum clip and pass a short quiz.', xp: 10, effort: 'low', verify_type: 'quiz' },
    { id: 'q-ank-005', mode: 'ancestra', title: 'Taste Test (In-Room)', description: 'Order a local snack and snap a photo + one-word rating.', xp: 7, effort: 'low', verify_type: 'photo' },
    { id: 'q-ank-006', mode: 'ancestra', title: 'Island Vocabulary Builder', description: 'Learn 5 new local Kittitian words and their meanings.', xp: 8, effort: 'low', verify_type: 'text' },
    { id: 'q-ank-007', mode: 'ancestra', title: 'Caribbean Sunrise Capture', description: 'Take a photo of the sunrise from your location.', xp: 6, effort: 'low', verify_type: 'photo' },
    { id: 'q-ank-008', mode: 'ancestra', title: 'Flag Trivia Challenge', description: 'Answer questions about St. Kitts & Nevis flag symbolism.', xp: 7, effort: 'low', verify_type: 'quiz' },
    { id: 'q-ank-009', mode: 'ancestra', title: 'Local Cuisine Explorer', description: 'Try a traditional dish and provide detailed review.', xp: 9, effort: 'medium', verify_type: 'text' },
    { id: 'q-ank-010', mode: 'ancestra', title: 'Cultural Dance Lesson', description: 'Watch and mimic a traditional Caribbean dance move.', xp: 12, effort: 'medium', verify_type: 'video' },
    { id: 'q-ank-011', mode: 'ancestra', title: 'Historical Timeline Quiz', description: 'Complete interactive timeline of island history.', xp: 15, effort: 'medium', verify_type: 'quiz' },
    { id: 'q-ank-012', mode: 'ancestra', title: 'Brimstone Hill Exploration', description: 'Virtual tour of UNESCO World Heritage fortress.', xp: 20, effort: 'high', verify_type: 'qr' },
    { id: 'q-ank-013', mode: 'ancestra', title: 'Sugar Plantation Legacy', description: 'Learn about the sugar industry impact and complete assessment.', xp: 18, effort: 'high', verify_type: 'quiz' },
    { id: 'q-ank-014', mode: 'ancestra', title: 'Carnival Culture Deep Dive', description: 'Explore carnival traditions and create presentation.', xp: 25, effort: 'high', verify_type: 'text' },
    { id: 'q-ank-015', mode: 'ancestra', title: 'Local Music Discovery', description: 'Discover and analyze traditional Kittitian music genres.', xp: 16, effort: 'medium', verify_type: 'audio' },
    { id: 'q-ank-016', mode: 'ancestra', title: 'Artisan Craft Study', description: 'Learn about local handicrafts and their cultural significance.', xp: 14, effort: 'medium', verify_type: 'photo' },
    { id: 'q-ank-017', mode: 'ancestra', title: 'Island Geology Adventure', description: 'Explore the volcanic origins and geological features.', xp: 22, effort: 'high', verify_type: 'quiz' },
    { id: 'q-ank-018', mode: 'ancestra', title: 'Postcard Memory Maker', description: 'Create artistic postcard showcasing island beauty.', xp: 8, effort: 'low', verify_type: 'photo' },
    { id: 'q-ank-019', mode: 'ancestra', title: 'Currency & Trade History', description: 'Learn about economic development and currency evolution.', xp: 11, effort: 'medium', verify_type: 'quiz' },
    { id: 'q-ank-020', mode: 'ancestra', title: 'Language Heritage Study', description: 'Explore linguistic influences and dialectical evolution.', xp: 19, effort: 'high', verify_type: 'text' },
  ],
  guardian: [
    { id: 'q-gdn-001', mode: 'guardian', title: 'Emergency Contacts Master', description: "Read emergency contact information and confirm understanding.", xp: 7, effort: 'low', verify_type: 'download' },
    { id: 'q-gdn-002', mode: 'guardian', title: 'Beach Safety Briefing', description: 'Complete beach rules orientation and safety quiz.', xp: 6, effort: 'low', verify_type: 'quiz' },
    { id: 'q-gdn-003', mode: 'guardian', title: 'Legal Age Verification', description: 'Understand local laws regarding age restrictions and ID requirements.', xp: 5, effort: 'low', verify_type: 'one-tap' },
    { id: 'q-gdn-004', mode: 'guardian', title: 'Drone Operation Guidelines', description: 'Learn visitor drone restrictions and registration requirements.', xp: 8, effort: 'low', verify_type: 'quiz' },
    { id: 'q-gdn-005', mode: 'guardian', title: 'Cultural Respect Pledge', description: 'Commit to respectful tourism practices and cultural sensitivity.', xp: 4, effort: 'low', verify_type: 'one-tap' },
    { id: 'q-gdn-006', mode: 'guardian', title: 'Emergency Response Drill', description: 'Practice emergency procedures and evacuation routes.', xp: 12, effort: 'medium', verify_type: 'quiz' },
    { id: 'q-gdn-007', mode: 'guardian', title: 'Local Law Primer', description: 'Study essential legal information for visitors.', xp: 10, effort: 'medium', verify_type: 'download' },
    { id: 'q-gdn-008', mode: 'guardian', title: 'Water Safety Certification', description: 'Complete swimming and water activity safety course.', xp: 15, effort: 'medium', verify_type: 'quiz' },
    { id: 'q-gdn-009', mode: 'guardian', title: 'Health Advisory Update', description: 'Review current health recommendations and precautions.', xp: 9, effort: 'low', verify_type: 'quiz' },
    { id: 'q-gdn-010', mode: 'guardian', title: 'Hazard Reporting System', description: 'Learn to identify and report potential safety hazards.', xp: 11, effort: 'medium', verify_type: 'qr' },
    { id: 'q-gdn-011', mode: 'guardian', title: 'Weather Alert Setup', description: 'Configure weather monitoring and alert systems.', xp: 8, effort: 'low', verify_type: 'one-tap' },
    { id: 'q-gdn-012', mode: 'guardian', title: 'Transportation Safety Guide', description: 'Learn safe practices for local transportation options.', xp: 13, effort: 'medium', verify_type: 'quiz' },
    { id: 'q-gdn-013', mode: 'guardian', title: 'Wildlife Interaction Protocol', description: 'Understand safe wildlife viewing and interaction guidelines.', xp: 16, effort: 'medium', verify_type: 'quiz' },
    { id: 'q-gdn-014', mode: 'guardian', title: 'Fire Safety Awareness', description: 'Complete fire prevention and response training module.', xp: 14, effort: 'medium', verify_type: 'quiz' },
    { id: 'q-gdn-015', mode: 'guardian', title: 'Medical Emergency Preparedness', description: 'Learn first aid basics and emergency medical procedures.', xp: 20, effort: 'high', verify_type: 'quiz' },
    { id: 'q-gdn-016', mode: 'guardian', title: 'Scam Prevention Workshop', description: 'Identify and avoid common tourist scams and frauds.', xp: 12, effort: 'medium', verify_type: 'quiz' },
    { id: 'q-gdn-017', mode: 'guardian', title: 'Personal Security Assessment', description: 'Evaluate and improve personal safety practices.', xp: 18, effort: 'high', verify_type: 'text' },
    { id: 'q-gdn-018', mode: 'guardian', title: 'Communication Emergency Plan', description: 'Establish reliable communication channels for emergencies.', xp: 15, effort: 'medium', verify_type: 'one-tap' },
    { id: 'q-gdn-019', mode: 'guardian', title: 'Insurance Verification', description: 'Confirm adequate travel and health insurance coverage.', xp: 7, effort: 'low', verify_type: 'download' },
    { id: 'q-gdn-020', mode: 'guardian', title: 'Natural Disaster Readiness', description: 'Prepare for hurricane season and natural emergencies.', xp: 25, effort: 'high', verify_type: 'quiz' },
  ]
};

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 750, 1050, 1400, 1800, 2250, 2750, 3300, 3900, 4550, 5250];

function getLevelFromXp(xp: number) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

function getXpForNextLevel(currentXp: number) {
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (currentXp < LEVEL_THRESHOLDS[i]) return LEVEL_THRESHOLDS[i] - currentXp;
  }
  return 0;
}

function getProgressPercentage(currentXp: number, level: number) {
  if (level >= LEVEL_THRESHOLDS.length) return 100;
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return Math.min(100, ((currentXp - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
}

function getRankFromStreak(streak: number) {
  if (streak >= 100) return 'Legendary Explorer';
  if (streak >= 50) return 'Master Explorer';
  if (streak >= 30) return 'Expert Explorer';
  if (streak >= 21) return 'Advanced Explorer';
  if (streak >= 14) return 'Seasoned Explorer';
  if (streak >= 7) return 'Apprentice Explorer';
  return 'Novice Explorer';
}

const getVerifyIcon = (verifyType: string) => {
  const icons = {
    photo: Camera,
    audio: Mic,
    video: Camera,
    download: Download,
    quiz: BookOpen,
    qr: QrCode,
    'one-tap': Check,
    text: BookOpen
  };
  return icons[verifyType as keyof typeof icons] || Check;
};

// ==============================
// ENHANCED USER DATA SYSTEM
// ==============================
interface UserProfile {
  id: string;
  name: string;
  ancestra_xp: number;
  guardian_xp: number;
  streak: number;
  maxStreak: number;
  rank: string;
  badges: string[];
  joinDate: string;
  lastActivity: string;
  completedQuests: string[];
  achievements: Achievement[];
  totalQuestsCompleted: number;
  averageQuestRating: number;
  preferredMode: 'ancestra' | 'guardian';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface LeaderboardEntry {
  rank: number;
  user: UserProfile;
  totalXp: number;
  streakDays: number;
}

// Mock leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, user: { id: '1', name: 'Explorer Alex', ancestra_xp: 2850, guardian_xp: 1950, streak: 45, maxStreak: 52, rank: 'Master Explorer', badges: [], joinDate: '2024-01-15', lastActivity: '2024-08-25', completedQuests: [], achievements: [], totalQuestsCompleted: 78, averageQuestRating: 4.8, preferredMode: 'ancestra' }, totalXp: 4800, streakDays: 45 },
  { rank: 2, user: { id: '2', name: 'Safety Sam', ancestra_xp: 1200, guardian_xp: 3200, streak: 38, maxStreak: 38, rank: 'Expert Explorer', badges: [], joinDate: '2024-02-01', lastActivity: '2024-08-25', completedQuests: [], achievements: [], totalQuestsCompleted: 65, averageQuestRating: 4.9, preferredMode: 'guardian' }, totalXp: 4400, streakDays: 38 },
  { rank: 3, user: { id: '3', name: 'Culture Queen', ancestra_xp: 3800, guardian_xp: 450, streak: 29, maxStreak: 31, rank: 'Expert Explorer', badges: [], joinDate: '2024-01-20', lastActivity: '2024-08-24', completedQuests: [], achievements: [], totalQuestsCompleted: 82, averageQuestRating: 4.7, preferredMode: 'ancestra' }, totalXp: 4250, streakDays: 29 },
  { rank: 4, user: { id: '4', name: 'Quest Master', ancestra_xp: 2100, guardian_xp: 1950, streak: 23, maxStreak: 28, rank: 'Advanced Explorer', badges: [], joinDate: '2024-03-10', lastActivity: '2024-08-25', completedQuests: [], achievements: [], totalQuestsCompleted: 58, averageQuestRating: 4.6, preferredMode: 'ancestra' }, totalXp: 4050, streakDays: 23 },
  { rank: 5, user: { id: '5', name: 'Island Hopper', ancestra_xp: 1800, guardian_xp: 2150, streak: 21, maxStreak: 21, rank: 'Advanced Explorer', badges: [], joinDate: '2024-02-28', lastActivity: '2024-08-23', completedQuests: [], achievements: [], totalQuestsCompleted: 61, averageQuestRating: 4.5, preferredMode: 'guardian' }, totalXp: 3950, streakDays: 21 },
];

// Mock achievements
const mockAchievements: Achievement[] = [
  { id: 'first-quest', title: 'First Steps', description: 'Complete your first quest', icon: '🎯', unlockedAt: '2024-08-20', rarity: 'common' },
  { id: 'week-streak', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', unlockedAt: '2024-08-22', rarity: 'rare' },
  { id: 'culture-expert', title: 'Culture Expert', description: 'Complete 20 Ancestra quests', icon: '🏛️', unlockedAt: '2024-08-24', rarity: 'epic' },
];

// ==============================
// THEMED COMPONENTS
// ==============================
const getThemeStyles = (mode: 'ancestra' | 'guardian', theme: any) => {
  if (mode === 'ancestra') {
    return {
      background: theme.bgGradient || 'linear-gradient(135deg, #fffbeb 0%, #fde68a 25%, #fca5a5 50%, #7dd3fc 75%, #0ea5e9 100%)',
      cardBg: '#F1EADF',
      primary: '#dc2626',
      secondary: '#0ea5e9',
      text: '#451a03',
      accent: '#C1A455',
      border: '#5E0B15',
      fontFamily: 'Lora, serif',
      borderRadius: '4px'
    };
  } else {
    return {
      background: theme.bgGradient || 'linear-gradient(135deg, #F0F4F8 0%, #E1E8ED 30%, #D6E3F0 60%, #B8CCE0 100%)',
      cardBg: '#F7F9FC',
      primary: '#2563eb',
      secondary: '#64748b',
      text: '#212B36',
      accent: '#00B8D4',
      border: '#A9B4C2',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '8px'
    };
  }
};

const ThemedCard = ({ children, mode, theme, className = "", onClick, isClickable = false }: { 
  children: React.ReactNode, 
  mode: 'ancestra' | 'guardian', 
  theme: any,
  className?: string,
  onClick?: () => void,
  isClickable?: boolean
}) => {
  const styles = getThemeStyles(mode, theme);
  
  const cardStyle = {
    background: styles.cardBg,
    borderLeft: mode === 'ancestra' ? `4px solid ${styles.border}` : `2px solid ${styles.accent}`,
    borderRadius: styles.borderRadius,
    boxShadow: mode === 'ancestra' 
      ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: styles.fontFamily,
    transition: 'all 250ms ease-out',
    cursor: isClickable ? 'pointer' : 'default'
  };

  return (
    <div 
      className={`p-6 hover:-translate-y-1 hover:shadow-lg ${isClickable ? 'hover:scale-[1.02]' : ''} ${className}`}
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (mode === 'guardian') {
          e.currentTarget.style.borderLeftColor = styles.accent;
          e.currentTarget.style.boxShadow = `0 0 20px rgba(0, 184, 212, 0.3)`;
        } else {
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (mode === 'guardian') {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        } else {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }
      }}
    >
      {children}
    </div>
  );
};

const ThemedButton = ({ children, mode, theme, variant = 'primary', onClick, disabled = false, className = "", size = 'md' }: { 
  children: React.ReactNode, 
  mode: 'ancestra' | 'guardian',
  theme: any,
  variant?: 'primary' | 'secondary', 
  onClick?: () => void,
  disabled?: boolean,
  className?: string,
  size?: 'sm' | 'md' | 'lg'
}) => {
  const styles = getThemeStyles(mode, theme);
  const padding = size === 'lg' ? '12px 24px' : size === 'sm' ? '6px 12px' : '10px 20px';
  
  const buttonStyle = {
    background: variant === 'primary' ? styles.primary : styles.secondary,
    color: '#ffffff',
    border: 'none',
    borderRadius: styles.borderRadius,
    padding,
    fontFamily: styles.fontFamily,
    fontWeight: '600',
    transition: 'all 200ms ease-in-out',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transform: 'scale(1)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  return (
    <button
      className={className}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (mode === 'guardian') {
            e.currentTarget.style.transform = 'scale(0.98)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
          } else {
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = mode === 'ancestra' ? 'translateY(1px)' : 'scale(0.95)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
    >
      {children}
    </button>
  );
};

const ThemedProgress = ({ current, total, mode, theme }: { current: number, total: number, mode: 'ancestra' | 'guardian', theme: any }) => {
  const styles = getThemeStyles(mode, theme);
  const percentage = Math.min(100, (current / total) * 100);

  const trackStyle = {
    width: '100%',
    height: mode === 'ancestra' ? '12px' : '8px',
    background: mode === 'ancestra' ? 'rgba(94, 11, 21, 0.2)' : '#E8F4F8',
    borderRadius: styles.borderRadius,
    position: 'relative' as const,
    overflow: 'hidden'
  };

  const fillStyle = {
    height: '100%',
    width: `${percentage}%`,
    background: mode === 'ancestra' 
      ? 'linear-gradient(90deg, #C1A455 0%, #D4B76A 50%, #C1A455 100%)'
      : styles.accent,
    borderRadius: styles.borderRadius,
    transition: 'width 500ms ease-out',
    position: 'relative' as const,
    animation: mode === 'ancestra' ? 'shimmer 2s infinite' : 'none'
  };

  return (
    <div style={trackStyle}>
      <div style={fillStyle} />
    </div>
  );
};

// ==============================
// PROFILE SECTION COMPONENT
// ==============================
const ProfileSection = ({ user, mode, theme }: { user: UserProfile, mode: 'ancestra' | 'guardian', theme: any }) => {
  const styles = getThemeStyles(mode, theme);
  const totalXp = user.ancestra_xp + user.guardian_xp;
  const level = getLevelFromXp(totalXp);
  
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <ThemedCard mode={mode} theme={theme} className="text-center">
        <div className="space-y-4">
          <div 
            className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-4xl text-white font-bold shadow-xl"
            style={{ background: `linear-gradient(135deg, ${styles.primary}, ${styles.secondary})` }}
          >
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: styles.text, fontFamily: styles.fontFamily }}>
              {user.name}
            </h2>
            <p className="text-lg" style={{ color: styles.primary }}>{user.rank}</p>
            <p className="text-sm opacity-70" style={{ color: styles.text }}>
              Level {level} Explorer • Joined {new Date(user.joinDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </ThemedCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ThemedCard mode={mode} theme={theme} className="text-center p-4">
          <div className="space-y-2">
            <Flame className="w-8 h-8 mx-auto" style={{ color: styles.primary }} />
            <div className="text-2xl font-bold" style={{ color: styles.text }}>{user.streak}</div>
            <div className="text-sm" style={{ color: styles.text, opacity: 0.7 }}>Current Streak</div>
          </div>
        </ThemedCard>
        
        <ThemedCard mode={mode} theme={theme} className="text-center p-4">
          <div className="space-y-2">
            <Target className="w-8 h-8 mx-auto" style={{ color: styles.accent }} />
            <div className="text-2xl font-bold" style={{ color: styles.text }}>{user.totalQuestsCompleted}</div>
            <div className="text-sm" style={{ color: styles.text, opacity: 0.7 }}>Quests Done</div>
          </div>
        </ThemedCard>
        
        <ThemedCard mode={mode} theme={theme} className="text-center p-4">
          <div className="space-y-2">
            <Star className="w-8 h-8 mx-auto" style={{ color: '#fbbf24' }} />
            <div className="text-2xl font-bold" style={{ color: styles.text }}>{totalXp.toLocaleString()}</div>
            <div className="text-sm" style={{ color: styles.text, opacity: 0.7 }}>Total XP</div>
          </div>
        </ThemedCard>
        
        <ThemedCard mode={mode} theme={theme} className="text-center p-4">
          <div className="space-y-2">
            <Award className="w-8 h-8 mx-auto" style={{ color: '#8b5cf6' }} />
            <div className="text-2xl font-bold" style={{ color: styles.text }}>{user.achievements.length}</div>
            <div className="text-sm" style={{ color: styles.text, opacity: 0.7 }}>Achievements</div>
          </div>
        </ThemedCard>
      </div>

      {/* Achievements Section */}
      <ThemedCard mode={mode} theme={theme}>
        <h3 className="text-xl font-bold mb-4" style={{ color: styles.text, fontFamily: styles.fontFamily }}>
          Recent Achievements
        </h3>
        <div className="space-y-3">
          {mockAchievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-4 p-3 rounded-lg" 
                 style={{ backgroundColor: `${styles.primary}10` }}>
              <div className="text-3xl">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold" style={{ color: styles.text }}>{achievement.title}</h4>
                <p className="text-sm" style={{ color: styles.text, opacity: 0.7 }}>{achievement.description}</p>
              </div>
              <div className="text-xs px-2 py-1 rounded-full" 
                   style={{ 
                     backgroundColor: achievement.rarity === 'legendary' ? '#fbbf24' : 
                                      achievement.rarity === 'epic' ? '#8b5cf6' : 
                                      achievement.rarity === 'rare' ? '#3b82f6' : '#10b981',
                     color: 'white'
                   }}>
                {achievement.rarity}
              </div>
            </div>
          ))}
        </div>
      </ThemedCard>

      {/* Progress Chart */}
      <ThemedCard mode={mode} theme={theme}>
        <h3 className="text-xl font-bold mb-4" style={{ color: styles.text, fontFamily: styles.fontFamily }}>
          Mode Progress
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium" style={{ color: styles.text }}>
                🏛️ Ancestra ({user.ancestra_xp} XP)
              </span>
              <span className="text-sm" style={{ color: styles.text, opacity: 0.7 }}>
                Level {getLevelFromXp(user.ancestra_xp)}
              </span>
            </div>
            <ThemedProgress current={user.ancestra_xp} total={Math.max(user.ancestra_xp, 1000)} mode={mode} theme={theme} />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium" style={{ color: styles.text }}>
                🛡️ Guardian ({user.guardian_xp} XP)
              </span>
              <span className="text-sm" style={{ color: styles.text, opacity: 0.7 }}>
                Level {getLevelFromXp(user.guardian_xp)}
              </span>
            </div>
            <ThemedProgress current={user.guardian_xp} total={Math.max(user.guardian_xp, 1000)} mode={mode} theme={theme} />
          </div>
        </div>
      </ThemedCard>
    </div>
  );
};

// ==============================
// LEADERBOARD COMPONENT
// ==============================
const LeaderboardSection = ({ mode, theme }: { mode: 'ancestra' | 'guardian', theme: any }) => {
  const styles = getThemeStyles(mode, theme);
  
  return (
    <div className="space-y-6">
      <ThemedCard mode={mode} theme={theme}>
        <div className="flex items-center gap-3 mb-6">
          <Crown className="w-8 h-8" style={{ color: styles.primary }} />
          <h2 className="text-2xl font-bold" style={{ color: styles.text, fontFamily: styles.fontFamily }}>
            Global Leaderboard
          </h2>
        </div>
        
        <div className="space-y-3">
          {mockLeaderboard.map((entry, index) => (
            <div 
              key={entry.user.id}
              className="flex items-center gap-4 p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]"
              style={{ 
                backgroundColor: index < 3 ? `${styles.primary}15` : `${styles.primary}08`,
                border: index < 3 ? `2px solid ${styles.primary}30` : `1px solid ${styles.border}20`
              }}
            >
              {/* Rank */}
              <div className="flex-shrink-0">
                {index === 0 && <Crown className="w-8 h-8 text-yellow-500" />}
                {index === 1 && <Medal className="w-8 h-8 text-gray-400" />}
                {index === 2 && <Medal className="w-8 h-8 text-amber-600" />}
                {index > 2 && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg"
                       style={{ backgroundColor: styles.primary, color: 'white' }}>
                    {entry.rank}
                  </div>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h3 className="font-bold text-lg" style={{ color: styles.text }}>
                  {entry.user.name}
                </h3>
                <p className="text-sm" style={{ color: styles.text, opacity: 0.7 }}>
                  {entry.user.rank} • {entry.totalXp.toLocaleString()} XP
                </p>
              </div>
              
              {/* Stats */}
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4" style={{ color: styles.accent }} />
                  <span className="font-bold" style={{ color: styles.text }}>{entry.streakDays}</span>
                </div>
                <div className="text-xs" style={{ color: styles.text, opacity: 0.7 }}>
                  {entry.user.totalQuestsCompleted} quests
                </div>
              </div>
            </div>
          ))}
        </div>
      </ThemedCard>
      
      {/* Your Ranking */}
      <ThemedCard mode={mode} theme={theme}>
        <div className="text-center space-y-4">
          <TrendingUp className="w-12 h-12 mx-auto" style={{ color: styles.accent }} />
          <div>
            <h3 className="text-xl font-bold" style={{ color: styles.text }}>Your Current Rank</h3>
            <p className="text-3xl font-bold" style={{ color: styles.primary }}>#47</p>
            <p className="text-sm" style={{ color: styles.text, opacity: 0.7 }}>
              Keep questing to climb higher!
            </p>
          </div>
        </div>
      </ThemedCard>
    </div>
  );
};

// ==============================
// QUEST CARD COMPONENT
// ==============================
const QuestCard = ({ quest, onAccept, onComplete, personality, mode, theme }: any) => {
  const [status, setStatus] = useState('available');
  const [verification, setVerification] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const styles = getThemeStyles(mode, theme);

  const VerifyIcon = getVerifyIcon(quest.verify_type);

  const handleAccept = async () => {
    setStatus('accepted');
    await onAccept(quest.id);
  };

  const handleStartComplete = () => {
    setStatus('completing');
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      const result = await onComplete(quest.id, verification, mode);
      if (result.ok) {
        setStatus('completed');
        setTimeout(() => {
          setStatus('available');
        }, 3000);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const getPersonalizedDescription = () => {
    const persona = personalities[personality as keyof typeof personalities];
    switch (personality) {
      case 'genZ':
        return `${quest.title} - fr no cap, this is giving main character energy! +${quest.xp} XP bestie ✨`;
      case 'dialect':
        return `Come ya! ${quest.title} - dis one sweet like sugar cake. Ya go get +${quest.xp} XP fi true!`;
      case 'teen':
        return `${quest.title} is totally cool! Snag +${quest.xp} XP and level up your game 😎`;
      case 'infant':
        return `Sweet little explorer, ${quest.title} will give you +${quest.xp} XP. Take your time! 👶`;
      default:
        return `${quest.description} (+${quest.xp} XP)`;
    }
  };

  return (
    <ThemedCard mode={mode} theme={theme} className="hover:scale-[1.02] transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold flex items-center gap-2 mb-2" style={{ 
            fontFamily: styles.fontFamily,
            color: styles.text,
            fontSize: '18px'
          }}>
            <VerifyIcon className="w-5 h-5" style={{ color: styles.primary }} />
            {quest.title}
            {personalities[personality as keyof typeof personalities]?.emoji}
          </h3>
          <p className="text-sm leading-relaxed" style={{ 
            color: styles.text,
            opacity: 0.8,
            fontFamily: styles.fontFamily
          }}>
            {getPersonalizedDescription()}
          </p>
        </div>
        <div className="flex flex-col items-end ml-4">
          <span className="text-2xl font-bold" style={{ color: styles.accent }}>
            +{quest.xp}
          </span>
          <span className="text-xs" style={{ color: styles.text, opacity: 0.6 }}>XP</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
            quest.effort === 'low' ? 'bg-green-100 text-green-700' :
            quest.effort === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {quest.effort} effort
          </span>
          <span className="text-xs px-2 py-1 rounded-full" 
                style={{ backgroundColor: `${styles.secondary}20`, color: styles.text }}>
            {quest.verify_type}
          </span>
        </div>

        <div className="flex gap-2">
          {status === 'available' && (
            <ThemedButton mode={mode} theme={theme} onClick={handleAccept} size="sm">
              Accept Quest
            </ThemedButton>
          )}

          {status === 'accepted' && (
            <ThemedButton mode={mode} theme={theme} variant="secondary" onClick={handleStartComplete} size="sm">
              Start
            </ThemedButton>
          )}

          {status === 'completing' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                {quest.verify_type === 'quiz' && (
                  <input
                    type="text"
                    placeholder="Your answer..."
                    className="px-3 py-2 border rounded text-sm flex-1"
                    style={{ 
                      borderRadius: styles.borderRadius,
                      borderColor: styles.border,
                      fontFamily: styles.fontFamily
                    }}
                    onChange={(e) => setVerification({answers: [e.target.value]})}
                  />
                )}
                {quest.verify_type === 'text' && (
                  <input
                    type="text"
                    placeholder="Enter response..."
                    className="px-3 py-2 border rounded text-sm flex-1"
                    style={{ 
                      borderRadius: styles.borderRadius,
                      borderColor: styles.border,
                      fontFamily: styles.fontFamily
                    }}
                    onChange={(e) => setVerification({text: e.target.value})}
                  />
                )}
                {quest.verify_type === 'photo' && (
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm flex-1"
                    onChange={() => setVerification({uploadToken: 'mock-photo'})}
                  />
                )}
                {quest.verify_type === 'audio' && (
                  <ThemedButton mode={mode} theme={theme} onClick={() => setVerification({uploadToken: 'mock-audio'})} size="sm">
                    🎤 Record
                  </ThemedButton>
                )}
                {quest.verify_type === 'one-tap' && (
                  <ThemedButton mode={mode} theme={theme} onClick={() => setVerification({confirmed: true})} size="sm">
                    ✓ Confirm
                  </ThemedButton>
                )}
              </div>
              <ThemedButton 
                mode={mode} 
                theme={theme}
                onClick={handleComplete} 
                disabled={isProcessing}
                size="sm"
              >
                {isProcessing ? 'Completing...' : 'Complete Quest'}
              </ThemedButton>
            </div>
          )}

          {status === 'completed' && (
            <div className="flex items-center animate-pulse" style={{ color: '#10b981' }}>
              <Check className="w-5 h-5 mr-2" />
              <span className="font-medium">Completed!</span>
            </div>
          )}
        </div>
      </div>
    </ThemedCard>
  );
};

// ==============================
// MAIN QUEST SYSTEM COMPONENT
// ==============================
interface QuestSystemProps {
  isOpen: boolean;
  onClose: () => void;
  activeMode: 'ancestra' | 'guardian';
  personality: string;
  theme: any;
}

export default function QuestSystem({ isOpen, onClose, activeMode, personality, theme }: QuestSystemProps) {
  const [user, setUser] = useState<UserProfile>({
    id: '1',
    name: 'Tourist Explorer',
    ancestra_xp: 185,
    guardian_xp: 92,
    streak: 0, // Start from zero as requested
    maxStreak: 0,
    rank: 'Novice Explorer',
    badges: ['welcome-wanderer'],
    joinDate: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    completedQuests: [],
    achievements: [],
    totalQuestsCompleted: 0,
    averageQuestRating: 0,
    preferredMode: activeMode
  });

  const [activeTab, setActiveTab] = useState('quests');
  const [sortBy, setSortBy] = useState('xp');
  const [filterEffort, setFilterEffort] = useState('all');
  const [loading, setLoading] = useState(false);
  const [xpAnimation, setXpAnimation] = useState<any>(null);
  const styles = getThemeStyles(activeMode, theme);

  const handleAcceptQuest = async (questId: string) => {
    return { ok: true };
  };

  const handleCompleteQuest = async (questId: string, verification: any, mode: string) => {
    const quest = allQuests[mode as keyof typeof allQuests].find(q => q.id === questId);
    if (!quest) return { ok: false };

    const xpAwarded = quest.xp + Math.floor(Math.random() * 5);
    const newXpTotal = user[`${mode}_xp` as keyof UserProfile] as number + xpAwarded;
    const newLevel = getLevelFromXp(newXpTotal);

    // Update streak system - increment by 1 for each completed quest
    const newStreak = user.streak + 1;
    const newMaxStreak = Math.max(user.maxStreak, newStreak);

    setUser(prev => ({
      ...prev,
      [`${mode}_xp`]: newXpTotal,
      streak: newStreak,
      maxStreak: newMaxStreak,
      rank: getRankFromStreak(newStreak),
      totalQuestsCompleted: prev.totalQuestsCompleted + 1,
      completedQuests: [...prev.completedQuests, questId],
      lastActivity: new Date().toISOString()
    }));

    setXpAnimation({ xp: xpAwarded, show: true });
    setTimeout(() => setXpAnimation(null), 3000);

    return { ok: true, xpAwarded, newXpTotal, newLevel };
  };

  const questList = allQuests[activeMode] || [];
  const filteredAndSortedQuests = questList
    .filter(quest => filterEffort === 'all' || quest.effort === filterEffort)
    .sort((a, b) => {
      switch (sortBy) {
        case 'xp': return b.xp - a.xp;
        case 'effort':
          const effortOrder = { low: 1, medium: 2, high: 3 };
          return effortOrder[a.effort as keyof typeof effortOrder] - effortOrder[b.effort as keyof typeof effortOrder];
        case 'type': return a.verify_type.localeCompare(b.verify_type);
        default: return 0;
      }
    });

  const questsByXP = {
    high: filteredAndSortedQuests.filter(q => q.xp >= 15),
    medium: filteredAndSortedQuests.filter(q => q.xp >= 8 && q.xp < 15),
    low: filteredAndSortedQuests.filter(q => q.xp < 8)
  };

  if (!isOpen) return null;

  return (
    <>
      {/* XP Animation Overlay */}
      {xpAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] pointer-events-none">
          <div 
            className="rounded-lg p-8 text-center animate-bounce shadow-2xl transform scale-110"
            style={{
              background: styles.cardBg,
              color: styles.text,
              fontFamily: styles.fontFamily,
              borderRadius: styles.borderRadius
            }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-4xl font-bold mb-3" style={{ color: styles.accent }}>
              +{xpAnimation.xp} XP
            </div>
            <div className="text-lg font-semibold mb-2">Quest Completed!</div>
            <div className="text-sm opacity-70">
              Streak: {user.streak} • Keep going! 🔥
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Quest System */}
      <div 
        className="fixed inset-0 z-[60] animate-fade-in"
        style={{ background: styles.background }}
      >
        {/* Header */}
        <div 
          className="h-20 border-b-2 flex items-center justify-between px-8 shadow-lg animate-slide-in"
          style={{ 
            backgroundColor: styles.cardBg,
            borderColor: styles.border,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex items-center gap-4">
            {activeMode === 'ancestra' ? (
              <Scroll className="w-10 h-10" style={{ color: styles.accent }} />
            ) : (
              <Shield className="w-10 h-10" style={{ color: styles.accent }} />
            )}
            <div>
              <h1 className="text-3xl font-bold" style={{ 
                color: styles.text,
                fontFamily: styles.fontFamily
              }}>
                {activeMode === 'ancestra' ? 'Chronicler\'s Legacy' : 'Guardian\'s Journey'}
              </h1>
              <p className="text-sm opacity-70" style={{ color: styles.text }}>
                {personalities[personality as keyof typeof personalities]?.emoji} {modes[activeMode].description}
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5" style={{ color: styles.primary }} />
              <span className="font-bold text-xl" style={{ color: styles.text }}>{user.streak}</span>
              <span className="text-sm opacity-70" style={{ color: styles.text }}>streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" style={{ color: styles.accent }} />
              <span className="font-bold text-xl" style={{ color: styles.text }}>
                {(user.ancestra_xp + user.guardian_xp).toLocaleString()}
              </span>
              <span className="text-sm opacity-70" style={{ color: styles.text }}>XP</span>
            </div>
            <ThemedButton mode={activeMode} theme={theme} onClick={onClose} variant="secondary">
              Close
            </ThemedButton>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Sidebar Navigation */}
          <div 
            className="w-64 border-r-2 p-6 animate-slide-in"
            style={{ 
              backgroundColor: styles.cardBg,
              borderColor: styles.border
            }}
          >
            <nav className="space-y-2">
              {[
                { id: 'quests', label: 'Quests', icon: Target },
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:scale-[1.02]`}
                  style={{
                    backgroundColor: activeTab === id ? `${styles.primary}20` : 'transparent',
                    color: activeTab === id ? styles.primary : styles.text,
                    fontFamily: styles.fontFamily,
                    borderRadius: styles.borderRadius
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              {activeTab === 'quests' && (
                <div className="space-y-8 animate-fade-in">
                  {/* Quest Controls */}
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium" style={{ 
                        color: styles.text,
                        fontFamily: styles.fontFamily
                      }}>
                        Sort by:
                      </label>
                      <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)} 
                        className="px-3 py-2 border rounded text-sm"
                        style={{
                          borderRadius: styles.borderRadius,
                          borderColor: styles.border,
                          fontFamily: styles.fontFamily,
                          backgroundColor: styles.cardBg
                        }}
                      >
                        <option value="xp">XP Reward</option>
                        <option value="effort">Effort Level</option>
                        <option value="type">Quest Type</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium" style={{ 
                        color: styles.text,
                        fontFamily: styles.fontFamily
                      }}>
                        Filter:
                      </label>
                      <select 
                        value={filterEffort} 
                        onChange={(e) => setFilterEffort(e.target.value)} 
                        className="px-3 py-2 border rounded text-sm"
                        style={{
                          borderRadius: styles.borderRadius,
                          borderColor: styles.border,
                          fontFamily: styles.fontFamily,
                          backgroundColor: styles.cardBg
                        }}
                      >
                        <option value="all">All Efforts</option>
                        <option value="low">Low Effort</option>
                        <option value="medium">Medium Effort</option>
                        <option value="high">High Effort</option>
                      </select>
                    </div>

                    <div className="ml-auto text-sm" style={{ 
                      color: styles.text,
                      opacity: 0.7,
                      fontFamily: styles.fontFamily
                    }}>
                      {filteredAndSortedQuests.length} quests available
                    </div>
                  </div>

                  {/* Quest Categories */}
                  <div className="space-y-8">
                    {questsByXP.high.length > 0 && (
                      <div>
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ 
                          color: styles.text,
                          fontFamily: styles.fontFamily
                        }}>
                          <Crown className="w-6 h-6" style={{ color: styles.accent }} />
                          Epic Quests (15+ XP)
                        </h3>
                        <div className="grid gap-6 md:grid-cols-2">
                          {questsByXP.high.map(quest => (
                            <QuestCard
                              key={quest.id}
                              quest={quest}
                              personality={personality}
                              mode={activeMode}
                              theme={theme}
                              onAccept={handleAcceptQuest}
                              onComplete={handleCompleteQuest}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {questsByXP.medium.length > 0 && (
                      <div>
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ 
                          color: styles.text,
                          fontFamily: styles.fontFamily
                        }}>
                          <Medal className="w-6 h-6" style={{ color: '#f59e0b' }} />
                          Adventure Quests (8-14 XP)
                        </h3>
                        <div className="grid gap-6 md:grid-cols-2">
                          {questsByXP.medium.map(quest => (
                            <QuestCard
                              key={quest.id}
                              quest={quest}
                              personality={personality}
                              mode={activeMode}
                              theme={theme}
                              onAccept={handleAcceptQuest}
                              onComplete={handleCompleteQuest}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {questsByXP.low.length > 0 && (
                      <div>
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ 
                          color: styles.text,
                          fontFamily: styles.fontFamily
                        }}>
                          <Zap className="w-6 h-6" style={{ color: '#10b981' }} />
                          Quick Quests (Under 8 XP)
                        </h3>
                        <div className="grid gap-6 md:grid-cols-2">
                          {questsByXP.low.map(quest => (
                            <QuestCard
                              key={quest.id}
                              quest={quest}
                              personality={personality}
                              mode={activeMode}
                              theme={theme}
                              onAccept={handleAcceptQuest}
                              onComplete={handleCompleteQuest}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="animate-fade-in">
                  <ProfileSection user={user} mode={activeMode} theme={theme} />
                </div>
              )}

              {activeTab === 'leaderboard' && (
                <div className="animate-fade-in">
                  <LeaderboardSection mode={activeMode} theme={theme} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}