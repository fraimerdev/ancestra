// Configuration system for browser environment
// Handles API keys and environment variables safely

// Environment configuration that works in browser
const CONFIG = {
  // AI Services
  GEMINI_API_KEY: "AIzaSyDpvQM-7jWsUInf6i28XjU7mk9mYx2Sgz0",
  ELEVENLABS_API_KEY: "sk_64ce640fda1c2391d3664440cd127ac97b7025a5d96ea955",
  
  // Events and Attractions APIs
  EVENTS_API_KEY: "IGPEQNSAPL2MHUMUCYMM",
  GOOGLE_PLACES_API_KEY: "AIzaSyDhsxPdt3Ca3LqTSWwxXwehwYP5gP7SSBQ",
  
  // Travel and Accommodation
  RAPIDAPI_KEY: "f0b3480d05mshd67f505b04986fp12d914jsn0f5a1a9854cd",
  EXPEDIA_HOST: "expedia13.p.rapidapi.com",
  
  // Weather API
  WEATHER_API_KEY: "496992d94df38eac3ce9240ea3596a9d",

  // ElevenLabs Configuration
  ELEVENLABS_BASE_URL: "https://api.elevenlabs.io/v1",
  ELEVENLABS_MODEL: "eleven_multilingual_v2",
  
  // Voice System Settings
  VOICE_SYSTEM_ENABLED: true,
  FALLBACK_TO_BROWSER_TTS: true,
  
  // Debug Settings
  DEBUG_VOICE_SYSTEM: false,
  VERBOSE_LOGGING: false
};

/**
 * Get configuration value safely
 */
export function getConfig(key: keyof typeof CONFIG): string | boolean {
  return CONFIG[key];
}

/**
 * Check if a configuration key exists
 */
export function hasConfig(key: keyof typeof CONFIG): boolean {
  return CONFIG[key] !== undefined && CONFIG[key] !== null;
}

/**
 * Get ElevenLabs API key
 */
export function getElevenLabsApiKey(): string | null {
  const apiKey = getConfig('ELEVENLABS_API_KEY') as string;
  
  if (!apiKey || apiKey.trim() === '') {
    console.warn('⚠️ ElevenLabs API key not configured');
    return null;
  }
  
  return apiKey;
}

/**
 * Check if ElevenLabs is configured and available
 */
export function isElevenLabsAvailable(): boolean {
  const apiKey = getElevenLabsApiKey();
  const enabled = getConfig('VOICE_SYSTEM_ENABLED') as boolean;
  
  return !!(apiKey && enabled);
}

/**
 * Get Gemini API key
 */
export function getGeminiApiKey(): string | null {
  const apiKey = getConfig('GEMINI_API_KEY') as string;
  
  if (!apiKey || apiKey.trim() === '') {
    console.warn('⚠️ Gemini API key not configured');
    return null;
  }
  
  return apiKey;
}

/**
 * Check if browser TTS fallback is enabled
 */
export function isBrowserTTSFallbackEnabled(): boolean {
  return getConfig('FALLBACK_TO_BROWSER_TTS') as boolean;
}

/**
 * Get debug settings
 */
export function getDebugSettings(): {
  debugVoiceSystem: boolean;
  verboseLogging: boolean;
} {
  return {
    debugVoiceSystem: getConfig('DEBUG_VOICE_SYSTEM') as boolean,
    verboseLogging: getConfig('VERBOSE_LOGGING') as boolean
  };
}

/**
 * Safe environment variable access for browser
 * This replaces direct process.env access
 */
export function getEnvVar(key: string, fallback: string = ''): string {
  // In browser environment, we use our CONFIG object
  if (key in CONFIG) {
    return CONFIG[key as keyof typeof CONFIG] as string;
  }
  
  // Fallback for any other environment variables
  if (typeof window !== 'undefined') {
    // Browser environment - use CONFIG
    return fallback;
  }
  
  // Server environment (if any) - would use actual process.env
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback;
  }
  
  return fallback;
}

/**
 * Log configuration status (for debugging)
 */
export function logConfigStatus(): void {
  const debugSettings = getDebugSettings();
  
  if (!debugSettings.debugVoiceSystem) {
    return;
  }
  
  console.log('🔧 Configuration Status:');
  console.log(`   • ElevenLabs Available: ${isElevenLabsAvailable()}`);
  console.log(`   • Browser TTS Fallback: ${isBrowserTTSFallbackEnabled()}`);
  console.log(`   • Voice System Enabled: ${getConfig('VOICE_SYSTEM_ENABLED')}`);
  console.log(`   • Debug Mode: ${debugSettings.debugVoiceSystem}`);
  
  if (debugSettings.verboseLogging) {
    console.log('🔍 Verbose Config Details:');
    console.log(`   • ElevenLabs API Key: ${getElevenLabsApiKey() ? '✅ Set' : '❌ Missing'}`);
    console.log(`   • Gemini API Key: ${getGeminiApiKey() ? '✅ Set' : '❌ Missing'}`);
  }
}

// Auto-log config status in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  logConfigStatus();
}

export default CONFIG;