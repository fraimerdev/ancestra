// Enhanced Chatbot Logic with Google Gemini AI and Dynamic Persona Detection
import { aiService } from './aiService';
import { translateText } from './constants';
import { findAnswerFromTourismData } from './dataHandler';

export interface ChatbotResponse {
  content: string;
  isFromAI: boolean;
  confidence: number;
  persona?: string;
  personaDetection?: any;
  transitionMessage?: string;
  metadata?: {
    model?: string;
    responseTime?: number;
    sources?: string[];
    hasWebContext?: boolean;
    hasVideoContext?: boolean;
    hasConversationHistory?: boolean;
  };
}

/**
 * Enhanced chatbot brain with Google Gemini AI and dynamic persona detection
 */
export async function processChatbotQuery(
  userInput: string,
  persona: string = 'Ancestra',
  tone: string = 'Auto-Detect',
  language: string = 'English',
  userName?: string,
  chatId?: string,
  conversationHistory?: any[]
): Promise<ChatbotResponse> {
  try {
    console.log('🧠 Enhanced Chatbot Brain with Google Gemini:', { 
      userInput, 
      persona, 
      tone, 
      language, 
      chatId,
      historyLength: conversationHistory?.length || 0
    });

    // Normalize input
    const normalizedInput = userInput.trim();
    
    // Check for empty input
    if (!normalizedInput) {
      return {
        content: getPersonalizedPrompt(persona, userName),
        isFromAI: false,
        confidence: 1.0,
        persona
      };
    }

    // Detect query type and determine appropriate mode
    const queryType = detectQueryType(normalizedInput);
    const mode = determineMode(queryType, persona);
    
    console.log('🔍 Query Analysis:', { 
      queryType, 
      determinedMode: mode,
      originalPersona: persona
    });

    // Check if AI service is ready
    if (!aiService.isReady()) {
      console.warn('⚠️ AI Service not ready, using fallback response');
      return {
        content: getFallbackResponse(persona, queryType, normalizedInput),
        isFromAI: false,
        confidence: 0.5,
        persona
      };
    }

    // Check if AI service has API key
    if (!aiService.hasApiKey()) {
      console.warn('⚠️ AI Service has no API key, providing setup guidance');
      return {
        content: getApiKeyMissingResponse(persona, queryType, normalizedInput),
        isFromAI: false,
        confidence: 0.7,
        persona
      };
    }

    // Handle emergency queries immediately
    if (queryType === 'emergency') {
      return handleEmergencyQuery(normalizedInput, language);
    }

    // Prepare user profile for persona detection
    const userProfile = {
      manual_persona: tone !== 'Auto-Detect' ? tone : undefined,
      origin: extractOriginHints(normalizedInput),
      age: extractAgeHints(normalizedInput),
      family: extractFamilyHints(normalizedInput),
      budget: extractBudgetHints(normalizedInput),
      accessibility: extractAccessibilityHints(normalizedInput)
    };

    // Generate AI response with dynamic persona detection
    const startTime = Date.now();
    
    const aiResponse = await aiService.generateResponse(normalizedInput, {
      mode,
      currentPersona: persona,
      userProfile,
      conversationHistory,
      language,
      userName
    });

    const responseTime = Date.now() - startTime;

    if (aiResponse.error) {
      console.error('❌ AI Service Error:', aiResponse.error);
      return {
        content: getFallbackResponse(persona, queryType, normalizedInput),
        isFromAI: false,
        confidence: 0.3,
        persona,
        metadata: { 
          responseTime,
          sources: ['fallback']
        }
      };
    }

    // Prepare the enhanced response
    const response: ChatbotResponse = {
      content: aiResponse.response,
      isFromAI: true,
      confidence: (aiResponse.personaDetection?.confidence || 80) / 100,
      persona: aiResponse.persona,
      personaDetection: aiResponse.personaDetection,
      transitionMessage: aiResponse.transitionMessage,
      metadata: {
        model: 'gemini-1.5-pro',
        responseTime,
        hasConversationHistory: conversationHistory && conversationHistory.length > 0,
        sources: ['google_gemini', 'dynamic_persona_detection']
      }
    };

    // Log successful response
    console.log('✅ Enhanced Chatbot Response Generated:', {
      confidence: response.confidence,
      detectedPersona: response.persona,
      hasTransition: !!response.transitionMessage,
      responseTime: response.metadata?.responseTime
    });

    return response;

  } catch (error) {
    console.error('❌ Chatbot Logic Error:', error);
    
    return {
      content: getFallbackErrorResponse(persona, language),
      isFromAI: false,
      confidence: 0.1,
      persona,
      metadata: { sources: ['fallback'] }
    };
  }
}

