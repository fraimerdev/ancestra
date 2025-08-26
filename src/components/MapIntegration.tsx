import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, MapPin, Navigation, Phone, Clock, Star, Info } from 'lucide-react';

interface MapIntegrationProps {
  onClose: () => void;
  persona: 'Ancestra' | 'The Guardian';
}

interface MapLocation {
  id: string;
  name: string;
  category: string;
  coordinates: { lat: number; lng: number };
  description: string;
  rating?: number;
  hours?: string;
  phone?: string;
  website?: string;
}

export default function MapIntegration({ onClose, persona }: MapIntegrationProps) {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  // Mock data for St. Kitts locations
  const locations: MapLocation[] = [
    {
      id: '1',
      name: 'Brimstone Hill Fortress',
      category: 'Historical',
      coordinates: { lat: 17.3776, lng: -62.8044 },
      description: 'UNESCO World Heritage Site fortress with panoramic views',
      rating: 4.8,
      hours: '9:30 AM - 5:30 PM',
      phone: '+1 (869) 465-2609'
    },
    {
      id: '2',
      name: 'Romney Manor',
      category: 'Cultural',
      coordinates: { lat: 17.3654, lng: -62.8123 },
      description: 'Historic plantation estate featuring Caribelle Batik',
      rating: 4.5,
      hours: '9:00 AM - 4:00 PM',
      phone: '+1 (869) 465-6253'
    },
    {
      id: '3',
      name: 'Independence Square',
      category: 'Historical',
      coordinates: { lat: 17.2955, lng: -62.7241 },
      description: 'Georgian square in central Basseterre',
      rating: 4.2,
      hours: '24 hours'
    },
    {
      id: '4',
      name: 'Frigate Bay Beach',
      category: 'Beach',
      coordinates: { lat: 17.2847, lng: -62.6953 },
      description: 'Popular beach with restaurants and water activities',
      rating: 4.6,
      hours: '24 hours'
    },
    {
      id: '5',
      name: 'El Fredo\'s Restaurant',
      category: 'Restaurant',
      coordinates: { lat: 17.2985, lng: -62.7235 },
      description: 'Local restaurant serving traditional Kittitian cuisine',
      rating: 4.3,
      hours: '11:00 AM - 10:00 PM',
      phone: '+1 (869) 465-3654'
    }
  ];

  const filteredLocations = persona === 'Ancestra' 
    ? locations.filter(loc => ['Historical', 'Cultural', 'Restaurant'].includes(loc.category))
    : locations.filter(loc => ['Hospital', 'Police', 'Embassy', 'Restaurant'].includes(loc.category) || loc.name.includes('Emergency'));

  // Add some safety-related locations for Guardian
  const guardianLocations: MapLocation[] = [
    {
      id: '6',
      name: 'Joseph N. France General Hospital',
      category: 'Hospital',
      coordinates: { lat: 17.2945, lng: -62.7201 },
      description: 'Main hospital in Basseterre',
      rating: 4.0,
      hours: '24 hours',
      phone: '+1 (869) 465-2551'
    },
    {
      id: '7',
      name: 'Tourist Police',
      category: 'Police',
      coordinates: { lat: 17.2960, lng: -62.7250 },
      description: 'Tourist police station in Basseterre',
      hours: '8:00 AM - 4:00 PM',
      phone: '911'
    }
  ];

  const displayLocations = persona === 'The Guardian' 
    ? [...locations, ...guardianLocations] 
    : locations.filter(loc => ['Historical', 'Cultural', 'Restaurant', 'Beach'].includes(loc.category));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl h-[90vh] flex">
        {/* Sidebar */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <MapPin className="w-6 h-6 mr-2" />
                St. Kitts Map
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {persona === 'Ancestra' 
                ? 'Explore cultural sites and attractions' 
                : 'Find safety services and emergency locations'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {displayLocations.map((location) => (
                <Card 
                  key={location.id} 
                  className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedLocation?.id === location.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{location.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {location.category}
                    </Badge>
                  </div>
                  
                  {location.rating && (
                    <div className="flex items-center mb-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-xs">{location.rating}</span>
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mb-2">
                    {location.description}
                  </p>
                  
                  {location.hours && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {location.hours}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          {/* Map Placeholder */}
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center relative">
            <div className="text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">St. Kitts Interactive Map</h3>
              <p className="text-muted-foreground">
                Click on locations in the sidebar to explore
              </p>
            </div>

            {/* Location Pins */}
            {displayLocations.map((location, index) => (
              <div
                key={location.id}
                className="absolute w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform"
                style={{
                  left: `${20 + (index * 15) % 60}%`,
                  top: `${20 + (index * 10) % 60}%`
                }}
                onClick={() => setSelectedLocation(location)}
              >
                {index + 1}
              </div>
            ))}

            {/* Selected Location Info */}
            {selectedLocation && (
              <Card className="absolute top-4 left-4 p-4 max-w-sm bg-white/95 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{selectedLocation.name}</h4>
                  <Badge variant="outline">{selectedLocation.category}</Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedLocation.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  {selectedLocation.rating && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{selectedLocation.rating} rating</span>
                    </div>
                  )}
                  
                  {selectedLocation.hours && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{selectedLocation.hours}</span>
                    </div>
                  )}
                  
                  {selectedLocation.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      <span>{selectedLocation.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Navigation className="w-3 h-3 mr-1" />
                    Directions
                  </Button>
                  <Button size="sm" variant="outline">
                    <Info className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}