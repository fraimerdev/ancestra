import { useState, useEffect, useCallback } from 'react';

// ==============================
// TYPES & INTERFACES
// ==============================
export interface QuestStep {
  id: string;
  type: 'geolocation' | 'ai_question' | 'photo' | 'text_input' | 'observation';
  title: string;
  description: string;
  requirement: string;
  completed: boolean;
  evidence?: any;
  aiQuestion?: {
    question: string;
    correctAnswer: string;
    hints: string[];
  };
  location?: {
    lat: number;
    lng: number;
    radius: number;
    name: string;
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'culture' | 'adventure' | 'food' | 'safety' | 'history' | 'nature';
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: string;
  xpReward: number;
  status: 'available' | 'active' | 'completed' | 'failed';
  steps: QuestStep[];
  lore: string;
  culturalContext: string;
  tips: string[];
  relatedData: any;
  acceptedAt?: Date;
  completedAt?: Date;
  currentStepIndex: number;
  persona: 'ancestra' | 'guardian';
  location: string;
  icon: string;
  progress?: number; // 0-100 percentage
}

export interface UserQuestStats {
  totalXP: number;
  completedQuests: number;
  activeQuests: number;
  streak: number;
  level: number;
  badges: string[];
  favoriteDifficulty: number;
  preferredCategory: string;
  totalQuestsStarted: number;
  lastActivityDate?: Date;
}

interface QuestManagementState {
  // Quest Collections
  availableQuests: Quest[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  
  // User Progress
  userStats: UserQuestStats;
  
  // Loading States
  isLoading: boolean;
  
  // Actions
  acceptQuest: (quest: Quest) => void;
  abandonQuest: (questId: string) => void;
  completeQuestStep: (questId: string, stepId: string, evidence: any) => void;
  resetQuest: (questId: string) => void;
  
  // Utility Functions
  getQuestById: (questId: string) => Quest | undefined;
  getActiveQuestsByPersona: (persona: 'ancestra' | 'guardian') => Quest[];
  updateUserStats: (updates: Partial<UserQuestStats>) => void;
  calculateLevel: (xp: number) => number;
  getNextLevelXP: (currentLevel: number) => number;
  
  // Data Management
  saveQuestData: () => void;
  loadQuestData: () => void;
  clearAllQuests: () => void;
}

// Tourism data types (local copy to avoid import issues)
interface TourismDataEntry {
  question: string;
  answer: string;
  category: string;
  location?: string;
  tags?: string[];
  difficulty?: number;
  persona?: 'ancestra' | 'guardian' | 'both';
}

// ==============================
// TOURISM DATA LOADER (LOCAL)
// ==============================
const loadTourismDataLocal = async (): Promise<TourismDataEntry[]> => {
  // Embedded fallback data to avoid import issues
  const fallbackData: TourismDataEntry[] = [
    {
      question: "What is the history of St. Kitts and Nevis?",
      answer: "St. Kitts and Nevis has a rich history dating back to pre-Columbian times when it was inhabited by the Kalinago and Taíno peoples. Christopher Columbus sighted the islands in 1493, naming the larger island Saint Christopher (later shortened to St. Kitts) after himself. The islands became the first successful English colony in the Caribbean in 1624, with sugar plantations driving the economy for centuries. The federation gained independence from Britain in 1983, becoming the newest sovereign nation in the Americas.",
      category: "History & Heritage",
      location: "St. Kitts",
      tags: ["history", "colonization", "independence", "sugar"],
      difficulty: 2,
      persona: "ancestra"
    },
    {
      question: "What are the traditional foods of St. Kitts and Nevis?",
      answer: "Traditional Kittitian and Nevisian cuisine reflects the islands' multicultural heritage. Popular dishes include goat water (a hearty stew considered the national dish), saltfish with dumplings, conch fritters, and breadfruit dishes. Cook-up rice (a one-pot meal with rice, pigeon peas, and coconut milk) is a staple. Local specialties also include sugar cake, black pudding, and cassava bread. Fresh seafood like mahi-mahi, snapper, and lobster are abundant.",
      category: "Food & Dining",
      location: "Various",
      tags: ["food", "cuisine", "traditional", "local"],
      difficulty: 1,
      persona: "ancestra"
    },
    {
      question: "Is St. Kitts and Nevis safe for tourists?",
      answer: "St. Kitts and Nevis is generally considered safe for tourists, with a relatively low crime rate compared to other Caribbean destinations. Violent crime against tourists is rare, though petty theft can occur. The islands have a stable political environment and good infrastructure. Visitors should take normal precautions like securing valuables, avoiding isolated areas at night, and being aware of their surroundings. The local police are helpful and tourism-focused.",
      category: "Safety & Crime",
      location: "St. Kitts & Nevis",
      tags: ["safety", "crime", "tourism", "security"],
      difficulty: 1,
      persona: "guardian"
    },
    {
      question: "What are the emergency contact numbers in St. Kitts and Nevis?",
      answer: "Emergency contact numbers in St. Kitts and Nevis: Police - 911 or 465-2241, Fire Department - 911 or 465-2366, Medical Emergency/Ambulance - 911 or 465-2551. The main hospital is Joseph N. France General Hospital in Basseterre (465-2551). Tourist Police can be reached at 465-2241. The US Embassy does not have a presence; contact the US Embassy in Barbados at (246) 227-4000 for American citizens needing assistance.",
      category: "Safety & Crime",
      location: "St. Kitts & Nevis",
      tags: ["emergency", "police", "medical", "contacts"],
      difficulty: 1,
      persona: "guardian"
    },
    {
      question: "What cultural festivals happen in St. Kitts and Nevis?",
      answer: "St. Kitts and Nevis hosts vibrant cultural festivals throughout the year. The highlight is Sugar Mas (Carnival), celebrated from mid-December through early January, featuring colorful parades, calypso competitions, and street dancing. Nevis has its own Culturama festival in late July/early August. Music Festival in June brings international and local artists. The St. Kitts Food & Rum Festival celebrates culinary traditions. Independence Day (September 19) features cultural shows and community celebrations.",
      category: "Cultural Knowledge",
      location: "St. Kitts & Nevis",
      tags: ["festivals", "carnival", "culture", "music"],
      difficulty: 2,
      persona: "ancestra"
    },
    {
      question: "What transportation options are available in St. Kitts and Nevis?",
      answer: "Transportation in St. Kitts and Nevis includes taxis (abundant but expensive), rental cars (driving on the left side), local buses (affordable but limited schedules), and the scenic railway in St. Kitts. Between islands, there are regular ferry services and short flights. Walking and cycling are viable in towns. Most hotels offer shuttle services to beaches and attractions. For safety, use licensed taxis, agree on fares beforehand, and avoid unlicensed operators.",
      category: "Tourism & Travel",
      location: "St. Kitts & Nevis",
      tags: ["transportation", "taxi", "rental", "ferry"],
      difficulty: 2,
      persona: "guardian"
    },
    {
      question: "What are the top attractions in St. Kitts?",
      answer: "Top attractions in St. Kitts include Brimstone Hill Fortress National Park (UNESCO World Heritage site), the scenic railway tour around the island, beautiful beaches like South Friars Bay and Cockleshell Beach, Romney Manor with its batik factory and gardens, the historic capital Basseterre with its Georgian architecture, Mount Liamuiga volcano for hiking, and the salt ponds for bird watching. Each offers unique insights into the island's natural beauty and colonial history.",
      category: "Tourism & Travel",
      location: "St. Kitts",
      tags: ["attractions", "fortress", "beaches", "hiking"],
      difficulty: 2,
      persona: "both"
    },
    {
      question: "What water activities are available in St. Kitts and Nevis?",
      answer: "St. Kitts and Nevis offer excellent water activities including snorkeling and diving at sites like Shitten Bay and Nags Head, deep-sea fishing for marlin and tuna, catamaran cruises, kayaking through mangroves, windsurfing, jet skiing, and swimming at pristine beaches. The coral reefs are healthy and full of marine life. Several operators offer PADI certification courses. Always use reputable operators and check weather conditions for safety.",
      category: "Nature & Outdoor Activities",
      location: "St. Kitts & Nevis",
      tags: ["water sports", "diving", "snorkeling", "beaches"],
      difficulty: 2,
      persona: "both"
    },
    {
      question: "What is the weather like in St. Kitts and Nevis?",
      answer: "St. Kitts and Nevis enjoy a tropical maritime climate with warm temperatures year-round (75-85°F/24-29°C). The dry season runs from December to April with less rainfall and lower humidity. The wet season (May-November) brings more rain and higher humidity but also lush landscapes. Hurricane season is June-November, with peak risk August-October. Trade winds provide natural cooling. The weather is generally pleasant for tourism year-round, with the dry season being most popular.",
      category: "Tourism & Travel",
      location: "St. Kitts & Nevis",
      tags: ["weather", "climate", "seasons", "hurricane"],
      difficulty: 1,
      persona: "both"
    },
    {
      question: "Where can I experience local culture in St. Kitts and Nevis?",
      answer: "Experience local culture at the Basseterre Market for fresh produce and local crafts, Berkeley Memorial for historical insights, the National Museum showcasing Amerindian artifacts and colonial history, local rum distilleries like St. Kitts Rum Company, traditional villages like Old Road Town, art galleries featuring Caribbean artists, local restaurants serving authentic cuisine, and community festivals where visitors can interact with locals and experience genuine Kittitian hospitality.",
      category: "Cultural Knowledge",
      location: "Various",
      tags: ["culture", "markets", "museums", "community"],
      difficulty: 2,
      persona: "ancestra"
    }
  ];

  try {
    console.log('📊 Loading tourism data from local files...');
    
    // Try to load external data, but fall back to embedded data
    const responses = await Promise.allSettled([
      fetch('/data/data.json').then(res => res.ok ? res.json() : []),
      fetch('/data/cuisine.json').then(res => res.ok ? res.json() : []),
      fetch('/data/events.json').then(res => res.ok ? res.json() : []),
      fetch('/data/hotels.json').then(res => res.ok ? res.json() : [])
    ]);

    const loadedData: TourismDataEntry[] = [];
    
    responses.forEach((result, index) => {
      const fileNames = ['data.json', 'cuisine.json', 'events.json', 'hotels.json'];
      
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        console.log(`✅ Successfully loaded ${fileNames[index]}`);
        loadedData.push(...result.value);
      } else {
        console.warn(`⚠️ Failed to load ${fileNames[index]}, using fallback data`);
      }
    });

    // Combine loaded data with fallback data
    const combinedData = [...fallbackData, ...loadedData];
    
    console.log(`✅ Tourism data loaded successfully: ${combinedData.length} entries`);
    return combinedData;
    
  } catch (error) {
    console.error('❌ Failed to load external tourism data:', error);
    console.log('📚 Using fallback tourism data only');
    return fallbackData;
  }
};

// ==============================
// QUEST GENERATION UTILITY
// ==============================
const generateQuestsFromTourismData = async (): Promise<Quest[]> => {
  try {
    console.log('🎯 Generating quests from tourism data...');
    
    let tourismEntries: TourismDataEntry[] = [];
    
    try {
      // Use local tourism data loader to avoid import issues
      tourismEntries = await loadTourismDataLocal();
      console.log(`📊 Loaded ${tourismEntries.length} tourism data entries`);
    } catch (dataError) {
      console.warn('⚠️ Failed to load tourism data, using fallback:', dataError);
      tourismEntries = [];
    }
    
    if (!tourismEntries || tourismEntries.length === 0) {
      console.warn('⚠️ No tourism data available, using fallback quests');
      return generateFallbackQuests();
    }
    
    const quests: Quest[] = [];
    
    // Generate Ancestra Cultural Quests
    const culturalEntries = tourismEntries.filter(entry => 
      entry.category === 'Food & Dining' || 
      entry.category === 'History & Heritage' || 
      entry.category === 'Cultural Knowledge' ||
      entry.persona === 'ancestra' ||
      entry.persona === 'both'
    );

    culturalEntries.slice(0, 8).forEach((entry, index) => {
      quests.push({
        id: `quest-ancestra-${index}`,
        title: `Cultural Discovery: ${entry.question.substring(0, 40)}...`,
        description: `Explore the rich heritage of St. Kitts through this immersive cultural experience.`,
        category: entry.category.includes('Food') ? 'food' : entry.category.includes('History') ? 'history' : 'culture',
        difficulty: (entry.difficulty || Math.ceil(Math.random() * 4) + 1) as any,
        estimatedTime: ['30 min', '45 min', '1 hour', '1.5 hours'][Math.floor(Math.random() * 4)],
        xpReward: Math.floor(Math.random() * 50) + 25,
        status: 'available',
        steps: generateQuestSteps(entry, 'ancestra'),
        lore: generateLore(entry, 'ancestra'),
        culturalContext: entry.answer.substring(0, 200) + '...',
        tips: [
          'Ask locals about their personal experiences',
          'Take time to appreciate the cultural significance',
          'Document your journey with respectful photography'
        ],
        relatedData: entry,
        currentStepIndex: 0,
        persona: 'ancestra',
        location: entry.location || 'St. Kitts',
        icon: getCategoryIcon(entry.category),
        progress: 0
      });
    });

    // Generate Guardian Safety & Adventure Quests
    const safetyEntries = tourismEntries.filter(entry => 
      entry.category === 'Safety & Crime' || 
      entry.category === 'Nature & Outdoor Activities' ||
      entry.category === 'Tourism & Travel' ||
      entry.persona === 'guardian'
    );

    safetyEntries.slice(0, 8).forEach((entry, index) => {
      quests.push({
        id: `quest-guardian-${index}`,
        title: `Guardian Mission: ${entry.question.substring(0, 40)}...`,
        description: `Master the essential knowledge and skills for safe exploration of St. Kitts.`,
        category: entry.category.includes('Safety') ? 'safety' : entry.category.includes('Nature') ? 'nature' : 'adventure',
        difficulty: (entry.difficulty || Math.ceil(Math.random() * 4) + 1) as any,
        estimatedTime: ['20 min', '30 min', '45 min', '1 hour'][Math.floor(Math.random() * 4)],
        xpReward: Math.floor(Math.random() * 40) + 30,
        status: 'available',
        steps: generateQuestSteps(entry, 'guardian'),
        lore: generateLore(entry, 'guardian'),
        culturalContext: entry.answer.substring(0, 200) + '...',
        tips: [
          'Always prioritize safety over adventure',
          'Keep emergency contacts readily available',
          'Trust your instincts and local guidance'
        ],
        relatedData: entry,
        currentStepIndex: 0,
        persona: 'guardian',
        location: entry.location || 'St. Kitts',
        icon: getCategoryIcon(entry.category),
        progress: 0
      });
    });

    // Add special featured quests
    quests.push({
      id: 'quest-sugar-mas-festival',
      title: 'Sugar Mas Cultural Immersion',
      description: 'Experience the vibrant traditions of St. Kitts Carnival through multi-step cultural exploration.',
      category: 'culture',
      difficulty: 3,
      estimatedTime: '2 hours',
      xpReward: 75,
      status: 'available',
      steps: [
        {
          id: 'step-1',
          type: 'geolocation',
          title: 'Visit Independence Square',
          description: 'Navigate to the heart of Basseterre where carnival celebrations begin',
          requirement: 'Arrive at Independence Square in Basseterre',
          completed: false,
          location: { lat: 17.2956, lng: -62.7258, radius: 100, name: 'Independence Square, Basseterre' }
        },
        {
          id: 'step-2',
          type: 'ai_question',
          title: 'Carnival Knowledge Test',
          description: 'Demonstrate your understanding of Sugar Mas traditions',
          requirement: 'Answer questions about carnival history',
          completed: false,
          aiQuestion: {
            question: 'What is the cultural significance of J\'ouvert Morning in Sugar Mas celebrations?',
            correctAnswer: 'Pre-dawn street party celebrating freedom and cultural expression',
            hints: [
              'Think about liberation and dawn symbolism',
              'Consider the historical context of carnival',
              'Remember the timing - Boxing Day morning'
            ]
          }
        },
        {
          id: 'step-3',
          type: 'photo',
          title: 'Capture Cultural Elements',
          description: 'Document authentic carnival preparations or decorations',
          requirement: 'Take a photo showing Sugar Mas cultural elements',
          completed: false
        }
      ],
      lore: `Sugar Mas is more than mere celebration—it's cultural rebellion transformed into joyful expression. Born from the ashes of plantation life, carnival became the sacred space where enslaved Africans could mock their oppressors, preserve their ancestral traditions, and celebrate hard-won freedom through music, dance, and elaborate costumes that told stories of resistance and hope.`,
      culturalContext: 'St. Kitts Carnival, known as Sugar Mas, is a unique celebration that blends cultural heritage with the festive spirit of the Christmas and New Year holidays.',
      tips: [
        'Visit during December-January for full experience',
        'Engage respectfully with local participants',
        'Learn the deeper historical meanings behind celebrations'
      ],
      relatedData: { festival: 'Sugar Mas', season: 'Christmas/New Year' },
      currentStepIndex: 0,
      persona: 'ancestra',
      location: 'Basseterre',
      icon: '🎭',
      progress: 0
    });

    console.log(`✅ Generated ${quests.length} quests successfully`);
    return quests;
    
  } catch (error) {
    console.error('❌ Error generating quests from tourism data:', error);
    console.log('📚 Using fallback quest generation');
    return generateFallbackQuests();
  }
};

// Generate fallback quests when tourism data is unavailable
const generateFallbackQuests = (): Quest[] => {
  return [
    {
      id: 'quest-fallback-ancestra-1',
      title: 'Explore St. Kitts Heritage',
      description: 'Discover the cultural richness of St. Kitts and Nevis through this introductory heritage experience.',
      category: 'culture',
      difficulty: 2,
      estimatedTime: '1 hour',
      xpReward: 50,
      status: 'available',
      steps: [
        {
          id: 'step-basic-1',
          type: 'text_input',
          title: 'Cultural Reflection',
          description: 'Share your thoughts about St. Kitts culture and what interests you most',
          requirement: 'Write about what you find interesting (minimum 100 words)',
          completed: false
        }
      ],
      lore: 'Every journey begins with curiosity about the world around us. St. Kitts and Nevis offer a tapestry of cultural experiences waiting to be discovered.',
      culturalContext: 'St. Kitts and Nevis is a federation with a rich blend of African, European, and indigenous influences.',
      tips: ['Be curious', 'Ask questions', 'Enjoy the journey'],
      relatedData: {},
      currentStepIndex: 0,
      persona: 'ancestra',
      location: 'St. Kitts',
      icon: '🏛️',
      progress: 0
    },
    {
      id: 'quest-fallback-guardian-1',
      title: 'Basic Safety Assessment',
      description: 'Learn fundamental safety protocols for exploring St. Kitts and Nevis.',
      category: 'safety',
      difficulty: 1,
      estimatedTime: '30 min',
      xpReward: 40,
      status: 'available',
      steps: [
        {
          id: 'step-safety-1',
          type: 'text_input',
          title: 'Safety Planning',
          description: 'Create a basic safety plan for your St. Kitts exploration',
          requirement: 'Write a safety checklist (minimum 100 words)',
          completed: false
        }
      ],
      lore: 'The Guardian\'s wisdom teaches us that preparation is the foundation of all successful adventures.',
      culturalContext: 'St. Kitts and Nevis is generally safe for tourists with proper precautions.',
      tips: ['Stay alert', 'Plan ahead', 'Know emergency contacts'],
      relatedData: {},
      currentStepIndex: 0,
      persona: 'guardian',
      location: 'St. Kitts',
      icon: '🛡️',
      progress: 0
    }
  ];
};

const generateQuestSteps = (dataEntry: TourismDataEntry, persona: 'ancestra' | 'guardian'): QuestStep[] => {
  const steps: QuestStep[] = [];
  
  // Step 1: Location-based step
  steps.push({
    id: `step-location-${Math.random().toString(36).substr(2, 9)}`,
    type: 'geolocation',
    title: `Visit ${dataEntry.location || 'the location'}`,
    description: persona === 'ancestra' 
      ? 'Journey to this culturally significant location to begin your heritage exploration'
      : 'Navigate to this strategic location to assess conditions and gather intelligence',
    requirement: `Arrive within 100 meters of the target location`,
    completed: false,
    location: {
      lat: getLocationCoordinates(dataEntry.location).lat,
      lng: getLocationCoordinates(dataEntry.location).lng,
      radius: 100,
      name: dataEntry.location || 'Target Location'
    }
  });

  // Step 2: AI knowledge verification
  steps.push({
    id: `step-knowledge-${Math.random().toString(36).substr(2, 9)}`,
    type: 'ai_question',
    title: persona === 'ancestra' ? 'Cultural Understanding Check' : 'Safety Assessment Quiz',
    description: persona === 'ancestra'
      ? 'Demonstrate your comprehension of the cultural significance'
      : 'Verify your understanding of safety protocols and risk factors',
    requirement: 'Answer knowledge questions correctly',
    completed: false,
    aiQuestion: {
      question: dataEntry.question,
      correctAnswer: dataEntry.answer.substring(0, 100),
      hints: [
        'Consider the historical context',
        'Think about local perspectives',
        'Remember the cultural significance'
      ]
    }
  });

  // Step 3: Documentation step
  if (Math.random() > 0.5) {
    steps.push({
      id: `step-photo-${Math.random().toString(36).substr(2, 9)}`,
      type: 'photo',
      title: 'Visual Documentation',
      description: persona === 'ancestra'
        ? 'Capture the cultural essence and heritage elements you observe'
        : 'Document safety conditions and potential hazards for future reference',
      requirement: 'Upload photographic evidence',
      completed: false
    });
  } else {
    steps.push({
      id: `step-observation-${Math.random().toString(36).substr(2, 9)}`,
      type: 'text_input',
      title: 'Detailed Observation',
      description: persona === 'ancestra'
        ? 'Reflect on the cultural stories and heritage connections you\'ve discovered'
        : 'Provide a comprehensive safety assessment and risk analysis',
      requirement: 'Write detailed observations (minimum 100 words)',
      completed: false
    });
  }

  return steps;
};

const generateLore = (dataEntry: TourismDataEntry, persona: 'ancestra' | 'guardian'): string => {
  if (persona === 'ancestra') {
    return `Deep in the heart of St. Kitts lies a story waiting to be discovered. ${dataEntry.answer.substring(0, 150)}... This quest will guide you through layers of cultural history that have shaped the island's identity for centuries. Every step you take connects you to the ancestral wisdom of those who came before, weaving your journey into the rich tapestry of Caribbean heritage.`;
  } else {
    return `The Guardian's knowledge runs deep through every corner of St. Kitts, where preparedness and wisdom can mean the difference between adventure and misadventure. ${dataEntry.answer.substring(0, 150)}... This mission will equip you with essential intelligence and safety protocols, ensuring you can navigate the island's wonders while maintaining vigilance and protecting both yourself and fellow travelers.`;
  }
};

const getCategoryIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    'Food & Dining': '🍽️',
    'History & Heritage': '🏛️',
    'Cultural Knowledge': '🎭',
    'Safety & Crime': '🛡️',
    'Nature & Outdoor Activities': '🏞️',
    'Tourism & Travel': '✈️'
  };
  return iconMap[category] || '📍';
};

