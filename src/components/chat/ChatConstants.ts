import { Globe, Brain, Map, AlertTriangle, Info, Target, BookOpen, Sparkles, Coffee, Shield, Phone, MapPin, Heart, Scroll } from "lucide-react";

// ==============================
// QUICKSTART BUTTON CONFIGURATIONS
// ==============================
export const getQuickstartButtons = (currentPersona: string, activeQuestCount: number) => {
  if (currentPersona === 'Ancestra') {
    return [
      { icon: <Globe className="w-4 h-4" />, text: "What is the history of St. Kitts?" },
      { icon: <Brain className="w-4 h-4" />, text: "What local foods should I try?" },
      { icon: <Map className="w-4 h-4" />, text: "Tell me about the culture and festivals" }
    ];
  } else if (currentPersona === 'The Guardian') {
    return [
      { icon: <Shield className="w-4 h-4" />, text: "Is St. Kitts safe for tourists?" },
      { icon: <AlertTriangle className="w-4 h-4" />, text: "What are some safety tips?" },
      { icon: <Info className="w-4 h-4" />, text: "Emergency contacts and health info" }
    ];
  } else {
    // Default quickstart buttons for specialized personas
    return [
      { icon: <Globe className="w-4 h-4" />, text: "What can you help me with?" },
      { icon: <Brain className="w-4 h-4" />, text: "Tell me about your expertise" },
      { icon: <Map className="w-4 h-4" />, text: "What makes you unique?" }
    ];
  }
};

// ==============================
// SIDEBAR NAVIGATION ITEMS
// ==============================
export const getSidebarNavItems = (currentPersona: string, activeQuestCount: number) => {
  const baseItems = [
    {
      icon: <Sparkles className="w-4 h-4" />,
      label: "Command Palette",
      action: "command-palette"
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: "Interactive Map",
      action: "map"
    },
    {
      icon: <Globe className="w-4 h-4" />,
      label: "Discovery Hub",
      action: "discovery"
    }
  ];

  // Add persona-specific quest buttons
  if (currentPersona === 'Ancestra') {
    baseItems.push({
      icon: <Scroll className="w-4 h-4" />,
      label: "Chronicler's Legacy",
      action: "quest",
      isQuest: true,
      questType: "ancestra",
      subtitle: "Heritage & Cultural Quests",
      activeCount: activeQuestCount,
      gradient: "from-coral-400 to-pink-400",
      hoverGradient: "from-coral-500 to-pink-500",
      emoji: "🏛️"
    });
  } else if (currentPersona === 'The Guardian') {
    baseItems.push({
      icon: <Shield className="w-4 h-4" />,
      label: "Guardian's Journey",
      action: "quest",
      isQuest: true,
      questType: "guardian",
      subtitle: "Safety & Security Quests",
      activeCount: activeQuestCount,
      gradient: "from-police-500 to-tactical-500",
      hoverGradient: "from-police-600 to-tactical-600",
      emoji: "🛡️"
    });
  }

  return baseItems;
};

// ==============================
// FEATURE ICONS FOR BULLET POINTS
// ==============================
export const getFeatureIcons = (index: number, persona: string) => {
  if (persona === 'Ancestra') {
    const icons = [
      <BookOpen className="w-5 h-5 text-white" />,
      <Sparkles className="w-5 h-5 text-white" />,
      <Map className="w-5 h-5 text-white" />,
      <Coffee className="w-5 h-5 text-white" />
    ];
    return icons[index] || <BookOpen className="w-5 h-5 text-white" />;
  } else if (persona === 'The Guardian') {
    const icons = [
      <Shield className="w-5 h-5 text-white" />,
      <Phone className="w-5 h-5 text-white" />,
      <MapPin className="w-5 h-5 text-white" />,
      <Heart className="w-5 h-5 text-white" />
    ];
    return icons[index] || <Shield className="w-5 h-5 text-white" />;
  }
  return <BookOpen className="w-5 h-5 text-white" />;
};

// ==============================
// COMMAND PALETTE COMMANDS
// ==============================
export const getChatCommands = (handlers: any) => [
  { name: "New Chat", action: handlers.newChat },
  { name: "Toggle Dark Mode", action: handlers.toggleDarkMode },
  { name: "Change Persona", action: handlers.changePersona },
  { name: "Show History", action: handlers.toggleHistory },
  { name: "Open Map", action: handlers.openMap },
  { name: "Open Discovery", action: handlers.openDiscovery },
  { name: "Quest Dashboard", action: handlers.openQuest },
  { name: "Go to Homepage", action: handlers.goToHomepage },
  { name: "Settings", action: handlers.openSettings }
];

// ==============================
// ANIMATION TIMING CONSTANTS
// ==============================
export const ANIMATION_DELAYS = {
  WAVE_INTERVAL: 100,
  FLOATING_INTERVAL: 80,
  EMOTION_CLEAR_DELAY: 3000,
  WELCOME_HIDE_DELAY: 4000,
  TYPING_SIMULATION_DELAY: 2000
};

// ==============================
// CHAT CONFIGURATION
// ==============================
export const CHAT_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_FILE_TYPES: "image/*,audio/*,.pdf,.doc,.docx,.txt",
  MIN_TEXT_LENGTH: 100,
  AUTO_SCROLL_BEHAVIOR: 'smooth' as ScrollBehavior,
  TRANSLATION_RETRY_ATTEMPTS: 3
};

// ==============================
// PERSONA COLORS AND THEMES
// ==============================
export const getPersonaColors = (currentPersona: string) => {
  if (currentPersona === 'Ancestra') {
    return { from: 'from-coral-400', via: 'via-pink-400', to: 'to-coral-500' };
  } else if (currentPersona === 'The Guardian') {
    return { from: 'from-ocean-400', via: 'via-blue-500', to: 'to-teal-500' };
  } else {
    // Default colors for specialized personas
    return { from: 'from-primary', via: 'via-secondary', to: 'to-primary' };
  }
};

// ==============================
// EMOTION INDICATORS
// ==============================
export const EMOTION_MESSAGES = {
  sad: '💔 Speaking softly and gently.',
  happy: '🎉 Joy detected! Let\'s celebrate!',
  angry: '😤 You seem upset, let\'s take it easy.',
  playful: '😂 LOL! You sound like a whole mood!',
  default: ''
};

// ==============================
// ERROR MESSAGES
// ==============================
export const ERROR_MESSAGES = {
  API_KEY_REQUIRED: "🔑 I need a Google Gemini API key to provide AI-powered responses. Please go to Settings → API tab to set up your free API key. I can still help with basic information about St. Kitts & Nevis!",
  SERVICE_BUSY: "🚧 The AI service is temporarily busy. Please wait a moment and try again!",
  NETWORK_ERROR: "🔌 Having trouble connecting to the AI service. Please check your connection and try again.",
  GENERIC_ERROR: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment!",
  LOCATION_DENIED: "Location access denied. Some quest features may be limited."
};