/**
 * Detect the type of query to determine the best response strategy
 */
function detectQueryType(input: string): string {
  const lowerInput = input.toLowerCase();

  // Emergency queries
  if (/\b(emergency|help me|urgent|911|police|hospital|doctor|ambulance|fire|danger|scared|lost)\b/i.test(input)) {
    return 'emergency';
  }

  // Safety-related queries
  if (/\b(safe|safety|security|crime|dangerous|risk|health|medical|insurance|precaution|travel advisory)\b/i.test(input)) {
    return 'safety';
  }

  // Current/live information queries
  if (/\b(current|now|today|tonight|this week|latest|recent|open|closed|hours|price|cost|schedule|event|weather)\b/i.test(input)) {
    return 'current_info';
  }

  // Tourism-specific queries
  if (/\b(visit|attraction|beach|hotel|restaurant|tour|activity|historic|museum|park|festival|culture|food|drink|souvenir|shop|vacation|holiday)\b/i.test(input)) {
    return 'tourism';
  }

  // Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|greetings|how are you|what's up|yo|hiya|howdy|sup|whats good)/i.test(input.trim())) {
    return 'greeting';
  }

  return 'general';
}

/**
 * Determine the appropriate mode based on query type and current persona
 */
function determineMode(queryType: string, currentPersona: string): 'ancestra' | 'guardian' {
  // Safety and emergency queries should use Guardian mode
  if (queryType === 'safety' || queryType === 'emergency') {
    return 'guardian';
  }

  // Tourism queries should use Ancestra mode
  if (queryType === 'tourism') {
    return 'ancestra';
  }

  // For general queries, respect the current persona
  if (currentPersona.toLowerCase().includes('guardian')) {
    return 'guardian';
  }

  // Default to Ancestra for heritage and cultural guidance
  return 'ancestra';
}

/**
 * Extract hints about user characteristics from their message
 */
function extractOriginHints(input: string): string | null {
  const originPatterns = {
    'JAM': /\b(jamaica|jamaican|yard|bredrin|sistren)\b/i,
    'TTO': /\b(trinidad|tobago|trini|doubles)\b/i,
    'BRB': /\b(barbados|bajan|bim)\b/i,
    'US': /\b(america|american|usa|states|dollars?)\b/i,
    'UK': /\b(britain|british|england|uk|pounds?|quid)\b/i,
    'CAN': /\b(canada|canadian|eh|loonie|toonie)\b/i
  };

  for (const [country, pattern] of Object.entries(originPatterns)) {
    if (pattern.test(input)) {
      return country;
    }
  }

  return null;
}

function extractAgeHints(input: string): string | null {
  if (/\b(teen|teenager|young|student|school|college|university)\b/i.test(input)) {
    return 'teenager';
  }
  if (/\b(baby|infant|toddler|child|kid)\b/i.test(input)) {
    return 'family_with_children';
  }
  if (/\b(senior|elderly|retirement|pension)\b/i.test(input)) {
    return 'senior';
  }
  return null;
}

function extractFamilyHints(input: string): string | null {
  if (/\b(baby|infant|toddler|stroller|diaper|formula)\b/i.test(input)) {
    return 'infant';
  }
  if (/\b(family|kids|children|child)\b/i.test(input)) {
    return 'family';
  }
  return null;
}

function extractBudgetHints(input: string): string | null {
  if (/\b(luxury|premium|exclusive|vip|high.?end|expensive|fancy)\b/i.test(input)) {
    return 'luxury';
  }
  if (/\b(budget|cheap|affordable|backpack|economy|low.?cost)\b/i.test(input)) {
    return 'economy';
  }
  return null;
}

