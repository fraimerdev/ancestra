// API Services for Discovery Hub features
import { config, getApiKey } from './config';

// Type for backward compatibility
interface APIConfig {
  GEMINI_API_KEY: string;
  EVENTS_API_KEY: string;
  GOOGLE_PLACES_API_KEY: string;
  RAPIDAPI_KEY: string;
  EXPEDIA_HOST: string;
  WEATHER_API_KEY: string;
}

// Use the centralized config
const API_CONFIG: APIConfig = {
  GEMINI_API_KEY: getApiKey('GEMINI_API_KEY'),
  EVENTS_API_KEY: getApiKey('EVENTS_API_KEY'),
  GOOGLE_PLACES_API_KEY: getApiKey('GOOGLE_PLACES_API_KEY'),
  RAPIDAPI_KEY: getApiKey('RAPIDAPI_KEY'),
  EXPEDIA_HOST: getApiKey('EXPEDIA_HOST'),
  WEATHER_API_KEY: getApiKey('WEATHER_API_KEY')
};

// Google Places API for restaurant search
export interface Restaurant {
  name: string;
  cuisine: string;
  rating: number;
  price: string;
  address: string;
  phone?: string;
  distance?: string;
  place_id?: string;
  photo_reference?: string;
}

export async function searchRestaurants(
  location: string = "Basseterre, St. Kitts", 
  cuisine: string = "restaurant"
): Promise<Restaurant[]> {
  try {
    // For demo purposes, using mock data with realistic St. Kitts restaurants
    // In production, this would be:
    // const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${cuisine}+restaurant+${location}&key=${API_CONFIG.GOOGLE_PLACES_API_KEY}`);
    
    const mockRestaurants: Restaurant[] = [
      {
        name: "The Spice Mill Restaurant",
        cuisine: "Caribbean",
        rating: 4.5,
        price: "$$",
        address: "Cockleshell Beach, St. Kitts",
        phone: "+1 (869) 762-2314",
        distance: "2.1 km"
      },
      {
        name: "Marshalls Restaurant", 
        cuisine: "Fine Dining",
        rating: 4.8,
        price: "$$$",
        address: "Horizons Villa Resort, St. Kitts",
        phone: "+1 (869) 466-8245",
        distance: "3.5 km"
      },
      {
        name: "El Fredo's Restaurant",
        cuisine: "Local",
        rating: 4.3,
        price: "$",
        address: "Bay Road, Basseterre",
        phone: "+1 (869) 465-3654",
        distance: "0.8 km"
      },
      {
        name: "Cathy's Ocean View Bar & Grill",
        cuisine: "Caribbean BBQ",
        rating: 4.6,
        price: "$$",
        address: "Frigate Bay, St. Kitts",
        phone: "+1 (869) 762-8849",
        distance: "4.2 km"
      },
      {
        name: "Serendipity Restaurant",
        cuisine: "International",
        rating: 4.4,
        price: "$$",
        address: "Monkey Hill, Basseterre",
        phone: "+1 (869) 465-9999",
        distance: "1.8 km"
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockRestaurants.filter(restaurant => 
      cuisine === "Any" || restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
}

// Weather API for activity suggestions
export interface WeatherData {
  condition: string;
  temperature: number;
  description: string;
  humidity?: number;
  windSpeed?: number;
}

export interface WeatherActivity {
  title: string;
  description: string;
  icon: string;
  weather: string;
  category: string;
}

export async function getCurrentWeather(location: string = "Basseterre"): Promise<WeatherData> {
  try {
    // In production:
    // const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_CONFIG.WEATHER_API_KEY}&units=metric`);
    
    // Mock Caribbean weather data
    const mockWeather: WeatherData = {
      condition: "sunny",
      temperature: 28,
      description: "Partly cloudy with warm temperatures",
      humidity: 75,
      windSpeed: 12
    };

    await new Promise(resolve => setTimeout(resolve, 800));
    return mockWeather;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return {
      condition: "unknown",
      temperature: 25,
      description: "Weather data unavailable"
    };
  }
}

export async function getWeatherBasedActivities(weather: WeatherData): Promise<WeatherActivity[]> {
  const activities: WeatherActivity[] = [];

  if (weather.condition === "sunny" || weather.temperature > 25) {
    activities.push(
      {
        title: "Visit Brimstone Hill Fortress",
        description: "Perfect weather for exploring this UNESCO World Heritage site with panoramic views",
        icon: "🏰",
        weather: "sunny",
        category: "Historical"
      },
      {
        title: "Beach Day at Frigate Bay",
        description: "Ideal conditions for swimming and sunbathing at St. Kitts' most popular beach",
        icon: "🏖️",
        weather: "sunny",
        category: "Beach"
      },
      {
        title: "Scenic Railway Journey",
        description: "Clear skies perfect for the scenic train ride around the island",
        icon: "🚂",
        weather: "sunny",
        category: "Adventure"
      }
    );
  } else if (weather.condition === "rainy") {
    activities.push(
      {
        title: "Romney Manor & Caribelle Batik",
        description: "Indoor cultural experience with batik demonstrations and shopping",
        icon: "🎨",
        weather: "rainy",
        category: "Cultural"
      },
      {
        title: "National Museum Visit",
        description: "Learn about St. Kitts history in a comfortable indoor setting",
        icon: "🏛️",
        weather: "rainy",
        category: "Educational"
      }
    );
  }

  return activities;
}

// Events and Activities API
export interface LocalEvent {
  name: string;
  date: string;
  location: string;
  description: string;
  category: string;
  price?: string;
}

export async function getLocalEvents(): Promise<LocalEvent[]> {
  try {
    // In production, this would integrate with event APIs
    const mockEvents: LocalEvent[] = [
      {
        name: "Sugar Mas Festival",
        date: "December 15 - January 3",
        location: "Various locations across St. Kitts",
        description: "Annual carnival celebration with parades, music, and cultural performances",
        category: "Festival",
        price: "Free"
      },
      {
        name: "St. Kitts Restaurant Week",
        date: "July 11-21",
        location: "Participating restaurants island-wide",
        description: "Culinary celebration featuring local cuisine and international flavors",
        category: "Food",
        price: "$20-60"
      },
      {
        name: "Heritage Walking Tour",
        date: "Daily",
        location: "Starting from Independence Square",
        description: "Guided tour through historic Basseterre with local guides",
        category: "Cultural",
        price: "$25"
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 1200));
    return mockEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// Parks and Nature API
export interface NatureSpot {
  name: string;
  type: string;
  distance: string;
  description: string;
  difficulty?: string;
  features: string[];
  coordinates?: { lat: number; lng: number };
}

export async function getNaturalAttractions(): Promise<NatureSpot[]> {
  const attractions: NatureSpot[] = [
    {
      name: "Central Forest Reserve National Park",
      type: "Rainforest",
      distance: "15 km from Basseterre",
      description: "Pristine rainforest covering 25% of St. Kitts, home to Mount Liamuiga volcano",
      difficulty: "Moderate to Challenging",
      features: ["Volcano hike", "Wildlife viewing", "Guided tours required"],
      coordinates: { lat: 17.3776, lng: -62.8044 }
    },
    {
      name: "South East Peninsula",
      type: "Coastal Park",
      distance: "12 km from Basseterre",
      description: "Dramatic coastline with salt ponds, beaches, and hiking trails",
      difficulty: "Easy to Moderate",
      features: ["Beach access", "Salt pond birding", "Scenic drives"],
      coordinates: { lat: 17.2635, lng: -62.6520 }
    },
    {
      name: "Black Rocks Formation",
      type: "Geological Site",
      distance: "8 km from Basseterre",
      description: "Volcanic rock formations on the Atlantic coast",
      difficulty: "Easy",
      features: ["Photography", "Geology tour", "Ocean views"],
      coordinates: { lat: 17.3911, lng: -62.8431 }
    },
    {
      name: "Timothy Hill Lookout",
      type: "Scenic Viewpoint",
      distance: "12 km from Basseterre",
      description: "Stunning viewpoint overlooking both Caribbean Sea and Atlantic Ocean",
      difficulty: "Easy",
      features: ["Panoramic views", "Photography", "Gift shop"],
      coordinates: { lat: 17.2951, lng: -62.6843 }
    }
  ];

  await new Promise(resolve => setTimeout(resolve, 1000));
  return attractions;
}

// Historical Sites API
export interface HistoricalSite {
  name: string;
  period: string;
  significance: string;
  address: string;
  visitingHours?: string;
  coordinates?: { lat: number; lng: number };
  entryFee?: string;
}

export async function getHistoricalSites(): Promise<HistoricalSite[]> {
  const sites: HistoricalSite[] = [
    {
      name: "Brimstone Hill Fortress National Park",
      period: "17th-18th Century",
      significance: "UNESCO World Heritage Site, military fortress complex",
      address: "Brimstone Hill, St. Kitts",
      visitingHours: "9:30 AM - 5:30 PM daily",
      coordinates: { lat: 17.3776, lng: -62.8044 },
      entryFee: "US$10 adults, US$5 children"
    },
    {
      name: "Romney Manor",
      period: "1625-Present",
      significance: "Historic plantation estate, connection to Thomas Jefferson family",
      address: "Old Road, St. Kitts",
      visitingHours: "9:00 AM - 4:00 PM (Mon-Sat)",
      coordinates: { lat: 17.3654, lng: -62.8123 },
      entryFee: "US$2 adults"
    },
    {
      name: "Independence Square",
      period: "1790",
      significance: "Georgian square, former slave market, Berkeley Memorial Clock",
      address: "Central Basseterre, St. Kitts",
      visitingHours: "Open 24 hours",
      coordinates: { lat: 17.2955, lng: -62.7241 },
      entryFee: "Free"
    },
    {
      name: "Old Road Sugar Estate",
      period: "17th-20th Century",
      significance: "Historical sugar plantation ruins and interpretation site",
      address: "Old Road, St. Kitts",
      visitingHours: "9:00 AM - 5:00 PM",
      coordinates: { lat: 17.3544, lng: -62.8234 },
      entryFee: "US$5 adults"
    }
  ];

  await new Promise(resolve => setTimeout(resolve, 900));
  return sites;
}

// Podcast Recommendations API
export interface PodcastRecommendation {
  title: string;
  host: string;
  description: string;
  category: string;
  rating: number;
  episodes?: number;
  duration?: string;
}

export async function getPodcastRecommendations(persona: 'Ancestra' | 'The Guardian'): Promise<PodcastRecommendation[]> {
  let recommendations: PodcastRecommendation[] = [];

  if (persona === 'Ancestra') {
    recommendations = [
      {
        title: "Caribbean History Uncovered",
        host: "Dr. Maria Santos",
        description: "Deep dives into the rich history of Caribbean islands, including colonial periods and cultural evolution",
        category: "History",
        rating: 4.7,
        episodes: 45,
        duration: "45 min avg"
      },
      {
        title: "Island Stories: Caribbean Folklore",
        host: "Marcus Thompson",
        description: "Traditional stories, legends, and cultural tales from across the Caribbean",
        category: "Culture",
        rating: 4.5,
        episodes: 32,
        duration: "30 min avg"
      },
      {
        title: "The Sugar Trail",
        host: "Prof. James Mitchell",
        description: "Exploring the impact of sugar cultivation on Caribbean society and economy",
        category: "History",
        rating: 4.8,
        episodes: 28,
        duration: "55 min avg"
      }
    ];
  } else {
    recommendations = [
      {
        title: "Travel Safety Weekly",
        host: "Sarah Johnson",
        description: "Expert advice on staying safe while traveling, including destination-specific tips",
        category: "Travel Safety",
        rating: 4.6,
        episodes: 78,
        duration: "35 min avg"
      },
      {
        title: "The Prepared Traveler",
        host: "Captain Mike Rodriguez",
        description: "Emergency preparedness and risk assessment for international travelers",
        category: "Safety",
        rating: 4.4,
        episodes: 52,
        duration: "40 min avg"
      },
      {
        title: "Caribbean Safety Report",
        host: "Lisa Chen",
        description: "Current safety updates and travel advisories for Caribbean destinations",
        category: "Regional Safety",
        rating: 4.3,
        episodes: 24,
        duration: "25 min avg"
      }
    ];
  }

  await new Promise(resolve => setTimeout(resolve, 700));
  return recommendations;
}

// Export all functions
export {
  API_CONFIG,
  type APIConfig
};

// Translation and Language Detection Functions for Chatbot Logic
export async function translateToEnglish(text: string, sourceLanguage?: string): Promise<string> {
  try {
    // Mock translation service - in production, would use Google Translate API or similar
    if (!sourceLanguage || sourceLanguage === 'English' || sourceLanguage === 'en') {
      return text;
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock translation without showing the undefined language
    if (sourceLanguage === 'undefined' || sourceLanguage === undefined) {
      return text; // Don't show translation indicator for undefined language
    }
    
    return `[Translated from ${sourceLanguage}] ${text}`;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text
  }
}

export async function detectLanguage(text: string): Promise<string> {
  try {
    // Mock language detection - in production, would use Google Cloud Translation API
    const languagePatterns = {
      'Spanish': /hola|gracias|por favor|¿|¡/i,
      'French': /bonjour|merci|s'il vous plaît|où/i,
      'German': /hallo|danke|bitte|wo ist/i,
      'Japanese': /こんにちは|ありがとう|すみません/
    };
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    for (const [language, pattern] of Object.entries(languagePatterns)) {
      if (pattern.test(text)) {
        return language;
      }
    }
    
    return 'English'; // Default to English
  } catch (error) {
    console.error('Language detection error:', error);
    return 'English';
  }
}

export async function translateToUserLanguage(text: string, targetLanguage: string): Promise<string> {
  try {
    // Mock translation service
    if (!targetLanguage || targetLanguage === 'English' || targetLanguage === 'en' || targetLanguage.toLowerCase() === 'english') {
      return text;
    }
    
    // Don't show translation indicator for undefined or invalid languages
    if (targetLanguage === 'undefined' || targetLanguage === undefined) {
      return text;
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock translation with target language indicator only for valid languages
    return `[${targetLanguage}] ${text}`;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}