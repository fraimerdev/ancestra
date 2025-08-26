import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  Send, Mic, Paperclip, Settings, Plus, Home, Compass, Sparkles, Clock, 
  Edit2, Trash2, BookOpen, Shield, MapPin, Volume2, VolumeX, 
  Globe, Brain, Map, AlertTriangle, Info, MessageCircle
} from "lucide-react";

import { 
  detectTone, 
  detectEmotion, 
  translateText
} from "../utils/constants";

import { getAISystemStatus } from "../utils/aiService";
import { processChatbotQuery } from "../utils/chatbotLogic";

import { 
  tourismData,
  findAnswerFromData, 
  findAnswerFromTourismData
} from "../utils/dataHandler";

import { 
  Message, 
  PERSONA_AVATARS, 
  SAFETY_DATA 
} from "../utils/constants";

import { Theme } from "../utils/theming";
import { useChatManagement } from "../hooks/useChatManagement";
import { useAudioControls } from "../hooks/useAudioControls";
import CommandPalette from "./CommandPalette";
import SettingsModal from "./SettingsModal";
import MapIntegration from "./MapIntegration";
import DiscoveryHub from "./DiscoveryHub";
import LanguageStatusIndicator from "./LanguageStatusIndicator";

interface ChatInterfaceProps {
  currentPersona: string; // Updated to support all personas
  setCurrentPersona: (persona: string) => void; // Updated to support all personas
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;
  largerText: boolean;
  setLargerText: (larger: boolean) => void;
  language: string;
  setLanguage: (language: string) => void;
  personaTone: string;
  setPersonaTone: (tone: string) => void;
  personaMemory: {[key: string]: string};
  setPersonaMemory: (memory: {[key: string]: string}) => void;
  theme: Theme;
  rotation: number;
  userName?: string; // Add userName prop
  onNavigateToHomepage: () => void;
  onOpenDiscoveryHub?: () => void;
  voiceEnabled?: boolean;
  setVoiceEnabled?: (enabled: boolean) => void;
}

