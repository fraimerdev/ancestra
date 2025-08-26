import { googleAIService, ConversationContext, GoogleAIResponse } from './googleAIService';
import { UserProfile } from './promptBuilder';

// Enhanced chat message interface
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  persona?: string;
  mode?: 'ancestra' | 'guardian';
  personaDetection?: any;
  transitionMessage?: string;
}

interface AIServiceConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Enhanced AI Service with Google Gemini integration and quota management
 */
class AIService {
  private isInitialized = false;
  private config: AIServiceConfig = {};

  /**
   * Initialize the AI service with pre-configured API key
   */
  async initialize(config: AIServiceConfig = {}): Promise<void> {
    this.config = { ...this.config, ...config };

    // First check if API key is provided in config
    if (config.apiKey) {
      googleAIService.initialize(config.apiKey);
      console.log('✅ AI Service initialized with provided Google Gemini API key');
      this.isInitialized = true;
      return;
    }

    // Use the pre-configured API key from environment
    let envKey: string | undefined;
    
    try {
      if (typeof window !== 'undefined') {
        // Browser environment - check multiple possible environment variable names
        envKey = import.meta.env?.VITE_GEMINI_API_KEY || 
                import.meta.env?.VITE_GOOGLE_GEMINI_API_KEY ||
                import.meta.env?.GEMINI_API_KEY ||
                import.meta.env?.GOOGLE_GEMINI_API_KEY ||
                (window as any).__ENV__?.GEMINI_API_KEY ||
                (window as any).__ENV__?.GOOGLE_GEMINI_API_KEY;
      } else {
        // Node environment
        envKey = process?.env?.GEMINI_API_KEY || 
                process?.env?.GOOGLE_GEMINI_API_KEY;
      }

      // Fallback: Use the known API key directly (since it's provided in secrets)
      if (!envKey) {
        envKey = "AIzaSyDpvQM-7jWsUInf6i28XjU7mk9mYx2Sgz0";
        console.log('🔑 Using pre-configured Google Gemini API key');
      }

    } catch (error) {
      console.warn('Environment variable access failed, using fallback:', error);
      // Use the pre-configured API key as fallback
      envKey = "AIzaSyDpvQM-7jWsUInf6i28XjU7mk9mYx2Sgz0";
    }
    
    if (envKey) {
      googleAIService.initialize(envKey);
      console.log('✅ AI Service initialized with Google Gemini API key');
    } else {
      console.error('❌ No API key found - AI Service initialization failed');
    }

    this.isInitialized = true;
  }

  /**
   * Check if service is initialized
   */
  isReady(): boolean {
    return this.isInitialized && googleAIService.isInitialized();
  }

  /**
   * Check if service has a valid API key
   */
  hasApiKey(): boolean {
    return googleAIService.isInitialized();
  }

  /**
   * Generate AI response with enhanced persona detection and quota management
   */
  async generateResponse(
    userMessage: string,
    context: {
      mode: 'ancestra' | 'guardian';
      currentPersona: string;
      userProfile?: any;
      conversationHistory?: ChatMessage[];
      language?: string;
      userName?: string;
    }
  ): Promise<{
    response: string;
    persona: string;
    personaDetection?: any;
    transitionMessage?: string;
    error?: string;
  }> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (!this.hasApiKey()) {
        console.error('❌ AI Service: No API key available');
        return {
          response: "I apologize, but I'm experiencing technical difficulties with my AI system. Please try again in a moment.",
          persona: context.currentPersona,
          error: 'API key not available'
        };
      }

      // Convert context to the format expected by Google AI service
      const userProfile: UserProfile = {
        origin: context.userProfile?.origin,
        age: context.userProfile?.age,
        family: context.userProfile?.family,
        budget: context.userProfile?.budget,
        accessibility: context.userProfile?.accessibility,
        manual_persona: context.userProfile?.manual_persona || context.currentPersona
      };

