// Conversation State Management System
export interface ConversationState {
  step: 'initial' | 'gathering_preferences' | 'providing_details';
  topic: string | null;
  preferences: {
    budget?: 'low' | 'medium' | 'high';
    location?: string;
    cuisine?: string;
    activity_type?: string;
    group_size?: string;
    time_of_day?: string;
    accommodation_type?: string;
    dish?: string;  // Added for specific food items
    [key: string]: string | undefined;
  };
  lastMessage: string;
  timestamp: number;
  userId?: string;
}

export class ConversationManager {
  private conversations = new Map<string, ConversationState>();

  // Get or create conversation state for a user
  getConversationState(userId: string = 'default'): ConversationState {
    if (!this.conversations.has(userId)) {
      this.conversations.set(userId, {
        step: 'initial',
        topic: null,
        preferences: {},
        lastMessage: '',
        timestamp: Date.now(),
        userId
      });
    }
    return this.conversations.get(userId)!;
  }

  // Update conversation state
  updateConversationState(userId: string, updates: Partial<ConversationState>): void {
    const currentState = this.getConversationState(userId);
    this.conversations.set(userId, {
      ...currentState,
      ...updates,
      timestamp: Date.now()
    });
  }

  // Reset conversation for new topic or chat
  resetConversation(userId: string): void {
    this.conversations.set(userId, {
      step: 'initial',
      topic: null,
      preferences: {},
      lastMessage: '',
      timestamp: Date.now(),
      userId
    });
  }

  // Enhanced topic detection with better food recognition
  detectTopic(message: string): string | null {
    const lowerMessage = message.toLowerCase().trim();
    
    // Check for meta queries first (these should NOT have tourism topics)
    const metaQueries = [
      'what can you do', 'what can u do', 'help', 'who are you', 'what are you',
      'how do you work', 'what is this', 'capabilities', 'what do you know',
      'tell me about yourself', 'how can you help', 'what services',
      'what are your features', 'what can you help with', 'introduce yourself'
    ];
    
    if (metaQueries.some(meta => lowerMessage.includes(meta)) || lowerMessage.length < 3) {
      return null; // No tourism topic for meta queries
    }

    // Enhanced dining keywords - including specific food items
    const diningKeywords = [
      // General dining terms
      'restaurant', 'food', 'dining', 'eat', 'cuisine', 'meal', 'hungry', 'lunch', 'dinner', 'breakfast',
      // Specific food items and dishes
      'chicken', 'bbq', 'barbecue', 'pizza', 'pasta', 'burger', 'sandwich', 'salad', 'fish', 'seafood',
      'lobster', 'crab', 'shrimp', 'beef', 'pork', 'lamb', 'rice', 'beans', 'curry', 'soup', 'stew',
      'bread', 'cake', 'dessert', 'ice cream', 'coffee', 'tea', 'juice', 'smoothie', 'cocktail', 'beer',
      // Cooking methods
      'grilled', 'fried', 'baked', 'roasted', 'steamed', 'boiled', 'sauteed',
      // Local Caribbean food terms
      'conch', 'saltfish', 'plantain', 'breadfruit', 'callaloo', 'roti', 'doubles', 'goat water',
      'johnny cake', 'coconut bread', 'sugar cake', 'tamarind balls', 'mauby', 'sorrel',
      // Food-related actions
      'cooking', 'recipe', 'ingredients', 'spicy', 'sweet', 'savory', 'fresh', 'local cuisine'
    ];
    
    if (diningKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'dining';
    }
    
    // Beach keywords
    if (lowerMessage.includes('beach') || lowerMessage.includes('swim') ||
        lowerMessage.includes('sand') || lowerMessage.includes('ocean') ||
        lowerMessage.includes('water activities') || lowerMessage.includes('snorkeling')) {
      return 'beaches';
    }
    
    // Activity keywords
    if (lowerMessage.includes('activity') || lowerMessage.includes('activities') ||
        lowerMessage.includes('tour') || lowerMessage.includes('adventure') ||
        lowerMessage.includes('hiking') || lowerMessage.includes('sightseeing') ||
        lowerMessage.includes('things to do') || lowerMessage.includes('attractions')) {
      return 'activities';
    }
    
    // Accommodation keywords
    if (lowerMessage.includes('hotel') || lowerMessage.includes('stay') ||
        lowerMessage.includes('accommodation') || lowerMessage.includes('resort') ||
        lowerMessage.includes('lodge') || lowerMessage.includes('room')) {
      return 'accommodation';
    }
    
    // Safety keywords
    if (lowerMessage.includes('safe') || lowerMessage.includes('safety') ||
        lowerMessage.includes('crime') || lowerMessage.includes('secure') ||
        lowerMessage.includes('emergency') || lowerMessage.includes('health')) {
      return 'safety';
    }
    
    return null;
  }