// CRITICAL FIX: Add validation function to prevent Promise rendering
function validateMessageContent(content: any): string {
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

export default function ChatInterface({
  currentPersona,
  setCurrentPersona,
  darkMode,
  setDarkMode,
  highContrast,
  setHighContrast,
  largerText,
  setLargerText,
  language,
  setLanguage,
  personaTone,
  setPersonaTone,
  personaMemory,
  setPersonaMemory,
  theme,
  rotation,
  userName,
  onNavigateToHomepage,
  onOpenDiscoveryHub,
  voiceEnabled = false,
  setVoiceEnabled
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [currentPath, setCurrentPath] = useState('Homepage > Chat');
  const [currentEmotion, setCurrentEmotion] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [aiStatus, setAiStatus] = useState<any>(null);
  
  // Beach animation states
  const [waveOffset, setWaveOffset] = useState(0);
  const [floatingOffset, setFloatingOffset] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const chatManagement = useChatManagement();
  const audioControls = useAudioControls();

  // Check AI status on component mount
  useEffect(() => {
    const status = getAISystemStatus();
    setAiStatus(status);
  }, []);

  // Enhanced audio playback with persona-specific voices
  const playMessageAudio = async (message: Message) => {
    const messagePersona = message.persona || currentPersona;
    const content = validateMessageContent(message.content);
    
    try {
      await audioControls.playPersonaSpeech(content, messagePersona, language);
    } catch (error) {
      console.error('Failed to play message audio:', error);
      // Fallback to basic audio if persona speech fails
      await audioControls.playAudio(content, language, messagePersona);
    }
  };

  // Beach wave animation
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Floating elements animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingOffset(prev => (prev + 0.5) % 360);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Initialize with welcome message (with translation support)
  useEffect(() => {
    const initializeWelcomeMessage = async () => {
      if (messages.length === 0) {
        let welcomeContent = '';
        
        // Get welcome message based on persona type
        const personaAvatar = PERSONA_AVATARS[currentPersona as keyof typeof PERSONA_AVATARS];
        
        // Create personalized greeting if userName is provided
        const greeting = userName ? `Hello ${userName}! ` : '';
        
        // Check if AI service has API key for enhanced welcome message
        const status = getAISystemStatus();
        const hasApiKey = status?.hasApiKey || false;
        
        if (currentPersona === 'Ancestra') {
          welcomeContent = `🌺 ${greeting}Welcome to Ancestra! I'm your heritage tourism guide for St. Kitts and Nevis. Ask me about sites, food, history, culture, and attractions!`;
          if (!hasApiKey) {
            welcomeContent += `\n\n🔑 For enhanced AI responses, please set up your Google Gemini API key in Settings → API tab.`;
          }
        } else if (currentPersona === 'The Guardian') {
          welcomeContent = `🛡️ ${greeting}Welcome to The Guardian! I'm here to provide you with essential safety information and tips for a secure visit to St. Kitts and Nevis.`;
          if (!hasApiKey) {
            welcomeContent += `\n\n🔑 For enhanced AI responses, please set up your Google Gemini API key in Settings → API tab.`;
          }
        } else {
          // Handle specialized personas
          welcomeContent = `${personaAvatar?.icon || '🤖'} ${greeting}Welcome! I'm ${personaAvatar?.name || currentPersona}, your ${personaAvatar?.description || 'specialized assistant'} for St. Kitts and Nevis. How can I help you today?`;
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
        
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          content: translatedContent, // Now guaranteed to be a string
          sender: 'bot',
          timestamp: new Date(),
          persona: currentPersona,
          avatar: personaAvatar?.icon || '🤖'
        };
        
        setMessages([welcomeMessage]);
      }
    };
    
    initializeWelcomeMessage().catch(error => {
      console.error('❌ Error initializing welcome message:', error);
      // Create fallback welcome message
      const personaAvatar = PERSONA_AVATARS[currentPersona as keyof typeof PERSONA_AVATARS];
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        content: `Welcome! I'm ${currentPersona}, ready to help you explore St. Kitts and Nevis!`,
        sender: 'bot',
        timestamp: new Date(),
        persona: currentPersona,
        avatar: personaAvatar?.icon || '🤖'
      };
      setMessages([fallbackMessage]);
    });
  }, [currentPersona, language, userName]);

  // Handle persona switching - regenerate welcome message when persona changes
  useEffect(() => {
    const handlePersonaSwitch = async () => {
      if (messages.length > 0 && messages[0]?.sender === 'bot') {
        // When persona changes, update the welcome message with the user's name
        let welcomeContent = '';
        
        // Get welcome message based on persona type
        const personaAvatar = PERSONA_AVATARS[currentPersona as keyof typeof PERSONA_AVATARS];
        
        // Create personalized greeting if userName is provided
        const greeting = userName ? `Hello ${userName}! ` : '';
        
        // Check if AI service has API key for enhanced welcome message
        const status = getAISystemStatus();
        const hasApiKey = status?.hasApiKey || false;
        
        if (currentPersona === 'Ancestra') {
          welcomeContent = `🌺 ${greeting}Welcome to Ancestra! I'm your heritage tourism guide for St. Kitts and Nevis. Ask me about sites, food, history, culture, and attractions!`;
          if (!hasApiKey) {
            welcomeContent += `\n\n🔑 For enhanced AI responses, please set up your Google Gemini API key in Settings → API tab.`;
          }
        } else if (currentPersona === 'The Guardian') {
          welcomeContent = `🛡️ ${greeting}Welcome to The Guardian! I'm here to provide you with essential safety information and tips for a secure visit to St. Kitts and Nevis.`;
          if (!hasApiKey) {
            welcomeContent += `\n\n🔑 For enhanced AI responses, please set up your Google Gemini API key in Settings → API tab.`;
          }
        } else {
          // Handle specialized personas
          welcomeContent = `${personaAvatar?.icon || '🤖'} ${greeting}Welcome! I'm ${personaAvatar?.name || currentPersona}, your ${personaAvatar?.description || 'specialized assistant'} for St. Kitts and Nevis. How can I help you today?`;
          if (!hasApiKey) {
            welcomeContent += `\n\n🔑 For enhanced AI responses, please set up your Google Gemini API key in Settings → API tab.`;
          }
        }
        
        // CRITICAL FIX: Ensure translation returns a string
        let translatedContent: string;
        try {
          translatedContent = await translateText(welcomeContent, language.toLowerCase());
          
          // Validate the translation result
          if (typeof translatedContent !== 'string') {
            console.warn('⚠️ Persona switch translation returned non-string, using original:', typeof translatedContent);
            translatedContent = welcomeContent;
          }
        } catch (error) {
          console.error('❌ Translation error in persona switch:', error);
          translatedContent = welcomeContent; // Fallback to original
        }
        
        const newWelcomeMessage: Message = {
          id: Date.now().toString(),
          content: translatedContent, // Now guaranteed to be a string
          sender: 'bot',
          timestamp: new Date(),
          persona: currentPersona,
          avatar: personaAvatar?.icon || '🤖'
        };
        
        // Replace the first message (welcome) with the new persona's welcome message
        setMessages(prev => [newWelcomeMessage, ...prev.slice(1)]);
      }
    };

    // Only run this effect when the persona changes and we have messages
    if (messages.length > 0) {
      handlePersonaSwitch().catch(error => {
        console.error('❌ Error in persona switch:', error);
        // Create fallback message if translation fails
        const personaAvatar = PERSONA_AVATARS[currentPersona as keyof typeof PERSONA_AVATARS];
        const fallbackMessage: Message = {
          id: Date.now().toString(),
          content: `Welcome! I'm ${currentPersona}, ready to help you explore St. Kitts and Nevis!`,
          sender: 'bot',
          timestamp: new Date(),
          persona: currentPersona,
          avatar: personaAvatar?.icon || '🤖'
        };
        setMessages(prev => [fallbackMessage, ...prev.slice(1)]);
      });
    }
  }, [currentPersona]); // Only depend on currentPersona to avoid infinite loops

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        setShowCommandPalette(!showCommandPalette);
      }
      if (event.key === 'Escape') {
        setShowCommandPalette(false);
        setShowSettings(false);
        setShowMap(false);
        setShowDiscovery(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showCommandPalette]);

  const getQuickstartButtons = () => {
    if (currentPersona === 'Ancestra') {
      return [
        { icon: <Globe className="w-4 h-4" />, text: "What is the history of St. Kitts?" },
        { icon: <Brain className="w-4 h-4" />, text: "What local foods should I try?" },
        { icon: <Map className="w-4 h-4" />, text: "Tell me about the culture and festivals" },
        { icon: <Compass className="w-4 h-4" />, text: "What are the must-see attractions?" }
      ];
    } else if (currentPersona === 'The Guardian') {
      return [
        { icon: <Shield className="w-4 h-4" />, text: "Is St. Kitts safe for tourists?" },
        { icon: <AlertTriangle className="w-4 h-4" />, text: "What are some safety tips?" },
        { icon: <Info className="w-4 h-4" />, text: "Emergency contacts and health info" },
        { icon: <MessageCircle className="w-4 h-4" />, text: "Transportation safety advice" }
      ];
    } else {
      // Default quickstart buttons for specialized personas
      return [
        { icon: <Globe className="w-4 h-4" />, text: "What can you help me with?" },
        { icon: <Brain className="w-4 h-4" />, text: "Tell me about your expertise" },
        { icon: <Map className="w-4 h-4" />, text: "What makes you unique?" },
        { icon: <Compass className="w-4 h-4" />, text: "How can you assist my visit?" }
      ];
    }
  };

  const commands = [
    { name: "New Chat", action: () => chatManagement.newChat(currentPersona, messages, setMessages, setCurrentPath) },
    { name: "Toggle Dark Mode", action: () => setDarkMode(!darkMode) },
    { name: "Change Persona", action: () => {
      // Cycle through main personas for now, can be enhanced to show persona selector
      const mainPersonas = ['Ancestra', 'The Guardian'];
      const currentIndex = mainPersonas.indexOf(currentPersona);
      const nextPersona = mainPersonas[(currentIndex + 1) % mainPersonas.length];
      setCurrentPersona(nextPersona);
    }},
    { name: "Show History", action: () => setShowHistory(!showHistory) },
    { name: "Open Map", action: () => setShowMap(true) },
    { name: "Open Discovery", action: () => {
      if (onOpenDiscoveryHub) {
        onOpenDiscoveryHub();
      } else {
        setShowDiscovery(true);
      }
    }},
    { name: "Go to Homepage", action: onNavigateToHomepage },
    { name: "Settings", action: () => setShowSettings(!showSettings) }
  ];

  const startListening = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInputValue("Tell me about the cultural significance of St. Kitts");
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const fileMessage: Message = {
        id: Date.now().toString(),
        content: `📎 Uploaded: ${file.name}`,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fileMessage]);
    }
  };

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // FIXED: Pass the actual selected tone directly instead of mapping
      let actualTone = personaTone;
      if (personaTone === 'Auto-Detect') {
        actualTone = detectTone(content);
      }
      
      console.log('🎭 ChatInterface - Selected tone:', personaTone);
      console.log('🎯 ChatInterface - Actual tone being passed:', actualTone);
      const detectedEmotion = detectEmotion(content);
      
      // Set emotion indicator
      if (detectedEmotion === 'sad') {
        setCurrentEmotion('💔 Speaking softly and gently.');
      } else if (detectedEmotion === 'happy') {
        setCurrentEmotion('🎉 Joy detected! Let\'s celebrate!');
      } else if (detectedEmotion === 'angry') {
        setCurrentEmotion('😤 You seem upset, let\'s take it easy.');
      } else if (detectedEmotion === 'playful') {
        setCurrentEmotion('😂 LOL! You sound like a whole mood!');
      } else {
        setCurrentEmotion('');
      }

      // CRITICAL FIX: Ensure input translation returns a string
      const translatedInput = await translateText(content, 'en');
      console.log('📥 Translated input (validated):', typeof translatedInput, translatedInput.substring(0, 50));
      
      console.log('=== CHAT INTERFACE DEBUG ===');
      console.log('User input:', translatedInput);
      console.log('Persona:', currentPersona);
      console.log('Available tourism data items:', tourismData.length);
      console.log('Selected tone:', actualTone);
      console.log('Detected emotion:', detectedEmotion);
      console.log('Current Language:', language);
      console.log('Translation context - Input lang: en, Target lang:', language.toLowerCase());

      // ENHANCED: Use new Google Gemini AI brain system with dynamic persona detection
      const chatbotResponse = await processChatbotQuery(
        translatedInput,
        currentPersona,
        actualTone,
        language.toLowerCase(),
        userName,
        undefined, // chatId - could be enhanced later
        messages // Pass conversation history
      );
      
      const botResponse = chatbotResponse.content;
      const detectedPersona = chatbotResponse.persona || currentPersona;
      const transitionMessage = chatbotResponse.transitionMessage;
      
      // CRITICAL FIX: Validate bot response is a string before proceeding
      if (typeof botResponse !== 'string') {
        console.error('❌ Bot response is not a string:', typeof botResponse, botResponse);
        throw new Error('Invalid bot response type');
      }
      
      console.log('🤖 Enhanced Bot Response Generated:', {
        originalPersona: currentPersona,
        detectedPersona: detectedPersona,
        hasTransition: !!transitionMessage,
        confidence: chatbotResponse.confidence,
        responseLength: botResponse?.length
      });
      
      // Update persona if it changed due to dynamic detection
      if (detectedPersona !== currentPersona) {
        console.log(`🎭 Persona auto-switched: ${currentPersona} → ${detectedPersona}`);
        setCurrentPersona(detectedPersona);
      }
      
      // CRITICAL FIX: Ensure translation returns a string
      const translatedResponse = await translateText(botResponse, language.toLowerCase());
      
      // CRITICAL FIX: Final validation before setting in state
      if (typeof translatedResponse !== 'string') {
        console.error('❌ Translated response is not a string:', typeof translatedResponse, translatedResponse);
        throw new Error('Invalid translated response type');
      }
      
      setIsTyping(false);
      const personaAvatar = PERSONA_AVATARS[detectedPersona as keyof typeof PERSONA_AVATARS];
      
      // Add transition message if persona switched
      if (transitionMessage) {
        const transitionBotMessage: Message = {
          id: Date.now().toString(),
          content: transitionMessage,
          sender: 'bot',
          timestamp: new Date(),
          persona: detectedPersona,
          avatar: personaAvatar?.icon || '🤖',
          tone: 'system',
          emotion: 'transition'
        };
        setMessages(prev => [...prev, transitionBotMessage]);
        
        // Small delay before main response
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: translatedResponse, // This is now guaranteed to be a string
        sender: 'bot',
        timestamp: new Date(),
        persona: detectedPersona, // Use detected persona
        avatar: personaAvatar?.icon || '🤖',
        tone: actualTone,
        emotion: detectedEmotion,
        confidence: chatbotResponse.confidence,
        aiMetadata: chatbotResponse.metadata
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Clear emotion after response
      setTimeout(() => setCurrentEmotion(''), 3000);
    } catch (error) {
      setIsTyping(false);
      console.error('❌ Error generating response:', error);
      
      let errorContent = "I apologize, but I'm having trouble processing your request right now. Please try again in a moment!";
      let isApiKeyError = false;
      
      if (error instanceof Error) {
        if (error.message.includes('API key required') || error.message.includes('API key')) {
          isApiKeyError = true;
          errorContent = "🔑 I need a Google Gemini API key to provide AI-powered responses. Please go to Settings → API tab to set up your free API key. I can still help with basic information about St. Kitts & Nevis!";
        } else if (error.message.includes('503')) {
          errorContent = "🚧 The AI service is temporarily busy. Please wait a moment and try again!";
        } else if (error.message.includes('network')) {
          errorContent = "🔌 Having trouble connecting to the AI service. Please check your connection and try again.";
        }
      }
      
      const personaAvatar = PERSONA_AVATARS[currentPersona as keyof typeof PERSONA_AVATARS];
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        sender: 'bot',
        timestamp: new Date(),
        avatar: personaAvatar?.icon || '🤖',
        tone: isApiKeyError ? 'helpful' : 'apologetic',
        emotion: isApiKeyError ? 'informative' : 'error'
      };
      setMessages(prev => [...prev, errorMessage]);

      // Update AI status if this was an API key error
      if (isApiKeyError) {
        const newStatus = getAISystemStatus();
        setAiStatus(newStatus);
      }
    }
  };

  const TypingIndicator = () => {
    const personaAvatar = PERSONA_AVATARS[currentPersona as keyof typeof PERSONA_AVATARS];
    
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
  };

  const getPersonaColors = () => {
    if (currentPersona === 'Ancestra') {
      return { from: 'from-coral-400', via: 'via-pink-400', to: 'to-coral-500' };
    } else if (currentPersona === 'The Guardian') {
      return { from: 'from-ocean-400', via: 'via-blue-500', to: 'to-teal-500' };
    } else {
      // Default colors for specialized personas
      return { from: 'from-primary', via: 'via-secondary', to: 'to-primary' };
    }
  };

  const personaColors = getPersonaColors();
  const currentPersonaAvatar = PERSONA_AVATARS[currentPersona as keyof typeof PERSONA_AVATARS];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Theme-Aware Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 transition-all duration-500"
          style={{ background: theme.bgGradient }}
        ></div>
        
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
        {/* Modals */}
        {showMap && (
          <MapIntegration 
            onClose={() => setShowMap(false)} 
            persona={currentPersona as any}
          />
        )}

        {showDiscovery && (
          <DiscoveryHub 
            onClose={() => setShowDiscovery(false)}
            persona={currentPersona as any}
            theme={theme}
          />
        )}

        <CommandPalette
          showCommandPalette={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          commands={commands}
          theme={theme}
        />

        {/* Header */}
        <header 
          className="backdrop-blur-md border-b sticky top-0 z-40"
          style={{
            backgroundColor: `${theme.cardBg}`,
            borderBottomColor: theme.borderColor
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg transform hover:scale-110 transition-all duration-300 ${
                    currentPersona === 'The Guardian' ? 'guardian-color-morph' : ''
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                  }}
                >
                  {currentPersona === 'Ancestra' ? <BookOpen className="w-6 h-6" /> : 
                   currentPersona === 'The Guardian' ? <Shield className="w-6 h-6" /> : 
                   <span className="text-lg">{currentPersonaAvatar?.icon || '🤖'}</span>}
                </div>
                <div>
                  <h1 className="text-xl font-bold" style={{ color: theme.text }}>
                    {currentPersonaAvatar?.icon || '🤖'} {currentPersonaAvatar?.name || currentPersona} - {currentPersonaAvatar?.description || 'AI Assistant'}
                  </h1>
                  <nav className="text-sm opacity-70" style={{ color: theme.text }}>
                    {currentPath}
                  </nav>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setShowDebugInfo(!showDebugInfo);
                    console.log('=== DEBUG INFO ===');
                    console.log('AI Service Status:', getAISystemStatus());
                    console.log('Tourism Data Length:', tourismData.length);
                    console.log('Current Persona:', currentPersona);
                    console.log('Current Language:', language);
                    console.log('Current Tone:', personaTone);
                  }}
                  className="px-3 py-1 text-xs rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: showDebugInfo ? theme.primary : `${theme.secondary}80`,
                    color: showDebugInfo ? 'white' : theme.text
                  }}
                  title="Debug Info"
                >
                  DEBUG
                </button>
                <span 
                  className="px-3 py-1 text-xs rounded-lg font-medium"
                  style={{
                    backgroundColor: `${theme.secondary}80`,
                    color: theme.text
                  }}
                >
                  Ctrl+K
                </span>
                <Button
                  onClick={() => setShowMap(true)}
                  variant="ghost"
                  size="sm"
                  title="Open Map"
                  className="transition-colors duration-200"
                  style={{ 
                    color: theme.text
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = theme.primary}
                  onMouseLeave={(e) => e.currentTarget.style.color = theme.text}
                >
                  <MapPin className="w-5 h-5" />
                </Button>
                <SettingsModal
                  currentPersona={currentPersona as any}
                  setCurrentPersona={setCurrentPersona as any}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  highContrast={highContrast}
                  setHighContrast={setHighContrast}
                  largerText={largerText}
                  setLargerText={setLargerText}
                  language={language}
                  setLanguage={setLanguage}
                  personaTone={personaTone}
                  setPersonaTone={setPersonaTone}
                  theme={theme}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Settings"
                    className="transition-colors duration-200"
                    style={{ 
                      color: theme.text
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.primary}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme.text}
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </SettingsModal>
              </div>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-64px)]">
          {/* Floating Sidebar */}
          <div 
            className="w-72 h-full fixed top-16 left-0 backdrop-blur-md border-r p-6 space-y-6 overflow-y-auto"
            style={{
              backgroundColor: `${theme.cardBg}`,
              borderRightColor: theme.borderColor
            }}
          >
            
            {/* Language and Status */}
            <LanguageStatusIndicator 
              language={language}
              theme={theme}
              personaTone={personaTone}
            />

            {/* Persona Switcher */}
            <div className="text-center">
              <Button
                onClick={() => {
                  // For now, cycle between main personas - this can be enhanced with full persona selector
                  const mainPersonas = ['Ancestra', 'The Guardian'];
                  const currentIndex = mainPersonas.indexOf(currentPersona);
                  if (currentIndex >= 0) {
                    const newPersona = mainPersonas[(currentIndex + 1) % mainPersonas.length];
                    setCurrentPersona(newPersona);
                    chatManagement.newChat(newPersona, messages, setMessages, setCurrentPath);
                  }
                }}
                className={`w-full p-4 rounded-2xl border-2 border-dashed font-bold text-lg transition-all duration-300 hover:scale-105 text-white shadow-xl ${
                  currentPersona === 'The Guardian' ? 'guardian-color-morph' : ''
                }`}
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  borderColor: `${theme.primary}50`
                }}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">{currentPersonaAvatar?.icon || '🤖'}</span>
                  <span>Switch Persona</span>
                </div>
              </Button>
            </div>

            {/* Navigation Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => chatManagement.newChat(currentPersona, messages, setMessages, setCurrentPath)}
                className="w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 justify-start shadow-lg"
                style={{
                  backgroundColor: `${theme.cardBg}`,
                  color: theme.text,
                  border: `1px solid ${theme.borderColor}`
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.secondary}40`}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.cardBg}
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">New Chat</span>
              </Button>

              <Button
                onClick={onNavigateToHomepage}
                className="w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 justify-start shadow-lg"
                style={{
                  backgroundColor: `${theme.cardBg}`,
                  color: theme.text,
                  border: `1px solid ${theme.borderColor}`
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.secondary}40`}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.cardBg}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Homepage</span>
              </Button>

              <Button
                onClick={() => {
                  setShowMap(true);
                  setCurrentPath('Homepage > Chat > Map');
                }}
                className="w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 justify-start shadow-lg"
                style={{
                  backgroundColor: `${theme.cardBg}`,
                  color: theme.text,
                  border: `1px solid ${theme.borderColor}`
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.secondary}40`}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.cardBg}
              >
                <Compass
                  className="w-5 h-5"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
                <span className="font-medium">Map</span>
              </Button>

              <Button
                onClick={() => {
                  if (onOpenDiscoveryHub) {
                    onOpenDiscoveryHub();
                    setCurrentPath('Homepage > Chat > Discovery');
                  } else {
                    setShowDiscovery(true);
                    setCurrentPath('Homepage > Chat > Discovery');
                  }
                }}
                className="w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 justify-start shadow-lg"
                style={{
                  backgroundColor: `${theme.cardBg}`,
                  color: theme.text,
                  border: `1px solid ${theme.borderColor}`
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.secondary}40`}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.cardBg}
              >
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Discovery Hub</span>
              </Button>

              <Button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 justify-start shadow-lg"
                style={{
                  backgroundColor: `${theme.cardBg}`,
                  color: theme.text,
                  border: `1px solid ${theme.borderColor}`
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.secondary}40`}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.cardBg}
              >
                <Clock className="w-5 h-5" />
                <span className="font-medium">History</span>
              </Button>

              {showHistory && (
                <div 
                  className="ml-4 space-y-2 max-h-40 overflow-y-auto rounded-xl p-3"
                  style={{
                    backgroundColor: `${theme.secondary}20`
                  }}
                >
                  <h4 className="text-sm font-bold mb-2" style={{ color: theme.text }}>Past Chats</h4>
                  {Object.keys(chatManagement.savedChats).slice(0, 5).map((chatId) => (
                    <button
                      key={chatId}
                      onClick={() => chatManagement.loadChat(chatId, setMessages, setCurrentPath)}
                      className="w-full text-left p-2 rounded-lg hover:scale-105 transition-all duration-200 text-sm"
                      style={{
                        backgroundColor: `${theme.cardBg}`,
                        color: theme.text,
                        border: `1px solid ${theme.borderColor}`
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.secondary}30`}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.cardBg}
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate flex-1">
                          {chatManagement.savedChats[chatId].title}
                        </span>
                        <div className="flex space-x-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              chatManagement.renameChat(chatId);
                            }}
                            className="p-1 rounded hover:scale-110 transition-transform"
                            style={{ color: theme.text }}
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              chatManagement.deleteChat(chatId);
                            }}
                            className="p-1 rounded hover:scale-110 transition-transform text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs opacity-60 mt-1">
                        {new Date(chatManagement.savedChats[chatId].timestamp).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Start Questions */}
            <div>
              <h4 className="text-sm font-bold mb-3" style={{ color: theme.text }}>Quick Start</h4>
              <div className="space-y-2">
                {getQuickstartButtons().map((button, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(button.text)}
                    className="w-full text-left p-3 rounded-xl hover:scale-105 transition-all duration-300 flex items-center space-x-3 shadow-lg"
                    style={{
                      backgroundColor: `${theme.cardBg}`,
                      color: theme.text,
                      border: `1px solid ${theme.borderColor}`
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.secondary}30`}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.cardBg}
                  >
                    {button.icon}
                    <span className="text-sm">{button.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Emotion Display */}
            {currentEmotion && (
              <div 
                className="p-3 rounded-xl text-center animate-pulse"
                style={{
                  backgroundColor: `${theme.primary}20`,
                  color: theme.text
                }}
              >
                <p className="text-sm font-medium">{currentEmotion}</p>
              </div>
            )}
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 ml-72 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-2xl px-6 py-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 ${
                      message.sender === 'user'
                        ? 'text-white'
                        : 'text-black'
                    }`}
                    style={{
                      background: message.sender === 'user'
                        ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                        : theme.cardBg,
                      color: message.sender === 'user' ? 'white' : theme.text,
                      border: message.sender === 'bot' ? `1px solid ${theme.borderColor}` : 'none'
                    }}
                  >
                    {message.sender === 'bot' && (
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-2xl">{message.avatar}</span>
                        <span className="text-sm font-bold opacity-70">
                          {currentPersonaAvatar?.name || currentPersona}
                        </span>
                        {message.tone && (
                          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${theme.secondary}40` }}>
                            {message.tone}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                    <div className="text-xs opacity-60 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && <TypingIndicator />}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div 
              className="border-t p-6"
              style={{ borderTopColor: theme.borderColor }}
            >
              <div className="flex space-x-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,application/pdf,.doc,.docx,.txt"
                />
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="ghost"
                  size="sm"
                  className="shrink-0"
                  style={{ color: theme.text }}
                  title="Upload File"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>

                <Button
                  onClick={startListening}
                  variant="ghost"
                  size="sm"
                  className={`shrink-0 ${isListening ? 'animate-pulse' : ''}`}
                  style={{ 
                    color: isListening ? theme.primary : theme.text,
                    backgroundColor: isListening ? `${theme.primary}20` : 'transparent'
                  }}
                  title="Voice Input"
                >
                  <Mic className="w-5 h-5" />
                </Button>

                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={`Ask ${currentPersonaAvatar?.name || currentPersona} anything about St. Kitts...`}
                    className="w-full py-3 px-4 rounded-2xl transition-all duration-300"
                    style={{
                      backgroundColor: theme.cardBg,
                      borderColor: theme.borderColor,
                      color: theme.text
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.borderColor;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  {uploadedFile && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                      <div className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}>
                        📎 {uploadedFile.name.slice(0, 10)}...
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  className="shrink-0 px-6 py-3 rounded-2xl text-white transition-all duration-300 hover:scale-105 shadow-lg"
                  style={{
                    background: inputValue.trim() 
                      ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                      : `${theme.secondary}60`,
                    opacity: inputValue.trim() ? 1 : 0.5
                  }}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>

              {uploadedFile && (
                <div className="mt-3 flex justify-between items-center p-2 rounded-lg" style={{ backgroundColor: `${theme.secondary}20` }}>
                  <span className="text-sm" style={{ color: theme.text }}>📎 {uploadedFile.name}</span>
                  <Button
                    onClick={() => setUploadedFile(null)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}