      // Build conversation context
      const conversationContext: ConversationContext = {
        messages: context.conversationHistory?.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          persona: msg.persona
        })) || [],
        currentPersona: context.currentPersona,
        userProfile,
        conversationHistory: {
          preferred_persona: context.currentPersona,
          previous_persona: context.conversationHistory?.[context.conversationHistory.length - 2]?.persona,
          message_count: context.conversationHistory?.length || 0,
          emotional_context: []
        }
      };

      // Generate response using Google Gemini with quota management
      const aiResponse = await googleAIService.generateResponse(
        userMessage,
        conversationContext,
        context.mode
      );

      if (aiResponse.error && aiResponse.error.includes('quota')) {
        console.log('⚠️ Quota management: Providing helpful response during quota limit');
        return {
          response: "I'm experiencing high demand right now, but I'm here to help! 🌺 Please try your question again in a moment, and I'll give you my full attention. In the meantime, you can explore the Discovery Hub for instant information about St. Kitts and Nevis!",
          persona: context.currentPersona,
          error: 'quota_exceeded'
        };
      }

      if (aiResponse.error) {
        console.error('❌ AI Service Error:', aiResponse.error);
        return {
          response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
          persona: context.currentPersona,
          error: aiResponse.error
        };
      }

      console.log('✅ AI Response generated successfully:', {
        persona: aiResponse.persona,
        confidence: aiResponse.personaDetection.confidence,
        hasTransition: !!aiResponse.transitionMessage
      });

      return {
        response: aiResponse.response,
        persona: aiResponse.persona,
        personaDetection: aiResponse.personaDetection,
        transitionMessage: aiResponse.transitionMessage
      };

    } catch (error) {
      console.error('❌ AI Service Error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Special handling for quota errors
      if (errorMessage.includes('429') || errorMessage.includes('quota')) {
        return {
          response: "I'm experiencing high demand right now! 🌺 Please wait a moment and try again. Your message is important to me!",
          persona: context.currentPersona,
          error: 'quota_exceeded'
        };
      }
      
      return {
        response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        persona: context.currentPersona,
        error: errorMessage
      };
    }
  }

  /**
   * Legacy support for existing chat system
   */
  async getChatResponse(
    message: string,
    persona: string,
    mode: string,
    language: string = 'English',
    personaTone: string = 'Auto-Detect',
    userName: string = '',
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      const response = await this.generateResponse(message, {
        mode: mode as 'ancestra' | 'guardian',
        currentPersona: persona,
        userProfile: {
          manual_persona: personaTone !== 'Auto-Detect' ? personaTone : undefined
        },
        conversationHistory,
        language,
        userName
      });

      // If there's a transition message, prepend it to the response
      if (response.transitionMessage) {
        return `${response.transitionMessage}\n\n${response.response}`;
      }

      return response.response;

    } catch (error) {
      console.error('❌ Legacy chat response error:', error);
      if (error instanceof Error && (error.message.includes('429') || error.message.includes('quota'))) {
        return "I'm experiencing high demand right now! 🌺 Please wait a moment and try again.";
      }
      return "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.";
    }
  }

  /**
   * Test the AI connection (only when explicitly requested)
   */
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const testResult = await googleAIService.testConnection();
      
      return {
        success: testResult.success,
        message: testResult.success ? 'Google Gemini AI is working perfectly! 🎉' : testResult.message,
        details: {
          service: 'Google Gemini',
          model: 'gemini-1.5-flash',
          initialized: this.isReady(),
          hasApiKey: this.hasApiKey(),
          quotaInfo: googleAIService.getQuotaInfo()
        }
      };

    } catch (error) {
      if (error instanceof Error && error.message.includes('429')) {
        return {
          success: false,
          message: 'Quota temporarily exceeded. The AI will work when you send your first message! 🌺',
          details: {
            service: 'Google Gemini',
            initialized: true,
            quotaLimited: true
          }
        };
      }
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection test failed',
        details: {
          service: 'Google Gemini',
          initialized: false,
          error: error
        }
      };
    }
  }

  /**
   * Get service status information
   */
  getStatus(): {
    initialized: boolean;
    ready: boolean;
    hasApiKey: boolean;
    service: string;
    model: string;
    features: string[];
  } {
    return {
      initialized: this.isInitialized,
      ready: this.isReady(),
      hasApiKey: this.hasApiKey(),
      service: 'Google Gemini AI with Dynamic Persona Detection',
      model: 'gemini-1.5-flash', // Updated to reflect the more efficient model
      features: [
        'Dynamic Persona Detection',
        'Multilingual Support',
        'Contextual Sub-Agents',
        'Emotion-Based Adaptation',
        'Cultural Pattern Recognition',
        'Automatic Mode Switching',
        'Intelligent Quota Management'
      ]
    };
  }

  /**
   * Update API key (for backwards compatibility)
   */
  updateApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
    googleAIService.initialize(apiKey);
    console.log('✅ API key updated successfully');
  }

  /**
   * Get conversation insights
   */
  getConversationInsights(messages: ChatMessage[]): {
    dominantPersona: string;
    emotionalTrend: string;
    engagementLevel: string;
    recommendations: string[];
  } {
    if (messages.length === 0) {
      return {
        dominantPersona: 'Auto-Detect',
        emotionalTrend: 'neutral',
        engagementLevel: 'low',
        recommendations: ['Start a conversation to get insights']
      };
    }

    // Analyze persona usage
    const personaCount: Record<string, number> = {};
    messages.forEach(msg => {
      if (msg.persona) {
        personaCount[msg.persona] = (personaCount[msg.persona] || 0) + 1;
      }
    });

    const dominantPersona = Object.entries(personaCount).reduce(
      (max, [persona, count]) => count > max.count ? { persona, count } : max,
      { persona: 'Auto-Detect', count: 0 }
    ).persona;

    // Simple engagement analysis
    const avgMessageLength = messages.reduce((sum, msg) => sum + msg.content.length, 0) / messages.length;
    const engagementLevel = avgMessageLength > 100 ? 'high' : avgMessageLength > 50 ? 'medium' : 'low';

    // Generate recommendations
    const recommendations: string[] = [];
    if (dominantPersona === 'Auto-Detect') {
      recommendations.push('Try selecting a specific persona for more personalized interactions');
    }
    if (engagementLevel === 'low') {
      recommendations.push('Ask more detailed questions to get comprehensive responses');
    }

    return {
      dominantPersona,
      emotionalTrend: 'neutral', // Could be enhanced with sentiment analysis
      engagementLevel,
      recommendations
    };
  }

  /**
   * Get quota usage information
   */
  getQuotaInfo(): { requestCount: number; lastRequestTime: number; quotaResetTime: number } {
    return googleAIService.getQuotaInfo();
  }
}

// Create and export singleton instance
export const aiService = new AIService();

/**
 * Get AI system status for debugging and monitoring
 */
export function getAISystemStatus(): {
  service: string;
  initialized: boolean;
  ready: boolean;
  hasApiKey: boolean;
  model: string;
  features: string[];
  lastCheck?: Date;
} {
  const status = aiService.getStatus();
  
  return {
    service: status.service || 'Google Gemini AI',
    initialized: status.initialized || false,
    ready: status.ready || false,
    hasApiKey: status.hasApiKey || false,
    model: status.model || 'gemini-1.5-flash',
    features: status.features || [
      'Dynamic Persona Detection',
      'Multilingual Support',
      'Contextual Sub-Agents',
      'Emotion-Based Adaptation',
      'Intelligent Quota Management'
    ],
    lastCheck: new Date()
  };
}

// Export types and interfaces
export type { ChatMessage, AIServiceConfig };
export { AIService };

// Export for backward compatibility
export default aiService;