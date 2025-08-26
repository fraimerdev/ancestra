import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, Search, Star, Camera, Clock, Users, Navigation, X, Globe, Languages } from 'lucide-react';

interface HeritageLocation {
  id: string;
  name: string;
  type: 'landmark' | 'museum' | 'beach' | 'restaurant' | 'hotel' | 'cultural';
  coordinates: { lat: number; lng: number };
  description: string;
  rating: number;
  visitTime: string;
  culturalSignificance: string;
  openHours: string;
}

const AncestraMap: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [map, setMap] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<HeritageLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const mapRef = useRef<HTMLDivElement>(null);

  // Heritage locations in St. Kitts & Nevis
  const heritageLocations: HeritageLocation[] = [
    {
      id: '1',
      name: 'Brimstone Hill Fortress',
      type: 'landmark',
      coordinates: { lat: 17.3725, lng: -62.8007 },
      description: 'UNESCO World Heritage fortress with stunning Caribbean views',
      rating: 4.8,
      visitTime: '2-3 hours',
      culturalSignificance: 'Built by enslaved Africans and British engineers, represents colonial military architecture',
      openHours: '9:00 AM - 5:30 PM daily'
    },
    {
      id: '2',
      name: 'Basseterre Historic District',
      type: 'cultural',
      coordinates: { lat: 17.2948, lng: -62.7177 },
      description: 'Colonial architecture and vibrant local culture in the capital city',
      rating: 4.5,
      visitTime: '1-2 hours',
      culturalSignificance: 'Original settlement showcasing French and British colonial heritage',
      openHours: 'Accessible 24/7'
    },
    {
      id: '3',
      name: 'Romney Manor',
      type: 'cultural',
      coordinates: { lat: 17.3423, lng: -62.7889 },
      description: 'Historic plantation house with batik workshops and botanical gardens',
      rating: 4.6,
      visitTime: '1-2 hours',
      culturalSignificance: 'Former sugar plantation showcasing Caribbean craft traditions',
      openHours: '8:30 AM - 4:30 PM Mon-Fri'
    },
    {
      id: '4',
      name: 'Frigate Bay Beach',
      type: 'beach',
      coordinates: { lat: 17.2588, lng: -62.6842 },
      description: 'Beautiful beach with calm Caribbean waters and coral reefs',
      rating: 4.7,
      visitTime: '2-4 hours',
      culturalSignificance: 'Traditional fishing area and modern tourism hub',
      openHours: 'Accessible 24/7'
    },
    {
      id: '5',
      name: 'National Museum',
      type: 'museum',
      coordinates: { lat: 17.2941, lng: -62.7198 },
      description: 'Comprehensive collection of Kittitian cultural artifacts',
      rating: 4.3,
      visitTime: '1-2 hours',
      culturalSignificance: 'Preserves pre-Columbian, colonial, and modern Caribbean heritage',
      openHours: '9:00 AM - 4:00 PM Mon-Fri'
    },
    {
      id: '6',
      name: 'Charlestown, Nevis',
      type: 'landmark',
      coordinates: { lat: 17.1379, lng: -62.6223 },
      description: 'Historic town and birthplace of Alexander Hamilton',
      rating: 4.4,
      visitTime: '2-3 hours',
      culturalSignificance: 'Georgian architecture and American founding father heritage',
      openHours: 'Accessible 24/7'
    }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      const stKittsCenter = { lat: 17.3028, lng: -62.7177 };
      
      const newMap = new window.google.maps.Map(mapRef.current, {
        zoom: 11,
        center: stKittsCenter,
        mapTypeId: window.google.maps.MapTypeId.TERRAIN,
        styles: [
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#38bdf8" }] // Ocean blue
          },
          {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [{ color: "#fef7f7" }] // Coral background
          },
          {
            featureType: "poi.attraction",
            elementType: "labels",
            stylers: [{ color: "#ef4444" }] // Coral primary
          }
        ]
      });

      setMap(newMap);

      // Add heritage location markers
      heritageLocations.forEach(location => {
        const marker = new window.google.maps.Marker({
          position: location.coordinates,
          map: newMap,
          title: location.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: getLocationColor(location.type),
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 8
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 280px; font-family: 'Inter', sans-serif;">
              <h3 style="margin: 0 0 8px 0; color: #ef4444; font-size: 16px;">${getLocationIcon(location.type)} ${location.name}</h3>
              <p style="margin: 4px 0; font-size: 14px; color: #666;">${location.description}</p>
              <div style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
                <span style="background: #fee2e2; color: #dc2626; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                  ⭐ ${location.rating}
                </span>
                <span style="background: #fce7f3; color: #be185d; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                  ⏱️ ${location.visitTime}
                </span>
              </div>
              <p style="margin: 6px 0; font-size: 12px; color: #888;"><strong>Cultural Significance:</strong> ${location.culturalSignificance}</p>
              <p style="margin: 6px 0; font-size: 12px; color: #888;"><strong>Hours:</strong> ${location.openHours}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          setSelectedLocation(location);
          infoWindow.open(newMap, marker);
        });
      });
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDhsxPdt3Ca3LqTSWwxXwehwYP5gP7SSBQ&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, []);

  const getLocationColor = (type: string): string => {
    const colors = {
      landmark: '#ef4444', // coral-500
      museum: '#f472b6',   // pink-400
      beach: '#38bdf8',    // ocean-400
      restaurant: '#fbbf24', // sand-400
      hotel: '#14b8a6',    // tropical-400
      cultural: '#dc2626'  // coral-600
    };
    return colors[type as keyof typeof colors] || '#ef4444';
  };

  const getLocationIcon = (type: string): string => {
    const icons = {
      landmark: '🏛️',
      museum: '🏛️',
      beach: '🏖️',
      restaurant: '🍽️',
      hotel: '🏨',
      cultural: '🎭'
    };
    return icons[type as keyof typeof icons] || '📍';
  };

  const translateText = async (text: string, targetLang: string): Promise<string> => {
    if (targetLang === 'en') return text;
    
    setIsTranslating(true);
    try {
      // Mock translation - in real app, use Google Translate API
      const translations: Record<string, Record<string, string>> = {
        'es': {
          'Brimstone Hill Fortress': 'Fortaleza de Brimstone Hill',
          'UNESCO World Heritage fortress with stunning Caribbean views': 'Fortaleza Patrimonio de la Humanidad de la UNESCO con vistas impresionantes del Caribe',
          'Cultural Significance': 'Significado Cultural',
          'Built by enslaved Africans and British engineers': 'Construida por africanos esclavizados e ingenieros británicos'
        },
        'fr': {
          'Brimstone Hill Fortress': 'Forteresse de Brimstone Hill',
          'UNESCO World Heritage fortress with stunning Caribbean views': 'Forteresse du patrimoine mondial de l\'UNESCO avec des vues magnifiques sur les Caraïbes',
          'Cultural Significance': 'Signification Culturelle',
          'Built by enslaved Africans and British engineers': 'Construit par des Africains réduits en esclavage et des ingénieurs britanniques'
        }
      };
      
      const langTranslations = translations[targetLang];
      if (langTranslations && langTranslations[text]) {
        return langTranslations[text];
      }
      
      // Fallback: return original text
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  const filteredLocations = heritageLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || location.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-full bg-background flex flex-col" style={{ backgroundColor: 'var(--background)', borderRadius: 'var(--radius-2xl)' }}>
      {/* Header */}
      <div className="p-6 border-b border-border bg-card" style={{ borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">🌺 Ancestra Heritage Map</h2>
              <p className="text-muted-foreground">Discover St. Kitts & Nevis Cultural Treasures</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Language Translator */}
            <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Close
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search heritage sites, museums, landmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Heritage Sites</SelectItem>
              <SelectItem value="landmark">🏛️ Landmarks</SelectItem>
              <SelectItem value="museum">🏛️ Museums</SelectItem>
              <SelectItem value="cultural">🎭 Cultural Sites</SelectItem>
              <SelectItem value="beach">🏖️ Beaches</SelectItem>
              <SelectItem value="restaurant">🍽️ Restaurants</SelectItem>
              <SelectItem value="hotel">🏨 Hotels</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />
          
          {/* Map Overlay Info */}
          <Card className="absolute top-4 left-4 bg-background/95 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-primary" />
                <span className="font-medium">Heritage Locations</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <span>Landmarks & Fortresses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-secondary rounded-full" />
                  <span>Museums & Cultural</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent rounded-full" />
                  <span>Beaches & Nature</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3" style={{ backgroundColor: 'var(--color-sand-400)' }} />
                  <span>Dining & Accommodation</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Translation Status */}
          {isTranslating && (
            <Card className="absolute top-4 right-4 bg-background/95 backdrop-blur">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-sm">Translating content...</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-card border-l overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Heritage Locations ({filteredLocations.length})
            </h3>
            
            <div className="space-y-4">
              {filteredLocations.map(location => (
                <Card key={location.id} className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover-bubble" onClick={() => {
                  setSelectedLocation(location);
                  if (map) {
                    map.setCenter(location.coordinates);
                    map.setZoom(15);
                  }
                }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: getLocationColor(location.type) + '20' }}>
                      <span className="text-lg">{getLocationIcon(location.type)}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{location.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{location.description}</p>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="secondary" className="text-xs">
                          ⭐ {location.rating}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {location.visitTime}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <strong>Cultural Significance:</strong> {location.culturalSignificance}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <strong>Hours:</strong> {location.openHours}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Quick Stats */}
            <Card className="mt-6 p-4 bg-primary/10">
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Heritage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{heritageLocations.filter(l => l.type === 'landmark').length}</div>
                    <div className="text-muted-foreground">Historic Landmarks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{heritageLocations.filter(l => l.type === 'museum').length}</div>
                    <div className="text-muted-foreground">Museums</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{heritageLocations.filter(l => l.type === 'cultural').length}</div>
                    <div className="text-muted-foreground">Cultural Sites</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{heritageLocations.filter(l => l.type === 'beach').length}</div>
                    <div className="text-muted-foreground">Beaches</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AncestraMap;