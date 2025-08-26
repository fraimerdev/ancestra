import { translateText } from "../../utils/constants";
import { getAISystemStatus } from "../../utils/aiService";
import { PERSONA_AVATARS, Message } from "../../utils/constants";
import { ERROR_MESSAGES } from "./ChatConstants";

// ==============================
// MESSAGE VALIDATION
// ==============================
export function validateMessageContent(content: any): string {
  // Check if content is a Promise
  if (content && typeof content.then === 'function') {
    console.error('❌ CRITICAL: Detected Promise in message content - this will cause React error!', content);
    return 'Error: Loading response...';
  }
  
  // Ensure content is a string
  if (typeof content !== 'string') {
    console.error('❌ CRITICAL: Message content is not a string:', typeof content, content);
    return String(content) || 'Error: Invalid content';
  }
  
  return content;
}

// ==============================
// WELCOME MESSAGE GENERATION
// ==============================
export async function generateWelcomeMessage(
  currentPersona: string,
  userName?: string,
  language: string = 'en',
  activeQuestCount: number = 0
): Promise<Message> {
  let welcomeContent = '';
  
  // Get welcome message based on persona type
  const personaAvatar = PERSONA_AVATARS[currentPersona as keyof typeof PERSONA_AVATARS];
  
  // Create personalized greeting if userName is provided
  const greeting = userName ? `Hello ${userName}! ` : '';
  
  // Check if AI service has API key for enhanced welcome message
  const status = getAISystemStatus();
  const hasApiKey = status?.hasApiKey || false;
  
  if (currentPersona === 'Ancestra') {
    welcomeContent = `🌺 ${greeting}Welcome to Ancestra! I'm your heritage tourism guide for St. Kitts and Nevis. Ask me about sites, food, history, culture, and attractions!

🎯 Ready to explore? Try my **Quest Dashboard** to embark on immersive cultural adventures and earn rewards for discovering the island's hidden treasures!`;
    
    if (activeQuestCount > 0) {
      welcomeContent += `\n\n📋 You have ${activeQuestCount} active cultural quest${activeQuestCount !== 1 ? 's' : ''} waiting for you!`;
    }
    
    if (!hasApiKey) {
      welcomeContent += `\n\n🔑 For enhanced AI responses, please set up your Google Gemini API key in Settings → API tab.`;
    }
  } else if (currentPersona === 'The Guardian') {
    welcomeContent = `🛡️ ${greeting}Welcome to The Guardian! I'm here to provide you with essential safety information and tips for a secure visit to St. Kitts and Nevis.

🎯 Stay prepared! Check out my **Quest Dashboard** to complete safety missions, learn emergency protocols, and become a certified island safety expert!`;
    
    if (activeQuestCount > 0) {
      welcomeContent += `\n\n📋 You have ${activeQuestCount} active safety quest${activeQuestCount !== 1 ? 's' : ''} in progress!`;
    }
    
    if (!hasApiKey) {
      welcomeContent += `\n\n🔑 For enhanced AI responses, please set up your Google Gemini API key in Settings → API tab.`;
    }
  } else {
    // Handle specialized personas
    welcomeContent = `${personaAvatar?.icon || '🤖'} ${greeting}Welcome! I'm ${personaAvatar?.name || currentPersona}, your ${personaAvatar?.description || 'specialized assistant'} for St. Kitts and Nevis. How can I help you today?

🎯 Explore my **Quest Dashboard** for personalized missions and rewards!`;
    if (!hasApiKey) {
      welcomeContent += `\n\n🔑 For enhanced AI responses, please set up your Google Gemini API key in Settings → API tab.`;
    }
  }
  
  // CRITICAL FIX: Ensure translation returns a string and handle errors
  let translatedContent: string;
  try {
    translatedContent = await translateText(welcomeContent, language.toLowerCase());
    
    // Validate the translation result
    if (typeof translatedContent !== 'string') {
      console.warn('⚠️ Translation returned non-string, using original:', typeof translatedContent);
      translatedContent = welcomeContent;
    }
  } catch (error) {
    console.error('❌ Translation error in welcome message:', error);
    translatedContent = welcomeContent; // Fallback to original
  }
  
  return {
    id: Date.now().toString(),
    content: translatedContent, // Now guaranteed to be a string
    sender: 'bot',
    timestamp: new Date(),
    persona: currentPersona,
    avatar: personaAvatar?.icon || '🤖'
  };
}

