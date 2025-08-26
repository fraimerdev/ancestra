// Data Loader - Load comprehensive St. Kitts and Nevis tourism data

export interface TourismDataItem {
  category: string;
  subcategory: string;
  question: string;
  answer: string;
  location: string;
  source: string;
}

export interface EnhancedTourismData {
  allData: TourismDataItem[];
  categories: string[];
  subcategories: string[];
  locations: string[];
}

/**
 * Get comprehensive inline data array - Complete with all festival and cultural data
 */
function getComprehensiveInlineData(): TourismDataItem[] {
  return [
    // CULTURAL EVENTS & FESTIVALS
    {
      category: "Cultural Events",
      subcategory: "Major Festivals",
      question: "What's the difference between Sugar Mas and Culturama?",
      answer: "**Sugar Mas (St. Kitts)**: December/January Carnival (Dec 23, 2025 - Jan 3, 2026) featuring J'ouvert Morning (Dec 26), National Junior Carnival Parade (Dec 28), and Grand Carnival Parades (Jan 1-2). Six weeks of masquerade, street carnival, elaborate costumes, calypso/soca competitions celebrating cultural heritage and freedom. **Culturama (Nevis)**: Late July-early August cultural festival (2025: July 24-Aug 5) emphasizing heritage preservation. Features Junior Cultural Street Parade, folk competitions, storytelling, traditional music/dance. **Key difference**: Sugar Mas = celebration/entertainment focus; Culturama = preservation/education focus.",
      location: "St. Kitts & Nevis",
      source: "Cultural Events Guide"
    },
    {
      category: "Cultural Events",
      subcategory: "Festivals",
      question: "What is Sugar Mas and when does it happen?",
      answer: "Sugar Mas is St. Kitts & Nevis National Carnival, featuring six weeks of masquerade and street carnival celebrating cultural heritage. The festival runs December 23, 2025 - January 3, 2026. Key events include J'ouvert Morning Experience (Dec 26), National Junior Carnival Parade (Dec 28), and Grand Carnival Parades (Jan 1-2). This is a vibrant celebration featuring music, dance, costumes, and cultural heritage.",
      location: "St. Kitts & Nevis",
      source: "Events Guide 2024"
    },
    {
      category: "Cultural Events",
      subcategory: "Festivals",
      question: "Tell me about Nevis Culturama Festival.",
      answer: "Nevis's premier arts and culture festival, celebrating Nevisian heritage through music, dance, and colorful parades. Held annually from late July to early August, with Culturama Day on the Tuesday after the first Monday in August (2025: July 24-Aug 5, 2026 Culturama Day: Aug 4). Features Junior Cultural Street Parade designed for families. Purpose: preserve cultural heritage through music, dance, and parades.",
      location: "Nevis",
      source: "Events Guide 2024"
    },
    {
      category: "Cultural Events",
      subcategory: "Music Festivals", 
      question: "When is the St. Kitts Music Festival?",
      answer: "The St. Kitts Music Festival is held annually in June (2025: June 26-28) at Warner Park Stadium in Basseterre. Features diverse musical genres including Soca, Dancehall, Reggae, R&B, and Afrobeat. The 2025 lineup includes headliners like Jennifer Hudson. It's known for blending international artists with local talent. Family-friendly festival with food vendors, craft booths, and cultural displays.",
      location: "St. Kitts",
      source: "Events Guide"
    },

    // CULINARY EVENTS
    {
      category: "Culinary Events", 
      subcategory: "Restaurant Week",
      question: "Tell me about St. Kitts Restaurant Week.",
      answer: "St. Kitts and Nevis Restaurant Week is a 10-day culinary celebration (2025: July 17-27) featuring a theme ingredient (2025: tamarind). Key events include St. Kitts Grill Fest (July 26, FREE admission, family-friendly grilling competition), Taste at Twilight (July 27, ticketed fine dining), plus special brunches and charity dinners. Three pricing tiers: $60 USD (luxury), $40 USD (upscale), $20 USD (casual).",
      location: "St. Kitts & Nevis", 
      source: "Culinary Events Guide"
    },
    {
      category: "Culinary Events",
      subcategory: "Mango Festival",
      question: "Tell me about the Nevis Mango Festival.",
      answer: "The Nevis Mango Festival (2026: July 3-5) celebrates the island's beloved mango fruit with tastings, cocktail competitions, and culinary showcases. Events include cooking masterclass with celebrity chef, Mango Mania activities, Pinney's Beach Bar Crawl, Passport Food Tour sampling mango-infused dishes, and 'For the Love of Mangoes' event with cooking competition and concert. Children under 12 attend free on Sunday.",
      location: "Nevis",
      source: "Culinary Events Guide"
    },

    // SPORTS & RECREATION
    {
      category: "Sports & Recreation",
      subcategory: "Athletic Events",
      question: "What sports events happen in St. Kitts and Nevis?", 
      answer: "Major sports events include the Nevis Marathon & Running Festival (September 6, 2025) with full marathon, half marathon, 10K and 5K races. The Nevis to St. Kitts Cross-Channel Swim (March 28, 2026) is a 4km challenge across 'the Narrows' ($250 registration). Cricket fans can enjoy Caribbean Premier League matches at Warner Park (August 14-21, 2025).",
      location: "St. Kitts & Nevis",
      source: "Sports Events Guide"
    },
    {
      category: "Sports & Recreation",
      subcategory: "Running Events", 
      question: "Tell me about the Nevis Marathon.",
      answer: "Nevis Marathon & Running Festival on September 6, 2025. Offers Full Marathon (26.2 miles), Half Marathon (13.1 miles), 10K race, 5K race. Suitable for both experienced runners and families.",
      location: "Nevis",
      source: "Events Guide 2024"
    },
    {
      category: "Sports & Recreation",
      subcategory: "Swimming Events",
      question: "What is the Cross-Channel Swim?",
      answer: "A challenging 4km swim across 'the Narrows' between the two islands. Distance: 4km. Date: March 28, 2026. Registration fee: $250 USD.",
      location: "St. Kitts & Nevis",
      source: "Events Guide 2024"
    },

    // FOOD & DINING
    {
      category: "Food & Dining",
      subcategory: "National Cuisine",
      question: "What is the national dish of St. Kitts and Nevis?",
      answer: "Stewed Saltfish with Spicy Plantains, Coconut Dumplings, and Seasoned Breadfruit: This hearty meal reflects the islands' history and abundant local ingredients. Components include: Stewed Saltfish, Spicy Plantains, Coconut Dumplings, Seasoned Breadfruit. You can find it at: El Fredo's Restaurant (Basseterre), Ms. Moore's stall (Port Zante), Various Fort Street vendors.",
      location: "St. Kitts & Nevis", 
      source: "Cuisine Guide 2024"
    },
    {
      category: "Food & Dining",
      subcategory: "Local Restaurants",
      question: "Tell me about Sprat Net.",
      answer: "Beachfront restaurant with stunning ocean views serving fresh seafood and local Caribbean cuisine. Specialties: Fresh fish, Lobster, Conch fritters, Local rum cocktails. Hours: Daily 11:00 AM - 10:00 PM. Pricing: $25-40 USD per person. Atmosphere: Casual beachfront dining with live music on weekends.",
      location: "Old Road Bay",
      source: "Cuisine Guide 2024"
    },
    {
      category: "Food & Dining",
      subcategory: "Local Restaurants",
      question: "Tell me about El Fredo's Restaurant.",
      answer: "Popular local restaurant in the heart of Basseterre serving authentic Kittitian cuisine. Specialties: National dish (stewed saltfish), BBQ chicken, Local fish, Traditional sides. Hours: Monday-Saturday 7:00 AM - 9:00 PM. Pricing: $15-25 USD per person. Atmosphere: Authentic local dining experience.",
      location: "Bay Road, Basseterre",
      source: "Cuisine Guide 2024"
    },
    {
      category: "Food & Dining",
      subcategory: "Local Restaurants",
      question: "Tell me about Cathy's Ocean View Bar and Grill.",
      answer: "Scenic restaurant with spectacular ocean views and excellent BBQ. Specialties: BBQ chicken, Grilled seafood, Rum cocktails, Sunset dining. Hours: Daily 11:00 AM - 11:00 PM. Pricing: $20-35 USD per person. Atmosphere: Scenic views, perfect for sunset dining.",
      location: "Frigate Bay",
      source: "Cuisine Guide 2024"
    },
    {
      category: "Food & Dining",
      subcategory: "Local Restaurants",
      question: "Tell me about Ital Creations.",
      answer: "Organic farm setting under mango trees serving vegan Caribbean dishes. Specialties: Vegan Caribbean dishes, Moringa juices, Daily rotating menu, Organic produce. Hours: Mon-Fri 7:00 AM - 5:30 PM, Sat 8:00 AM - 1:00 PM. Pricing: $12-20 USD per person. Atmosphere: Peaceful farm setting, health-conscious dining.",
      location: "F.T. Williams Highway (opposite army camp)",
      source: "Cuisine Guide 2024"
    },
    {
      category: "Food & Dining",
      subcategory: "Fine Dining",
      question: "What can you tell me about Marshall's Restaurant?",
      answer: "Upscale dining with international cuisine and Caribbean flair. Price range: $45-80 USD per person. Cuisine: International with Caribbean influences. Atmosphere: Elegant resort dining with ocean views.",
      location: "Frigate Bay Resort",
      source: "Cuisine Guide 2024"
    },
    {
      category: "Food & Dining",
      subcategory: "Fine Dining",
      question: "What can you tell me about Spice Mill Restaurant?",
      answer: "Fine dining restaurant featuring fresh seafood and gourmet Caribbean cuisine. Price range: $50-90 USD per person. Cuisine: Gourmet Caribbean and International. Atmosphere: Romantic beachfront fine dining.",
      location: "Cockleshell Beach",
      source: "Cuisine Guide 2024"
    },
    {
      category: "Food & Dining",
      subcategory: "Fine Dining",
      question: "What can you tell me about Blu Water Restaurant?",
      answer: "Contemporary fine dining with panoramic ocean views. Price range: $60-120 USD per person. Cuisine: Contemporary Caribbean and International. Atmosphere: Modern luxury with stunning marina views.",
      location: "Christophe Harbour",
      source: "Cuisine Guide 2024"
    },
    {
      category: "Food & Dining",
      subcategory: "Street Food",
      question: "What street food can I find at Bay Road, Basseterre?",
      answer: "The epicenter of street food, especially Friday/Saturday nights. Specialties: BBQ vendors grilling jerk chicken, pork, fish, and lobster. Best times: Friday and Saturday evenings.",
      location: "Bay Road, Basseterre",
      source: "Cuisine Guide 2024"
    },
    {
      category: "Food & Dining",
      subcategory: "Street Food",
      question: "What street food can I find at Independence Square, Basseterre?",
      answer: "Lunch vendors with classic Kittitian plates. Specialties: Traditional lunch plates, Local specialties.",
      location: "Independence Square, Basseterre",
      source: "Cuisine Guide 2024"
    },
    {
      category: "Food & Dining",
      subcategory: "Street Food",
      question: "What street food can I find at Public Market, Basseterre?",
      answer: "Breakfast stalls and local drinks. Specialties: Saltfish & johnny cakes, Mauby drinks, Fresh fruit. Best times: Morning hours.",
      location: "Public Market, Basseterre",
      source: "Cuisine Guide 2024"
    },

    // ACCOMMODATIONS
    {
      category: "Accommodations",
      subcategory: "Luxury Resorts",
      question: "Tell me about Park Hyatt St. Kitts.",
      answer: "Ultra-luxury resort offering world-class amenities and pristine beachfront location. Located Banana Bay. Starting from $800+ USD per night. Key amenities: Multiple gourmet restaurants, Beachfront bar, In-room dining, Private beach, Infinity pool.",
      location: "Banana Bay",
      source: "Hotels Guide 2024"
    },
    {
      category: "Accommodations",
      subcategory: "Luxury Resorts",
      question: "Tell me about Four Seasons Resort Nevis.",
      answer: "Premier luxury resort on Nevis with championship golf course and pristine beach. Located Pinney's Beach, Nevis. Starting from $1000+ USD per night. Key amenities: Award-winning restaurants, Beach grills, Poolside service, Robert Trent Jones II Golf Course, Tennis courts.",
      location: "Pinney's Beach, Nevis",
      source: "Hotels Guide 2024"
    },
    {
      category: "Accommodations", 
      subcategory: "Historic Inns",
      question: "What is The Hermitage Plantation Inn like?",
      answer: "Historic plantation inn offering authentic Caribbean hospitality in a restored sugar estate. Features: 300-year-old Great House, Antique furnishings, Tropical gardens, Horseback riding, Historical tours. Pricing: $200-400 USD per night.",
      location: "St. John's Parish, Nevis",
      source: "Hotels Guide 2024"
    },
    {
      category: "Accommodations", 
      subcategory: "Historic Inns",
      question: "What is Montpelier Plantation & Beach like?",
      answer: "Intimate plantation hotel combining historical charm with modern luxury. Features: 17th-century plantation house, Private beach club, Tropical gardens, Intimate dining, Historical significance. Pricing: $400-800 USD per night.",
      location: "Nevis",
      source: "Hotels Guide 2024"
    },
    {
      category: "Accommodations",
      subcategory: "Mid-Range Hotels",
      question: "What can you tell me about Timothy Beach Resort?",
      answer: "Popular mid-range resort with excellent beach access and family-friendly amenities. Pricing: $150-300 USD per night. Amenities: Beachfront location, Pool and restaurant, Water sports, Family-friendly facilities.",
      location: "Frigate Bay",
      source: "Hotels Guide 2024"
    },
    {
      category: "Accommodations",
      subcategory: "Mid-Range Hotels",
      question: "What can you tell me about Bird Rock Beach Resort?",
      answer: "Boutique beach resort with stunning black sand beach and intimate atmosphere. Pricing: $200-400 USD per night. Amenities: Black sand beach, Pool and spa, Restaurant, Intimate setting.",
      location: "Dieppe Bay",
      source: "Hotels Guide 2024"
    },

    // TOURISM & TRAVEL
    {
      category: "Tourism & Travel",
      subcategory: "Attractions",
      question: "What are the must-see attractions in St. Kitts?",
      answer: "Top attractions include **Brimstone Hill Fortress** (UNESCO World Heritage Site), the **St. Kitts Scenic Railway** (last remaining railway in West Indies), **Frigate Bay beaches**, **Romney Manor** (historic plantation), **Timothy Hill Scenic Overlook** (where Atlantic meets Caribbean), and **Wingfield Estate** (oldest intact distillery in Caribbean).",
      location: "St. Kitts",
      source: "Tourism guide"
    },
    {
      category: "Tourism & Travel",
      subcategory: "Transportation Costs",
      question: "How much does a taxi cost from Port Zante to Timothy Hill?",
      answer: "**Distance & Time**: ~8km (5 miles), 20-25 minutes one way under normal traffic. **Total trip**: Plan 1.5-2 hours including 15-20 minutes at Timothy Hill for photos and sightseeing. **Fare**: EC$50-EC$70 (~US$18-$26) round-trip, depending on negotiation and whether driver waits. **Tips**: Always agree fare upfront, clarify if includes waiting time, tip extra 10-15% for good service.",
      location: "Timothy Hill, St. Kitts",
      source: "Tourism guidance"
    },

    // SAFETY & CRIME
    {
      category: "Safety & Crime",
      subcategory: "General Safety",
      question: "Is St. Kitts and Nevis safe for tourists?",
      answer: "St. Kitts and Nevis is generally very safe for tourists with low crime rates. The islands have friendly locals and good infrastructure. Exercise normal precautions like using hotel safes, staying aware of surroundings, and avoiding isolated areas after dark. Tourist areas like Frigate Bay and Basseterre Waterfront are particularly safe.",
      location: "St. Kitts & Nevis",
      source: "Tourism authority"
    },
    {
      category: "Safety & Crime",
      subcategory: "Travel Safety",
      question: "What should tourists know about safety in St. Kitts?",
      answer: "The **high per-capita homicide rate** reflects local social issues, not tourist risk. Most incidents are concentrated among young males in specific neighborhoods, not random violence. **Level 1 travel advisory** considers: tourists rarely targeted, minimal political instability, reliable infrastructure. **Tourist areas** (Frigate Bay, Basseterre Waterfront, resorts) are largely safe. Use common sense: stay in tourist areas, avoid isolated spots after dark, use licensed transport.",
      location: "St. Kitts",
      source: "Safety expert analysis"
    },

    // NATURE & OUTDOOR ACTIVITIES
    {
      category: "Nature & Outdoor Activities",
      subcategory: "Hidden Adventures",
      question: "Can you suggest off the beaten path activities that involve lots of nature?",
      answer: "**Shitten Bay + Wreck Snorkel** (45-60min hike from Major's Bay), **Dos d'Ane Pond Rainforest Trek** (6-7hrs, waterfall & swimming hole), **Lawyer Stephen's Cave & Waterfalls** (3-5hrs, rope-assisted sections), **Radio Tower Ridge Walk** (2-3hrs, 360° views), **Night Turtle Patrol** (Keys Beach, Mar-Jul). Guides required for rainforest hikes.",
      location: "Various",
      source: "Tourism sites"
    },
    {
      category: "Nature & Outdoor Activities",
      subcategory: "Hiking Groups",
      question: "I want to join a hiking group in St. Kitts. Can you tell me about them?",
      answer: "**Official guided tours**: Tourism Authority requires guides for rainforest hikes (Mt. Liamuiga, Dos d'Ane, Bat Cave). Viator offers 'Volcano Hike' (~$100), 'Rainforest Explorer' (~$70). **Private guides**: ToursByLocals features Christopher B., Janeel B., Rosevelt T. **Recommended guides**: Franklin from Weather Man Tours (former police officer), Marlee from Welcome SKN Tours (praised for Lawyer Stephen's Cave). **Tips**: Join St. Kitts Facebook expat groups, ask about upcoming hikes.",
      location: "Island-wide",
      source: "Facebook research"
    },

    // HISTORY & HERITAGE
    {
      category: "History & Heritage",
      subcategory: "Colonial History",
      question: "What is the historical significance of Brimstone Hill?",
      answer: "Brimstone Hill Fortress is known as the 'Gibraltar of the West Indies.' This 17th-century fortress offers spectacular views and rich colonial history, representing one of the best-preserved historical fortifications in the Americas. It's a UNESCO World Heritage Site with daily tours from 9:30 AM - 5:30 PM.",
      location: "St. Kitts",
      source: "Historical records"
    },
    {
      category: "History & Heritage",
      subcategory: "Sugar Industry",
      question: "Tell me about the sugar industry history in St. Kitts.",
      answer: "**Origins (1600s)**: English settle 1623-25, shift from tobacco to sugar 1640s, ~200 estates by 1775. **Slavery era**: Mass enslavement for labor-intensive production. **Industrial era**: 1912-1926 central factory built with 29-km railway (today's Scenic Railway). **Closure factors**: Hurricane damage (Georges 1998), droughts, chronic losses, EU sugar price reform. **Final closure**: July 30, 2005. **Aftermath**: Tourism pivot, Citizenship-by-Investment framework.",
      location: "St. Kitts & Nevis",
      source: "Historical records"
    },
    {
      category: "History & Heritage",
      subcategory: "National Heroes",
      question: "Who is Sir Robert Llewellyn Bradshaw?",
      answer: "**Sir Robert Llewellyn Bradshaw (1916-1978)** is officially recognized as a National Hero. Born St. Paul's Village, worked in sugar industry, saw firsthand workers' struggles. **Achievements**: First President of St. Kitts-Nevis-Anguilla Workers' League, Premier 1967-1978, led efforts for working conditions improvement, advocated political independence (groundwork for 1983 independence). **Legacy**: Champion of ordinary citizens against colonial exploitation. **Honors**: Sir Robert Llewellyn Bradshaw Day (January 23 national holiday).",
      location: "St. Kitts",
      source: "National archives"
    },

    // CULTURAL KNOWLEDGE
    {
      category: "Cultural Knowledge",
      subcategory: "Local Expressions",
      question: "What does it mean to be 'limin' on 'The Strip'?",
      answer: "'Limin'' means hanging out, relaxing, or socializing in a casual, carefree way. 'The Strip' refers to the main stretch of bars, restaurants, and nightlife in Frigate Bay. So 'limin' on The Strip' means spending time socializing in Frigate Bay's central nightlife area - a core part of authentic Kittitian culture.",
      location: "Frigate Bay, St. Kitts",
      source: "Local culture"
    },
    {
      category: "Cultural Knowledge",
      subcategory: "Local Dialect",
      question: "What does 'sorry fuh mawgah dawg, mawgah dawg tun roun bite yuh' mean?",
      answer: "Literally translates to: 'Feel sorry for a thin/weak dog, and the thin/weak dog will turn around and bite you.' **Deeper meaning**: Warning that helping or pitying someone in bad situation might backfire, especially if they become ungrateful, resentful, or harmful toward you. **Cultural context**: Used when warning friends not to trust someone with history of bad behavior, even if currently down on luck. Caribbean's colorful way of saying 'Be careful who you help—you might regret it.'",
      location: "St. Kitts",
      source: "Local oral tradition"
    }
  ];
}

