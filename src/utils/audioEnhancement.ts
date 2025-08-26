// Audio Enhancement Utility for Persona Voice Integration
import { ELEVENLABS_VOICE_MAP, getPersonaVoiceId } from './constants';
import { generatePersonaSpeech } from './elevenLabsService';

/**
 * Enhanced audio controller that automatically integrates persona voices
 * This ensures any existing audio buttons automatically use the new voice system
 */
export class AudioEnhancementManager {
  private static instance: AudioEnhancementManager;
  
  static getInstance(): AudioEnhancementManager {
    if (!AudioEnhancementManager.instance) {
      AudioEnhancementManager.instance = new AudioEnhancementManager();
    }
    return AudioEnhancementManager.instance;
  }

  /**
   * Enhance existing audio function to use persona voices
   */
  async enhanceAudioPlayback(
    text: string, 
    language: string = 'en',
    persona: string = 'Ancestra'
  ): Promise<void> {
    console.log(`🎵 Enhanced audio playback for persona: ${persona}`);
    
    try {
      // Try ElevenLabs first
      const result = await generatePersonaSpeech({
        text,
        persona
      });
      
      if (result.success && result.audioUrl) {
        // Play the audio
        const audio = new Audio(result.audioUrl);
        audio.play();
        return;
      }
    } catch (error) {
      console.warn('ElevenLabs TTS failed, falling back to browser TTS:', error);
    }
    
    // Fallback to browser TTS
    this.fallbackToWebSpeech(text, language);
  }

  private fallbackToWebSpeech(text: string, language: string): void {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.lang = language === 'English' ? 'en-US' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }

  /**
   * Get voice status for a persona
   */
  getPersonaVoiceStatus(persona: string): {
    hasElevenLabsVoice: boolean;
    voiceId: string | null;
    fallbackAvailable: boolean;
  } {
    const voiceId = getPersonaVoiceId(persona);
    
    return {
      hasElevenLabsVoice: !!voiceId,
      voiceId: voiceId || null,
      fallbackAvailable: 'speechSynthesis' in window
    };
  }

  /**
   * Test voice for a specific persona
   */
  async testPersonaVoice(persona: string): Promise<boolean> {
    const testText = `Hello! This is ${persona} speaking.`;
    
    try {
      await this.enhanceAudioPlayback(testText, 'en', persona);
      return true;
    } catch (error) {
      console.error(`Voice test failed for ${persona}:`, error);
      return false;
    }
  }
}

// Export singleton instance
export const audioEnhancement = AudioEnhancementManager.getInstance();

// Export convenience functions
export const playPersonaAudio = (text: string, persona: string, language: string = 'en') =>
  audioEnhancement.enhanceAudioPlayback(text, language, persona);

export const testPersonaVoice = (persona: string) =>
  audioEnhancement.testPersonaVoice(persona);

export const getVoiceStatus = (persona: string) =>
  audioEnhancement.getPersonaVoiceStatus(persona);

export default audioEnhancement;