// ==============================
// ERROR HANDLING
// ==============================
export function generateErrorMessage(
  error: Error,
  currentPersona: string
): Message {
  let errorContent = ERROR_MESSAGES.GENERIC_ERROR;
  let isApiKeyError = false;
  
  if (error.message.includes('API key required') || error.message.includes('API key')) {
    isApiKeyError = true;
    errorContent = ERROR_MESSAGES.API_KEY_REQUIRED;
  } else if (error.message.includes('503')) {
    errorContent = ERROR_MESSAGES.SERVICE_BUSY;
  } else if (error.message.includes('network')) {
    errorContent = ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  const personaAvatar = PERSONA_AVATARS[currentPersona as keyof typeof PERSONA_AVATARS];
  
  return {
    id: (Date.now() + 1).toString(),
    content: errorContent,
    sender: 'bot',
    timestamp: new Date(),
    avatar: personaAvatar?.icon || '🤖',
    tone: isApiKeyError ? 'helpful' : 'apologetic',
    emotion: isApiKeyError ? 'informative' : 'error'
  };
}

// ==============================
// ANIMATION CALCULATIONS
// ==============================
export function calculateFloatingOffset(offset: number): string {
  return `translateY(${Math.sin(offset * 0.02) * 20}px)`;
}

export function calculateWaveOffset(offset: number, baseValue: number, intensity: number): number {
  return baseValue + Math.sin(offset * 0.02) * intensity;
}

// ==============================
// PERSONA UTILITIES
// ==============================
export function getPersonaActiveQuests(questManagement: any, currentPersona: string): number {
  const activePersona = currentPersona === 'Ancestra' ? 'ancestra' : 'guardian';
  return questManagement.getActiveQuestsByPersona(activePersona).length;
}

export function getPersonaAvatar(currentPersona: string) {
  return PERSONA_AVATARS[currentPersona as keyof typeof PERSONA_AVATARS];
}

// ==============================
// KEYBOARD SHORTCUTS
// ==============================
export function handleKeyboardShortcuts(
  event: KeyboardEvent,
  handlers: {
    toggleCommandPalette: () => void;
    closeModals: () => void;
  }
) {
  if (event.ctrlKey && event.key === 'k') {
    event.preventDefault();
    handlers.toggleCommandPalette();
  }
  if (event.key === 'Escape') {
    handlers.closeModals();
  }
}

// ==============================
// FILE VALIDATION
// ==============================
export function validateFileUpload(file: File): boolean {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image', 'audio', 'application/pdf', 'application/msword', 'text'];
  
  if (file.size > maxSize) {
    console.error('File too large:', file.size);
    return false;
  }
  
  const isAllowedType = allowedTypes.some(type => file.type.startsWith(type));
  if (!isAllowedType) {
    console.error('File type not allowed:', file.type);
    return false;
  }
  
  return true;
}

// ==============================
// SCROLL UTILITIES
// ==============================
export function scrollToBottom(elementRef: React.RefObject<HTMLDivElement>) {
  elementRef.current?.scrollIntoView({ behavior: 'smooth' });
}

// ==============================
// PERSONA THEME HELPERS
// ==============================
export function getPersonaThemeClasses(currentPersona: string): string {
  if (currentPersona === 'Ancestra') {
    return 'ancestra-theme';
  } else if (currentPersona === 'The Guardian') {
    return 'guardian-theme';
  }
  return '';
}

export function getPersonaAnimationClass(currentPersona: string): string {
  return currentPersona === 'The Guardian' ? 'guardian-color-shift' : '';
}