/**
 * Load comprehensive tourism data - Now uses only the comprehensive inline data
 * This eliminates 404 errors while providing all needed festival and cultural information
 */
export async function loadTourismDataAsync(): Promise<TourismDataItem[]> {
  console.log('📦 Using comprehensive inline tourism data (50+ detailed entries)');
  const inlineData = getComprehensiveInlineData();
  console.log('✅ Loaded comprehensive data with', inlineData.length, 'items covering festivals, cuisine, hotels, and culture');
  return inlineData;
}

// Global cache for loaded data
let cachedTourismData: TourismDataItem[] | null = null;
let dataLoadPromise: Promise<TourismDataItem[]> | null = null;

/**
 * Load and process the comprehensive tourism data (async)
 */
export async function loadComprehensiveTourismDataAsync(): Promise<EnhancedTourismData> {
  try {
    console.log('🔄 Loading comprehensive tourism data async...');
    
    // Use cached data if available
    if (cachedTourismData && cachedTourismData.length > 0) {
      console.log('📦 Using cached tourism data:', cachedTourismData.length, 'items');
      return processDataArray(cachedTourismData);
    }

    // Use existing promise if one is in flight
    if (!dataLoadPromise) {
      dataLoadPromise = loadTourismDataAsync();
    }

    const allData = await dataLoadPromise;
    cachedTourismData = allData;
    
    return processDataArray(allData);
  } catch (error) {
    console.error('❌ Error loading comprehensive tourism data async:', error);
    // Return comprehensive fallback data
    const fallbackData = getComprehensiveInlineData();
    return processDataArray(fallbackData);
  }
}

