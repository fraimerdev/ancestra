interface UserProfile {
  origin?: string | null;
  age?: string | null;
  family?: string | null;
  budget?: string | null;
  accessibility?: string | null;
  manual_persona?: string | null;
}

interface ConversationHistory {
  preferred_persona?: string;
  previous_persona?: string;
  message_count?: number;
  emotional_context?: string[];
}

interface PersonaDetectionResult {
  selectedPersona: string;
  confidence: number;
  reasoning: string[];
  transitions?: string;
}

// Caribbean countries for dialect detection
const CARIBBEAN_COUNTRIES = [
  'JAM', 'TTO', 'BRB', 'GRD', 'DMA', 'LCA', 'VCT', 'ATG', 'KNA', 'SKN'
];

// Patois/Caribbean dialect patterns
const PATOIS_PATTERNS = [
  'weh yuh deh', 'yuh good', 'liming', 'jammin', 'pickney', 'smallie',
  'leh we go', 'irie', 'bless up', 'big up', 'nah mean', 'seen',
  'yard', 'bredrin', 'sistren', 'nuff', 'bare', 'cotch'
];

// Baby talk patterns
const BABY_TALK_PATTERNS = [
  'mama', 'dada', 'bye bye', 'night night', 'yum yum', 'uh oh',
  'peek-a-boo', 'all done', 'more more', 'hi hi', 'no no'
];

// Formal/scholarly language patterns
const FORMAL_PATTERNS = [
  'furthermore', 'nevertheless', 'notwithstanding', 'henceforth', 'accordingly',
  'subsequently', 'consequently', 'inasmuch', 'heretofore', 'aforementioned',
  'vis-à-vis', 'ergo', 'ipso facto', 'per se', 'sine qua non'
];

// Gen Z slang patterns
const GEN_Z_PATTERNS = [
  'no cap', 'bet', 'say less', 'periodt', 'it\'s giving', 'slay', 'bestie',
  'fam', 'stan', 'tea', 'shade', 'mood', 'vibe', 'lowkey', 'highkey',
  'that slaps', 'fire', 'hits different', 'main character energy', 'delulu',
  'pookie', 'bby', 'unhinged', 'iykyk', 'living rent free'
];

// Teen slang patterns  
const TEEN_PATTERNS = [
  'spill the tea', 'no cap', 'the vibe', 'low-key', 'bet', 'that\'s fire',
  'sus', 'based', 'cringe', 'ok boomer', 'facts', 'deadass', 'fr', 'ngl'
];

// Emotional distress patterns
const DISTRESS_PATTERNS = [
  'scared', 'worried', 'anxious', 'nervous', 'afraid', 'concerned', 'upset',
  'stressed', 'overwhelmed', 'confused', 'lost', 'help', 'don\'t know',
  'not sure', 'uncertain', 'emergency', 'urgent', 'problem'
];

// Excitement patterns
const EXCITEMENT_PATTERNS = [
  'amazing', 'awesome', 'incredible', 'fantastic', 'wonderful', 'excited',
  'thrilled', 'can\'t wait', 'so happy', 'love this', 'perfect', 'brilliant',
  'excellent', 'outstanding', 'phenomenal', '!!!', 'yay', 'woohoo'
];

// High energy patterns
const HIGH_ENERGY_PATTERNS = [
  'let\'s go', 'pump it up', 'ready to party', 'energized', 'pumped',
  'hyped', 'revved up', 'fired up', 'charged', 'amped', 'psyched'
];

// Relaxed patterns
const RELAXED_PATTERNS = [
  'chill', 'relax', 'take it easy', 'no rush', 'whenever', 'laid back',
  'casual', 'easy going', 'slow down', 'zen', 'peaceful', 'calm'
];

/**
 * Check if text contains specific patterns
 */
function containsPatterns(text: string, patterns: string[]): boolean {
  const lowerText = text.toLowerCase();
  return patterns.some(pattern => lowerText.includes(pattern.toLowerCase()));
}