  // Enhanced preference extraction with better food detection
  extractPreferences(message: string, topic: string | null): Partial<ConversationState['preferences']> {
    const preferences: Partial<ConversationState['preferences']> = {};
    const lowerMessage = message.toLowerCase();
    
    // Extract budget preferences
    if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || 
        lowerMessage.includes('affordable') || lowerMessage.includes('low cost') ||
        lowerMessage.includes('inexpensive')) {
      preferences.budget = 'low';
    } else if (lowerMessage.includes('upscale') || lowerMessage.includes('expensive') || 
               lowerMessage.includes('luxury') || lowerMessage.includes('fine') ||
               lowerMessage.includes('high end') || lowerMessage.includes('premium')) {
      preferences.budget = 'high';
    } else if (lowerMessage.includes('mid') || lowerMessage.includes('moderate') ||
               lowerMessage.includes('average') || lowerMessage.includes('reasonable')) {
      preferences.budget = 'medium';
    }
    
    // Extract location preferences  
    if (lowerMessage.includes('beach') || lowerMessage.includes('waterfront') ||
        lowerMessage.includes('oceanfront') || lowerMessage.includes('seaside')) {
      preferences.location = 'beach';
    } else if (lowerMessage.includes('frigate bay')) {
      preferences.location = 'frigate_bay';
    } else if (lowerMessage.includes('basseterre')) {
      preferences.location = 'basseterre';
    } else if (lowerMessage.includes('downtown') || lowerMessage.includes('town') || 
               lowerMessage.includes('city center') || lowerMessage.includes('central')) {
      preferences.location = 'downtown';
    }
    
    // Extract group size
    if (lowerMessage.includes('couple') || lowerMessage.includes('two people') || lowerMessage.includes('2 people')) {
      preferences.group_size = 'couple';
    } else if (lowerMessage.includes('family') || lowerMessage.includes('kids') || lowerMessage.includes('children')) {
      preferences.group_size = 'family';
    } else if (lowerMessage.includes('solo') || lowerMessage.includes('alone') || lowerMessage.includes('1 person')) {
      preferences.group_size = 'solo';
    } else if (lowerMessage.includes('group') || lowerMessage.includes('friends')) {
      preferences.group_size = 'group';
    }
    
    // Enhanced topic-specific preferences
    if (topic === 'dining') {
      // Specific dishes
      if (lowerMessage.includes('chicken')) preferences.dish = 'chicken';
      if (lowerMessage.includes('bbq') || lowerMessage.includes('barbecue')) {
        preferences.cuisine = 'bbq';
        if (lowerMessage.includes('chicken')) preferences.dish = 'bbq chicken';
      }
      if (lowerMessage.includes('pizza')) {
        preferences.cuisine = 'pizza';
        preferences.dish = 'pizza';
      }
      if (lowerMessage.includes('seafood') || lowerMessage.includes('fish')) {
        preferences.cuisine = 'seafood';
        preferences.dish = 'seafood';
      }
      if (lowerMessage.includes('burger')) preferences.dish = 'burger';
      if (lowerMessage.includes('pasta')) preferences.dish = 'pasta';
      
      // Cuisine types
      if (lowerMessage.includes('caribbean') || lowerMessage.includes('local') || 
          lowerMessage.includes('traditional') || lowerMessage.includes('kittitian')) {
        preferences.cuisine = 'caribbean';
      }
      if (lowerMessage.includes('italian')) preferences.cuisine = 'italian';
      if (lowerMessage.includes('american')) preferences.cuisine = 'american';
      if (lowerMessage.includes('chinese')) preferences.cuisine = 'chinese';
      if (lowerMessage.includes('mexican')) preferences.cuisine = 'mexican';
      if (lowerMessage.includes('vegetarian') || lowerMessage.includes('vegan')) {
        preferences.cuisine = 'vegetarian';
      }
      
      // Meal times
      if (lowerMessage.includes('breakfast')) preferences.time_of_day = 'breakfast';
      if (lowerMessage.includes('lunch')) preferences.time_of_day = 'lunch';
      if (lowerMessage.includes('dinner')) preferences.time_of_day = 'dinner';
      if (lowerMessage.includes('brunch')) preferences.time_of_day = 'brunch';
    }
    
    if (topic === 'activities') {
      if (lowerMessage.includes('water') || lowerMessage.includes('swimming') || lowerMessage.includes('diving')) 
        preferences.activity_type = 'water';
      if (lowerMessage.includes('cultural') || lowerMessage.includes('history') || lowerMessage.includes('museum')) 
        preferences.activity_type = 'cultural';
      if (lowerMessage.includes('adventure') || lowerMessage.includes('hiking') || lowerMessage.includes('outdoor')) 
        preferences.activity_type = 'adventure';
      if (lowerMessage.includes('relaxing') || lowerMessage.includes('calm') || lowerMessage.includes('peaceful')) 
        preferences.activity_type = 'relaxing';
    }
    
    if (topic === 'accommodation') {
      if (lowerMessage.includes('resort') || lowerMessage.includes('all inclusive')) 
        preferences.accommodation_type = 'resort';
      if (lowerMessage.includes('boutique') || lowerMessage.includes('intimate') || lowerMessage.includes('small')) 
        preferences.accommodation_type = 'boutique';
      if (lowerMessage.includes('beachfront') || lowerMessage.includes('ocean view')) 
        preferences.accommodation_type = 'beachfront';
    }
    
    return preferences;
  }

  // Check if we have enough preferences for detailed recommendations
  hasEnoughPreferences(topic: string | null, preferences: ConversationState['preferences']): boolean {
    if (!topic) return false;
    
    const prefCount = Object.keys(preferences).length;
    
    switch (topic) {
      case 'dining':
        // For dining, having a dish or cuisine is often enough to provide good recommendations
        return prefCount >= 1 && (preferences.dish || preferences.cuisine || preferences.budget || preferences.location);
      case 'accommodation':
        return prefCount >= 1 && (preferences.budget || preferences.location || preferences.accommodation_type);
      case 'activities':
        return prefCount >= 1 && (preferences.activity_type || preferences.location);
      default:
        return prefCount >= 1;
    }
  }

  // Generate follow-up questions based on topic and existing preferences
  generateFollowUpQuestions(topic: string, preferences: ConversationState['preferences']): string[] {
    const questions: string[] = [];
    
    switch (topic) {
      case 'dining':
        if (!preferences.dish && !preferences.cuisine) {
          questions.push("What type of cuisine or dish are you in the mood for?");
        }
        if (!preferences.budget) {
          questions.push("Are you looking for fine dining or something more casual?");
        }
        if (!preferences.location) {
          questions.push("Which area of St. Kitts would you prefer?");
        }
        if (!preferences.group_size && !preferences.time_of_day) {
          questions.push("How many people will be dining?");
        }
        break;
        
      case 'accommodation':
        if (!preferences.budget) {
          questions.push("What's your preferred budget range?");
        }
        if (!preferences.location) {
          questions.push("Do you want to stay near the beach or in town?");
        }
        if (!preferences.accommodation_type) {
          questions.push("Are you looking for a resort experience or something more intimate?");
        }
        break;
        
      case 'activities':
        if (!preferences.activity_type) {
          questions.push("Are you interested in cultural experiences or outdoor adventures?");
        }
        if (!preferences.time_of_day) {
          questions.push("Are you planning these activities for morning, afternoon, or evening?");
        }
        if (!preferences.group_size) {
          questions.push("Are you traveling solo, as a couple, or with a group?");
        }
        break;
        
      case 'beaches':
        if (!preferences.activity_type) {
          questions.push("Are you looking for calm beaches or ones with water activities?");
        }
        if (!preferences.location) {
          questions.push("Do you prefer secluded spots or beaches with amenities?");
        }
        break;
        
      default:
        questions.push("What specific information would be most helpful?");
    }
    
    // Return max 2 questions to avoid overwhelming
    return questions.slice(0, 2);
  }

  // Clean up old conversations (call periodically)
  cleanupOldConversations(): void {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    for (let [userId, state] of this.conversations) {
      if (state.timestamp < oneHourAgo) {
        this.conversations.delete(userId);
      }
    }
  }
}

// Global conversation manager instance
export const conversationManager = new ConversationManager();

// Clean up old conversations every 30 minutes
setInterval(() => {
  conversationManager.cleanupOldConversations();
}, 30 * 60 * 1000);