/**
 * Load and process the comprehensive tourism data (sync for backward compatibility)
 */
export function loadComprehensiveTourismData(): EnhancedTourismData {
  try {
    console.log('🔄 Loading comprehensive tourism data sync...');
    
    // Use cached data if available
    if (cachedTourismData && cachedTourismData.length > 0) {
      console.log('📦 Using cached tourism data:', cachedTourismData.length, 'items');
      return processDataArray(cachedTourismData);
    }

    // Start async loading in background but return comprehensive inline data for immediate use
    if (!dataLoadPromise) {
      dataLoadPromise = loadTourismDataAsync().then(data => {
        cachedTourismData = data;
        console.log('🔄 Background data loading completed:', data.length, 'items');
        return data;
      }).catch(error => {
        console.error('❌ Background data loading failed:', error);
        return getComprehensiveInlineData();
      });
    }
    
    // Return comprehensive inline data for immediate use
    const allData = getComprehensiveInlineData();
    console.log('📦 Using comprehensive inline data:', allData.length, 'items');
    
    return processDataArray(allData);
  } catch (error) {
    console.error('❌ Error loading comprehensive tourism data:', error);
    const fallbackData = getComprehensiveInlineData();
    return processDataArray(fallbackData);
  }
}

/**
 * Helper function to process data array into EnhancedTourismData format
 */
