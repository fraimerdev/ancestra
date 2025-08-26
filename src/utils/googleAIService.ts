import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSystemPrompt, buildSystemPromptWithData, UserProfile, PromptBuilderConfig } from './promptBuilder';
import { detectPersonaModifiers, PersonaDetectionResult } from './personaDetection';

// Enhanced interface for chat messages
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
  persona?: string;
  detectedEmotion?: string;
}

interface ConversationContext {
  messages: ChatMessage[];
  currentPersona: string;
  userProfile: UserProfile;
  conversationHistory: {
    preferred_persona?: string;
    previous_persona?: string;
    message_count?: number;
    emotional_context?: string[];
  };
}

interface GoogleAIResponse {
  response: string;
  persona: string;
  personaDetection: PersonaDetectionResult;
  transitionMessage?: string;
  error?: string;
}

class GoogleAIService {
  private genAI: GoogleGenerativeAI | null = null;
  private apiKey: string | null = null;
  private lastRequestTime: number = 0;
  private requestCount: number = 0;
  private quotaResetTime: number = 0;

  /**
   * Initialize the Google AI service
   */
  initialize(apiKey: string): void {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Google AI Service initialized with API key and tourism data integration');
  }

  /**
   * Check if the service is properly initialized
   */
  isInitialized(): boolean {
    return this.genAI !== null && this.apiKey !== null;
  }

