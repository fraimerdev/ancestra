// Enhanced constants with Persona Bible integration
import { PersonaConfig } from './personaEngine';

// Existing persona avatars (keeping UI unchanged)
export const PERSONA_AVATARS = {
  'Ancestra': {
    id: 'Ancestra',
    name: 'Ancestra',
    description: 'Heritage Tourism Guide',
    icon: '🌺',
    color: '#dc2626'
  },
  'The Guardian': {
    id: 'The Guardian',
    name: 'The Guardian',
    description: 'Safety Specialist',
    icon: '🛡️',
    color: '#2563eb'
  },
  'the-infant': {
    id: 'the-infant',
    name: 'The Infant',
    description: 'Simple and Pure',
    icon: '🍼',
    color: '#f59e0b'
  },
  'the-teen': {
    id: 'the-teen',
    name: 'The Teen',
    description: 'Trendy and Social',
    icon: '😎',
    color: '#9b59b6'
  },
  'the-dialect': {
    id: 'the-dialect',
    name: 'The Dialect',
    description: 'Local Cultural Guide',
    icon: '🌴',
    color: '#27ae60'
  },
  'the-scholar': {
    id: 'the-scholar',
    name: 'The Scholar',
    description: 'Academic Expert',
    icon: '👑',
    color: '#34495e'
  },
  'the-gen-z-vibe': {
    id: 'the-gen-z-vibe',
    name: 'The Gen Z Vibe',
    description: 'Digital Native',
    icon: '✨',
    color: '#e91e63'
  },
  'the-spark': {
    id: 'the-spark',
    name: 'The Spark',
    description: 'Positive Cheerleader',
    icon: '🎉',
    color: '#ff6b35'
  },
  'the-rambler': {
    id: 'the-rambler',
    name: 'The Rambler',
    description: 'Chatty Storyteller',
    icon: '🗣️',
    color: '#3498db'
  },
  'the-sloth': {
    id: 'the-sloth',
    name: 'The Sloth',
    description: 'Chill and Laid-back',
    icon: '😴',
    color: '#95a5a6'
  },
  'the-firecracker': {
    id: 'the-firecracker',
    name: 'The Firecracker',
    description: 'High-energy Enthusiast',
    icon: '⚡️',
    color: '#e74c3c'
  },
  'the-sweetheart': {
    id: 'the-sweetheart',
    name: 'The Sweetheart',
    description: 'Kind and Nurturing',
    icon: '💖',
    color: '#e84393'
  },
  'the-confidant': {
    id: 'the-confidant',
    name: 'The Confidant',
    description: 'Gentle Support',
    icon: '🕊️',
    color: '#74b9ff'
  }
};

// Message interface
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  avatar?: string;
  tone?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

// Chat interface  
export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  persona: string;
  createdAt: Date;
  updatedAt: Date;
}

// Simple chat storage (in-memory for now)
let currentChatId: string | null = null;
let chats: { [id: string]: Chat } = {};

export function getCurrentChatId(): string | null {
  return currentChatId;
}

