import { promptSystemData } from '../data/promptSystemData';

interface UserProfile {
  origin?: string | null;
  age?: string | null;
  family?: string | null;
  budget?: string | null;
  accessibility?: string | null;
  manual_persona?: string | null;
}

interface PromptBuilderConfig {
  mode: 'ancestra' | 'guardian';
  persona?: string | null;
  userProfile?: UserProfile;
  userQuery: string;
}

// Language detection and instruction mapping
const LANGUAGE_INSTRUCTION_MAP: Record<string, string> = {
  "es": "Responde al usuario en español.",
  "fr": "Répondez à l'utilisateur en français.",
  "de": "Antworten Sie dem Benutzer auf Deutsch.",
  "pt": "Responda ao usuário em português.",
  "it": "Rispondi all'utente in italiano.",
  "nl": "Antwoord de gebruiker in het Nederlands.",
  "ru": "Ответьте пользователю на русском языке.",
  "ja": "ユーザーに日本語で答えてください。",
  "ko": "사용자에게 한국어로 답하세요.",
  "zh-cn": "请用中文回答用户。",
  "zh-tw": "請用繁體中文回答用戶。",
  "ar": "يرجى الرد على المستخدم باللغة العربية.",
  "hi": "कृपया उपयोगकर्ता को हिंदी में जवाब दें।",
  "sw": "Tafadhali jibu mtumiaji kwa Kiswahili.",
  "tr": "Kullanıcıya Türkçe yanıt verin.",
  "pl": "Odpowiedz użytkownikowi po polsku.",
  "sv": "Svara användaren på svenska.",
  "da": "Besvar brugeren på dansk.",
  "no": "Svar brukeren på norsk.",
  "fi": "Vastaa käyttäjälle suomeksi.",
  "cs": "Odpovězte uživateli česky.",
  "hu": "Válaszoljon a felhasználónak magyarul.",
  "el": "Απαντήστε στον χρήστη στα ελληνικά.",
  "he": "בבקשה ענה למשתמש בעברית.",
  "th": "กรุณาตอบผู้ใช้เป็นภาษาไทย",
  "vi": "Vui lòng trả lời người dùng bằng tiếng Việt.",
  "id": "Mohon jawab pengguna dalam bahasa Indonesia.",
  "ms": "Sila jawab pengguna dalam bahasa Melayu.",
  "tl": "Mangyaring sagutin ang user sa Filipino.",
  "ro": "Vă rugăm să răspundeți utilizatorului în română.",
  "uk": "Будь ласка, відповідайте користувачеві українською.",
  "bg": "Моля, отговорете на потребителя на български.",
  "hr": "Molimo odgovorite korisniku na hrvatskom jeziku.",
  "sk": "Odpovedzte používateľovi po slovensky.",
  "sl": "Prosimo, odgovorite uporabniku v slovenščini.",
  "et": "Palun vastake kasutajale eesti keeles.",
  "lv": "Lūdzu, atbildiet lietotājam latviski.",
  "lt": "Atsakykite vartotojui lietuviškai.",
  "mt": "Jekk jogħġbok wieġeb lill-utent bil-Malti.",
  "ga": "Freagair an t-úsáideoir i nGaeilge le do thoil.",
  "is": "Vinsamlegast svaraðu notandanum á íslensku.",
  "sq": "Ju lutem përgjigjuni përdoruesit në shqip.",
  "eu": "Mesedez, erantzun erabiltzaileari euskaraz.",
  "ca": "Responeu a l'usuari en català, si us plau.",
  "gl": "Responde ao usuario en galego, por favor.",
  "af": "Antwoord asseblief die gebruiker in Afrikaans.",
};

// Simple language detection (basic keyword matching for common patterns)
function detectLanguage(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Spanish patterns
  if (/\b(hola|gracias|por favor|donde|como|cuando)\b/.test(lowerText)) {
    return 'es';
  }
  
  // French patterns
  if (/\b(bonjour|merci|s'il vous plaît|où|comment|quand)\b/.test(lowerText)) {
    return 'fr';
  }
  
  // German patterns
  if (/\b(hallo|danke|bitte|wo|wie|wann)\b/.test(lowerText)) {
    return 'de';
  }
  
  // Portuguese patterns
  if (/\b(olá|obrigado|por favor|onde|como|quando)\b/.test(lowerText)) {
    return 'pt';
  }
  
  // Italian patterns
  if (/\b(ciao|grazie|per favore|dove|come|quando)\b/.test(lowerText)) {
    return 'it';
  }
  
  // Caribbean Patois patterns
  if (/\b(weh yuh deh|yuh good|liming|jammin|pickney|smallie)\b/.test(lowerText)) {
    return 'patois';
  }
  
  // Default to English
  return 'en';
}

// Template string replacement function
function replaceTemplateVariables(template: string, variables: Record<string, any>): string {
  return template.replace(/\$\{([^}]+)\}/g, (match, varName) => {
    const value = variables[varName];
    return value !== undefined ? String(value) : match;
  });
}