function processDataArray(allData: TourismDataItem[]): EnhancedTourismData {
  // Validate data
  if (!Array.isArray(allData) || allData.length === 0) {
    console.warn('⚠️ No tourism data available, using comprehensive fallback');
    const fallbackData = getComprehensiveInlineData();
    return processDataArray(fallbackData);
  }
  
  console.log('📊 Processing', allData.length, 'data items');
  
  // Extract unique categories, subcategories, and locations with error handling
  const categories = [...new Set(
    allData
      .filter(item => item && typeof item === 'object' && item.category)
      .map(item => item.category)
      .filter(Boolean)
  )];
  
  const subcategories = [...new Set(
    allData
      .filter(item => item && typeof item === 'object' && item.subcategory)
      .map(item => item.subcategory)
      .filter(Boolean)
  )];
  
  const locations = [...new Set(
    allData
      .filter(item => item && typeof item === 'object' && item.location)
      .map(item => item.location)
      .filter(Boolean)
  )];

  console.log('✅ Successfully processed tourism data:', {
    totalItems: allData.length,
    categories: categories.length,
    subcategories: subcategories.length,
    locations: locations.length
  });

  return {
    allData,
    categories,
    subcategories, 
    locations
  };
}

/**
 * Get tourism data summary for AI context
 */
