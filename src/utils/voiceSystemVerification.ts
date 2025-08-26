// Voice System Verification Utility
import { ELEVENLABS_VOICE_MAP, VOICE_CONFIG, PERSONA_AVATARS } from './constants';
import { generatePersonaSpeech, isPersonaVoiceConfigured } from './elevenLabsService';
import { isElevenLabsAvailable, getElevenLabsApiKey, isBrowserTTSFallbackEnabled } from './config';

interface VoiceSystemStatus {
  isConfigured: boolean;
  apiKeyAvailable: boolean;
  personaCount: number;
  voiceCount: number;
  missingVoices: string[];
  status: 'healthy' | 'warning' | 'error';
  message: string;
  elevenLabsAvailable: boolean;
  browserTTSAvailable: boolean;
}

/**
 * Comprehensive voice system verification
 */
export async function verifyVoiceSystem(): Promise<VoiceSystemStatus> {
  console.log('🔍 Verifying Voice System...');
  
  const result: VoiceSystemStatus = {
    isConfigured: false,
    apiKeyAvailable: false,
    personaCount: 0,
    voiceCount: 0,
    missingVoices: [],
    status: 'error',
    message: 'System not verified',
    elevenLabsAvailable: false,
    browserTTSAvailable: false
  };

  try {
    // Check ElevenLabs availability
    result.elevenLabsAvailable = isElevenLabsAvailable();
    result.apiKeyAvailable = !!getElevenLabsApiKey();
    
    // Check browser TTS availability
    result.browserTTSAvailable = isBrowserTTSFallbackEnabled() && 'speechSynthesis' in window;

    // Count personas and voices
    const personas = Object.keys(PERSONA_AVATARS);
    const voiceMap = Object.keys(ELEVENLABS_VOICE_MAP);
    
    result.personaCount = personas.length;
    result.voiceCount = voiceMap.length;

    // Check for missing voice configurations
    for (const persona of personas) {
      if (!isPersonaVoiceConfigured(persona)) {
        result.missingVoices.push(persona);
      }
    }

    // Determine system status
    if (result.elevenLabsAvailable && result.missingVoices.length === 0) {
      result.status = 'healthy';
      result.message = `Voice system fully configured with ElevenLabs (${result.voiceCount} voices for ${result.personaCount} personas)`;
      result.isConfigured = true;
    } else if (result.elevenLabsAvailable && result.missingVoices.length <= 2) {
      result.status = 'warning';
      result.message = `ElevenLabs available but missing some voice configs: ${result.missingVoices.join(', ')}`;
      result.isConfigured = true;
    } else if (result.browserTTSAvailable) {
      result.status = 'warning';
      result.message = `ElevenLabs unavailable, using browser TTS fallback`;
      result.isConfigured = true;
    } else {
      result.status = 'error';
      result.message = `No voice systems available`;
    }

    console.log(`✅ Voice System Status: ${result.status.toUpperCase()}`);
    console.log(`📊 ElevenLabs: ${result.elevenLabsAvailable ? '✅' : '❌'}, Browser TTS: ${result.browserTTSAvailable ? '✅' : '❌'}`);
    console.log(`🎵 Personas: ${result.personaCount}, Voices: ${result.voiceCount}`);
    
    if (result.missingVoices.length > 0) {
      console.warn(`⚠️ Missing voice configs for:`, result.missingVoices);
    }

    return result;

  } catch (error) {
    console.error('❌ Voice system verification failed:', error);
    result.status = 'error';
    result.message = `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return result;
  }
}

/**
 * Test voice generation for a specific persona
 */
export async function testPersonaVoiceGeneration(persona: string): Promise<{
  success: boolean;
  error?: string;
  audioUrl?: string;
  usedFallback?: boolean;
}> {
  console.log(`🎵 Testing voice generation for ${persona}...`);
  
  try {
    const testText = `Hello! I'm ${persona}, and this is a test of my voice synthesis.`;
    
    if (isElevenLabsAvailable()) {
      const result = await generatePersonaSpeech({
        text: testText,
        persona
      });

      if (result.success) {
        console.log(`✅ ElevenLabs voice test successful for ${persona}`);
        return {
          success: true,
          audioUrl: result.audioUrl,
          usedFallback: false
        };
      } else {
        console.warn(`⚠️ ElevenLabs failed for ${persona}, trying browser TTS`);
      }
    }

    // Try browser TTS fallback
    if (isBrowserTTSFallbackEnabled() && 'speechSynthesis' in window) {
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(testText);
        utterance.onend = () => {
          console.log(`✅ Browser TTS test successful for ${persona}`);
          resolve({
            success: true,
            usedFallback: true
          });
        };
        utterance.onerror = () => {
          console.error(`❌ Browser TTS failed for ${persona}`);
          resolve({
            success: false,
            error: 'Browser TTS failed',
            usedFallback: true
          });
        };
        window.speechSynthesis.speak(utterance);
      });
    }

    return {
      success: false,
      error: 'No voice systems available'
    };

  } catch (error) {
    console.error(`❌ Voice test exception for ${persona}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generate voice system report
 */
export function generateVoiceSystemReport(): string {
  const personas = Object.entries(PERSONA_AVATARS);
  const voices = Object.entries(ELEVENLABS_VOICE_MAP);
  
  let report = '🎵 VOICE SYSTEM CONFIGURATION REPORT\n';
  report += '='.repeat(50) + '\n\n';
  
  report += `📊 OVERVIEW:\n`;
  report += `   • Total Personas: ${personas.length}\n`;
  report += `   • Total Voices: ${voices.length}\n`;
  report += `   • ElevenLabs: ${isElevenLabsAvailable() ? '✅ Available' : '❌ Unavailable'}\n`;
  report += `   • Browser TTS: ${isBrowserTTSFallbackEnabled() && 'speechSynthesis' in window ? '✅ Available' : '❌ Unavailable'}\n`;
  report += `   • API Key: ${getElevenLabsApiKey() ? '✅ Configured' : '❌ Missing'}\n\n`;
  
  report += `🎭 PERSONA-VOICE MAPPING:\n`;
  for (const [personaId, personaInfo] of personas) {
    const voiceId = ELEVENLABS_VOICE_MAP[personaId as keyof typeof ELEVENLABS_VOICE_MAP];
    const hasConfig = isPersonaVoiceConfigured(personaId);
    const status = voiceId && hasConfig ? '✅' : '❌';
    
    report += `   ${status} ${personaInfo.icon} ${personaInfo.name}\n`;
    report += `      Voice ID: ${voiceId || 'Not configured'}\n`;
    report += `      Config: ${hasConfig ? 'Available' : 'Missing'}\n\n`;
  }
  
  report += `🔊 ELEVENLABS VOICE IDS:\n`;
  for (const [persona, voiceId] of voices) {
    report += `   • ${persona}: ${voiceId}\n`;
  }
  
  return report;
}

/**
 * Auto-run verification on import (development only)
 */
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  verifyVoiceSystem().then(status => {
    if (status.status === 'healthy') {
      console.log('🎵 Voice system ready!');
    } else if (status.status === 'warning') {
      console.warn('⚠️ Voice system has warnings:', status.message);
    } else {
      console.error('❌ Voice system has issues:', status.message);
    }
  }).catch(error => {
    console.error('❌ Voice system verification failed:', error);
  });
}

export default {
  verifyVoiceSystem,
  testPersonaVoiceGeneration,
  generateVoiceSystemReport
};