// Cache for loaded tourism data
let tourismDataCache: any = null;

/**
 * Load tourism data dynamically from JSON files
 */
async function loadTourismData(): Promise<any> {
  if (tourismDataCache) {
    return tourismDataCache;
  }

  try {
    // Load all tourism data files
    const [mainDataResponse, hotelsResponse, eventsResponse, cuisineResponse] = await Promise.all([
      fetch('/data/data.json'),
      fetch('/data/hotels.json'),
      fetch('/data/events.json'),
      fetch('/data/cuisine.json')
    ]);

    const mainData = await mainDataResponse.json();
    const hotelsData = await hotelsResponse.json();
    const eventsData = await eventsResponse.json();
    const cuisineData = await cuisineResponse.json();

    tourismDataCache = {
      mainData,
      hotelsData,
      eventsData,
      cuisineData
    };

    console.log('✅ Tourism data loaded successfully');
    return tourismDataCache;
  } catch (error) {
    console.warn('⚠️ Could not load tourism data, using fallback:', error);
    // Return empty data structure as fallback
    return {
      mainData: [],
      hotelsData: { hotelGuide: { title: "St. Kitts Hotels" }, luxuryResorts: {}, budgetFriendlyOptions: {} },
      eventsData: { events: [] },
      cuisineData: { cuisine: [] }
    };
  }
}

/**
 * Format tourism data for inclusion in the system prompt
 */
function formatTourismDataSync(data: any): string {
  const { mainData = [], hotelsData = {}, eventsData = {}, cuisineData = {} } = data;

  const tourismSection = `

## ST. KITTS & NEVIS TOURISM DATABASE

### ACCOMMODATIONS & HOTELS
${JSON.stringify(hotelsData, null, 2).substring(0, 3000)}...

### RESTAURANTS, FOOD & DINING
Key dining information:
${mainData.filter((item: any) => item.category === 'Food & Dining').slice(0, 15).map((item: any) => 
  `**${item.subcategory}**: ${item.question}\n${item.answer}\nLocation: ${item.location}`
).join('\n\n')}

### ATTRACTIONS & ACTIVITIES
${mainData.filter((item: any) => item.category === 'Nature & Outdoor Activities').slice(0, 10).map((item: any) => 
  `**${item.subcategory}**: ${item.question}\n${item.answer}\nLocation: ${item.location}`
).join('\n\n')}

### HISTORY & HERITAGE SITES
${mainData.filter((item: any) => item.category === 'History & Heritage').slice(0, 10).map((item: any) => 
  `**${item.subcategory}**: ${item.question}\n${item.answer}\nLocation: ${item.location}`
).join('\n\n')}

### CULTURAL KNOWLEDGE & LOCAL INSIGHTS  
${mainData.filter((item: any) => item.category === 'Cultural Knowledge').slice(0, 8).map((item: any) => 
  `**${item.subcategory}**: ${item.question}\n${item.answer}\nLocation: ${item.location}`
).join('\n\n')}

### SAFETY & TRAVEL INFORMATION
${mainData.filter((item: any) => item.category === 'Safety & Crime').slice(0, 5).map((item: any) => 
  `**${item.subcategory}**: ${item.question}\n${item.answer}\nLocation: ${item.location}`
).join('\n\n')}

### EVENTS & FESTIVALS
${JSON.stringify(eventsData, null, 2).substring(0, 2000)}...

### CUISINE & LOCAL SPECIALTIES
${JSON.stringify(cuisineData, null, 2).substring(0, 2000)}...

### TRANSPORTATION & PRACTICAL INFO
${mainData.filter((item: any) => item.category === 'Tourism & Travel').slice(0, 8).map((item: any) => 
  `**${item.subcategory}**: ${item.question}\n${item.answer}\nLocation: ${item.location}`
).join('\n\n')}

## IMPORTANT USAGE INSTRUCTIONS
- Use this comprehensive database to provide specific, accurate information about St. Kitts and Nevis
- Reference actual businesses, locations, prices, and details from this data
- When users ask about hotels, restaurants, activities, or attractions, draw from this specific information
- Provide real names, locations, and current details rather than generic responses
- Use the pricing information and specific recommendations provided
- Reference the cultural knowledge and local insights to provide authentic experiences
`;

  return tourismSection;
}