const getLocationCoordinates = (locationName?: string) => {
  const coordinates: Record<string, {lat: number, lng: number}> = {
    'Basseterre': { lat: 17.2956, lng: -62.7258 },
    'Frigate Bay': { lat: 17.2654, lng: -62.6977 },
    'Old Road': { lat: 17.3167, lng: -62.7833 },
    'Sandy Point': { lat: 17.3614, lng: -62.8489 },
    'Charlestown': { lat: 17.1370, lng: -62.6213 },
    'Irish Town': { lat: 17.2948, lng: -62.7197 },
    'Various': { lat: 17.2956, lng: -62.7258 },
    'St. Kitts': { lat: 17.2956, lng: -62.7258 },
    'St. Kitts & Nevis': { lat: 17.2956, lng: -62.7258 }
  };
  return coordinates[locationName || 'St. Kitts'] || coordinates['St. Kitts'];
};

// ==============================
// STORAGE KEYS
// ==============================
const STORAGE_KEYS = {
  AVAILABLE_QUESTS: 'stkitts_available_quests',
  ACTIVE_QUESTS: 'stkitts_active_quests',
  COMPLETED_QUESTS: 'stkitts_completed_quests',
  USER_STATS: 'stkitts_user_quest_stats',
  LAST_SYNC: 'stkitts_quest_last_sync'
};

// ==============================
// QUEST MANAGEMENT HOOK
// ==============================
export const useQuestManagement = (): QuestManagementState => {
  // State
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserQuestStats>({
    totalXP: 0,
    completedQuests: 0,
    activeQuests: 0,
    streak: 0,
    level: 1,
    badges: [],
    favoriteDifficulty: 2,
    preferredCategory: 'culture',
    totalQuestsStarted: 0
  });

  // Initialize quest data on mount
  useEffect(() => {
    loadQuestData();
  }, []);

  // Auto-save when quest data changes
  useEffect(() => {
    if (!isLoading) {
      saveQuestData();
    }
  }, [activeQuests, completedQuests, userStats, isLoading]);

  // Load quest data from localStorage
  const loadQuestData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Load available quests (generate fresh ones each time)
      console.log('🎯 Loading quest data...');
      const generatedQuests = await generateQuestsFromTourismData();
      setAvailableQuests(generatedQuests);
      
      // Load active quests
      const savedActiveQuests = localStorage.getItem(STORAGE_KEYS.ACTIVE_QUESTS);
      if (savedActiveQuests) {
        try {
          const parsedActiveQuests = JSON.parse(savedActiveQuests);
          // Convert date strings back to Date objects
          const restoredActiveQuests = parsedActiveQuests.map((quest: any) => ({
            ...quest,
            acceptedAt: quest.acceptedAt ? new Date(quest.acceptedAt) : undefined,
            completedAt: quest.completedAt ? new Date(quest.completedAt) : undefined
          }));
          setActiveQuests(restoredActiveQuests);
        } catch (parseError) {
          console.warn('⚠️ Failed to parse active quests, clearing storage:', parseError);
          localStorage.removeItem(STORAGE_KEYS.ACTIVE_QUESTS);
        }
      }
      
      // Load completed quests
      const savedCompletedQuests = localStorage.getItem(STORAGE_KEYS.COMPLETED_QUESTS);
      if (savedCompletedQuests) {
        try {
          const parsedCompletedQuests = JSON.parse(savedCompletedQuests);
          const restoredCompletedQuests = parsedCompletedQuests.map((quest: any) => ({
            ...quest,
            acceptedAt: quest.acceptedAt ? new Date(quest.acceptedAt) : undefined,
            completedAt: quest.completedAt ? new Date(quest.completedAt) : undefined
          }));
          setCompletedQuests(restoredCompletedQuests);
        } catch (parseError) {
          console.warn('⚠️ Failed to parse completed quests, clearing storage:', parseError);
          localStorage.removeItem(STORAGE_KEYS.COMPLETED_QUESTS);
        }
      }
      
      // Load user stats
      const savedUserStats = localStorage.getItem(STORAGE_KEYS.USER_STATS);
      if (savedUserStats) {
        try {
          const parsedStats = JSON.parse(savedUserStats);
          setUserStats({
            ...parsedStats,
            lastActivityDate: parsedStats.lastActivityDate ? new Date(parsedStats.lastActivityDate) : undefined
          });
        } catch (parseError) {
          console.warn('⚠️ Failed to parse user stats, using defaults:', parseError);
          localStorage.removeItem(STORAGE_KEYS.USER_STATS);
        }
      }
      
      console.log('✅ Quest data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading quest data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save quest data to localStorage
  const saveQuestData = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_QUESTS, JSON.stringify(activeQuests));
      localStorage.setItem(STORAGE_KEYS.COMPLETED_QUESTS, JSON.stringify(completedQuests));
      localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify({
        ...userStats,
        lastActivityDate: new Date()
      }));
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      
      console.log('💾 Quest data saved successfully');
    } catch (error) {
      console.error('❌ Error saving quest data:', error);
    }
  }, [activeQuests, completedQuests, userStats]);

  // Accept a quest (move from available to active)
  const acceptQuest = useCallback((quest: Quest) => {
    const acceptedQuest: Quest = {
      ...quest,
      status: 'active',
      acceptedAt: new Date(),
      currentStepIndex: 0,
      progress: 0
    };
    
    setActiveQuests(prev => [...prev, acceptedQuest]);
    setUserStats(prev => ({
      ...prev,
      activeQuests: prev.activeQuests + 1,
      totalQuestsStarted: prev.totalQuestsStarted + 1
    }));
    
    console.log(`🎯 Quest accepted: ${quest.title}`);
  }, []);

  // Abandon a quest (remove from active)
  const abandonQuest = useCallback((questId: string) => {
    setActiveQuests(prev => prev.filter(quest => quest.id !== questId));
    setUserStats(prev => ({
      ...prev,
      activeQuests: Math.max(0, prev.activeQuests - 1)
    }));
    
    console.log(`❌ Quest abandoned: ${questId}`);
  }, []);

  // Complete a quest step
  const completeQuestStep = useCallback((questId: string, stepId: string, evidence: any) => {
    setActiveQuests(prev => prev.map(quest => {
      if (quest.id === questId) {
        const updatedSteps = quest.steps.map(step => 
          step.id === stepId ? { ...step, completed: true, evidence } : step
        );
        
        const completedStepsCount = updatedSteps.filter(step => step.completed).length;
        const progress = (completedStepsCount / updatedSteps.length) * 100;
        const nextStepIndex = quest.currentStepIndex + 1;
        const isQuestComplete = nextStepIndex >= updatedSteps.length;
        
        if (isQuestComplete) {
          // Move quest to completed
          const completedQuest: Quest = {
            ...quest,
            steps: updatedSteps,
            currentStepIndex: nextStepIndex,
            status: 'completed',
            completedAt: new Date(),
            progress: 100
          };
          
          setCompletedQuests(prev => [...prev, completedQuest]);
          setActiveQuests(prev => prev.filter(q => q.id !== questId));
          
          // Update user stats for quest completion
          setUserStats(prev => ({
            ...prev,
            totalXP: prev.totalXP + quest.xpReward,
            completedQuests: prev.completedQuests + 1,
            activeQuests: Math.max(0, prev.activeQuests - 1),
            level: calculateLevel(prev.totalXP + quest.xpReward),
            streak: prev.streak + 1
          }));
          
          console.log(`🏆 Quest completed: ${quest.title} (+${quest.xpReward} XP)`);
          return completedQuest;
        } else {
          const updatedQuest = {
            ...quest,
            steps: updatedSteps,
            currentStepIndex: nextStepIndex,
            progress
          };
          
          console.log(`✅ Quest step completed: ${stepId} (${Math.round(progress)}% complete)`);
          return updatedQuest;
        }
      }
      return quest;
    }));
  }, []);

  // Reset a quest (restart from beginning)
  const resetQuest = useCallback((questId: string) => {
    setActiveQuests(prev => prev.map(quest => {
      if (quest.id === questId) {
        const resetSteps = quest.steps.map(step => ({
          ...step,
          completed: false,
          evidence: undefined
        }));
        
        return {
          ...quest,
          steps: resetSteps,
          currentStepIndex: 0,
          progress: 0
        };
      }
      return quest;
    }));
    
    console.log(`🔄 Quest reset: ${questId}`);
  }, []);

  // Get quest by ID (search all collections)
  const getQuestById = useCallback((questId: string): Quest | undefined => {
    let foundQuest = availableQuests.find(q => q.id === questId);
    if (!foundQuest) foundQuest = activeQuests.find(q => q.id === questId);
    if (!foundQuest) foundQuest = completedQuests.find(q => q.id === questId);
    return foundQuest;
  }, [availableQuests, activeQuests, completedQuests]);

  // Get active quests by persona
  const getActiveQuestsByPersona = useCallback((persona: 'ancestra' | 'guardian'): Quest[] => {
    return activeQuests.filter(quest => quest.persona === persona);
  }, [activeQuests]);

  // Update user stats
  const updateUserStats = useCallback((updates: Partial<UserQuestStats>) => {
    setUserStats(prev => ({ ...prev, ...updates }));
  }, []);

  // Calculate level from XP
  const calculateLevel = useCallback((xp: number): number => {
    // Level progression: 100 XP for level 2, 250 for level 3, 450 for level 4, etc.
    // Formula: sum of (level * 150) for each level
    let level = 1;
    let requiredXP = 0;
    
    while (xp >= requiredXP) {
      level++;
      requiredXP += level * 150;
    }
    
    return Math.max(1, level - 1);
  }, []);

  // Get XP required for next level
  const getNextLevelXP = useCallback((currentLevel: number): number => {
    return (currentLevel + 1) * 150;
  }, []);

  // Clear all quest data
  const clearAllQuests = useCallback(() => {
    setActiveQuests([]);
    setCompletedQuests([]);
    setUserStats({
      totalXP: 0,
      completedQuests: 0,
      activeQuests: 0,
      streak: 0,
      level: 1,
      badges: [],
      favoriteDifficulty: 2,
      preferredCategory: 'culture',
      totalQuestsStarted: 0
    });
    
    // Clear localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('🗑️ All quest data cleared');
  }, []);

  return {
    // Quest Collections
    availableQuests,
    activeQuests,
    completedQuests,
    
    // User Progress
    userStats,
    
    // Loading States
    isLoading,
    
    // Actions
    acceptQuest,
    abandonQuest,
    completeQuestStep,
    resetQuest,
    
    // Utility Functions
    getQuestById,
    getActiveQuestsByPersona,
    updateUserStats,
    calculateLevel,
    getNextLevelXP,
    
    // Data Management  
    saveQuestData,
    loadQuestData,
    clearAllQuests
  };
};