/**
 * Detect emotional state from user input
 */
function detectEmotion(userInput: string): string {
  const lowerInput = userInput.toLowerCase();
  
  if (containsPatterns(lowerInput, DISTRESS_PATTERNS)) {
    return 'distressed';
  }
  
  if (containsPatterns(lowerInput, EXCITEMENT_PATTERNS) || userInput.includes('!!!')) {
    return 'excited';
  }
  
  if (containsPatterns(lowerInput, HIGH_ENERGY_PATTERNS)) {
    return 'high_energy';
  }
  
  if (containsPatterns(lowerInput, RELAXED_PATTERNS)) {
    return 'relaxed';
  }
  
  return 'neutral';
}

/**
 * Check for specific language patterns
 */
function containsPatois(text: string): boolean {
  return containsPatterns(text, PATOIS_PATTERNS);
}

function containsBabyTalk(text: string): boolean {
  return containsPatterns(text, BABY_TALK_PATTERNS);
}

function containsFormalLanguage(text: string): boolean {
  return containsPatterns(text, FORMAL_PATTERNS);
}

function containsGenZSlang(text: string): boolean {
  return containsPatterns(text, GEN_Z_PATTERNS);
}

function containsTeenSlang(text: string): boolean {
  return containsPatterns(text, TEEN_PATTERNS);
}

/**
 * Generate persona transition message
 */
function generatePersonaTransition(currentPersona: string, newPersona: string): string | null {
  if (currentPersona === newPersona) {
    return null;
  }
  
  const transitions: Record<string, string> = {
    [`Default->${newPersona}`]: `I see you're looking for a different communication style! Let me switch to ${newPersona}...`,
    [`The Scholar->${newPersona}`]: `Let me drop the formal approach and switch to ${newPersona} style...`,
    [`The Confidant->${newPersona}`]: `I sense a shift in energy! Switching to ${newPersona}...`,
    [`The Infant->${newPersona}`]: `Time to grow up a bit! Switching to ${newPersona}...`,
    [`The Dialect->${newPersona}`]: `Switching from island vibes to ${newPersona}...`,
    [`The Gen Z Vibe->${newPersona}`]: `Ok let me switch up the energy to ${newPersona}...`
  };
  
  const transitionKey = `${currentPersona}->${newPersona}`;
  return transitions[transitionKey] || `Switching to ${newPersona} communication style...`;
}

/**
 * Main persona detection function
 */