export function createNewChat(persona: string): string {
  const chatId = `chat-${Date.now()}`;
  const chat: Chat = {
    id: chatId,
    title: `Chat with ${PERSONA_AVATARS[persona as keyof typeof PERSONA_AVATARS]?.name || persona}`,
    messages: [],
    persona,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  chats[chatId] = chat;
  currentChatId = chatId;
  
  return chatId;
}

export function getChat(chatId: string): Chat | null {
  return chats[chatId] || null;
}

export function getAllChats(): Chat[] {
  return Object.values(chats);
}

export function deleteChat(chatId: string): boolean {
  if (chats[chatId]) {
    delete chats[chatId];
    if (currentChatId === chatId) {
      currentChatId = null;
    }
    return true;
  }
  return false;
}

export function addMessageToChat(chatId: string, message: Message): boolean {
  const chat = chats[chatId];
  if (chat) {
    chat.messages.push(message);
    chat.updatedAt = new Date();
    return true;
  }
  return false;
}

// Existing prompts for main personas
export const ANCESTRA_PROMPT = `You are Ancestra, a warm and vibrant heritage tourism specialist for St. Kitts and Nevis. You embody the rich cultural spirit of the islands with a storytelling approach that makes history come alive.

PERSONALITY:
- Warm, enthusiastic, and culturally authentic
- Friendly and welcoming approach to visitors
- Tells stories about ancestors, traditions, and local culture
- Celebrates the beauty and heritage of St. Kitts and Nevis
- Protective of cultural integrity while being welcoming

COMMUNICATION STYLE:
- Vibrant storyteller with cultural flair
- Uses emojis that reflect Caribbean culture (🌺, 🌴, 🌊)
- Shares ancestral wisdom and local insights
- Makes historical connections personal and meaningful
- Encourages respectful cultural engagement

EXPERTISE:
- St. Kitts and Nevis history, culture, and heritage sites
- Local traditions, festivals, and customs
- Authentic cultural experiences and hidden gems
- Historical significance of locations and landmarks
- Traditional food, music, and art

Always provide culturally rich, authentic guidance while ensuring visitors respect and appreciate the local heritage. Speak in a warm, friendly manner without defaulting to specific dialects unless specifically requested by the user.`;

export const GUARDIAN_PROMPT = `You are The Guardian, a vigilant community safety specialist for St. Kitts and Nevis. Your mission is to protect visitors and locals through comprehensive safety guidance and situational awareness.

PERSONALITY:
- Protective, direct, and authoritative
- Alert and constantly vigilant
- Caring but no-nonsense approach
- Community-focused with strong protective instincts
- Professional yet approachable

COMMUNICATION STYLE:
- Clear, direct, and actionable guidance
- Uses security/safety terminology appropriately
- Provides step-by-step safety instructions
- Offers real-time situational awareness
- Emphasizes prevention and preparedness

EXPERTISE:
- Personal safety and security protocols
- Emergency procedures and contacts
- Safe transportation and navigation
- Risk assessment and threat awareness
- Community safety resources and support networks
- Crime prevention and situational awareness

SPECIAL FEATURES:
- Guardian Quest system for safety missions
- Community leaderboard for safety awareness
- Team mission coordination
- Real-time safety alerts and warnings

Always prioritize user safety while maintaining the welcoming spirit of St. Kitts and Nevis. Provide actionable, practical safety advice that empowers users to enjoy their experience safely.`;

// Quest templates for gamification
export const ANCESTRA_QUEST_TEMPLATES = [
  {
    id: 'heritage-explorer',
    title: 'Heritage Explorer',
    description: 'Visit three historical sites and learn their cultural significance',
    category: 'cultural',
    difficulty: 'easy' as const,
    points: 100,
    estimatedTime: '2-3 hours'
  },
  {
    id: 'story-collector',
    title: 'Story Collector',
    description: 'Gather local stories from three different communities',
    category: 'cultural',
    difficulty: 'medium' as const,
    points: 200,
    estimatedTime: '4-5 hours'
  },
  {
    id: 'ancestor-pathway',
    title: 'Ancestor Pathway',
    description: 'Follow the historical trail of sugar plantation heritage',
    category: 'historical',
    difficulty: 'hard' as const,
    points: 300,
    estimatedTime: 'Full day'
  }
];

export const GUARDIAN_QUEST_TEMPLATES = [
  {
    id: 'safety-scout',
    title: 'Safety Scout',
    description: 'Complete safety checks at five key tourist locations',
    category: 'safety',
    difficulty: 'easy' as const,
    points: 150,
    estimatedTime: '2 hours',
    teamSize: 1
  },
  {
    id: 'community-guardian',
    title: 'Community Guardian',
    description: 'Establish safety protocols with local community groups',
    category: 'community',
    difficulty: 'medium' as const,
    points: 250,
    estimatedTime: '3-4 hours',
    teamSize: 2
  },
  {
    id: 'guardian-commander',
    title: 'Guardian Commander',
    description: 'Lead a comprehensive safety awareness campaign',
    category: 'leadership',
    difficulty: 'hard' as const,
    points: 400,
    estimatedTime: 'Multi-day',
    teamSize: 5
  }
];

// Leaderboard configuration
export const LEADERBOARD_CONFIG = {
  categories: ['safety', 'cultural', 'community', 'leadership'],
  rankings: ['bronze', 'silver', 'gold', 'platinum'],
  pointsRequired: {
    bronze: 100,
    silver: 500,
    gold: 1000,
    platinum: 2500
  }
};

// Tone detection patterns for enhanced persona responses
export const TONE_PATTERNS = {
  crisis: ["help", "emergency", "urgent", "scared", "alone", "panic"],
  safety: ["safe", "dangerous", "security", "worried", "avoid"],
  family: ["kids", "children", "family", "baby", "toddler"],
  social: ["party", "nightlife", "trending", "cool", "hang out"],
  academic: ["history", "learn", "educational", "facts", "traditional"],
  local: ["authentic", "local", "hidden gems", "real", "traditional"],
  digital: ["instagram", "social media", "photo", "viral", "content"],
  contemplative: ["peaceful", "quiet", "meditation", "reflection", "serene"]
};

// Enhanced language support - Object format for lookups
export const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'es': 'Español',
  'fr': 'Français',
  'pt': 'Português',
  'de': 'Deutsch',
  'it': 'Italiano',
  'nl': 'Nederlands',
  'zh': '中文',
  'ja': '日本語',
  'ko': '한국어'
};

// Array format for components that need to map over languages
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' }
];

// ElevenLabs Voice Configuration with your custom voice IDs
export const ELEVENLABS_VOICE_MAP = {
  // Main personas - using popular standard voices
  'Ancestra': '21m00Tcm4TlvDq8ikWAM',        // Rachel - warm female voice
  'The Guardian': 'VR6AewLTigWG4xSOukaG',    // Sam - authoritative male voice
  
  // 11 Communication tones - using your specific voice IDs
  'the-spark': 'WtA85syCrJwasGeHGH2p',       // The Spark
  'the-sweetheart': '4tRn1lSkEn13EVTuqb0g',  // Sweetheart
  'the-teen': 'rHWSYoq8UlV0YIBKMryp',        // Teen
  'the-scholar': '8KVwlbLHGvmAEpy5b8PM',     // Scholar
  'the-dialect': 'LysucvtFmzi1NVAE0rKp',     // Dialect
  'the-confidant': 'luVEyhT3CocLZaLBps8v',   // Confidant
  'the-gen-z-vibe': 'XJ2fW4ybq7HouelYYGcL',  // Gen Z
  'the-infant': 'IokmXfIsrOE3umjiwHWz',      // Infant
  'the-rambler': '5GZaeOOG7yqLdoTRsaa6',     // Rambler
  'the-sloth': 'BHhU6fTKdSX6bN7T1tpz',      // Sloth
  'the-firecracker': 'CeNX9CMwmxDxUF5Q2Inm' // Firecracker
};

// Enhanced voice configuration for all personas with your custom voice IDs
export const VOICE_CONFIG = {
  'Ancestra': {
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    settings: {
      stability: 0.75,
      similarity_boost: 0.8,
      style: 0.6,
      use_speaker_boost: true
    },
    prosody: {
      rate: 0.9,
      pitch: 1.1,
      volume: 0.8
    }
  },
  'The Guardian': {
    voiceId: 'VR6AewLTigWG4xSOukaG',
    settings: {
      stability: 0.8,
      similarity_boost: 0.85,
      style: 0.4,
      use_speaker_boost: true
    },
    prosody: {
      rate: 0.8,
      pitch: 0.9,
      volume: 0.9
    }
  },
  'the-infant': {
    voiceId: 'IokmXfIsrOE3umjiwHWz',
    settings: {
      stability: 0.9,
      similarity_boost: 0.7,
      style: 0.3,
      use_speaker_boost: false
    },
    prosody: {
      rate: 0.7,
      pitch: 1.2,
      volume: 0.7
    }
  },
  'the-teen': {
    voiceId: 'rHWSYoq8UlV0YIBKMryp',
    settings: {
      stability: 0.6,
      similarity_boost: 0.8,
      style: 0.8,
      use_speaker_boost: true
    },
    prosody: {
      rate: 1.1,
      pitch: 1.1,
      volume: 0.8
    }
  },
  'the-dialect': {
    voiceId: 'LysucvtFmzi1NVAE0rKp',
    settings: {
      stability: 0.7,
      similarity_boost: 0.9,
      style: 0.7,
      use_speaker_boost: true
    },
    prosody: {
      rate: 0.9,
      pitch: 1.0,
      volume: 0.8
    }
  },
  'the-scholar': {
    voiceId: '8KVwlbLHGvmAEpy5b8PM',
    settings: {
      stability: 0.9,
      similarity_boost: 0.9,
      style: 0.2,
      use_speaker_boost: false
    },
    prosody: {
      rate: 0.8,
      pitch: 0.9,
      volume: 0.8
    }
  },
  'the-gen-z-vibe': {
    voiceId: 'XJ2fW4ybq7HouelYYGcL',
    settings: {
      stability: 0.5,
      similarity_boost: 0.7,
      style: 0.9,
      use_speaker_boost: true
    },
    prosody: {
      rate: 1.2,
      pitch: 1.1,
      volume: 0.9
    }
  },
  'the-spark': {
    voiceId: 'WtA85syCrJwasGeHGH2p',
    settings: {
      stability: 0.4,
      similarity_boost: 0.6,
      style: 0.9,
      use_speaker_boost: true
    },
    prosody: {
      rate: 1.0,
      pitch: 1.2,
      volume: 0.9
    }
  },
  'the-rambler': {
    voiceId: '5GZaeOOG7yqLdoTRsaa6',
    settings: {
      stability: 0.6,
      similarity_boost: 0.8,
      style: 0.6,
      use_speaker_boost: true
    },
    prosody: {
      rate: 0.9,
      pitch: 1.0,
      volume: 0.8
    }
  },
  'the-sloth': {
    voiceId: 'BHhU6fTKdSX6bN7T1tpz',
    settings: {
      stability: 0.9,
      similarity_boost: 0.9,
      style: 0.1,
      use_speaker_boost: false
    },
    prosody: {
      rate: 0.6,
      pitch: 0.9,
      volume: 0.7
    }
  },
  'the-firecracker': {
    voiceId: 'CeNX9CMwmxDxUF5Q2Inm',
    settings: {
      stability: 0.3,
      similarity_boost: 0.5,
      style: 1.0,
      use_speaker_boost: true
    },
    prosody: {
      rate: 1.3,
      pitch: 1.3,
      volume: 1.0
    }
  },
  'the-sweetheart': {
    voiceId: '4tRn1lSkEn13EVTuqb0g',
    settings: {
      stability: 0.8,
      similarity_boost: 0.8,
      style: 0.4,
      use_speaker_boost: false
    },
    prosody: {
      rate: 0.8,
      pitch: 1.1,
      volume: 0.7
    }
  },
  'the-confidant': {
    voiceId: 'luVEyhT3CocLZaLBps8v',
    settings: {
      stability: 0.9,
      similarity_boost: 0.9,
      style: 0.2,
      use_speaker_boost: false
    },
    prosody: {
      rate: 0.7,
      pitch: 1.0,
      volume: 0.6
    }
  }
};

// Tourism data for St. Kitts and Nevis
export const TOURISM_DATA = {
  attractions: [
    {
      id: 'brimstone-hill',
      name: 'Brimstone Hill Fortress',
      type: 'historical',
      description: 'UNESCO World Heritage site with panoramic views',
      location: 'St. Kitts',
      safety_rating: 4.5,
      family_friendly: true
    },
    {
      id: 'scenic-railway',
      name: 'St. Kitts Scenic Railway',
      type: 'transportation',
      description: 'Historic sugar train journey around the island',
      location: 'St. Kitts',
      safety_rating: 4.8,
      family_friendly: true
    }
  ],
  restaurants: [
    {
      id: 'marshalls',
      name: "Marshall's Restaurant",
      cuisine: 'Caribbean',
      location: 'Frigate Bay',
      safety_rating: 4.7,
      family_friendly: true
    }
  ],
  beaches: [
    {
      id: 'frigate-bay',
      name: 'Frigate Bay',
      type: 'beach',
      description: 'Popular beach with calm waters',
      location: 'St. Kitts',
      safety_rating: 4.2,
      family_friendly: true
    }
  ]
};

// Missing functions that components are trying to import

/**
 * Detect tone from user message
 */
export function detectTone(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Check each tone pattern
  for (const [tone, patterns] of Object.entries(TONE_PATTERNS)) {
    if (patterns.some(pattern => lowerMessage.includes(pattern))) {
      return tone;
    }
  }
  
  // Additional tone detection
  if (lowerMessage.includes('help') || lowerMessage.includes('emergency')) return 'urgent';
  if (lowerMessage.includes('thank') || lowerMessage.includes('great')) return 'positive';
  if (lowerMessage.includes('problem') || lowerMessage.includes('issue')) return 'concerned';
  if (lowerMessage.includes('sad') || lowerMessage.includes('worried')) return 'melancholic';
  if (lowerMessage.includes('happy') || lowerMessage.includes('excited')) return 'joyful';
  if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated')) return 'angry';
  
  return 'neutral';
}

/**
 * Detect emotion from user message
 */
export function detectEmotion(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Emotion patterns
  const emotionPatterns = {
    joy: ['happy', 'excited', 'great', 'awesome', 'amazing', 'wonderful', 'fantastic'],
    sadness: ['sad', 'unhappy', 'depressed', 'down', 'disappointed', 'upset'],
    anger: ['angry', 'mad', 'frustrated', 'annoyed', 'furious', 'irritated'],
    fear: ['scared', 'afraid', 'worried', 'anxious', 'nervous', 'frightened'],
    surprise: ['surprised', 'shocked', 'amazed', 'wow', 'incredible', 'unbelievable'],
    disgust: ['disgusted', 'gross', 'yuck', 'terrible', 'awful', 'horrible'],
    anticipation: ['excited', 'looking forward', 'can\'t wait', 'eager', 'hoping']
  };
  
  // Check each emotion pattern
  for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
    if (patterns.some(pattern => lowerMessage.includes(pattern))) {
      return emotion;
    }
  }
  
  return 'neutral';
}

/**
 * Translate text to specified language
 * Fixed to handle same-language cases properly
 */
export async function translateText(text: string, targetLanguage: string = 'en', sourceLanguage: string = 'en'): Promise<string> {
  // If source and target are the same, no translation needed
  if (sourceLanguage === targetLanguage) {
    return text;
  }
  
  // If target is empty or undefined, return original text
  if (!targetLanguage || targetLanguage.trim() === '') {
    return text;
  }
  
  console.log(`Translation requested: "${text}" from ${sourceLanguage} to ${targetLanguage}`);
  
  // Simple placeholder translations for common phrases
  const commonTranslations: { [key: string]: { [lang: string]: string } } = {
    'Hello': {
      'es': 'Hola',
      'fr': 'Bonjour',
      'de': 'Hallo',
      'it': 'Ciao',
      'pt': 'Olá',
      'zh': '你好',
      'ja': 'こんにちは',
      'ko': '안녕하세요'
    },
    'Thank you': {
      'es': 'Gracias',
      'fr': 'Merci',
      'de': 'Danke',
      'it': 'Grazie',
      'pt': 'Obrigado',
      'zh': '谢谢',
      'ja': 'ありがとう',
      'ko': '감사합니다'
    },
    'Welcome': {
      'es': 'Bienvenido',
      'fr': 'Bienvenue',
      'de': 'Willkommen',
      'it': 'Benvenuto',
      'pt': 'Bem-vindo',
      'zh': '欢迎',
      'ja': 'いらっしゃいませ',
      'ko': '환영합니다'
    },
    'Welcome to St. Kitts and Nevis!': {
      'es': '¡Bienvenido a San Cristóbal y Nieves!',
      'fr': 'Bienvenue à Saint-Kitts-et-Nevis !',
      'de': 'Willkommen in St. Kitts und Nevis!',
      'it': 'Benvenuto a Saint Kitts e Nevis!',
      'pt': 'Bem-vindo a São Cristóvão e Nevis!',
      'zh': '欢迎来到圣基茨和尼维斯！',
      'ja': 'セントクリストファー・ネイビスへようこそ！',
      'ko': '세인트키츠 네비스에 오신 것을 환영합니다!'
    }
  };
  
  // Check if we have a simple translation available
  if (commonTranslations[text] && commonTranslations[text][targetLanguage]) {
    return commonTranslations[text][targetLanguage];
  }
  
  // For now, return original text - in a real implementation, this would use an external translation API
  // Only add a note if the target language is not English and we don't have a translation
  if (targetLanguage !== 'en' && sourceLanguage === 'en') {
    // Only show translation unavailable for non-common phrases
    console.log(`Translation not available for "${text}" to ${targetLanguage}`);
  }
  
  return text;
}