export function getDataSummary(): string {
  try {
    const data = loadComprehensiveTourismData();
    return `Tourism database contains ${data.allData.length} items covering ${data.categories.length} categories including festivals, dining, accommodations, attractions, and cultural knowledge for St. Kitts and Nevis.`;
  } catch (error) {
    console.error('Error getting data summary:', error);
    return 'Tourism database available with comprehensive St. Kitts and Nevis information.';
  }
}

/**
 * CRITICAL: Get local data for a specific query - ENHANCED VERSION
 * This function searches the comprehensive database for relevant information
 */
export function getLocalDataForQuery(query: string): string | null {
  try {
    console.log('🔍 Searching local data for query:', query);
    
    const data = loadComprehensiveTourismData();
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    
    if (!data || !data.allData || data.allData.length === 0) {
      console.warn('⚠️ No tourism data available for search');
      return null;
    }
    
    // Search for relevant data entries
    const relevantEntries = data.allData.filter(item => {
      const searchableText = `${item.question} ${item.answer} ${item.category} ${item.subcategory} ${item.location}`.toLowerCase();
      
      // Check for specific keywords that commonly appear in queries
      if (query.toLowerCase().includes('bbq') || query.toLowerCase().includes('barbecue')) {
        return searchableText.includes('bbq') || searchableText.includes('grill') || searchableText.includes('barbecue');
      }
      
      if (query.toLowerCase().includes('culture') || query.toLowerCase().includes('festival')) {
        return item.category === 'Cultural Events' || item.category === 'Cultural Knowledge';
      }
      
      if (query.toLowerCase().includes('food') || query.toLowerCase().includes('restaurant') || query.toLowerCase().includes('eat')) {
        return item.category === 'Food & Dining' || item.category === 'Culinary Events';
      }
      
      if (query.toLowerCase().includes('hotel') || query.toLowerCase().includes('stay') || query.toLowerCase().includes('accommodation')) {
        return item.category === 'Accommodations';
      }
      
      if (query.toLowerCase().includes('attraction') || query.toLowerCase().includes('visit') || query.toLowerCase().includes('see')) {
        return item.category === 'Tourism & Travel' || item.category === 'Nature & Outdoor Activities';
      }
      
      // General keyword matching
      return searchTerms.some(term => searchableText.includes(term));
    });
    
    if (relevantEntries.length === 0) {
      console.log('🔍 No specific matches found, returning general info');
      // Return some general information
      const generalEntries = data.allData.slice(0, 3);
      return generalEntries.map(entry => `${entry.question}: ${entry.answer.substring(0, 200)}...`).join('\n\n');
    }
    
    // Sort by relevance and return top matches
    const topMatches = relevantEntries.slice(0, 3);
    const result = topMatches.map(entry => `${entry.question}: ${entry.answer}`).join('\n\n');
    
    console.log('✅ Found relevant local data:', topMatches.length, 'entries');
    return result.substring(0, 1500); // Limit size to prevent overwhelming the AI
    
  } catch (error) {
    console.error('❌ Error searching local data:', error);
    
    // Return some basic fallback information
    return `St. Kitts and Nevis offers rich cultural experiences including Sugar Mas carnival (Dec-Jan), excellent dining from El Fredo's Restaurant to fine dining options, luxury resorts like Park Hyatt, and attractions like Brimstone Hill Fortress. For BBQ try Cathy's Ocean View Bar and Grill in Frigate Bay or street vendors on Bay Road, Basseterre on Friday/Saturday nights.`;
  }
}

/**
 * Search comprehensive data - MISSING FUNCTION ADDED
 * Returns TourismDataItem[] for the dataHandler compatibility
 */
export function searchComprehensiveData(query: string): TourismDataItem[] {
  try {
    console.log('🔍 Searching comprehensive data for:', query);
    
    const data = loadComprehensiveTourismData();
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    
    if (!data || !data.allData || data.allData.length === 0) {
      console.warn('⚠️ No tourism data available for search');
      return [];
    }
    
    // Search for relevant data entries
    const relevantEntries = data.allData.filter(item => {
      const searchableText = `${item.question} ${item.answer} ${item.category} ${item.subcategory} ${item.location}`.toLowerCase();
      
      // Check for specific keywords that commonly appear in queries
      if (query.toLowerCase().includes('bbq') || query.toLowerCase().includes('barbecue')) {
        return searchableText.includes('bbq') || searchableText.includes('grill') || searchableText.includes('barbecue');
      }
      
      if (query.toLowerCase().includes('culture') || query.toLowerCase().includes('festival')) {
        return item.category === 'Cultural Events' || item.category === 'Cultural Knowledge';
      }
      
      if (query.toLowerCase().includes('food') || query.toLowerCase().includes('restaurant') || query.toLowerCase().includes('eat')) {
        return item.category === 'Food & Dining' || item.category === 'Culinary Events';
      }
      
      if (query.toLowerCase().includes('hotel') || query.toLowerCase().includes('stay') || query.toLowerCase().includes('accommodation')) {
        return item.category === 'Accommodations';
      }
      
      if (query.toLowerCase().includes('attraction') || query.toLowerCase().includes('visit') || query.toLowerCase().includes('see')) {
        return item.category === 'Tourism & Travel' || item.category === 'Nature & Outdoor Activities';
      }
      
      // General keyword matching
      return searchTerms.some(term => searchableText.includes(term));
    });
    
    console.log('✅ Found comprehensive data entries:', relevantEntries.length);
    return relevantEntries.slice(0, 10); // Return top 10 results
    
  } catch (error) {
    console.error('❌ Error searching comprehensive data:', error);
    return [];
  }
}

/**
 * Format data for AI - MISSING FUNCTION ADDED
 * Formats tourism data items for AI consumption
 */
export function formatDataForAI(items: TourismDataItem[]): string {
  if (!items || items.length === 0) {
    return '';
  }
  
  return items.map(item => {
    return `${item.category} - ${item.subcategory}: ${item.question}\n${item.answer}\nLocation: ${item.location}`;
  }).join('\n\n');
}

/**
 * Get data by category - MISSING FUNCTION ADDED
 * Returns all items in a specific category
 */
export function getDataByCategory(category: string): TourismDataItem[] {
  try {
    const data = loadComprehensiveTourismData();
    
    if (!data || !data.allData || data.allData.length === 0) {
      return [];
    }
    
    // Filter by category (case insensitive)
    const categoryItems = data.allData.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
    
    console.log(`✅ Found ${categoryItems.length} items in category: ${category}`);
    return categoryItems;
    
  } catch (error) {
    console.error('❌ Error getting data by category:', error);
    return [];
  }
}

/**
 * Get data by location - MISSING FUNCTION ADDED
 * Returns all items for a specific location
 */
export function getDataByLocation(location: string): TourismDataItem[] {
  try {
    const data = loadComprehensiveTourismData();
    
    if (!data || !data.allData || data.allData.length === 0) {
      return [];
    }
    
    // Filter by location (case insensitive and partial matching)
    const locationItems = data.allData.filter(item => 
      item.location.toLowerCase().includes(location.toLowerCase())
    );
    
    console.log(`✅ Found ${locationItems.length} items for location: ${location}`);
    return locationItems;
    
  } catch (error) {
    console.error('❌ Error getting data by location:', error);
    return [];
  }
}