function extractAccessibilityHints(input: string): string | null {
  if (/\b(wheelchair|disabled|accessibility|accessible|mobility|special.?needs)\b/i.test(input)) {
    return 'required';
  }
  return null;
}

/**
 * Handle emergency queries with immediate response
 */
function handleEmergencyQuery(input: string, language: string): ChatbotResponse {
  const emergencyInfo = `🚨 EMERGENCY CONTACTS FOR ST. KITTS AND NEVIS:

🆘 **IMMEDIATE EMERGENCY**: 911

🚓 **Police**: (869) 465-2241
🚒 **Fire Department**: (869) 465-2222  
🏥 **Hospital**: Joseph N. France General Hospital (869) 465-2551
⛵ **Coast Guard**: (869) 465-8106

🏥 **MEDICAL FACILITIES:**
• Joseph N. France General Hospital, Basseterre
• Alexandra Hospital, Nevis
• Private medical clinics in major areas

**If this is a life-threatening emergency, call 911 immediately or go to the nearest hospital.**

For non-emergencies, I'm here to help with safety information and travel guidance.`;

  return {
    content: emergencyInfo,
    isFromAI: false,
    confidence: 1.0,
    persona: 'The Guardian',
    metadata: { sources: ['emergency_database'] }
  };
}

/**
 * Get personalized prompts based on persona and user context
 */
function getPersonalizedPrompt(persona: string, userName?: string): string {
  const greeting = userName ? `Hi ${userName}! ` : 'Hello! ';
  
  if (persona.toLowerCase().includes('guardian')) {
    return `🛡️ ${greeting}I'm The Guardian, your safety specialist for St. Kitts & Nevis. How can I help keep you safe and informed?`;
  }
  
  // Default to Ancestra for cultural guidance
  return `🌺 ${greeting}I'm Ancestra, your heritage tourism guide for St. Kitts & Nevis. What would you like to explore about our beautiful islands?`;
}

/**
 * Get response when API key is missing but service is ready
 */
function getApiKeyMissingResponse(persona: string, queryType: string, input: string): string {
  const isGuardian = persona.toLowerCase().includes('guardian');
  const personaIcon = isGuardian ? '🛡️' : '🌺';
  const personaName = isGuardian ? 'The Guardian' : 'Ancestra';
  
  let baseResponse = '';
  
  // Provide some basic information based on query type
  switch (queryType) {
    case 'safety':
      baseResponse = `${personaIcon} I can share that St. Kitts and Nevis is generally very safe for tourists. Emergency number: 911. For detailed safety guidance, `;
      break;
    case 'tourism':
      baseResponse = `${personaIcon} I can tell you that St. Kitts offers Brimstone Hill Fortress, scenic railway, and beautiful beaches like Frigate Bay. For personalized recommendations, `;
      break;
    case 'greeting':
      baseResponse = `${personaIcon} Hello! I'm ${personaName}, ready to help with St. Kitts & Nevis. For my full AI capabilities, `;
      break;
    default:
      baseResponse = `${personaIcon} I'd love to provide detailed insights about St. Kitts & Nevis! For my enhanced AI features, `;
  }
  
  return `${baseResponse}I need a Google Gemini API key to unlock my full potential. 

🔧 **Quick Setup:**
1. Click the ⚙️ Settings button (top right)
2. Go to the "API" tab
3. Enter your Google Gemini API key
4. Test the connection

💡 **Get your free API key:** Visit Google AI Studio (makersuite.google.com/app/apikey)

I can still help with basic information about our beautiful islands! What would you like to know?`;
}

/**
 * Get enhanced fallback response based on query type
 */
