import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Shield, Search, AlertTriangle, MapPin, Phone, Clock, Navigation, X, Zap, Radio } from 'lucide-react';

interface SafetyLocation {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'fire' | 'embassy' | 'emergency' | 'coast_guard';
  coordinates: { lat: number; lng: number };
  description: string;
  emergencyNumber: string;
  availability: '24/7' | 'business_hours' | 'on_call';
  services: string[];
  responseTime: string;
}

const GuardianSafetyMap: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [map, setMap] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<SafetyLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Safety and emergency locations in St. Kitts & Nevis
  const safetyLocations: SafetyLocation[] = [
    {
      id: '1',
      name: 'Joseph N. France General Hospital',
      type: 'hospital',
      coordinates: { lat: 17.2941, lng: -62.7267 },
      description: 'Main public hospital with emergency services',
      emergencyNumber: '+1-869-465-2551',
      availability: '24/7',
      services: ['Emergency Care', 'Surgery', 'Ambulance', 'ICU'],
      responseTime: '5-15 minutes'
    },
    {
      id: '2',
      name: 'Royal St. Kitts Police Station',
      type: 'police',
      coordinates: { lat: 17.2948, lng: -62.7177 },
      description: 'Main police headquarters in Basseterre',
      emergencyNumber: '911',
      availability: '24/7',
      services: ['Emergency Response', 'Criminal Investigation', 'Traffic Control'],
      responseTime: '3-10 minutes'
    },
    {
      id: '3',
      name: 'Fire & Rescue Services',
      type: 'fire',
      coordinates: { lat: 17.2935, lng: -62.7190 },
      description: 'Central fire station and rescue services',
      emergencyNumber: '911',
      availability: '24/7',
      services: ['Fire Response', 'Emergency Rescue', 'Hazmat', 'Medical Assist'],
      responseTime: '5-12 minutes'
    },
    {
      id: '4',
      name: 'St. Kitts Coast Guard',
      type: 'coast_guard',
      coordinates: { lat: 17.2890, lng: -62.7035 },
      description: 'Maritime safety and rescue operations',
      emergencyNumber: '+1-869-466-3349',
      availability: '24/7',
      services: ['Sea Rescue', 'Maritime Patrol', 'Emergency Transport'],
      responseTime: '10-30 minutes'
    },
    {
      id: '5',
      name: 'Canadian High Commission',
      type: 'embassy',
      coordinates: { lat: 17.2965, lng: -62.7204 },
      description: 'Consular services for Canadian citizens',
      emergencyNumber: '+1-869-465-1335',
      availability: 'business_hours',
      services: ['Consular Services', 'Emergency Documentation', 'Citizen Support'],
      responseTime: '1-4 hours'
    },
    {
      id: '6',
      name: 'Emergency Operations Center',
      type: 'emergency',
      coordinates: { lat: 17.3015, lng: -62.7150 },
      description: 'Disaster management and coordination center',
      emergencyNumber: '+1-869-467-1234',
      availability: '24/7',
      services: ['Disaster Response', 'Evacuation Coordination', 'Weather Alerts'],
      responseTime: 'Immediate'
    },
    {
      id: '7',
      name: 'Alexandra Hospital (Nevis)',
      type: 'hospital',
      coordinates: { lat: 17.1379, lng: -62.6223 },
      description: 'Main hospital serving Nevis island',
      emergencyNumber: '+1-869-469-5473',
      availability: '24/7',
      services: ['Emergency Care', 'General Medicine', 'Ambulance'],
      responseTime: '8-20 minutes'
    },
    {
      id: '8',
      name: 'Nevis Police Division',
      type: 'police',
      coordinates: { lat: 17.1390, lng: -62.6210 },
      description: 'Police services for Nevis island',
      emergencyNumber: '911',
      availability: '24/7',
      services: ['Emergency Response', 'Community Policing', 'Tourist Assistance'],
      responseTime: '5-15 minutes'
    }
  ];

  // Initialize Google Maps with tactical styling
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
            stylers: [{ color: "#1e40af" }] // Police blue
          },
          {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [{ color: "#f8fafc" }] // Tactical light
          },
          {
            featureType: "poi.government",
            elementType: "labels",
            stylers: [{ color: "#2563eb" }] // Police blue
          },
          {
            featureType: "poi.medical",
            elementType: "labels",
            stylers: [{ color: "#dc2626" }] // Emergency red
          }
        ]
      });

      setMap(newMap);

      // Add safety location markers
      safetyLocations.forEach(location => {
        const marker = new window.google.maps.Marker({
          position: location.coordinates,
          map: newMap,
          title: location.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: getLocationColor(location.type),
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
            scale: 10
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 300px; font-family: 'Inter', sans-serif;">
              <h3 style="margin: 0 0 8px 0; color: #2563eb; font-size: 16px;">${getLocationIcon(location.type)} ${location.name}</h3>
              <p style="margin: 4px 0; font-size: 14px; color: #666;">${location.description}</p>
              <div style="margin: 8px 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span style="background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                  📞 ${location.emergencyNumber}
                </span>
                <span style="background: ${getAvailabilityColor(location.availability)}; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                  🕐 ${location.availability}
                </span>
                <span style="background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                  ⚡ ${location.responseTime}
                </span>
              </div>
              <p style="margin: 6px 0; font-size: 12px; color: #888;"><strong>Services:</strong> ${location.services.join(', ')}</p>
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
      hospital: '#dc2626',    // Emergency red
      police: '#2563eb',      // Police blue
      fire: '#ea580c',        // Fire orange
      embassy: '#16a34a',     // Embassy green
      emergency: '#7c3aed',   // Emergency purple
      coast_guard: '#0891b2'  // Coast guard teal
    };
    return colors[type as keyof typeof colors] || '#2563eb';
  };

  const getLocationIcon = (type: string): string => {
    const icons = {
      hospital: '🏥',
      police: '👮',
      fire: '🚒',
      embassy: '🏛️',
      emergency: '🚨',
      coast_guard: '⚓'
    };
    return icons[type as keyof typeof icons] || '🛡️';
  };

  const getAvailabilityColor = (availability: string): string => {
    switch (availability) {
      case '24/7': return '#dcfce7; color: #16a34a';
      case 'business_hours': return '#fef3c7; color: #d97706';
      case 'on_call': return '#fce7f3; color: #be185d';
      default: return '#f1f5f9; color: #475569';
    }
  };

  const filteredLocations = safetyLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterType === 'all' || location.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const emergencyContacts = [
    { name: 'Police Emergency', number: '911', type: 'police' },
    { name: 'Fire Emergency', number: '911', type: 'fire' },
    { name: 'Medical Emergency', number: '911', type: 'hospital' },
    { name: 'Coast Guard', number: '+1-869-466-3349', type: 'coast_guard' }
  ];

  return (
    <div className="h-full bg-background flex flex-col" style={{ backgroundColor: 'var(--background)', borderRadius: 'var(--radius-2xl)' }}>
      {/* Header */}
      <div className="p-6 border-b border-border bg-card" style={{ 
        borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
        background: emergencyMode ? '#fee2e2' : 'var(--card)',
        borderColor: emergencyMode ? '#fca5a5' : 'var(--border)'
      }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              emergencyMode ? 'bg-red-500 animate-pulse' : 'bg-blue-600'
            }`}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">🛡️ Guardian Safety Map</h2>
              <p className="text-muted-foreground">Emergency Services & Safety Resources</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setEmergencyMode(!emergencyMode)}
              variant={emergencyMode ? "destructive" : "outline"}
              className="gap-2"
            >
              <Zap className="w-4 h-4" />
              {emergencyMode ? 'Exit Emergency' : 'Emergency Mode'}
            </Button>
            
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
              placeholder="Search emergency services, hospitals, police..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="hospital">🏥 Medical</SelectItem>
              <SelectItem value="police">👮 Police</SelectItem>
              <SelectItem value="fire">🚒 Fire & Rescue</SelectItem>
              <SelectItem value="coast_guard">⚓ Coast Guard</SelectItem>
              <SelectItem value="embassy">🏛️ Embassies</SelectItem>
              <SelectItem value="emergency">🚨 Emergency Ops</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Emergency Mode Alert */}
        {emergencyMode && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg animate-pulse">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-bold text-red-800">EMERGENCY MODE ACTIVE</h3>
                <p className="text-sm text-red-700">Quick access to emergency services and contacts</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {emergencyContacts.map(contact => (
                <Button
                  key={contact.number}
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                  onClick={() => window.open(`tel:${contact.number}`)}
                >
                  <Phone className="w-3 h-3" />
                  {contact.name}: {contact.number}
                </Button>
              ))}
            </div>
          </div>
        )}
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
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Safety Services</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full" />
                  <span>Medical Emergency</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  <span>Police Services</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-600 rounded-full" />
                  <span>Fire & Rescue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-600 rounded-full" />
                  <span>Coast Guard</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Status */}
          {emergencyMode && (
            <Card className="absolute top-4 right-4 bg-red-50/95 backdrop-blur border-red-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                  <span className="text-sm font-medium text-red-800">Emergency Mode Active</span>
                </div>
                <p className="text-xs text-red-700">All emergency contacts highlighted</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-card border-l overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              Safety Services ({filteredLocations.length})
            </h3>
            
            <div className="space-y-4">
              {filteredLocations.map(location => (
                <Card key={location.id} className={`p-4 transition-all duration-300 cursor-pointer hover-bubble ${
                  emergencyMode ? 'border-red-200 shadow-lg' : ''
                }`} onClick={() => {
                  setSelectedLocation(location);
                  if (map) {
                    map.setCenter(location.coordinates);
                    map.setZoom(15);
                  }
                }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ 
                      backgroundColor: getLocationColor(location.type) + '20',
                      border: emergencyMode ? `2px solid ${getLocationColor(location.type)}` : 'none'
                    }}>
                      <span className="text-lg">{getLocationIcon(location.type)}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{location.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{location.description}</p>
                      
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <Badge variant="destructive" className="text-xs gap-1">
                          <Phone className="w-3 h-3" />
                          {location.emergencyNumber}
                        </Badge>
                        <Badge 
                          variant={location.availability === '24/7' ? 'default' : 'secondary'} 
                          className="text-xs"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {location.availability}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          ⚡ {location.responseTime}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <strong>Services:</strong> {location.services.join(', ')}
                        </p>
                      </div>

                      {emergencyMode && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full mt-3 gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`tel:${location.emergencyNumber}`);
                          }}
                        >
                          <Phone className="w-4 h-4" />
                          Call {location.emergencyNumber}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Emergency Quick Actions */}
            <Card className="mt-6 p-4 bg-blue-50">
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  Emergency Quick Access
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => window.open('tel:911')}>
                    <Phone className="w-4 h-4 text-red-600" />
                    Emergency Services: 911
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => window.open('tel:+1-869-465-2551')}>
                    <Phone className="w-4 h-4 text-red-600" />
                    Hospital: +1-869-465-2551
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => window.open('tel:+1-869-466-3349')}>
                    <Phone className="w-4 h-4 text-blue-600" />
                    Coast Guard: +1-869-466-3349
                  </Button>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 text-sm mb-2">⚠️ Emergency Guidelines</h4>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• Stay calm and provide clear location</li>
                    <li>• Give exact nature of emergency</li>
                    <li>• Follow dispatcher instructions</li>
                    <li>• Keep emergency numbers readily available</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardianSafetyMap;