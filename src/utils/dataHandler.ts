// Enhanced Data Handler with Google AI Integration and Comprehensive Local Data
import { aiService } from './aiService';
import { 
  loadComprehensiveTourismData, 
  searchComprehensiveData, 
  formatDataForAI,
  getDataByCategory as getComprehensiveDataByCategory,
  getDataByLocation,
  TourismDataItem 
} from './dataLoader';

// Legacy tourism data structure for backward compatibility
export const tourismData = [
  {
    id: 1,
    category: "attractions",
    title: "Brimstone Hill Fortress National Park",
    description: "A UNESCO World Heritage Site, this 17th-century fortress offers spectacular views and rich colonial history. Known as the 'Gibraltar of the West Indies.'",
    location: "St. Kitts",
    type: "historical",
    keywords: ["fortress", "unesco", "history", "colonial", "views", "brimstone hill"],
    details: {
      openingHours: "Daily 9:30 AM - 5:30 PM",
      admissionFee: "Adults: $10 USD, Children: $5 USD",
      duration: "2-3 hours",
      difficulty: "Moderate walking"
    }
  },
  {
    id: 2,
    category: "attractions",
    title: "St. Kitts Scenic Railway",
    description: "The last remaining railway in the West Indies, offering a 3-hour circular tour around St. Kitts through sugar cane fields and coastal views.",
    location: "St. Kitts",
    type: "tour",
    keywords: ["railway", "train", "scenic", "sugar cane", "tour", "circular"],
    details: {
      duration: "3 hours",
      schedule: "Varies by season",
      includes: "Air-conditioned cars, commentary, refreshments"
    }
  },
  {
    id: 3,
    category: "beaches",
    title: "Frigate Bay",
    description: "St. Kitts' most popular beach destination with both Atlantic and Caribbean coastlines, restaurants, bars, and water sports.",
    location: "St. Kitts",
    type: "beach",
    keywords: ["beach", "frigate bay", "water sports", "restaurants", "nightlife", "swimming"],
    details: {
      activities: ["Swimming", "Snorkeling", "Jet skiing", "Beach volleyball"],
      amenities: ["Restaurants", "Bars", "Beach chairs", "Water sports rentals"],
      bestTime: "Year-round, calmer on Caribbean side"
    }
  },
  {
    id: 4,
    category: "food",
    title: "Local Cuisine",
    description: "St. Kitts and Nevis offers delicious Caribbean cuisine including goat water, conch fritters, saltfish and Johnny cakes.",
    location: "Both islands",
    type: "cuisine",
    keywords: ["food", "cuisine", "goat water", "conch", "saltfish", "johnny cakes", "local dishes"],
    details: {
      mustTry: ["Goat Water (national dish)", "Conch fritters", "Saltfish", "Coconut dumplings", "Sea moss drink"],
      restaurants: ["Reggae Beach Bar", "Marshalls", "Spice Mill", "Belle Mont Farm"]
    }
  },
  {
    id: 5,
    category: "attractions",
    title: "Nevis Hot Springs",
    description: "Natural thermal springs in Nevis offering relaxation and therapeutic benefits in a tropical setting.",
    location: "Nevis",
    type: "natural",
    keywords: ["hot springs", "thermal", "nevis", "relaxation", "natural", "therapeutic"],
    details: {
      temperature: "104-108°F (40-42°C)",
      benefits: "Therapeutic minerals, relaxation",
      access: "Short hike required"
    }
  },
  {
    id: 6,
    category: "culture",
    title: "Carnival",
    description: "Annual Christmas season celebration featuring parades, music, dancing, and colorful costumes.",
    location: "Both islands",
    type: "festival",
    keywords: ["carnival", "festival", "christmas", "parade", "music", "dance", "culture"],
    details: {
      when: "Late December through early January",
      highlights: ["Grand Parade", "Calypso competitions", "Street parties", "Traditional mas bands"]
    }
  },
  {
    id: 7,
    category: "safety",
    title: "General Safety Information",
    description: "St. Kitts and Nevis is generally safe for tourists with low crime rates and friendly locals.",
    location: "Both islands",
    type: "safety",
    keywords: ["safety", "crime", "security", "police", "emergency", "health"],
    details: {
      emergency: "911",
      police: "(869) 465-2241",
      hospital: "(869) 465-2551",
      tips: ["Use hotel safes", "Stay aware of surroundings", "Drink responsibly", "Respect local customs"]
    }
  },
  {
    id: 8,
    category: "transportation",
    title: "Getting Around",
    description: "Options include rental cars, taxis, buses, and ferry between islands.",
    location: "Both islands",
    type: "transport",
    keywords: ["transport", "taxi", "rental car", "bus", "ferry", "travel"],
    details: {
      options: ["Rental cars (drive on left)", "Licensed taxis", "Public buses", "Ferry to Nevis"],
      tips: ["International driving permit recommended", "Negotiate taxi fares", "Ferry runs multiple times daily"]
    }
  }
];

// Enhanced search function with comprehensive local data and AI integration
export async function findAnswerFromData(
  query: string,
  useAI: boolean = true,
  includeWebSearch: boolean = false
): Promise<string> {
  try {
    console.log('🔍 Enhanced data search with comprehensive data:', { query, useAI, includeWebSearch });

    // First, search through comprehensive local data
    const localResults = findAnswerFromTourismData(query);
    
    if (localResults && localResults.length > 100) {
      // If we have good local data and AI is enabled, enhance it
      if (useAI) {
        try {
          const enhancedPrompt = `Based on this comprehensive St. Kitts and Nevis information: "${localResults}", please provide a detailed and engaging response to: "${query}". Focus on the local information provided and avoid suggesting other websites.`;
          
          const aiResult = await aiService.generateResponse(enhancedPrompt, {
            mode: 'ancestra',
            currentPersona: 'Ancestra',
            userProfile: {}
          });
          
          if (aiResult.response && aiResult.response.length > 50) {
            return aiResult.response;
          }
        } catch (error) {
          console.warn('AI enhancement failed, using local data:', error);
        }
      }
      
      return localResults;
    }

    // If local data is insufficient and AI is enabled, use AI-powered search with local context
    if (useAI) {
      const aiResult = await aiService.generateResponse(query, {
        mode: 'ancestra',
        currentPersona: 'Ancestra',
        userProfile: {}
      });
      
      if (aiResult.response) {
        return aiResult.response;
      }
    }

    // Fallback to basic local search
    return localResults || getNoDataFoundMessage(query);

  } catch (error) {
    console.error('Enhanced data search error:', error);
    return findAnswerFromTourismData(query) || getNoDataFoundMessage(query);
  }
}

// Enhanced tourism data search using comprehensive JSON data
export function findAnswerFromTourismData(query: string): string {
  if (!query || query.trim().length === 0) {
    return '';
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  console.log('🔍 Searching comprehensive tourism data for:', normalizedQuery);

  try {
    // Search comprehensive data
    const relevantItems = searchComprehensiveData(query);
    
    if (relevantItems.length === 0) {
      return '';
    }

    // Format response based on number of items
    let response = '';
    
    if (relevantItems.length === 1) {
      const item = relevantItems[0];
      response = formatSingleComprehensiveItem(item);
    } else {
      response = formatMultipleComprehensiveItems(relevantItems, normalizedQuery);
    }

    console.log('✅ Found comprehensive data:', { itemCount: relevantItems.length, responseLength: response.length });
    return response;
  } catch (error) {
    console.error('Error searching comprehensive data:', error);
    return '';
  }
}

// Format response for a single comprehensive data item
function formatSingleComprehensiveItem(item: TourismDataItem): string {
  let response = `**${item.category}**`;
  
  if (item.subcategory && item.subcategory !== item.category) {
    response += ` - ${item.subcategory}`;
  }
  
  response += `\n\n${item.answer}`;
  
  if (item.location && item.location !== 'Various' && item.location !== 'St. Kitts & Nevis') {
    response += `\n\n📍 **Location:** ${item.location}`;
  }
  
  if (item.source && item.source !== 'Local knowledge') {
    response += `\n\n📚 **Source:** ${item.source}`;
  }
  
  return response;
}

// Format response for multiple comprehensive data items
function formatMultipleComprehensiveItems(items: TourismDataItem[], query: string): string {
  let response = `Here's what I found about ${query} in St. Kitts and Nevis:\n\n`;
  
  items.slice(0, 3).forEach((item, index) => {
    response += `**${index + 1}. ${item.subcategory || item.category}**\n`;
    
    // Use the question as a title if it's more specific than the category
    if (item.question.length < 100) {
      response += `*${item.question}*\n`;
    }
    
    // Truncate long answers for multiple items
    const answer = item.answer.length > 300 
      ? item.answer.substring(0, 300) + '...' 
      : item.answer;
    response += `${answer}`;
    
    if (item.location && item.location !== 'Various') {
      response += ` (${item.location})`;
    }
    response += '\n\n';
  });
  
  if (items.length > 3) {
    response += `I have ${items.length - 3} more related entries. Would you like me to share more specific information about any of these topics?`;
  } else if (items.length > 1) {
    response += 'Would you like more detailed information about any of these topics?';
  }
  
  return response;
}

// Placeholder web search function
function searchWeb(query: string): Promise<{ ok: boolean; data?: any }> {
  console.warn('Web search not implemented, returning placeholder');
  return Promise.resolve({ ok: false });
}

// Enhanced web search integration
export async function searchWebForTourismInfo(query: string): Promise<{
  success: boolean;
  results: any[];
  summary: string;
}> {
  try {
    const searchResult = await searchWeb(`${query} St. Kitts Nevis tourism travel`);
    
    if (!searchResult.ok || !searchResult.data?.items) {
      return {
        success: false,
        results: [],
        summary: 'No current web information found'
      };
    }

    const results = searchResult.data.items.slice(0, 5).map((item: any) => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet,
      source: item.displayLink
    }));

    const summary = `Found ${results.length} current web results about ${query} in St. Kitts and Nevis`;

    return {
      success: true,
      results,
      summary
    };

  } catch (error) {
    console.error('Web search error:', error);
    return {
      success: false,
      results: [],
      summary: 'Web search temporarily unavailable'
    };
  }
}

// Placeholder YouTube search function
function searchYouTube(query: string, limit: number): Promise<{ ok: boolean; data?: any }> {
  console.warn('YouTube search not implemented, returning placeholder');
  return Promise.resolve({ ok: false });
}

// YouTube search for visual content
export async function searchVideosForTourism(query: string): Promise<{
  success: boolean;
  videos: any[];
  summary: string;
}> {
  try {
    const searchResult = await searchYouTube(`${query} St. Kitts Nevis travel tourism`, 5);
    
    if (!searchResult.ok || !searchResult.data?.items) {
      return {
        success: false,
        videos: [],
        summary: 'No videos found'
      };
    }

    const videos = searchResult.data.items.map((video: any) => ({
      title: video.snippet.title,
      description: video.snippet.description,
      channel: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      videoId: video.id.videoId,
      thumbnail: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`
    }));

    const summary = `Found ${videos.length} videos about ${query} in St. Kitts and Nevis`;

    return {
      success: true,
      videos,
      summary
    };

  } catch (error) {
    console.error('Video search error:', error);
    return {
      success: false,
      videos: [],
      summary: 'Video search temporarily unavailable'
    };
  }
}

// Placeholder map functions
function getMapEmbedUrl(location: string): string {
  return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(location)}`;
}

function getDirectionsUrl(from: string, to: string): string {
  return `https://www.google.com/maps/dir/${encodeURIComponent(from)}/${encodeURIComponent(to)}`;
}

// Get map information for locations
export function getLocationMapInfo(location: string): {
  embedUrl: string;
  directionsUrl: string;
  searchUrl: string;
} {
  const cleanLocation = location.includes('St. Kitts') || location.includes('Nevis') ? 
    location : `${location}, St. Kitts and Nevis`;

  return {
    embedUrl: getMapEmbedUrl(cleanLocation),
    directionsUrl: getDirectionsUrl('Basseterre', cleanLocation),
    searchUrl: `https://www.google.com/maps/search/${encodeURIComponent(cleanLocation)}`
  };
}

// Enhanced data categories using comprehensive data
export const DATA_CATEGORIES = (() => {
  try {
    const { categories } = loadComprehensiveTourismData();
    
    // Create dynamic categories from comprehensive data
    const dynamicCategories: { [key: string]: any } = {};
    
    categories.forEach(category => {
      const key = category.toLowerCase().replace(/\s+/g, '_').replace(/&/g, 'and');
      dynamicCategories[key] = {
        name: category,
        description: `Information about ${category.toLowerCase()} in St. Kitts and Nevis`,
        emoji: getCategoryEmoji(category)
      };
    });
    
    return dynamicCategories;
  } catch (error) {
    console.error('Error loading categories:', error);
    // Fallback categories
    return {
      attractions: { name: 'Attractions', description: 'Tourist destinations', emoji: '🏛️' },
      food: { name: 'Food & Dining', description: 'Culinary experiences', emoji: '🍽️' },
      culture: { name: 'Culture & Events', description: 'Cultural experiences', emoji: '🎭' },
      safety: { name: 'Safety & Health', description: 'Safety information', emoji: '🛡️' }
    };
  }
})();

// Get emoji for category
function getCategoryEmoji(category: string): string {
  const emojiMap: { [key: string]: string } = {
    'Food & Dining': '🍽️',
    'Safety & Crime': '🛡️',
    'Nature & Outdoor Activities': '🌿',
    'History & Heritage': '🏛️',
    'Cultural Knowledge': '🎭',
    'Tourism & Travel': '✈️',
    'Accommodations': '🏨',
    'Transportation': '🚗',
    'Shopping': '🛍️',
    'Entertainment': '🎵',
    'Sports & Recreation': '⚽',
    'Health & Wellness': '💪'
  };
  
  return emojiMap[category] || '📍';
}

// Get data by category using comprehensive data
export function getDataByCategory(category: string): TourismDataItem[] {
  return getComprehensiveDataByCategory(category);
}

// Get random tourism fact from comprehensive data
export function getRandomTourismFact(): string {
  try {
    const { allData } = loadComprehensiveTourismData();
    
    // Filter items that make good facts
    const factItems = allData.filter(item => 
      item.answer.length < 500 && 
      (item.category === 'History & Heritage' || 
       item.category === 'Cultural Knowledge' ||
       item.subcategory.includes('History') ||
       item.subcategory.includes('Culture'))
    );
    
    if (factItems.length > 0) {
      const randomItem = factItems[Math.floor(Math.random() * factItems.length)];
      return `Did you know? ${randomItem.answer.substring(0, 300)}${randomItem.answer.length > 300 ? '...' : ''}`;
    }
  } catch (error) {
    console.error('Error getting random fact:', error);
  }
  
  // Fallback facts
  const facts = [
    "St. Kitts was named after Saint Christopher by Columbus in 1493.",
    "Brimstone Hill Fortress is called the 'Gibraltar of the West Indies'.",
    "The St. Kitts Railway is the last remaining railway in the West Indies.",
    "Nevis is the birthplace of Alexander Hamilton, first U.S. Secretary of Treasury.",
    "The islands were formed by volcanic activity and have fertile soil perfect for sugar cane.",
    "Green vervet monkeys roam freely throughout St. Kitts - they were brought by early settlers.",
    "The federation of St. Kitts and Nevis gained independence in 1983.",
    "Frigate Bay has both Atlantic and Caribbean coastlines within walking distance."
  ];
  
  return facts[Math.floor(Math.random() * facts.length)];
}

// Fallback message when no data is found
function getNoDataFoundMessage(query: string): string {
  return `I don't have specific information about "${query}" in my comprehensive local database right now. However, I have extensive knowledge about St. Kitts and Nevis covering food & dining, safety & crime, nature & outdoor activities, history & heritage, cultural knowledge, tourism & travel, and much more. Could you try rephrasing your question or ask about a related topic? I'm here to help you with authentic local information about our beautiful islands!`;
}

// Data validation and health check for comprehensive data
export function validateTourismData(): {
  isValid: boolean;
  totalItems: number;
  categoryCounts: { [key: string]: number };
  issues: string[];
} {
  try {
    const { allData, categories } = loadComprehensiveTourismData();
    const issues: string[] = [];
    const categoryCounts: { [key: string]: number } = {};

    // Count items by category
    categories.forEach(category => {
      categoryCounts[category] = allData.filter(item => item.category === category).length;
    });

    // Check for potential issues
    allData.forEach((item, index) => {
      if (!item.question) issues.push(`Item ${index + 1} missing question`);
      if (!item.answer) issues.push(`Item ${index + 1} missing answer`);
      if (!item.category) issues.push(`Item ${index + 1} missing category`);
    });

    return {
      isValid: issues.length === 0,
      totalItems: allData.length,
      categoryCounts,
      issues
    };
  } catch (error) {
    return {
      isValid: false,
      totalItems: 0,
      categoryCounts: {},
      issues: [`Failed to load comprehensive data: ${error}`]
    };
  }
}

// Export enhanced search function as default export for backward compatibility
export default findAnswerFromData;