export function detectPersonaModifiers(
  userInput: string,
  userProfile: UserProfile,
  conversationHistory: ConversationHistory
): PersonaDetectionResult {
  
  // Initialize persona scores
  const personaScores: Record<string, number> = {
    'Auto-Detect': 0,
    'The Dialect - Authentic Islander': 0,
    'The Infant - Gentle Nurturer': 0,
    'The Scholar - Learned Educator': 0,
    'The Gen Z Vibe - Digital Native': 0,
    'The Teen - Cool Confidant': 0,
    'The Confidant - Quiet Companion': 0,
    'The Spark - Creative Inspiration': 0,
    'The Rambler - Detailed Storyteller': 0,
    'The Sloth - Relaxed Guide': 0,
    'The Firecracker - High Energy': 0,
    'The Sweetheart - Extra Caring': 0
  };
  
  const reasoning: string[] = [];
  
  // 1. Manual Selection Override (highest priority)
  if (userProfile.manual_persona) {
    return {
      selectedPersona: userProfile.manual_persona,
      confidence: 100,
      reasoning: ['Manual persona selection override'],
    };
  }
  
  // 2. Language Pattern Detection
  if (containsPatois(userInput)) {
    personaScores['The Dialect - Authentic Islander'] += 10;
    reasoning.push('Detected Caribbean patois/dialect patterns');
  }
  
  if (containsBabyTalk(userInput)) {
    personaScores['The Infant - Gentle Nurturer'] += 8;
    reasoning.push('Detected baby talk patterns');
  }
  
  if (containsFormalLanguage(userInput)) {
    personaScores['The Scholar - Learned Educator'] += 7;
    reasoning.push('Detected formal/academic language');
  }
  
  if (containsGenZSlang(userInput)) {
    personaScores['The Gen Z Vibe - Digital Native'] += 8;
    reasoning.push('Detected Gen Z slang and internet culture');
  }
  
  if (containsTeenSlang(userInput)) {
    personaScores['The Teen - Cool Confidant'] += 6;
    reasoning.push('Detected teen/youth slang');
  }
  
  // 3. Emotional State Detection
  const emotion = detectEmotion(userInput);
  
  switch (emotion) {
    case 'distressed':
      personaScores['The Confidant - Quiet Companion'] += 9;
      reasoning.push('Detected emotional distress - activating supportive mode');
      break;
    case 'excited':
      personaScores['The Spark - Creative Inspiration'] += 7;
      reasoning.push('Detected excitement and positive energy');
      break;
    case 'high_energy':
      personaScores['The Firecracker - High Energy'] += 7;
      reasoning.push('Detected high energy communication');
      break;
    case 'relaxed':
      personaScores['The Sloth - Relaxed Guide'] += 5;
      reasoning.push('Detected relaxed, casual communication');
      break;
  }
  
  // 4. User Profile Considerations
  if (userProfile.origin && CARIBBEAN_COUNTRIES.includes(userProfile.origin)) {
    personaScores['The Dialect - Authentic Islander'] += 6;
    reasoning.push('User from Caribbean region - cultural connection');
  }
  
  if (userProfile.age === 'teenager' || userProfile.age === 'teen') {
    personaScores['The Teen - Cool Confidant'] += 5;
    personaScores['The Gen Z Vibe - Digital Native'] += 4;
    reasoning.push('Teen age profile detected');
  }
  
  if (userProfile.age === 'young adult' || userProfile.age?.includes('18-25')) {
    personaScores['The Gen Z Vibe - Digital Native'] += 5;
    reasoning.push('Young adult age profile detected');
  }
  
  // 5. Message length patterns
  if (userInput.length > 200) {
    personaScores['The Rambler - Detailed Storyteller'] += 3;
    reasoning.push('Long message suggests detailed communication preference');
  }
  
  if (userInput.split('!').length > 3) {
    personaScores['The Firecracker - High Energy'] += 4;
    reasoning.push('Multiple exclamation marks suggest high energy');
  }
  
  // 6. Conversation History
  if (conversationHistory.preferred_persona) {
    personaScores[conversationHistory.preferred_persona] += 3;
    reasoning.push('Previous persona preference detected');
  }
  
  // 7. Special conditions
  if (userInput.toLowerCase().includes('help') || userInput.toLowerCase().includes('support')) {
    personaScores['The Sweetheart - Extra Caring'] += 4;
    reasoning.push('Request for help detected - activating caring mode');
  }
  
  // Find the persona with the highest score
  const winnerPersona = Object.entries(personaScores).reduce((max, [persona, score]) => 
    score > max.score ? { persona, score } : max, 
    { persona: 'Auto-Detect', score: 0 }
  );
  
  // If no clear winner, use Auto-Detect
  const selectedPersona = winnerPersona.score > 2 ? winnerPersona.persona : 'Auto-Detect';
  
  // Calculate confidence based on score
  const confidence = Math.min(95, Math.max(20, winnerPersona.score * 10));
  
  // Generate transition message if needed
  const currentPersona = conversationHistory.previous_persona || 'Default';
  const transitionMessage = generatePersonaTransition(currentPersona, selectedPersona);
  
  return {
    selectedPersona,
    confidence,
    reasoning,
    transitions: transitionMessage || undefined
  };
}

/**
 * Switch persona with transition handling
 */
export function switchPersona(
  currentPersona: string,
  newPersona: string,
  context: string
): string | null {
  return generatePersonaTransition(currentPersona, newPersona);
}

/**
 * Export types for use in other modules
 */
export type { UserProfile, ConversationHistory, PersonaDetectionResult };