/**
 * Build the complete system prompt for Google Gemini with tourism data
 */
export function buildSystemPrompt(config: PromptBuilderConfig): string {
  const { mode, persona, userProfile, userQuery } = config;
  
  // Detect language from user query
  const detectedLanguage = detectLanguage(userQuery);
  const languageInstruction = LANGUAGE_INSTRUCTION_MAP[detectedLanguage] || '';
  
  // Include basic tourism data (synchronous for now)
  const basicTourismData = `

## ST. KITTS & NEVIS TOURISM KNOWLEDGE BASE

You have access to comprehensive tourism information about St. Kitts and Nevis including:

### ACCOMMODATIONS
- **Luxury Resorts**: St. Kitts Marriott Resort & The Royal Beach Casino, Park Hyatt St. Kitts, Four Seasons Resort Nevis
- **Historic Plantation Inns**: The Hermitage, Montpelier Plantation & Beach, Nisbet Plantation Beach Club
- **Budget Options**: Seaview Inn, The Colosseum, Golden Gate Inn

### DINING & CUISINE
- **BBQ & Grilled Food**: Cathy's Ocean View Bar and Grill, El Fredo's Restaurant, Smurf BBQ & Grill
- **Fine Dining**: Restaurant Week events, Park Hyatt dining, Four Seasons restaurants
- **Street Food**: Bay Road vendors, Independence Square lunch stalls, Public Market breakfast
- **Local Specialties**: National dish (Stewed Saltfish with Spicy Plantains), Goat Water, Johnny Cakes
- **Pizza**: Pizza Boys, Pizza Hub, Rasby's Pizza
- **Ital/Vegan**: Ital Creations, OJ's Ital Cart, The Mill House

### ATTRACTIONS & ACTIVITIES
- **Heritage Sites**: Brimstone Hill Fortress, Romney Manor, Wingfield Estate
- **Nature Activities**: Mt. Liamuiga hike, Dos d'Ane Pond, Lawyer Stephen's Cave
- **Beaches**: Frigate Bay, Timothy Hill, South Friars Beach, Cockleshell Beach
- **Cultural Experiences**: Masquerade traditions, Sugar Mas Carnival, Culturama (Nevis)

### TRANSPORTATION
- **Taxis**: Licensed taxis with yellow plates, rates from Basseterre to Timothy Hill ~EC$50-70
- **Scenic Railway**: St. Kitts Scenic Railway tour around the island
- **Ferry**: Regular service between St. Kitts and Nevis

### SAFETY INFORMATION
- **General**: Level 1 travel advisory, tourist areas generally safe
- **Precautions**: Stay in tourist areas, avoid isolated spots after dark, use licensed transport
- **Emergency**: Police 911, Basseterre Police +1(869)465-2241

Use this knowledge to provide specific, accurate recommendations with real business names, locations, and current details.`;
  
  // Prepare runtime variables
  const runtimeVariables = {
    MODE: mode,
    PERSONA: persona || '',
    USER_PROFILE: JSON.stringify(userProfile || {}),
    BASE: promptSystemData.sections.BASE,
    ANCESTRA_BLOCK: promptSystemData.sections.ANCESTRA_BLOCK,
    GUARDIAN_BLOCK: promptSystemData.sections.GUARDIAN_BLOCK,
    SUB_AGENTS: promptSystemData.sections.SUB_AGENTS,
    COLLABORATION: promptSystemData.sections.COLLABORATION,
    EMERGENCY: promptSystemData.sections.EMERGENCY,
    DYNAMIC: promptSystemData.sections.DYNAMIC,
    QA: promptSystemData.sections.QA,
    PERSONA_SWITCH: promptSystemData.sections.PERSONA_SWITCH
  };
  
  // Build the prompt using the template
  let systemPrompt = replaceTemplateVariables(promptSystemData.prompt_template, runtimeVariables);
  
  // Add the tourism data section
  systemPrompt += basicTourismData;
  
  // Add language instruction if detected
  if (languageInstruction) {
    systemPrompt += `\n\n${languageInstruction}`;
  }
  
  // Add final instruction about using the data
  systemPrompt += `

## CRITICAL INSTRUCTION
You MUST use the St. Kitts & Nevis tourism knowledge base provided above to answer user questions. Reference specific hotels, restaurants, attractions, prices, and locations from this data. Do not provide generic responses - use the actual names, details, and recommendations from the comprehensive database provided.`;
  
  return systemPrompt;
}