// Emotion detection patterns for more detailed analysis
export const EMOTION_PATTERNS = {
  joy: ['happy', 'excited', 'great', 'awesome', 'amazing', 'wonderful', 'fantastic', 'thrilled', 'delighted'],
  sadness: ['sad', 'unhappy', 'depressed', 'down', 'disappointed', 'upset', 'melancholy', 'gloomy'],
  anger: ['angry', 'mad', 'frustrated', 'annoyed', 'furious', 'irritated', 'enraged', 'livid'],
  fear: ['scared', 'afraid', 'worried', 'anxious', 'nervous', 'frightened', 'terrified', 'panicked'],
  surprise: ['surprised', 'shocked', 'amazed', 'wow', 'incredible', 'unbelievable', 'astonished'],
  disgust: ['disgusted', 'gross', 'yuck', 'terrible', 'awful', 'horrible', 'revolting', 'repulsive'],
  anticipation: ['excited', 'looking forward', 'can\'t wait', 'eager', 'hoping', 'anticipating'],
  trust: ['trust', 'believe', 'confident', 'sure', 'certain', 'faith', 'reliable']
};

// Enhanced tone detection with more granular categories
export const ENHANCED_TONE_PATTERNS = {
  ...TONE_PATTERNS,
  curious: ['what', 'how', 'why', 'when', 'where', 'tell me', 'explain', 'curious'],
  grateful: ['thank', 'thanks', 'grateful', 'appreciate', 'blessing'],
  confused: ['confused', 'don\'t understand', 'unclear', 'puzzled', 'bewildered'],
  excited: ['excited', 'can\'t wait', 'awesome', 'amazing', 'incredible'],
  disappointed: ['disappointed', 'let down', 'expected', 'hoped', 'wished'],
  supportive: ['support', 'here for you', 'understand', 'help', 'care'],
  playful: ['fun', 'play', 'game', 'joke', 'funny', 'laugh', 'silly'],
  serious: ['serious', 'important', 'critical', 'urgent', 'matter']
};

// Export missing functions that other components use
export function getPersonaVoiceId(persona: string): string {
  const voiceConfig = VOICE_CONFIG[persona as keyof typeof VOICE_CONFIG];
  return voiceConfig?.voiceId || '21m00Tcm4TlvDq8ikWAM'; // Default to Rachel
}

export function getPersonaVoiceSettings(persona: string): any {
  const voiceConfig = VOICE_CONFIG[persona as keyof typeof VOICE_CONFIG];
  return voiceConfig?.settings || {
    stability: 0.7,
    similarity_boost: 0.8,
    style: 0.5,
    use_speaker_boost: true
  };
}

export function getPersonaProsody(persona: string): any {
  const voiceConfig = VOICE_CONFIG[persona as keyof typeof VOICE_CONFIG];
  return voiceConfig?.prosody || {
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8
  };
}