function getFallbackResponse(persona: string, queryType: string, input: string): string {
  const isGuardian = persona.toLowerCase().includes('guardian');
  
  switch (queryType) {
    case 'safety':
      return `🛡️ St. Kitts and Nevis is generally very safe for tourists. Stay hydrated, use reef-safe sunscreen, keep emergency contacts handy (call 911 for emergencies), and trust your instincts. Most visitors have wonderful, trouble-free experiences on our friendly islands.`;
    
    case 'tourism':
      return `🌺 St. Kitts and Nevis offers incredible experiences! Visit the historic Brimstone Hill Fortress, relax on beautiful beaches like Frigate Bay, take the scenic railway, explore our sugar plantation heritage, and enjoy local delicacies. Our islands blend rich history with Caribbean paradise!`;
    
    case 'current_info':
      return `For the most current information about St. Kitts and Nevis, I recommend checking the official tourism website at visitstkitts.com or contacting local tourism offices directly.`;
    
    case 'greeting':
      return getPersonalizedPrompt(persona);
    
    default:
      if (isGuardian) {
        return `🛡️ I'm here to help with safety and travel guidance for St. Kitts and Nevis. Whether you need emergency information, health tips, or security advice, I'm your guardian companion.`;
      } else {
        return `🌺 I'd love to help you discover the magic of St. Kitts and Nevis! Ask me about our culture, history, attractions, food, or anything else about our beautiful twin islands.`;
      }
  }
}

/**
 * Get fallback error response with persona awareness
 */
function getFallbackErrorResponse(persona: string, language: string): string {
  const isGuardian = persona.toLowerCase().includes('guardian');
  
  if (isGuardian) {
    return `🛡️ I'm experiencing temporary technical difficulties, but your safety remains my priority. St. Kitts and Nevis is a safe destination with friendly locals. For emergencies, always call 911. Please try your question again shortly.`;
  }
  
  return `🌺 I'm having a brief technical moment, but I'm still here to help you explore St. Kitts and Nevis! Our islands offer amazing history, culture, and natural beauty. Please try asking your question again, and I'll do my best to assist you!`;
}

/**
 * Legacy compatibility function with enhanced features
 */
export async function generateChatbotResponse(
  input: string,
  persona: string = 'Ancestra',
  tone: string = 'Auto-Detect',
  language: string = 'English',
  chatId?: string,
  conversationHistory?: any[]
): Promise<string> {
  const result = await processChatbotQuery(input, persona, tone, language, undefined, chatId, conversationHistory);
  
  // If there's a transition message, include it
  if (result.transitionMessage) {
    return `${result.transitionMessage}\n\n${result.content}`;
  }
  
  return result.content;
}

/**
 * Get conversation insights for analytics
 */
export function getConversationInsights(messages: any[]): {
  dominantPersona: string;
  emotionalTrend: string;
  queryTypes: string[];
  recommendations: string[];
} {
  if (!messages || messages.length === 0) {
    return {
      dominantPersona: 'Ancestra',
      emotionalTrend: 'neutral',
      queryTypes: [],
      recommendations: ['Start a conversation to get personalized insights!']
    };
  }

  // Analyze query types in conversation
  const queryTypes = messages
    .filter(msg => msg.role === 'user')
    .map(msg => detectQueryType(msg.content))
    .filter((type, index, arr) => arr.indexOf(type) === index);

  // Simple persona analysis
  const personaCounts: Record<string, number> = {};
  messages.forEach(msg => {
    if (msg.persona) {
      personaCounts[msg.persona] = (personaCounts[msg.persona] || 0) + 1;
    }
  });

  const dominantPersona = Object.entries(personaCounts).reduce(
    (max, [persona, count]) => count > max.count ? { persona, count } : max,
    { persona: 'Ancestra', count: 0 }
  ).persona;

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (queryTypes.includes('safety') && queryTypes.includes('tourism')) {
    recommendations.push('Great balance of safety and cultural exploration!');
  } else if (queryTypes.includes('tourism') && !queryTypes.includes('safety')) {
    recommendations.push('Consider asking about safety tips for your planned activities');
  } else if (queryTypes.includes('safety') && !queryTypes.includes('tourism')) {
    recommendations.push('Explore our cultural attractions and local experiences!');
  }

  if (queryTypes.length === 1) {
    recommendations.push('Try asking about different aspects of St. Kitts & Nevis');
  }

  return {
    dominantPersona,
    emotionalTrend: 'positive', // Could be enhanced with sentiment analysis
    queryTypes,
    recommendations: recommendations.length > 0 ? recommendations : ['Keep exploring our beautiful islands!']
  };
}