// ElevenLabs TTS Service for Persona Voices - Enhanced Error Handling
import { ELEVENLABS_VOICE_MAP, VOICE_CONFIG, getPersonaVoiceId, getPersonaVoiceSettings } from './constants';
import { getElevenLabsApiKey, isElevenLabsAvailable, getConfig, isBrowserTTSFallbackEnabled } from './config';

interface ElevenLabsResponse {
  success: boolean;
  audioUrl?: string;
  error?: string;
  usedFallback?: boolean;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

interface SpeechRequest {
  text: string;
  persona: string;
  model_id?: string;
}

/**
 * Generate speech using ElevenLabs API for a specific persona with enhanced error handling
 */
export async function generatePersonaSpeech(request: SpeechRequest): Promise<ElevenLabsResponse> {
  try {
    // Check if ElevenLabs is available
    if (!isElevenLabsAvailable()) {
      console.warn('⚠️ ElevenLabs service not available, will use browser TTS fallback');
      return {
        success: false,
        error: 'ElevenLabs service not configured',
        usedFallback: false
      };
    }

    const apiKey = getElevenLabsApiKey();
    
    if (!apiKey) {
      console.warn('⚠️ ElevenLabs API key not found, will use browser TTS fallback');
      return {
        success: false,
        error: 'ElevenLabs API key not configured',
        usedFallback: false
      };
    }

    // Get voice ID for the persona
    const voiceId = getPersonaVoiceId(request.persona);
    if (!voiceId) {
      console.warn(`⚠️ No voice ID found for persona: ${request.persona}, will use browser TTS fallback`);
      return {
        success: false,
        error: `Voice not configured for persona: ${request.persona}`,
        usedFallback: false
      };
    }

    // Get voice settings for the persona
    const voiceSettings = getPersonaVoiceSettings(request.persona);
    
    const baseUrl = getConfig('ELEVENLABS_BASE_URL') as string;
    const url = `${baseUrl}/text-to-speech/${voiceId}`;
    
    console.log(`🎵 Attempting ElevenLabs TTS for persona '${request.persona}' with voice ID: ${voiceId}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: request.text,
        model_id: request.model_id || getConfig('ELEVENLABS_MODEL'),
        voice_settings: voiceSettings
      })
    });

    if (!response.ok) {
      let errorMessage = `API error: ${response.status} - ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        
        // Enhanced error handling for common ElevenLabs errors
        if (response.status === 401) {
          errorMessage = 'ElevenLabs API key is invalid or expired';
        } else if (response.status === 429 || errorData.detail?.status === 'voice_limit_reached') {
          errorMessage = 'ElevenLabs voice limit reached. Using browser TTS instead.';
          console.warn('⚠️ ElevenLabs voice limit reached, falling back to browser TTS');
        } else if (response.status === 400) {
          errorMessage = 'Invalid request to ElevenLabs API';
        } else if (response.status === 500) {
          errorMessage = 'ElevenLabs server error';
        } else if (errorData.detail?.message) {
          errorMessage = errorData.detail.message;
        }
      } catch (parseError) {
        // If we can't parse the error response, use the status text
        console.warn('⚠️ Could not parse ElevenLabs error response');
      }
      
      console.warn(`⚠️ ElevenLabs API error: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
        usedFallback: false
      };
    }

    // Convert response to blob URL for audio playback
    const audioBlob = await response.blob();
    
    // Check if we actually got audio data
    if (audioBlob.size === 0) {
      console.warn('⚠️ ElevenLabs returned empty audio blob');
      return {
        success: false,
        error: 'Empty audio response from ElevenLabs',
        usedFallback: false
      };
    }
    
    const audioUrl = URL.createObjectURL(audioBlob);
    
    console.log(`✅ ElevenLabs speech generated successfully for persona: ${request.persona}`);
    
    return {
      success: true,
      audioUrl: audioUrl,
      usedFallback: false
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.warn(`⚠️ ElevenLabs generation failed: ${errorMessage}`);
    
    return {
      success: false,
      error: errorMessage,
      usedFallback: false
    };
  }
}

/**
 * Clean up audio URL to prevent memory leaks
 */
export function cleanupAudioUrl(audioUrl: string): void {
  if (audioUrl && audioUrl.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(audioUrl);
      console.log(`🧹 Cleaned up audio URL: ${audioUrl.substring(0, 50)}...`);
    } catch (error) {
      console.warn('⚠️ Failed to cleanup audio URL:', error);
    }
  }
}

/**
 * Enhanced browser TTS fallback function with better error handling
 */
export function playWithBrowserTTS(text: string, persona: string = 'Ancestra', language: string = 'en-US'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Browser TTS not supported on this device'));
      return;
    }

    try {
      // Stop any current speech with enhanced cleanup
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        // Wait a bit for cancellation to complete
        setTimeout(() => startSpeech(), 100);
      } else {
        startSpeech();
      }

      function startSpeech() {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Get persona-specific prosody settings
        const prosody = VOICE_CONFIG[persona as keyof typeof VOICE_CONFIG]?.prosody || {
          rate: 1.0,
          pitch: 1.0,
          volume: 0.8
        };
        
        // Apply persona-specific voice settings to browser TTS
        utterance.rate = Math.max(0.1, Math.min(2.0, prosody.rate));
        utterance.pitch = Math.max(0, Math.min(2.0, prosody.pitch)); 
        utterance.volume = Math.max(0, Math.min(1.0, prosody.volume));
        utterance.lang = language;
        
        // Try to use a voice that matches the persona's gender/style
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          // Select voice based on persona characteristics
          let selectedVoice = voices.find(voice => voice.lang.startsWith(language.substring(0, 2)));
          
          if (!selectedVoice) {
            selectedVoice = voices[0]; // Fallback to first available voice
          }
          
          utterance.voice = selectedVoice;
        }
        
        utterance.onstart = () => {
          console.log(`🎵 Browser TTS started for persona: ${persona}`);
        };
        
        utterance.onend = () => {
          console.log(`✅ Browser TTS completed for persona: ${persona}`);
          resolve();
        };
        
        // FIXED: Enhanced error handling for browser TTS events
        utterance.onerror = (event) => {
          console.error(`❌ Browser TTS error for persona ${persona}:`, event);
          
          // Extract meaningful error information from the event
          let errorMessage = 'Browser TTS failed';
          
          if (event.error) {
            switch (event.error) {
              case 'network':
                errorMessage = 'Network error during speech synthesis';
                break;
              case 'synthesis-unavailable':
                errorMessage = 'Speech synthesis not available';
                break;
              case 'synthesis-failed':
                errorMessage = 'Speech synthesis failed';
                break;
              case 'language-unavailable':
                errorMessage = 'Selected language not available';
                break;
              case 'voice-unavailable':
                errorMessage = 'Selected voice not available';
                break;
              case 'text-too-long':
                errorMessage = 'Text too long for synthesis';
                break;
              case 'invalid-argument':
                errorMessage = 'Invalid argument provided to speech synthesis';
                break;
              case 'not-allowed':
                errorMessage = 'Speech synthesis not allowed (may require user interaction)';
                break;
              case 'canceled':
              case 'interrupted':
                // These are normal when stopping/switching audio
                console.log(`ℹ️ Browser TTS ${event.error} for persona: ${persona}`);
                resolve(); // Don't treat as error
                return;
              default:
                errorMessage = `Speech synthesis error: ${event.error}`;
            }
          }
          
          reject(new Error(errorMessage));
        };

        console.log(`🎵 Starting browser TTS for persona: ${persona} (rate: ${utterance.rate}, pitch: ${utterance.pitch})`);
        window.speechSynthesis.speak(utterance);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown browser TTS error';
      console.error(`❌ Browser TTS setup failed for ${persona}:`, errorMessage);
      reject(new Error(errorMessage));
    }
  });
}

/**
 * Force stop all speech synthesis with enhanced cleanup
 */
export async function forceStopSpeech(): Promise<void> {
  if ('speechSynthesis' in window) {
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Wait for cancellation to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Double-check and cancel again if still speaking
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      console.log('🛑 Browser TTS stopped and cleaned up');
    } catch (error) {
      console.warn('⚠️ Error during speech cleanup:', error);
    }
  }
}

/**
 * Check if browser TTS is actually available and working
 */
export function isBrowserTTSAvailable(): boolean {
  if (!('speechSynthesis' in window)) {
    return false;
  }
  
  try {
    // Test if we can create an utterance
    const test = new SpeechSynthesisUtterance('test');
    return true;
  } catch (error) {
    console.warn('⚠️ Browser TTS not properly available:', error);
    return false;
  }
}

/**
 * Enhanced speech generation with automatic fallback and better error handling
 */
export async function generateSpeechWithFallback(
  text: string, 
  persona: string, 
  language: string = 'en'
): Promise<{
  success: boolean;
  audioUrl?: string;
  usedFallback: boolean;
  error?: string;
}> {
  
  // Validate text first
  const { isValid, cleanText, error: validationError } = validateTTSText(text);
  
  if (!isValid) {
    return {
      success: false,
      usedFallback: false,
      error: validationError
    };
  }

  // Try ElevenLabs first if available
  if (isElevenLabsAvailable()) {
    console.log(`🎵 Attempting ElevenLabs TTS for persona: ${persona}`);
    
    try {
      const result = await generatePersonaSpeech({
        text: cleanText,
        persona
      });

      if (result.success && result.audioUrl) {
        return {
          success: true,
          audioUrl: result.audioUrl,
          usedFallback: false
        };
      }
      
      // Check if it's a quota/limit error
      if (result.error?.includes('limit reached') || result.error?.includes('quota')) {
        console.warn(`⚠️ ElevenLabs failed for ${persona}: ${result.error}`);
      } else {
        console.warn(`⚠️ ElevenLabs failed for ${persona}: ${result.error}`);
      }
    } catch (error) {
      console.warn(`⚠️ ElevenLabs threw exception for ${persona}:`, error);
    }
  } else {
    console.log(`ℹ️ ElevenLabs not available, using browser TTS for persona: ${persona}`);
  }

  // Fallback to browser TTS
  if (isBrowserTTSFallbackEnabled() && isBrowserTTSAvailable()) {
    console.log(`🔄 Using browser TTS fallback for persona: ${persona}`);
    
    try {
      await playWithBrowserTTS(cleanText, persona, language === 'English' ? 'en-US' : 'en-US');
      return {
        success: true,
        usedFallback: true
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Browser TTS failed';
      console.error(`❌ Browser TTS failed for ${persona}:`, errorMessage);
      return {
        success: false,
        usedFallback: true,
        error: errorMessage
      };
    }
  }

  return {
    success: false,
    usedFallback: false,
    error: 'No TTS options available or working'
  };
}

/**
 * Validate text for TTS (remove special characters, limit length)
 */
export function validateTTSText(text: string): { isValid: boolean; cleanText: string; error?: string } {
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      cleanText: '',
      error: 'Text cannot be empty'
    };
  }
  
  // Remove emojis and special characters that might cause TTS issues
  let cleanText = text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, '');
  
  // Limit text length for API constraints
  const maxLength = 2500;
  if (cleanText.length > maxLength) {
    cleanText = cleanText.substring(0, maxLength) + '...';
  }
  
  return {
    isValid: true,
    cleanText: cleanText.trim()
  };
}

/**
 * Test voice system with better error reporting - FIXED to prevent automatic testing
 */
export async function testVoiceSystem(): Promise<{
  elevenLabsWorking: boolean;
  browserTTSWorking: boolean;
  errors: string[];
  recommendations: string[];
}> {
  const result = {
    elevenLabsWorking: false,
    browserTTSWorking: false,
    errors: [] as string[],
    recommendations: [] as string[]
  };

  console.log('🔍 Manual voice system test initiated...');

  // Test ElevenLabs (without actually playing audio)
  if (isElevenLabsAvailable()) {
    try {
      console.log('🔍 Testing ElevenLabs API connection...');
      
      // Just test the API connection, don't generate audio
      const apiKey = getElevenLabsApiKey();
      const baseUrl = getConfig('ELEVENLABS_BASE_URL') as string;
      
      if (apiKey && baseUrl) {
        result.elevenLabsWorking = true;
        console.log('✅ ElevenLabs configuration appears valid');
      } else {
        result.errors.push('ElevenLabs API key or URL missing');
      }
    } catch (error) {
      result.errors.push(`ElevenLabs test exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } else {
    result.errors.push('ElevenLabs not configured or API key missing');
    result.recommendations.push('Configure ElevenLabs API key in settings for premium voice experience.');
  }

  // Test Browser TTS availability (without playing audio)
  if (isBrowserTTSFallbackEnabled()) {
    try {
      console.log('🔍 Testing browser TTS availability...');
      
      if (isBrowserTTSAvailable()) {
        result.browserTTSWorking = true;
        console.log('✅ Browser TTS is available');
      } else {
        result.errors.push('Browser TTS not supported on this device');
      }
    } catch (error) {
      result.errors.push(`Browser TTS test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } else {
    result.errors.push('Browser TTS not available or disabled');
    result.recommendations.push('Enable browser TTS fallback for reliable voice functionality.');
  }

  console.log('✅ Voice system test completed:', result);
  return result;
}

/**
 * Get available voices for personas
 */
export function getAvailablePersonaVoices(): { [key: string]: string } {
  return ELEVENLABS_VOICE_MAP;
}

/**
 * Test if a persona has a voice configured
 */
export function isPersonaVoiceConfigured(persona: string): boolean {
  return persona in VOICE_CONFIG;
}

/**
 * Create SSML for enhanced speech synthesis
 */
export function createSSMLForPersona(text: string, persona: string): string {
  const prosody = VOICE_CONFIG[persona as keyof typeof VOICE_CONFIG]?.prosody || {
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8
  };
  
  // Convert rate/pitch/volume to SSML attributes
  const rateValue = prosody.rate < 0.8 ? 'slow' : prosody.rate > 1.2 ? 'fast' : 'medium';
  const pitchValue = prosody.pitch < 0.9 ? 'low' : prosody.pitch > 1.1 ? 'high' : 'medium';
  
  // Add persona-specific emphasis
  let enhancedText = text;
  
  switch (persona) {
    case 'the-firecracker':
      enhancedText = `<emphasis level="strong">${text}</emphasis>`;
      break;
    case 'the-sloth':
      enhancedText = text.replace(/\./g, '... <break time="500ms"/>');
      break;
    case 'the-confidant':
      enhancedText = `<prosody volume="soft">${text}</prosody>`;
      break;
    case 'the-scholar':
      enhancedText = text.replace(/\./g, '. <break time="200ms"/>');
      break;
    default:
      enhancedText = text;
  }
  
  return `<speak>
    <prosody rate="${rateValue}" pitch="${pitchValue}">
      ${enhancedText}
    </prosody>
  </speak>`;
}

/**
 * Handle persona tone switching for speech
 */
export function handlePersonaToneSwitch(
  originalText: string, 
  newPersona: string, 
  previousPersona?: string
): { text: string; shouldRegenerate: boolean } {
  
  if (!previousPersona || previousPersona === newPersona) {
    return {
      text: originalText,
      shouldRegenerate: false
    };
  }
  
  // Add a brief tone acknowledgment
  const toneAcknowledgment = `Switching to ${newPersona} tone now. `;
  
  return {
    text: toneAcknowledgment + originalText,
    shouldRegenerate: true
  };
}

export default {
  generatePersonaSpeech,
  generateSpeechWithFallback,
  cleanupAudioUrl,
  getAvailablePersonaVoices,
  isPersonaVoiceConfigured,
  createSSMLForPersona,
  validateTTSText,
  handlePersonaToneSwitch,
  playWithBrowserTTS,
  testVoiceSystem,
  forceStopSpeech,
  isBrowserTTSAvailable
};