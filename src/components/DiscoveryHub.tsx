import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, MapPin, Thermometer, Book, Utensils, Hotel, Music, X, 
  AlertCircle, Info, Star, Clock, Users, Wifi, Car, Coffee, 
  ExternalLink, ChevronRight, RefreshCw, Filter
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Theme } from '../utils/theming';

interface DiscoveryHubProps {
  onClose: () => void;
  persona: string;
  theme?: Theme;
}

const DiscoveryHub: React.FC<DiscoveryHubProps> = ({ onClose, persona, theme }) => {
  const [activeTab, setActiveTab] = useState('events');
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(true);

  // Events State
  const [location, setLocation] = useState('St. Kitts and Nevis');
  const [events, setEvents] = useState([]);
  const [eventsError, setEventsError] = useState(null);

  // Media State
  const [mediaQuery, setMediaQuery] = useState('caribbean culture');
  const [mediaType, setMediaType] = useState('books');
  const [mediaResults, setMediaResults] = useState([]);

  // Travel State
  const [destination, setDestination] = useState('St. Kitts');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [hotels, setHotels] = useState([]);

  // Weather State
  const [weatherCity, setWeatherCity] = useState('Basseterre');
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);

  // Dining State
  const [diningLocation, setDiningLocation] = useState('Basseterre');
  const [cuisineType, setCuisineType] = useState('caribbean');
  const [restaurants, setRestaurants] = useState([]);

  // Animation state
  const [cardAnimationDelay, setCardAnimationDelay] = useState(0);

  // Get persona-based theming
  const getPersonaTheme = () => {
    if (persona === 'Ancestra') {
      return {
        primary: 'var(--color-coral-500)',
        secondary: 'var(--color-pink-400)',
        accent: 'var(--color-sand-400)',
        gradient: 'linear-gradient(135deg, var(--color-coral-50), var(--color-pink-50), var(--color-sand-50))',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'var(--color-coral-200)',
        textPrimary: 'var(--color-coral-900)',
        textSecondary: 'var(--color-coral-600)',
        hoverColor: 'var(--color-coral-100)'
      };
    } else if (persona === 'The Guardian') {
      return {
        primary: 'var(--color-police-600)',
        secondary: 'var(--color-tactical-500)',
        accent: 'var(--color-police-400)',
        gradient: 'linear-gradient(135deg, var(--color-police-50), var(--color-tactical-50), var(--color-police-100))',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'var(--color-police-200)',
        textPrimary: 'var(--color-police-900)',
        textSecondary: 'var(--color-police-600)',
        hoverColor: 'var(--color-police-100)'
      };
    } else {
      // Default theme for specialized personas
      return {
        primary: theme?.primary || 'var(--color-primary)',
        secondary: theme?.secondary || 'var(--color-secondary)',
        accent: theme?.accent || 'var(--color-accent)',
        gradient: theme?.bgGradient || 'linear-gradient(135deg, var(--background), var(--muted))',
        cardBg: theme?.cardBg || 'var(--card)',
        borderColor: theme?.borderColor || 'var(--border)',
        textPrimary: theme?.text || 'var(--foreground)',
        textSecondary: theme?.secondary || 'var(--muted-foreground)',
        hoverColor: theme?.accent || 'var(--accent)'
      };
    }
  };

  const personaTheme = getPersonaTheme();

  // Enhanced demo data loading with animations
  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = () => {
    // Load sample events with staggered animation
    setEvents([
      {
        id: '1',
        name: { text: 'St. Kitts Music Festival 2025' },
        start: { local: '2025-08-20T18:00:00' },
        logo: { url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop' },
        url: '#',
        description: { text: 'Annual music festival featuring local and international artists celebrating Caribbean culture' },
        venue: 'Independence Square',
        price: 'Free',
        category: 'Music & Arts'
      },
      {
        id: '2',
        name: { text: 'Brimstone Hill Heritage Day' },
        start: { local: '2025-08-22T10:00:00' },
        logo: { url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop' },
        url: '#',
        description: { text: 'Celebrate the UNESCO World Heritage Site with guided tours and cultural activities' },
        venue: 'Brimstone Hill Fortress',
        price: '$15',
        category: 'History & Culture'
      },
      {
        id: '3',
        name: { text: 'Frigate Bay Beach Festival' },
        start: { local: '2025-08-25T14:00:00' },
        logo: { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=250&fit=crop' },
        url: '#',
        description: { text: 'Beach party with local food, drinks, and live entertainment by the Caribbean Sea' },
        venue: 'Frigate Bay Beach',
        price: '$25',
        category: 'Beach & Recreation'
      },
      {
        id: '4',
        name: { text: 'Nevis Cultural Walk' },
        start: { local: '2025-08-27T09:00:00' },
        logo: { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop' },
        url: '#',
        description: { text: 'Guided walking tour through historic Charlestown with local storytellers' },
        venue: 'Charlestown, Nevis',
        price: '$10',
        category: 'History & Culture'
      }
    ]);

    // Load sample media with categories
    setMediaResults([
      {
        id: '1',
        volumeInfo: {
          title: 'A History of St. Kitts and Nevis',
          authors: ['Caribbean Historians Society'],
          imageLinks: { thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop' },
          description: 'Comprehensive guide to the islands\' fascinating history, from Kalinago settlements to independence',
          publishedDate: '2023',
          pageCount: 342,
          categories: ['History', 'Caribbean Studies'],
          rating: 4.8
        }
      },
      {
        id: '2',
        volumeInfo: {
          title: 'Caribbean Cuisine: St. Kitts & Nevis',
          authors: ['Chef Maria Santos', 'Local Culinary Institute'],
          imageLinks: { thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop' },
          description: 'Traditional recipes and cooking techniques passed down through generations',
          publishedDate: '2024',
          pageCount: 248,
          categories: ['Cooking', 'Culture'],
          rating: 4.9
        }
      },
      {
        id: '3',
        volumeInfo: {
          title: 'Island Paradise Travel Guide',
          authors: ['Caribbean Travel Experts'],
          imageLinks: { thumbnail: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=200&h=300&fit=crop' },
          description: 'Complete travel guide featuring hidden gems, local tips, and sustainable tourism practices',
          publishedDate: '2024',
          pageCount: 456,
          categories: ['Travel', 'Tourism'],
          rating: 4.7
        }
      }
    ]);

    // Load sample hotels with enhanced details
    setHotels([
      {
        id: '1',
        name: 'Ocean Terrace Inn',
        rating: 4.8,
        price: 225,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=350&fit=crop',
        description: 'Luxury oceanfront resort with stunning Caribbean views',
        amenities: ['Pool', 'Spa', 'Restaurant', 'Wifi', 'Beach Access'],
        location: 'Fortlands, Basseterre',
        priceRange: '$200-$300',
        reviews: 324
      },
      {
        id: '2',
        name: 'Sugar Bay Club Suite & Hotel',
        rating: 4.5,
        price: 189,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=350&fit=crop',
        description: 'All-inclusive resort perfect for families',
        amenities: ['All-Inclusive', 'Kids Club', 'Multiple Pools', 'Water Sports'],
        location: 'Frigate Bay',
        priceRange: '$150-$250',
        reviews: 256
      },
      {
        id: '3',
        name: 'Marriott Resort',
        rating: 4.7,
        price: 285,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=350&fit=crop',
        description: 'Premium beachfront hotel with world-class amenities',
        amenities: ['Golf Course', 'Multiple Restaurants', 'Casino', 'Spa'],
        location: 'Frigate Bay',
        priceRange: '$250-$400',
        reviews: 578
      }
    ]);

    // Load sample restaurants with detailed info
    setRestaurants([
      {
        place_id: '1',
        name: 'Spice Mill Restaurant',
        rating: 4.8,
        price_level: 3,
        photos: [{ photo_reference: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop' }],
        formatted_address: 'Cockleshell Beach, St. Kitts',
        cuisine: 'Caribbean Fusion',
        description: 'Beachfront dining with locally sourced ingredients and breathtaking sunset views',
        specialties: ['Conch Fritters', 'Jerk Chicken', 'Rum Punch'],
        priceRange: '$25-$45',
        openHours: '11:00 AM - 10:00 PM'
      },
      {
        place_id: '2',
        name: 'The Kitchen Restaurant',
        rating: 4.6,
        price_level: 3,
        photos: [{ photo_reference: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop' }],
        formatted_address: 'Fort Street, Basseterre',
        cuisine: 'International',
        description: 'Contemporary dining experience blending international flavors with Caribbean influences',
        specialties: ['Lobster Thermidor', 'Caribbean Curry', 'Breadfruit Chips'],
        priceRange: '$20-$50',
        openHours: '6:00 PM - 11:00 PM'
      },
      {
        place_id: '3',
        name: 'Fisherman\'s Wharf',
        rating: 4.4,
        price_level: 2,
        photos: [{ photo_reference: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' }],
        formatted_address: 'Fortlands, Basseterre',
        cuisine: 'Seafood',
        description: 'Fresh daily catch with traditional Caribbean preparations in a waterfront setting',
        specialties: ['Grilled Mahi Mahi', 'Coconut Shrimp', 'Fish Cakes'],
        priceRange: '$15-$35',
        openHours: '12:00 PM - 9:00 PM'
      }
    ]);

    // Load enhanced weather data
    setWeather({
      temp: 82,
      condition: 'Partly Cloudy',
      description: 'Warm with tropical breeze',
      icon: '02d',
      location: 'Basseterre, St. Kitts and Nevis',
      humidity: 75,
      windSpeed: 12,
      feelsLike: 86,
      uvIndex: 8,
      visibility: '10 km',
      pressure: '1013 hPa',
      sunrise: '6:15 AM',
      sunset: '6:45 PM',
      coordinates: { lat: 17.2955, lng: -62.7251 },
      forecast: [
        { day: 'Today', high: 84, low: 76, condition: 'Partly Cloudy', icon: '02d' },
        { day: 'Tomorrow', high: 86, low: 78, condition: 'Sunny', icon: '01d' },
        { day: 'Wednesday', high: 83, low: 75, condition: 'Scattered Showers', icon: '10d' }
      ]
    });
  };

  // Enhanced search functions with loading states
  const searchEvents = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Data is already loaded - could filter based on search
    }, 1000);
  };

  const searchMedia = async () => {
    setLoading(true);
    setTimeout(() => {
      if (mediaType === 'podcasts') {
        setMediaResults([
          {
            id: '1',
            volumeInfo: {
              title: 'Caribbean Culture Podcast',
              authors: ['Marcus Thompson'],
              imageLinks: { thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200&h=300&fit=crop' },
              description: 'Exploring the rich cultural heritage of St. Kitts and Nevis through interviews and stories',
              publishedDate: '2024',
              categories: ['Podcast', 'Culture'],
              rating: 4.6
            }
          }
        ]);
      }
      setLoading(false);
    }, 800);
  };

  const searchHotels = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  };

  const getWeatherAndSuggest = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const searchRestaurants = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 900);
  };

  const getActivityRecommendation = () => {
    if (!weather) return '';
    if (weather.temp > 75) {
      return "Perfect weather for outdoor activities! Try beach hopping, hiking Mount Liamuiga, or exploring Brimstone Hill Fortress.";
    } else if (weather.temp > 65) {
      return "Great weather for sightseeing! Visit local museums, take a scenic drive, or enjoy outdoor dining.";
    } else {
      return "Cooler weather - perfect for indoor cultural experiences, local markets, or cozy restaurant visits.";
    }
  };

  const tabs = [
    { id: 'events', label: 'Events', icon: Music, color: personaTheme.primary },
    { id: 'media', label: 'Books & Media', icon: Book, color: personaTheme.secondary },
    { id: 'travel', label: 'Hotels', icon: Hotel, color: personaTheme.accent },
    { id: 'weather', label: 'Weather', icon: Thermometer, color: personaTheme.primary },
    { id: 'dining', label: 'Dining', icon: Utensils, color: personaTheme.secondary }
  ];

  return (
    <div 
      className="w-full h-full rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md"
      style={{ background: personaTheme.gradient }}
    >
      {/* Enhanced Header */}
      <div 
        className="sticky top-0 z-20 p-6 border-b backdrop-blur-md"
        style={{ 
          backgroundColor: personaTheme.cardBg,
          borderBottomColor: personaTheme.borderColor
        }}
      >
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover-lift"
                style={{ background: `linear-gradient(135deg, ${personaTheme.primary}, ${personaTheme.secondary})` }}
              >
                <Search className="w-6 h-6" />
              </div>
              <h1 
                className="text-4xl font-bold"
                style={{ color: personaTheme.textPrimary }}
              >
                Discovery Hub
              </h1>
            </div>
            <p 
              className="text-lg"
              style={{ color: personaTheme.textSecondary }}
            >
              Explore St. Kitts & Nevis - Events, Culture, Accommodations & More
            </p>
          </div>
          
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="flex-shrink-0 hover-lift"
            style={{ color: personaTheme.textPrimary }}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Enhanced Demo Mode Toggle */}
        <div className="flex justify-center mt-4">
          <div 
            className="flex items-center space-x-3 px-6 py-3 rounded-full shadow-lg hover-lift transition-all duration-300"
            style={{ backgroundColor: `${personaTheme.primary}20` }}
          >
            <Info className="w-5 h-5" style={{ color: personaTheme.primary }} />
            <span className="font-medium" style={{ color: personaTheme.textPrimary }}>
              {demoMode ? 'Demo Mode: Showing sample St. Kitts data' : 'Live Mode: Attempting real API calls'}
            </span>
            <Button
              onClick={() => setDemoMode(!demoMode)}
              className="transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: demoMode ? personaTheme.primary : `${personaTheme.primary}40`,
                color: demoMode ? 'white' : personaTheme.textPrimary
              }}
              size="sm"
            >
              {demoMode ? 'Switch to Live' : 'Switch to Demo'}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Enhanced Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList 
            className="grid w-full grid-cols-5 mb-8 p-2 rounded-xl shadow-xl"
            style={{ backgroundColor: personaTheme.cardBg }}
          >
            {tabs.map(({ id, label, icon: Icon, color }) => (
              <TabsTrigger
                key={id}
                value={id}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                  activeTab === id ? 'text-white shadow-lg' : ''
                }`}
                style={{
                  backgroundColor: activeTab === id ? color : 'transparent',
                  color: activeTab === id ? 'white' : personaTheme.textPrimary
                }}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card 
              className="shadow-xl hover-lift transition-all duration-300"
              style={{ backgroundColor: personaTheme.cardBg, borderColor: personaTheme.borderColor }}
            >
              <CardHeader>
                <CardTitle 
                  className="flex items-center gap-3 text-2xl"
                  style={{ color: personaTheme.textPrimary }}
                >
                  <Music className="w-7 h-7" style={{ color: personaTheme.primary }} />
                  Events & Attractions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search location..."
                    className="flex-1"
                    disabled={demoMode}
                  />
                  <Button
                    onClick={searchEvents}
                    disabled={loading}
                    className="px-6 text-white hover:scale-105 transition-all duration-300"
                    style={{ backgroundColor: personaTheme.primary }}
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span className="ml-2">{loading ? 'Loading...' : 'Search'}</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map((event, index) => (
                    <Card 
                      key={event.id} 
                      className={`hover-lift transition-all duration-300 stagger-${index + 1} animate-fade-in overflow-hidden`}
                      style={{ borderColor: personaTheme.borderColor }}
                    >
                      <div className="relative">
                        <img
                          src={event.logo?.url}
                          alt={event.name.text}
                          className="w-full h-48 object-cover"
                        />
                        <Badge 
                          className="absolute top-3 right-3"
                          style={{ backgroundColor: personaTheme.primary, color: 'white' }}
                        >
                          {event.category}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 
                          className="font-bold text-lg mb-2"
                          style={{ color: personaTheme.textPrimary }}
                        >
                          {event.name.text}
                        </h3>
                        <div className="flex items-center gap-2 mb-2 text-sm" style={{ color: personaTheme.textSecondary }}>
                          <Calendar className="w-4 h-4" />
                          {new Date(event.start.local).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-sm" style={{ color: personaTheme.textSecondary }}>
                          <MapPin className="w-4 h-4" />
                          {event.venue}
                        </div>
                        <p className="text-sm mb-3" style={{ color: personaTheme.textSecondary }}>
                          {event.description.text}
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" style={{ borderColor: personaTheme.primary, color: personaTheme.primary }}>
                            {event.price}
                          </Badge>
                          <Button 
                            size="sm" 
                            className="hover:scale-105 transition-all duration-300"
                            style={{ backgroundColor: personaTheme.primary, color: 'white' }}
                          >
                            Learn More
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <Card 
              className="shadow-xl hover-lift transition-all duration-300"
              style={{ backgroundColor: personaTheme.cardBg, borderColor: personaTheme.borderColor }}
            >
              <CardHeader>
                <CardTitle 
                  className="flex items-center gap-3 text-2xl"
                  style={{ color: personaTheme.textPrimary }}
                >
                  <Book className="w-7 h-7" style={{ color: personaTheme.secondary }} />
                  Books & Media
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Select value={mediaType} onValueChange={setMediaType}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="podcasts">Podcasts</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={mediaQuery}
                    onChange={(e) => setMediaQuery(e.target.value)}
                    placeholder="Search for content..."
                    className="flex-1"
                    disabled={demoMode}
                  />
                  <Button
                    onClick={searchMedia}
                    disabled={loading}
                    className="px-6 text-white hover:scale-105 transition-all duration-300"
                    style={{ backgroundColor: personaTheme.secondary }}
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span className="ml-2">{loading ? 'Loading...' : 'Search'}</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mediaResults.map((item, index) => (
                    <Card 
                      key={item.id} 
                      className={`hover-lift transition-all duration-300 stagger-${index + 1} animate-fade-in`}
                      style={{ borderColor: personaTheme.borderColor }}
                    >
                      <div className="p-4">
                        <img
                          src={item.volumeInfo.imageLinks?.thumbnail}
                          alt={item.volumeInfo.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h4 
                          className="font-bold text-lg mb-2"
                          style={{ color: personaTheme.textPrimary }}
                        >
                          {item.volumeInfo.title}
                        </h4>
                        <p className="text-sm mb-2" style={{ color: personaTheme.textSecondary }}>
                          By {item.volumeInfo.authors?.join(', ')}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{item.volumeInfo.rating}</span>
                        </div>
                        <p className="text-sm mb-3" style={{ color: personaTheme.textSecondary }}>
                          {item.volumeInfo.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.volumeInfo.categories?.map((category, idx) => (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className="text-xs"
                              style={{ borderColor: personaTheme.secondary, color: personaTheme.secondary }}
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hotels Tab */}
          <TabsContent value="travel" className="space-y-6">
            <Card 
              className="shadow-xl hover-lift transition-all duration-300"
              style={{ backgroundColor: personaTheme.cardBg, borderColor: personaTheme.borderColor }}
            >
              <CardHeader>
                <CardTitle 
                  className="flex items-center gap-3 text-2xl"
                  style={{ color: personaTheme.textPrimary }}
                >
                  <Hotel className="w-7 h-7" style={{ color: personaTheme.accent }} />
                  Hotels & Accommodation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Destination"
                    disabled={demoMode}
                  />
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    disabled={demoMode}
                  />
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    disabled={demoMode}
                  />
                </div>
                <Button
                  onClick={searchHotels}
                  disabled={loading}
                  className="w-full md:w-auto px-6 text-white hover:scale-105 transition-all duration-300 mb-6"
                  style={{ backgroundColor: personaTheme.accent }}
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span className="ml-2">{loading ? 'Loading...' : 'Find Hotels'}</span>
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotels.map((hotel, index) => (
                    <Card 
                      key={hotel.id} 
                      className={`hover-lift transition-all duration-300 stagger-${index + 1} animate-fade-in overflow-hidden`}
                      style={{ borderColor: personaTheme.borderColor }}
                    >
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-48 object-cover"
                      />
                      <CardContent className="p-4">
                        <h4 
                          className="font-bold text-lg mb-2"
                          style={{ color: personaTheme.textPrimary }}
                        >
                          {hotel.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(hotel.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{hotel.rating}</span>
                          <span className="text-sm" style={{ color: personaTheme.textSecondary }}>
                            ({hotel.reviews} reviews)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-sm" style={{ color: personaTheme.textSecondary }}>
                          <MapPin className="w-4 h-4" />
                          {hotel.location}
                        </div>
                        <p className="text-sm mb-3" style={{ color: personaTheme.textSecondary }}>
                          {hotel.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className="text-xs"
                              style={{ borderColor: personaTheme.accent, color: personaTheme.accent }}
                            >
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span 
                              className="text-lg font-bold"
                              style={{ color: personaTheme.primary }}
                            >
                              ${hotel.price}
                            </span>
                            <span className="text-sm" style={{ color: personaTheme.textSecondary }}>
                              /night
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            className="hover:scale-105 transition-all duration-300"
                            style={{ backgroundColor: personaTheme.accent, color: 'white' }}
                          >
                            Book Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weather Tab */}
          <TabsContent value="weather" className="space-y-6">
            <Card 
              className="shadow-xl hover-lift transition-all duration-300"
              style={{ backgroundColor: personaTheme.cardBg, borderColor: personaTheme.borderColor }}
            >
              <CardHeader>
                <CardTitle 
                  className="flex items-center gap-3 text-2xl"
                  style={{ color: personaTheme.textPrimary }}
                >
                  <Thermometer className="w-7 h-7" style={{ color: personaTheme.primary }} />
                  Weather & Activity Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Input
                    value={weatherCity}
                    onChange={(e) => setWeatherCity(e.target.value)}
                    placeholder="Enter city name..."
                    className="flex-1"
                    disabled={demoMode}
                  />
                  <Button
                    onClick={getWeatherAndSuggest}
                    disabled={loading}
                    className="px-6 text-white hover:scale-105 transition-all duration-300"
                    style={{ backgroundColor: personaTheme.primary }}
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span className="ml-2">{loading ? 'Loading...' : 'Get Weather'}</span>
                  </Button>
                </div>

                {weather && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Weather */}
                    <Card 
                      className="p-6 text-center hover-lift transition-all duration-300"
                      style={{ 
                        background: `linear-gradient(135deg, ${personaTheme.primary}20, ${personaTheme.secondary}20)`,
                        borderColor: personaTheme.borderColor 
                      }}
                    >
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-lg"
                          style={{ backgroundColor: personaTheme.primary }}
                        >
                          ☀️
                        </div>
                        <div>
                          <div 
                            className="text-4xl font-bold"
                            style={{ color: personaTheme.textPrimary }}
                          >
                            {weather.temp}°F
                          </div>
                          <div style={{ color: personaTheme.textSecondary }}>
                            {weather.condition}
                          </div>
                        </div>
                      </div>
                      <h3 
                        className="font-bold text-lg mb-2"
                        style={{ color: personaTheme.textPrimary }}
                      >
                        {weather.location}
                      </h3>
                      <p className="mb-4" style={{ color: personaTheme.textSecondary }}>
                        Feels like {weather.feelsLike}°F
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div>💧</div>
                          <span>{weather.humidity}% Humidity</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div>💨</div>
                          <span>{weather.windSpeed} mph Wind</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div>🌅</div>
                          <span>{weather.sunrise}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div>🌇</div>
                          <span>{weather.sunset}</span>
                        </div>
                      </div>
                    </Card>

                    {/* Activity Recommendations */}
                    <Card 
                      className="p-6 hover-lift transition-all duration-300"
                      style={{ borderColor: personaTheme.borderColor }}
                    >
                      <h3 
                        className="font-bold text-lg mb-4 flex items-center gap-2"
                        style={{ color: personaTheme.textPrimary }}
                      >
                        <MapPin className="w-5 h-5" />
                        Activity Recommendations
                      </h3>
                      <div 
                        className="p-4 rounded-lg mb-4"
                        style={{ backgroundColor: `${personaTheme.accent}20` }}
                      >
                        <p style={{ color: personaTheme.textPrimary }}>
                          {getActivityRecommendation()}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium" style={{ color: personaTheme.textPrimary }}>
                          3-Day Forecast
                        </h4>
                        {weather.forecast?.map((day, index) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between p-2 rounded"
                            style={{ backgroundColor: `${personaTheme.primary}10` }}
                          >
                            <span className="font-medium">{day.day}</span>
                            <div className="flex items-center gap-2">
                              <span>{day.condition}</span>
                              <span className="font-medium">
                                {day.high}°/{day.low}°
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dining Tab */}
          <TabsContent value="dining" className="space-y-6">
            <Card 
              className="shadow-xl hover-lift transition-all duration-300"
              style={{ backgroundColor: personaTheme.cardBg, borderColor: personaTheme.borderColor }}
            >
              <CardHeader>
                <CardTitle 
                  className="flex items-center gap-3 text-2xl"
                  style={{ color: personaTheme.textPrimary }}
                >
                  <Utensils className="w-7 h-7" style={{ color: personaTheme.secondary }} />
                  Dining & Restaurants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Input
                    value={diningLocation}
                    onChange={(e) => setDiningLocation(e.target.value)}
                    placeholder="Location"
                    className="flex-1"
                    disabled={demoMode}
                  />
                  <Select value={cuisineType} onValueChange={setCuisineType}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="caribbean">Caribbean</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                      <SelectItem value="seafood">Seafood</SelectItem>
                      <SelectItem value="fusion">Fusion</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={searchRestaurants}
                    disabled={loading}
                    className="px-6 text-white hover:scale-105 transition-all duration-300"
                    style={{ backgroundColor: personaTheme.secondary }}
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span className="ml-2">{loading ? 'Loading...' : 'Search'}</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {restaurants.map((restaurant, index) => (
                    <Card 
                      key={restaurant.place_id} 
                      className={`hover-lift transition-all duration-300 stagger-${index + 1} animate-fade-in overflow-hidden`}
                      style={{ borderColor: personaTheme.borderColor }}
                    >
                      <img
                        src={restaurant.photos?.[0]?.photo_reference}
                        alt={restaurant.name}
                        className="w-full h-48 object-cover"
                      />
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 
                            className="font-bold text-lg"
                            style={{ color: personaTheme.textPrimary }}
                          >
                            {restaurant.name}
                          </h4>
                          <Badge 
                            variant="outline"
                            style={{ borderColor: personaTheme.secondary, color: personaTheme.secondary }}
                          >
                            {restaurant.cuisine}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(restaurant.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{restaurant.rating}</span>
                          <span className="text-sm" style={{ color: personaTheme.textSecondary }}>
                            • {restaurant.priceRange}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-sm" style={{ color: personaTheme.textSecondary }}>
                          <MapPin className="w-4 h-4" />
                          {restaurant.formatted_address}
                        </div>
                        <div className="flex items-center gap-2 mb-3 text-sm" style={{ color: personaTheme.textSecondary }}>
                          <Clock className="w-4 h-4" />
                          {restaurant.openHours}
                        </div>
                        <p className="text-sm mb-3" style={{ color: personaTheme.textSecondary }}>
                          {restaurant.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {restaurant.specialties?.slice(0, 2).map((specialty, idx) => (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className="text-xs"
                              style={{ borderColor: personaTheme.secondary, color: personaTheme.secondary }}
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        <Button 
                          className="w-full hover:scale-105 transition-all duration-300"
                          style={{ backgroundColor: personaTheme.secondary, color: 'white' }}
                        >
                          View Menu
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DiscoveryHub;