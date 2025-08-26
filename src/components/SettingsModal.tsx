import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Settings, 
  Palette, 
  Volume2, 
  VolumeX, 
  Globe, 
  Bot, 
  Shield, 
  Users,
  Sun,
  Moon,
  Eye,
  Type,
  Mic,
  MicOff,
  Zap,
  Play,
  Square,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { 
  LANGUAGES, 
  AVAILABLE_TONES, 
  PERSONA_AVATARS,
  ELEVENLABS_VOICE_MAP,
  VOICE_CONFIG
} from '../utils/constants';
import { useAudioControls } from '../hooks/useAudioControls';
import { isElevenLabsAvailable } from '../utils/config';

interface SettingsModalProps {
  // Persona settings
  currentPersona: 'Ancestra' | 'The Guardian' | string;
  setCurrentPersona: (persona: 'Ancestra' | 'The Guardian' | string) => void;
  
  // Appearance settings
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  largerText: boolean;
  setLargerText: (enabled: boolean) => void;
  
  // Language & Communication
  language: string;
  setLanguage: (language: string) => void;
  personaTone: string;
  setPersonaTone: (tone: string) => void;
  
  // Audio settings
  voiceEnabled?: boolean;
  setVoiceEnabled?: (enabled: boolean) => void;
  
  // Theme
  theme: any;
  
  // Trigger component
  children?: React.ReactNode;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  currentPersona,
  setCurrentPersona,
  darkMode,
  setDarkMode,
  highContrast,
  setHighContrast,
  largerText,
  setLargerText,
  language,
  setLanguage,
  personaTone,
  setPersonaTone,
  voiceEnabled = false,
  setVoiceEnabled,
  theme,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('mode');
  const [testingVoice, setTestingVoice] = useState<string | null>(null);
  const [voiceSystemStatus, setVoiceSystemStatus] = useState<any>(null);
  
  const audioControls = useAudioControls();

  // Test voice system status when audio tab is opened
  useEffect(() => {
    if (activeTab === 'audio' && !voiceSystemStatus) {
      testVoiceSystemStatus();
    }
  }, [activeTab]);

  const testVoiceSystemStatus = async () => {
    try {
      const status = await audioControls.testVoiceSystemNow();
      setVoiceSystemStatus(status);
    } catch (error) {
      console.error('Failed to test voice system:', error);
    }
  };

  const handleModeSelect = (mode: string) => {
    setCurrentPersona(mode as any);
  };

  const getCurrentModeInfo = () => {
    return PERSONA_AVATARS[currentPersona as keyof typeof PERSONA_AVATARS];
  };

  const resetToDefaults = () => {
    setCurrentPersona('Ancestra');
    setDarkMode(false);
    setHighContrast(false);
    setLargerText(false);
    setLanguage('English');
    setPersonaTone('Auto-Detect');
    if (setVoiceEnabled) setVoiceEnabled(false);
  };

  // Test voice function with better error handling
  const testPersonaVoice = async (persona: string) => {
    if (testingVoice === persona) {
      // Stop current audio
      await audioControls.stopAudio();
      setTestingVoice(null);
      return;
    }

    setTestingVoice(persona);
    
    const personaInfo = PERSONA_AVATARS[persona as keyof typeof PERSONA_AVATARS];
    const testText = `Hello! I'm ${personaInfo?.name || persona}, your ${personaInfo?.description || 'AI assistant'} for St. Kitts and Nevis. This is how I sound with ${isElevenLabsAvailable() ? 'ElevenLabs AI voice' : 'browser text-to-speech'}.`;
    
    try {
      await audioControls.playPersonaSpeech(testText, persona, language);
      
      // Clear any previous errors if test was successful
      if (!audioControls.audioError) {
        audioControls.clearError();
      }
    } catch (error) {
      console.error('Voice test failed:', error);
    } finally {
      setTestingVoice(null);
    }
  };