/**
 * Build system prompt with dynamically loaded data (async version)
 */
export async function buildSystemPromptWithData(config: PromptBuilderConfig): Promise<string> {
  const { mode, persona, userProfile, userQuery } = config;
  
  // Load tourism data
  const tourismData = await loadTourismData();
  
  // Detect language from user query
  const detectedLanguage = detectLanguage(userQuery);
  const languageInstruction = LANGUAGE_INSTRUCTION_MAP[detectedLanguage] || '';
  
  // Include the comprehensive tourism data
  const tourismDataSection = formatTourismDataSync(tourismData);
  
  // Prepare runtime variables
  const runtimeVariables = {
    MODE: mode,
    PERSONA: persona || '',
    USER_PROFILE: JSON.stringify(userProfile || {}),
    BASE: promptSystemData.sections.BASE,
    ANCESTRA_BLOCK: promptSystemData.sections.ANCESTRA_BLOCK,
    GUARDIAN_BLOCK: promptSystemData.sections.GUARDIAN_BLOCK,
    SUB_AGENTS: promptSystemData.sections.SUB_AGENTS,
    COLLABORATION: promptSystemData.sections.COLLABORATION,
    EMERGENCY: promptSystemData.sections.EMERGENCY,
    DYNAMIC: promptSystemData.sections.DYNAMIC,
    QA: promptSystemData.sections.QA,
    PERSONA_SWITCH: promptSystemData.sections.PERSONA_SWITCH
  };
  
  // Build the prompt using the template
  let systemPrompt = replaceTemplateVariables(promptSystemData.prompt_template, runtimeVariables);
  
  // Add the tourism data section
  systemPrompt += tourismDataSection;
  
  // Add language instruction if detected
  if (languageInstruction) {
    systemPrompt += `\n\n${languageInstruction}`;
  }
  
  // Add final instruction about using the data
  systemPrompt += `

## CRITICAL INSTRUCTION
You MUST use the St. Kitts & Nevis tourism database provided above to answer user questions. Reference specific hotels, restaurants, attractions, prices, and locations from this data. Do not provide generic responses - use the actual names, details, and recommendations from the comprehensive database provided.`;
  
  return systemPrompt;
}

/**
 * Export types for use in other modules
 */
export type { UserProfile, PromptBuilderConfig };

/**
 * Get available persona modifiers
 */
export function getAvailablePersonas(): string[] {
  return [
    'Auto-Detect',
    'The Infant - Gentle Nurturer',
    'The Teen - Cool Confidant', 
    'The Scholar - Learned Educator',
    'The Dialect - Authentic Islander',
    'The Gen Z Vibe - Digital Native',
    'The Confidant - Quiet Companion',
    'The Spark - Creative Inspiration',
    'The Rambler - Detailed Storyteller',
    'The Sloth - Relaxed Guide',
    'The Firecracker - High Energy',
    'The Sweetheart - Extra Caring'
  ];
}

/**
 * Get persona emoji mapping
 */
export function getPersonaEmojis(): Record<string, string> {
  return {
    'Auto-Detect': '🎯',
    'The Infant - Gentle Nurturer': '👶',
    'The Teen - Cool Confidant': '🎸',
    'The Scholar - Learned Educator': '📚',
    'The Dialect - Authentic Islander': '🎭',
    'The Gen Z Vibe - Digital Native': '📱',
    'The Confidant - Quiet Companion': '🤝',
    'The Spark - Creative Inspiration': '💡',
    'The Rambler - Detailed Storyteller': '🗣️',
    'The Sloth - Relaxed Guide': '😴',
    'The Firecracker - High Energy': '🎆',
    'The Sweetheart - Extra Caring': '💕'
  };
}