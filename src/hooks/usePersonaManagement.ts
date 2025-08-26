import { useState, useEffect } from "react";
import { 
  PERSONA_AVATARS
} from "../utils/constants";
import { PersonaEngine } from "../utils/personaEngine";

// Initialize persona engine instance
const personaEngine = new PersonaEngine();

// Persona ID mapping to handle different formats
const PERSONA_ID_MAPPING: Record<string, string> = {
  // Auto-detect mappings
  'Auto-Detect': 'Ancestra',
  'auto-detect': 'Ancestra',
  
  // Full name to ID mappings
  'The Infant - Gentle Nurturer': 'the-infant',
  'The Teen - Cool Confidant': 'the-teen', 
  'The Scholar - Learned Educator': 'the-scholar',
  'The Dialect - Authentic Islander': 'the-dialect',
  'The Gen Z Vibe - Digital Native': 'the-gen-z-vibe',
  'The Confidant - Quiet Companion': 'the-confidant',
  'The Spark - Creative Inspiration': 'the-spark',
  'The Rambler - Detailed Storyteller': 'the-rambler',
  'The Sloth - Relaxed Guide': 'the-sloth',
  'The Firecracker - High Energy': 'the-firecracker',
  'The Sweetheart - Extra Caring': 'the-sweetheart',
  
  // Partial name mappings
  'The Infant': 'the-infant',
  'The Teen': 'the-teen',
  'The Scholar': 'the-scholar',
  'The Dialect': 'the-dialect',
  'The Gen Z Vibe': 'the-gen-z-vibe',
  'The Confidant': 'the-confidant',
  'The Spark': 'the-spark',
  'The Rambler': 'the-rambler',
  'The Sloth': 'the-sloth',
  'The Firecracker': 'the-firecracker',
  'The Sweetheart': 'the-sweetheart',
  
  // Main personas
  'Ancestra': 'Ancestra',
  'The Guardian': 'The Guardian',
  
  // Handle potential emotion/tone values that shouldn't be persona IDs
  'neutral': 'Ancestra',
  'excited': 'the-spark',
  'distressed': 'the-confidant',
  'high_energy': 'the-firecracker',
  'relaxed': 'the-sloth'
};

export function usePersonaManagement() {
  const [currentPersona, setCurrentPersona] = useState<string>('Ancestra');
  const [personaTone, setPersonaTone] = useState('Auto-Detect');
  const [personaMemory, setPersonaMemory] = useState<{[key: string]: string}>({});

  // Initialize persona engine on hook start
  useEffect(() => {
    personaEngine.setPersona(currentPersona);
    console.log('🤖 Persona Engine initialized with:', currentPersona);
  }, []);

  // Update persona engine when persona changes
  useEffect(() => {
    const isValidPersona = Object.keys(PERSONA_AVATARS).includes(currentPersona);
    if (isValidPersona) {
      personaEngine.setPersona(currentPersona);
      console.log('🔄 Switched to persona:', currentPersona);
      
      // Auto-switch to guardian mode for safety-focused personas
      const personaInfo = PERSONA_AVATARS[currentPersona as keyof typeof PERSONA_AVATARS];
      if (personaInfo && currentPersona !== 'Ancestra' && currentPersona !== 'The Guardian') {
        // For specialized personas, start in regular mode
        personaEngine.setMode('regular');
      }
    }
  }, [currentPersona]);

  // Enhanced persona ID normalization
  const normalizePersonaId = (personaId: string): string => {
    // First check direct mapping
    if (PERSONA_ID_MAPPING[personaId]) {
      return PERSONA_ID_MAPPING[personaId];
    }
    
    // Check if it's already a valid persona ID
    if (Object.keys(PERSONA_AVATARS).includes(personaId)) {
      return personaId;
    }
    
    // Fallback to Ancestra for any unrecognized values
    console.warn('Unknown persona ID, falling back to Ancestra:', personaId);
    return 'Ancestra';
  };

  // Enhanced persona switching with validation and normalization
  const handlePersonaChange = (newPersona: string) => {
    const normalizedPersonaId = normalizePersonaId(newPersona);
    const validPersona = PERSONA_AVATARS[normalizedPersonaId as keyof typeof PERSONA_AVATARS];
    
    if (validPersona) {
      setCurrentPersona(normalizedPersonaId);
      
      // Update persona engine
      personaEngine.setPersona(normalizedPersonaId);
      
      // Initialize memory for new persona if not exists
      if (!personaMemory[normalizedPersonaId]) {
        setPersonaMemory(prev => ({
          ...prev,
          [normalizedPersonaId]: `I'm ready to assist you as ${validPersona.name}!`
        }));
      }
      
      console.log('✨ Persona changed to:', normalizedPersonaId, '(from input:', newPersona, ')');
    } else {
      console.error('Invalid persona ID after normalization:', newPersona, '->', normalizedPersonaId);
      // Fallback to Ancestra
      setCurrentPersona('Ancestra');
    }
  };

  // Get current persona display info
  const getCurrentPersonaInfo = () => {
    return PERSONA_AVATARS[currentPersona as keyof typeof PERSONA_AVATARS] || PERSONA_AVATARS['Ancestra'];
  };

  // Determine if Guardian-style animations should be applied
  const shouldUseGuardianAnimation = () => {
    return currentPersona === 'The Guardian';
  };

  return {
    currentPersona,
    setCurrentPersona,
    personaTone,
    setPersonaTone,
    personaMemory,
    setPersonaMemory,
    handlePersonaChange,
    getCurrentPersonaInfo,
    shouldUseGuardianAnimation,
    personaEngine,
    normalizePersonaId
  };
}