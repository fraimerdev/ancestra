import { useState, useRef, useEffect } from 'react';
import { generateSpeechWithFallback, cleanupAudioUrl, validateTTSText, testVoiceSystem, isBrowserTTSAvailable, forceStopSpeech } from '../utils/elevenLabsService';
import { isElevenLabsAvailable, isBrowserTTSFallbackEnabled } from '../utils/config';

interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  currentPersona: string | null;
  currentAudioUrl: string | null;
  usedFallback: boolean;
  hasTestedSystem: boolean;
}

export function useAudioControls() {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    error: null,
    currentPersona: null,
    currentAudioUrl: null,
    usedFallback: false,
    hasTestedSystem: false
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isInitializedRef = useRef(false);

  // FIXED: Remove automatic voice system test that was causing double TTS playback
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      console.log('🎵 Audio controls initialized (no automatic testing)');
    }
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioState.currentAudioUrl) {
        cleanupAudioUrl(audioState.currentAudioUrl);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fallbackUtteranceRef.current && 'speechSynthesis' in window) {
        forceStopSpeech();
      }
    };
  }, []);

  // Cleanup previous audio when new audio is set
  useEffect(() => {
    return () => {
      if (audioState.currentAudioUrl) {
        cleanupAudioUrl(audioState.currentAudioUrl);
      }
    };
  }, [audioState.currentAudioUrl]);

  const playPersonaSpeech = async (text: string, persona: string, language: string = 'en') => {
    try {
      // Stop any current playback
      await stopAudio();
      
      setAudioState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        currentPersona: persona,
        usedFallback: false
      }));

      console.log(`🎵 Starting speech playback for persona: ${persona}`);
      
      // Use the enhanced service with automatic fallback
      const result = await generateSpeechWithFallback(text, persona, language);

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate speech');
      }

      // If we got an audio URL (ElevenLabs), play it
      if (result.audioUrl && !result.usedFallback) {
        console.log(`🎵 Playing ElevenLabs audio for ${persona}`);
        
        const audio = new Audio(result.audioUrl);
        audioRef.current = audio;

        // Set up audio event listeners with better error handling
        audio.onloadeddata = () => {
          console.log(`✅ ElevenLabs audio loaded for ${persona}`);
          setAudioState(prev => ({
            ...prev,
            isLoading: false,
            currentAudioUrl: result.audioUrl!,
            usedFallback: false
          }));
        };

        audio.onplay = () => {
          console.log(`▶️ ElevenLabs audio playing for ${persona}`);
          setAudioState(prev => ({
            ...prev,
            isPlaying: true
          }));
        };

        audio.onended = () => {
          console.log(`⏹️ ElevenLabs audio ended for ${persona}`);
          setAudioState(prev => ({
            ...prev,
            isPlaying: false
          }));
          // Cleanup audio URL after playback
          if (result.audioUrl) {
            cleanupAudioUrl(result.audioUrl);
          }
        };

        // FIXED: Enhanced error handling for audio playback
        audio.onerror = (e) => {
          console.error('❌ ElevenLabs audio playback error:', e);
          
          // Try to extract meaningful error information
          let errorMessage = 'Audio playback failed';
          if (e instanceof ErrorEvent) {
            errorMessage = `Audio error: ${e.message}`;
          } else if (audio.error) {
            switch (audio.error.code) {
              case MediaError.MEDIA_ERR_ABORTED:
                errorMessage = 'Audio playback was aborted';
                break;
              case MediaError.MEDIA_ERR_NETWORK:
                errorMessage = 'Network error while loading audio';
                break;
              case MediaError.MEDIA_ERR_DECODE:
                errorMessage = 'Audio decoding error';
                break;
              case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage = 'Audio format not supported';
                break;
              default:
                errorMessage = 'Unknown audio error';
            }
          }
          
          setAudioState(prev => ({
            ...prev,
            isPlaying: false,
            isLoading: false,
            error: `${errorMessage}. Trying browser TTS fallback...`
          }));
          
          // Cleanup failed audio
          if (result.audioUrl) {
            cleanupAudioUrl(result.audioUrl);
          }
          
          // Try browser TTS as immediate fallback
          if (isBrowserTTSFallbackEnabled()) {
            console.log(`🔄 Attempting browser TTS fallback for ${persona} after audio error`);
            playPersonaSpeechWithBrowserTTS(text, persona, language);
          }
        };

        // Start playback
        try {
          await audio.play();
        } catch (playError) {
          console.warn(`⚠️ ElevenLabs audio.play() failed for ${persona}:`, playError);
          // Cleanup and fallback to browser TTS
          cleanupAudioUrl(result.audioUrl);
          if (isBrowserTTSFallbackEnabled()) {
            await playPersonaSpeechWithBrowserTTS(text, persona, language);
          } else {
            throw new Error(`Audio playback failed: ${playError instanceof Error ? playError.message : 'Unknown error'}`);
          }
        }
        
      } else if (result.usedFallback) {
        // Browser TTS was used successfully (no audio URL)
        console.log(`✅ Browser TTS completed successfully for ${persona}`);
        setAudioState(prev => ({
          ...prev,
          isLoading: false,
          isPlaying: false,
          usedFallback: true
        }));
      }

    } catch (error) {
      console.error('❌ Speech generation failed completely:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setAudioState(prev => ({
        ...prev,
        isLoading: false,
        error: `Voice generation failed: ${errorMessage}`
      }));
    }
  };

  const playPersonaSpeechWithBrowserTTS = async (text: string, persona: string, language: string) => {
    try {
      // Check if browser TTS is actually available before attempting
      if (!isBrowserTTSAvailable()) {
        throw new Error('Browser TTS is not available on this device');
      }

      setAudioState(prev => ({
        ...prev,
        isLoading: true,
        usedFallback: true,
        error: null
      }));

      console.log(`🔄 Attempting browser TTS for persona: ${persona}`);

      // Import and use the browser TTS function
      const { playWithBrowserTTS } = await import('../utils/elevenLabsService');
      await playWithBrowserTTS(text, persona, language === 'English' ? 'en-US' : 'en-US');
      
      console.log(`✅ Browser TTS completed successfully for persona: ${persona}`);
      
      setAudioState(prev => ({
        ...prev,
        isLoading: false,
        isPlaying: false,
        usedFallback: true
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Browser TTS failed with unknown error';
      console.error(`❌ Browser TTS fallback failed for ${persona}:`, errorMessage);
      
      // Provide more helpful error messages
      let userFriendlyMessage = errorMessage;
      if (errorMessage.includes('not supported')) {
        userFriendlyMessage = 'Text-to-speech is not supported on this device or browser';
      } else if (errorMessage.includes('not allowed')) {
        userFriendlyMessage = 'Text-to-speech permission is required. Please check your browser settings';
      } else if (errorMessage.includes('network')) {
        userFriendlyMessage = 'Network error occurred during speech synthesis';
      } else if (errorMessage.includes('synthesis-failed')) {
        userFriendlyMessage = 'Speech synthesis failed. Please try again';
      }
      
      setAudioState(prev => ({
        ...prev,
        isLoading: false,
        error: `Voice playback failed: ${userFriendlyMessage}`
      }));
    }
  };

  const playAudio = async (text: string, language: string = 'en', persona: string = 'Ancestra') => {
    // If already playing, stop current audio
    if (audioState.isPlaying) {
      await stopAudio();
      return;
    }

    await playPersonaSpeech(text, persona, language);
  };

  const stopAudio = async (): Promise<void> => {
    console.log('🛑 Stopping all audio playback');
    
    // Stop ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    // Stop browser TTS using the enhanced stop function
    try {
      await forceStopSpeech();
      fallbackUtteranceRef.current = null;
    } catch (error) {
      console.warn('⚠️ Error stopping speech synthesis:', error);
    }

    // Cleanup current audio URL
    if (audioState.currentAudioUrl) {
      cleanupAudioUrl(audioState.currentAudioUrl);
    }

    setAudioState(prev => ({
      ...prev,
      isPlaying: false,
      isLoading: false,
      currentAudioUrl: null
    }));
  };

  const clearError = () => {
    setAudioState(prev => ({
      ...prev,
      error: null
    }));
  };

  // Test if persona voice is available
  const isPersonaVoiceAvailable = (persona: string): boolean => {
    return isElevenLabsAvailable() || isBrowserTTSFallbackEnabled();
  };

  // Get comprehensive voice system status
  const getVoiceSystemStatus = () => {
    const browserTTSActuallyAvailable = isBrowserTTSFallbackEnabled() && isBrowserTTSAvailable();
    
    return {
      elevenLabsAvailable: isElevenLabsAvailable(),
      browserTTSAvailable: browserTTSActuallyAvailable,
      hasVoiceOptions: isElevenLabsAvailable() || browserTTSActuallyAvailable,
      currentPersona: audioState.currentPersona,
      usedFallback: audioState.usedFallback,
      hasTestedSystem: audioState.hasTestedSystem
    };
  };

  // FIXED: Manual voice system test that only runs when explicitly called
  const testVoiceSystemNow = async () => {
    try {
      setAudioState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));

      console.log('🔍 Manually testing voice system...');
      const result = await testVoiceSystem();
      
      setAudioState(prev => ({
        ...prev,
        isLoading: false,
        hasTestedSystem: true
      }));

      console.log('✅ Manual voice system test completed:', result);
      return result;
    } catch (error) {
      setAudioState(prev => ({
        ...prev,
        isLoading: false,
        error: `Voice system test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
      throw error;
    }
  };

  return {
    // State
    isPlayingAudio: audioState.isPlaying,
    isLoadingAudio: audioState.isLoading,
    audioError: audioState.error,
    currentPersona: audioState.currentPersona,
    usedFallback: audioState.usedFallback,
    hasTestedSystem: audioState.hasTestedSystem,
    
    // Actions
    playAudio,
    stopAudio,
    clearError,
    playPersonaSpeech,
    isPersonaVoiceAvailable,
    getVoiceSystemStatus,
    testVoiceSystemNow,
    
    // Legacy support for existing components
    playAudioWithElevenLabs: playPersonaSpeech,
    playAudioWithBrowserTTS: playPersonaSpeechWithBrowserTTS
  };
}