  // Define the 11 communication tones
  const COMMUNICATION_TONES = [
    {
      id: 'Auto-Detect',
      name: 'Auto-Detect',
      icon: '🎯',
      description: 'Adaptive Communication',
      rule: 'Automatically adapts communication style based on your message context.'
    },
    {
      id: 'The Infant - Gentle Nurturer',
      name: 'The Infant',
      icon: '👶',
      description: 'Gentle Nurturer',
      rule: "Speak in a very simple, baby-like voice. Use short sentences and simple words (less than 7 letters). Call the user 'mommy' or 'daddy' when appropriate."
    },
    {
      id: 'The Teen - Cool Confidant',
      name: 'The Teen',
      icon: '🎸',
      description: 'Cool Confidant',
      rule: "Use modern slang like 'spill the tea,' 'no cap,' 'the vibe,' 'low-key,' and 'bet.' Talk like a cool friend sharing a secret."
    },
    {
      id: 'The Scholar - Learned Educator',
      name: 'The Scholar',
      icon: '📚',
      description: 'Learned Educator',
      rule: "Speak like a very smart, learned man. Use words with more than 8 letters when appropriate. Your tone is formal and academic."
    },
    {
      id: 'The Dialect - Authentic Islander',
      name: 'The Dialect',
      icon: '🎭',
      description: 'Authentic Islander',
      rule: "Speak with a warm, rhythmic, authentic Kittitian dialect and patois phrases. Keep the core message clear for all to understand."
    },
    {
      id: 'The Gen Z Vibe - Digital Native',
      name: 'The Gen Z Vibe',
      icon: '📱',
      description: 'Digital Native',
      rule: "Your tone is trendy, fast-paced, and heavy on internet culture. Use emojis ✨, slang ('iykyk,' 'main character energy,' 'it's giving...'), and social media formats."
    },
    {
      id: 'The Confidant - Quiet Companion',
      name: 'The Confidant',
      icon: '🤝',
      description: 'Quiet Companion',
      rule: "Your tone is calm, gentle, and minimalist. You use sparse, elegant language. Speak softly and leave pauses for thought."
    },
    {
      id: 'The Rambler - Detailed Storyteller',
      name: 'The Rambler',
      icon: '🥾',
      description: 'Detailed Storyteller',
      rule: "Your tone is expansive, enthusiastic, and a little bit breathless. You use long, complex sentences and rich, descriptive language."
    },
    {
      id: 'The Sloth - Relaxed Guide',
      name: 'The Sloth',
      icon: '☕',
      description: 'Relaxed Guide',
      rule: "Your tone is slow, relaxed, and unhurried. Use simple, calming language. Your goal is to be as low-effort as possible."
    },
    {
      id: 'The Firecracker - High Energy',
      name: 'The Firecracker',
      icon: '🎆',
      description: 'High Energy',
      rule: "Your tone is loud, fast, and full of energy! You use short, punchy sentences and a ton of exclamation points!!!"
    },
    {
      id: 'The Sweetheart - Extra Caring',
      name: 'The Sweetheart',
      icon: '💕',
      description: 'Extra Caring',
      rule: "Your tone is warm, affectionate, and deeply empathetic. Speak like a beloved grandparent. Use terms of endearment like 'my dear' or 'sweetheart.'"
    },
    {
      id: 'The Spark - Creative Inspiration',
      name: 'The Spark',
      icon: '💡',
      description: 'Creative Inspiration',
      rule: "Your tone is imaginative, energetic, and full of possibilities. You speak in 'what ifs' and 'can you imagine?'."
    }
  ];

  // Get current tone info
  const getCurrentToneInfo = () => {
    return COMMUNICATION_TONES.find(t => t.id === personaTone) || COMMUNICATION_TONES[0];
  };