  /**
   * Get API key with fallback to pre-configured key
   */
  private getApiKey(): string {
    if (this.apiKey) {
      return this.apiKey;
    }

    // Try environment variables first
    let envKey: string | undefined;
    
    try {
      if (typeof window !== 'undefined') {
        // Browser environment
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
    } catch (error) {
      console.warn('Environment variable access failed:', error);
    }

    // Use the pre-configured API key if environment variables are not available
    if (!envKey) {
      envKey = "AIzaSyDpvQM-7jWsUInf6i28XjU7mk9mYx2Sgz0";
      console.log('🔑 Using pre-configured Google Gemini API key');
    }

    if (envKey) {
      this.apiKey = envKey;
      return envKey;
    }

    throw new Error('Google Gemini API key not found.');
  }

  /**
   * Implement rate limiting and retry logic for quota errors
   */
  private async handleRateLimit(): Promise<void> {
    const now = Date.now();
    
    // Reset counter if it's a new minute
    if (now - this.quotaResetTime > 60000) {
      this.requestCount = 0;
      this.quotaResetTime = now;
    }

    // If we're approaching the free tier limit (15 requests per minute), add delay
    if (this.requestCount >= 10) {
      const delayMs = Math.min(5000, (this.requestCount - 9) * 1000);
      console.log(`⏳ Rate limiting: waiting ${delayMs}ms before request`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    // Ensure minimum time between requests (4 seconds for free tier)
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < 4000) {
      const delayMs = 4000 - timeSinceLastRequest;
      console.log(`⏳ Quota protection: waiting ${delayMs}ms between requests`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    this.requestCount++;
    this.lastRequestTime = Date.now();
  }

  /**
   * Retry logic for quota exceeded errors
   */
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.handleRateLimit();
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (error instanceof Error && error.message.includes('429')) {
          // Quota exceeded - implement exponential backoff
          const backoffMs = Math.min(30000, Math.pow(2, attempt) * 2000); // Max 30 seconds
          console.log(`⚠️ Quota exceeded, attempt ${attempt}/${maxRetries}. Retrying in ${backoffMs}ms...`);
          
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, backoffMs));
            continue;
          }
        }
        
        // If it's not a quota error or we've exhausted retries, throw immediately
        throw error;
      }
    }

    throw lastError;
  }

  /**
   * Enhance user profile with dynamic detection
   */
  private enhanceUserProfile(
    userInput: string,
    baseProfile: UserProfile,
    conversationContext: ConversationContext
  ): UserProfile {
    // Auto-detect family situation from message content
    const hasInfantKeywords = /\b(baby|infant|toddler|child|stroller|diaper)\b/i.test(userInput);
    const hasTeenKeywords = /\b(teen|teenager|young adult|student|adventure)\b/i.test(userInput);
    const hasAccessibilityKeywords = /\b(disability|wheelchair|accessible|special needs)\b/i.test(userInput);
    const hasLuxuryKeywords = /\b(luxury|premium|exclusive|VIP|high-end)\b/i.test(userInput);
    const hasBudgetKeywords = /\b(budget|cheap|affordable|backpacking|economy)\b/i.test(userInput);

    const enhanced: UserProfile = { ...baseProfile };

    if (hasInfantKeywords && !enhanced.family) {
      enhanced.family = 'infant';
    }

    if (hasTeenKeywords && !enhanced.age) {
      enhanced.age = 'teenager';
    }

    if (hasAccessibilityKeywords && !enhanced.accessibility) {
      enhanced.accessibility = 'required';
    }

    if (hasLuxuryKeywords && !enhanced.budget) {
      enhanced.budget = 'luxury';
    }

    if (hasBudgetKeywords && !enhanced.budget) {
      enhanced.budget = 'economy';
    }

    return enhanced;
  }

  /**
   * Generate AI response with dynamic persona detection and tourism data
   */
  async generateResponse(
    userInput: string,
    conversationContext: ConversationContext,
    mode: 'ancestra' | 'guardian' = 'ancestra'
  ): Promise<GoogleAIResponse> {
    try {
      if (!this.isInitialized()) {
        const apiKey = this.getApiKey();
        this.initialize(apiKey);
      }

      if (!this.genAI) {
        throw new Error('Google AI service not properly initialized');
      }

      // Enhance user profile with dynamic detection
      const enhancedProfile = this.enhanceUserProfile(
        userInput,
        conversationContext.userProfile,
        conversationContext
      );

      // Detect appropriate persona
      const personaDetection = detectPersonaModifiers(
        userInput,
        enhancedProfile,
        conversationContext.conversationHistory
      );

      console.log('🎭 Persona Detection Result:', {
        selectedPersona: personaDetection.selectedPersona,
        confidence: personaDetection.confidence,
        reasoning: personaDetection.reasoning
      });

      // Build system prompt with detected persona and tourism data
      const promptConfig: PromptBuilderConfig = {
        mode,
        persona: personaDetection.selectedPersona,
        userProfile: enhancedProfile,
        userQuery: userInput
      };

      // Try to use the async version with full tourism data, fallback to sync version
      let systemPrompt: string;
      try {
        systemPrompt = await buildSystemPromptWithData(promptConfig);
        console.log('📊 System prompt built with full tourism data - length:', systemPrompt.length);
      } catch (error) {
        console.warn('⚠️ Could not load full tourism data, using basic version:', error);
        systemPrompt = buildSystemPrompt(promptConfig);
        console.log('📊 System prompt built with basic tourism data - length:', systemPrompt.length);
      }

      // Use the more efficient gemini-1.5-flash model with sufficient token allowance for tourism data
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: systemPrompt
      });

      // Generate content with retry logic and proper token limits
      console.log('🚀 Sending request to Google Gemini with St. Kitts tourism data...');
      
      const result = await this.retryWithBackoff(async () => {
        return await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: userInput }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000, // Increased to allow for detailed tourism responses
            topP: 0.8,
            topK: 40
          }
        });
      });

      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Empty response from Google Gemini');
      }

      console.log('✅ Received tourism-aware response from Google Gemini');

      // Update conversation history
      conversationContext.conversationHistory.previous_persona = conversationContext.currentPersona;
      conversationContext.conversationHistory.preferred_persona = personaDetection.selectedPersona;
      conversationContext.conversationHistory.message_count = (conversationContext.conversationHistory.message_count || 0) + 1;

      return {
        response: text,
        persona: personaDetection.selectedPersona,
        personaDetection,
        transitionMessage: personaDetection.transitions
      };

    } catch (error) {
      console.error('❌ Google AI Service Error:', error);
      
      let errorMessage = 'Failed to generate AI response';
      
      if (error instanceof Error) {
        if (error.message.includes('429') || error.message.includes('quota')) {
          errorMessage = "I'm experiencing high demand right now. Please wait a moment and try again. Your message is important to me! 🌺";
        } else if (error.message.includes('API key')) {
          errorMessage = 'Invalid or missing Google Gemini API key. Please check your configuration.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error while connecting to Google Gemini. Please check your connection.';
        } else {
          errorMessage = error.message;
        }
      }

      return {
        response: errorMessage,
        persona: 'Auto-Detect',
        personaDetection: {
          selectedPersona: 'Auto-Detect',
          confidence: 0,
          reasoning: ['Error occurred during processing']
        },
        error: errorMessage
      };
    }
  }

  /**
   * Generate response for specific mode and persona
   */
  async generateResponseWithMode(
    userInput: string,
    mode: 'ancestra' | 'guardian',
    persona: string,
    userProfile: UserProfile = {},
    conversationHistory: any = {}
  ): Promise<GoogleAIResponse> {
    const context: ConversationContext = {
      messages: [],
      currentPersona: persona,
      userProfile,
      conversationHistory
    };

    return this.generateResponse(userInput, context, mode);
  }

  /**
   * Test the Google AI connection (only when explicitly requested)
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.isInitialized()) {
        const apiKey = this.getApiKey();
        this.initialize(apiKey);
      }

      const testResponse = await this.generateResponseWithMode(
        'Hello, tell me about St. Kitts',
        'ancestra',
        'Auto-Detect'
      );

      if (testResponse.error) {
        return {
          success: false,
          message: testResponse.error
        };
      }

      return {
        success: true,
        message: 'Google Gemini AI with St. Kitts tourism data connection successful! 🎉'
      };

    } catch (error) {
      if (error instanceof Error && error.message.includes('429')) {
        return {
          success: false,
          message: 'Quota temporarily exceeded. The AI will work when you send your first message! 🌺'
        };
      }
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get available models
   */
  getAvailableModels(): string[] {
    return [
      'gemini-1.5-flash', // Primary model - more efficient and suitable for tourism data
      'gemini-1.5-pro',   // Fallback if needed
      'gemini-1.0-pro'    // Legacy support
    ];
  }

  /**
   * Get service status
   */
  getStatus(): { initialized: boolean; hasApiKey: boolean; model: string } {
    return {
      initialized: this.isInitialized(),
      hasApiKey: this.apiKey !== null,
      model: 'gemini-1.5-flash' // Updated to reflect the new model
    };
  }

  /**
   * Get quota usage info
   */
  getQuotaInfo(): { requestCount: number; lastRequestTime: number; quotaResetTime: number } {
    return {
      requestCount: this.requestCount,
      lastRequestTime: this.lastRequestTime,
      quotaResetTime: this.quotaResetTime
    };
  }
}

// Create and export singleton instance
export const googleAIService = new GoogleAIService();

// Export types and classes
export type { ChatMessage, ConversationContext, GoogleAIResponse, UserProfile };
export { GoogleAIService };

// Export utility functions
export {
  buildSystemPrompt,
  buildSystemPromptWithData,
  detectPersonaModifiers,
  getAvailablePersonas,
  getPersonaEmojis
} from './promptBuilder';