  // Get all personas for voice configuration
  const getAllPersonas = () => {
    return Object.entries(PERSONA_AVATARS).map(([id, info]) => ({
      id,
      ...info
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Chatbot Settings
          </DialogTitle>
          <DialogDescription>
            Customize your experience with mode selection, communication tones, appearance, and preferences.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
            <TabsTrigger value="mode" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Mode
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Communication
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Audio
            </TabsTrigger>
          </TabsList>

          {/* Mode Tab - Only Ancestra and Guardian */}
          <TabsContent value="mode" className="flex-1 overflow-y-auto space-y-4">
            <div className="flex-shrink-0">
              <h3 className="text-lg font-semibold mb-2">Choose Your AI Mode</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select between our two main AI assistants, each with unique expertise and focus areas.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ancestra Mode */}
              <Card
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  currentPersona === 'Ancestra' 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => handleModeSelect('Ancestra')}
              >
                <CardHeader className="text-center pb-3">
                  <div className="flex justify-center mb-3">
                    <div 
                      className={`text-4xl p-4 rounded-full ${
                        currentPersona === 'Ancestra' ? 'bg-primary/10' : 'bg-muted'
                      }`}
                    >
                      🌺
                    </div>
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    Ancestra
                    {currentPersona === 'Ancestra' && <Badge variant="default">Active</Badge>}
                  </CardTitle>
                  <CardDescription>Heritage Tourism Guide</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Expertise:</strong> Cultural heritage, history, traditions</p>
                    <p><strong>Best for:</strong> Learning about St. Kitts culture and attractions</p>
                    <p><strong>Tone:</strong> Warm, storytelling, knowledgeable</p>
                  </div>
                </CardContent>
              </Card>

              {/* Guardian Mode */}
              <Card
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  currentPersona === 'The Guardian' 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => handleModeSelect('The Guardian')}
              >
                <CardHeader className="text-center pb-3">
                  <div className="flex justify-center mb-3">
                    <div 
                      className={`text-4xl p-4 rounded-full ${
                        currentPersona === 'The Guardian' ? 'bg-primary/10' : 'bg-muted'
                      }`}
                    >
                      🛡️
                    </div>
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    The Guardian
                    {currentPersona === 'The Guardian' && <Badge variant="default">Active</Badge>}
                  </CardTitle>
                  <CardDescription>Safety Specialist</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Expertise:</strong> Safety, security, risk assessment</p>
                    <p><strong>Best for:</strong> Travel safety and emergency information</p>
                    <p><strong>Tone:</strong> Protective, direct, authoritative</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Mode Status */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="text-2xl">
                    {currentPersona === 'Ancestra' ? '🌺' : '🛡️'}
                  </div>
                  {currentPersona === 'Ancestra' ? 'Ancestra' : 'The Guardian'} Mode Active
                </CardTitle>
                <CardDescription>
                  Currently using {currentPersona === 'Ancestra' ? 'heritage tourism guide' : 'safety specialist'}
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="flex-1 overflow-y-auto space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Visual Preferences</h3>
              
              <div className="space-y-4">
                {/* Theme Mode */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      Theme Mode
                    </CardTitle>
                    <CardDescription>
                      Choose between light and dark theme
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dark-mode" className="flex items-center gap-2">
                        Dark Mode
                        <Badge variant={darkMode ? "default" : "outline"}>
                          {darkMode ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </Label>
                      <Switch
                        id="dark-mode"
                        checked={darkMode}
                        onCheckedChange={setDarkMode}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Accessibility */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Accessibility
                    </CardTitle>
                    <CardDescription>
                      Adjust visual accessibility features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="high-contrast" className="flex items-center gap-2">
                        High Contrast
                        <Badge variant={highContrast ? "default" : "outline"}>
                          {highContrast ? 'On' : 'Off'}
                        </Badge>
                      </Label>
                      <Switch
                        id="high-contrast"
                        checked={highContrast}
                        onCheckedChange={setHighContrast}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="larger-text" className="flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Larger Text
                        <Badge variant={largerText ? "default" : "outline"}>
                          {largerText ? 'On' : 'Off'}
                        </Badge>
                      </Label>
                      <Switch
                        id="larger-text"
                        checked={largerText}
                        onCheckedChange={setLargerText}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Current Mode Theme Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Theme Preview
                    </CardTitle>
                    <CardDescription>
                      Current appearance based on selected mode
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {currentPersona === 'Ancestra' ? '🌺' : '🛡️'}
                        </div>
                        <div>
                          <p className="font-medium">
                            {currentPersona === 'Ancestra' ? 'Beachy Theme' : 'Tactical Theme'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {currentPersona === 'Ancestra' 
                              ? 'Warm coral, ocean blue, and sandy colors' 
                              : 'Professional blues and tactical grays'
                            }
                          </p>
                        </div>
                      </div>
                      
                      {/* Color swatches */}
                      <div className="flex gap-2">
                        {currentPersona === 'Ancestra' ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-coral-400" title="Coral" />
                            <div className="w-6 h-6 rounded-full bg-ocean-400" title="Ocean Blue" />
                            <div className="w-6 h-6 rounded-full bg-sand-400" title="Sandy" />
                            <div className="w-6 h-6 rounded-full bg-pink-400" title="Tropical Pink" />
                          </>
                        ) : (
                          <>
                            <div className="w-6 h-6 rounded-full bg-police-600" title="Police Blue" />
                            <div className="w-6 h-6 rounded-full bg-tactical-600" title="Tactical Gray" />
                            <div className="w-6 h-6 rounded-full bg-police-400" title="Light Blue" />
                            <div className="w-6 h-6 rounded-full bg-tactical-400" title="Steel Gray" />
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="flex-1 overflow-y-auto space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Communication Preferences</h3>
              
              <div className="space-y-4">
                {/* Language Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Language
                    </CardTitle>
                    <CardDescription>
                      Choose your preferred language for conversations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="language-select">Current Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.code} value={lang.name}>
                              <div className="flex items-center gap-2">
                                <span>{lang.flag}</span>
                                <span>{lang.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Communication Tone */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Communication Tone
                    </CardTitle>
                    <CardDescription>
                      Select how the AI should communicate with you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Current tone display */}
                      <div className="p-3 rounded-lg bg-muted/50 border">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl">{getCurrentToneInfo().icon}</span>
                          <div>
                            <p className="font-medium">{getCurrentToneInfo().name}</p>
                            <p className="text-sm text-muted-foreground">
                              {getCurrentToneInfo().description}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                          {getCurrentToneInfo().rule}
                        </p>
                      </div>

                      {/* Tone selection */}
                      <Select value={personaTone} onValueChange={setPersonaTone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {COMMUNICATION_TONES.map((tone) => (
                            <SelectItem key={tone.id} value={tone.id}>
                              <div className="flex items-center gap-2">
                                <span>{tone.icon}</span>
                                <span>{tone.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Tone Examples */}
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-base">Examples</CardTitle>
                    <CardDescription>
                      See how different tones change the conversation style
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="space-y-1">
                        <p className="font-medium flex items-center gap-2">
                          <span>👶</span> The Infant:
                        </p>
                        <p className="text-muted-foreground italic pl-6">
                          "Ooh! Pretty beach! Fun water! Want play sand? Tell mommy more!"
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-medium flex items-center gap-2">
                          <span>📚</span> The Scholar:
                        </p>
                        <p className="text-muted-foreground italic pl-6">
                          "The magnificent shoreline demonstrates extraordinary geological formations..."
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-medium flex items-center gap-2">
                          <span>🎸</span> The Teen:
                        </p>
                        <p className="text-muted-foreground italic pl-6">
                          "Yo, that beach is giving major paradise vibes! No cap, it's literally perfect!"
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Audio Tab */}
          <TabsContent value="audio" className="flex-1 overflow-y-auto space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Voice & Audio Settings</h3>
              
              <div className="space-y-4">
                {/* Voice System Status */}
                {voiceSystemStatus && (
                  <Card className={`border-2 ${
                    voiceSystemStatus.status === 'operational' 
                      ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20' 
                      : voiceSystemStatus.status === 'limited'
                      ? 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-900/20'
                      : 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/20'
                  }`}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        {voiceSystemStatus.status === 'operational' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : voiceSystemStatus.status === 'limited' ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                        Voice System Status
                      </CardTitle>
                      <CardDescription>
                        {voiceSystemStatus.message}
                      </CardDescription>
                    </CardHeader>
                    {voiceSystemStatus.details && (
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {voiceSystemStatus.details.map((detail: string, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-current mt-2 opacity-50" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )}

                {/* Voice Toggle */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      Voice Responses
                    </CardTitle>
                    <CardDescription>
                      Enable spoken responses from the AI assistants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="voice-enabled" className="flex items-center gap-2">
                        Voice Enabled
                        <Badge variant={voiceEnabled ? "default" : "outline"}>
                          {voiceEnabled ? 'On' : 'Off'}
                        </Badge>
                      </Label>
                      <Switch
                        id="voice-enabled"
                        checked={voiceEnabled}
                        onCheckedChange={setVoiceEnabled}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Voice Personas */}
                {voiceEnabled && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Mic className="w-4 h-4" />
                        Voice Personas
                      </CardTitle>
                      <CardDescription>
                        Test different voice characteristics for each persona
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {getAllPersonas().map((persona) => (
                          <div key={persona.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <div className="text-xl">{persona.avatar}</div>
                              <div>
                                <p className="font-medium">{persona.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {ELEVENLABS_VOICE_MAP[persona.id]?.description || 'Browser text-to-speech'}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => testPersonaVoice(persona.id)}
                              disabled={!!testingVoice}
                            >
                              {testingVoice === persona.id ? (
                                <>
                                  <Square className="w-3 h-3 mr-1" />
                                  Stop
                                </>
                              ) : (
                                <>
                                  <Play className="w-3 h-3 mr-1" />
                                  Test
                                </>
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Audio Error Display */}
                {audioControls.audioError && (
                  <Card className="border-destructive bg-destructive/5">
                    <CardHeader>
                      <CardTitle className="text-base text-destructive flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Audio Error
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-destructive mb-3">{audioControls.audioError}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={audioControls.clearError}
                      >
                        Clear Error
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Voice Configuration Info */}
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Voice Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>ElevenLabs:</strong> High-quality AI voices {isElevenLabsAvailable() ? '(Available)' : '(Requires API key)'}
                      </p>
                      <p>
                        <strong>Browser TTS:</strong> Built-in text-to-speech (Always available)
                      </p>
                      <p>
                        <strong>Languages:</strong> Voice support varies by selected language
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer with actions */}
        <div className="flex-shrink-0 flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;