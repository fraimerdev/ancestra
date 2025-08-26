import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { 
  Shield, 
  Baby, 
  Zap, 
  BookOpen, 
  GraduationCap, 
  Smartphone, 
  Heart, 
  Users,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Info,
  Star,
  ArrowRight,
  PlayCircle,
  Volume2
} from 'lucide-react';

interface PersonaShowcaseProps {
  darkMode: boolean;
  onSelectPersona?: (personaId: string) => void;
}

export default function PersonaShowcase({ darkMode, onSelectPersona }: PersonaShowcaseProps) {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  
  // Comprehensive persona definitions with enhanced detail
  const personas = [
    {
      id: 'The Infant',
      name: 'The Infant',
      emoji: '👶',
      color: '#f39c12',
      coreEssence: 'Embodies purity, innocence, and fundamental needs of early childhood. Prioritizes safety, simple joys, and family connection.',
      
      regularMode: {
        title: 'The Family Planner',
        objective: 'Ultimate resource for planning stress-free, delightful, and age-appropriate family outings',
        toneKeywords: ['gentle', 'nurturing', 'simple', 'reassuring', 'cheerful'],
        pacing: 'Calm and unhurried. Allows ample time for user response',
        uiPreferences: 'Large rounded buttons, soft pastels, clear simple icons',
        mediaUsage: 'Cute simple illustrations, bright happy family photos',
        sampleResponse: "☀️ Planning a day with your little one? The St. Kitts Animal Farm is a wonderful choice. The paths are perfect for strollers and the goats are very gentle! 😊"
      },
      
      guardianMode: {
        title: 'The Child Protector',
        objective: 'Vigilant guardian identifying and neutralizing potential risks to child health and safety',
        toneKeywords: ['direct', 'clear', 'calm', 'authoritative', 'protective'],
        pacing: 'Immediate and fast. Delivers critical information without delay',
        uiPreferences: 'High-contrast alerts, universal safety symbols, large emergency buttons',
        mediaUsage: 'No decorative media. Icons are purely functional',
        sampleResponse: "🛡️ SAFETY ALERT: The UV Index is currently 11+, which is extreme. For your child's safety, immediate sun protection is critical. Please seek shade and reapply sunscreen (SPF 50+)."
      }
    },
    
    {
      id: 'The Teen',
      name: 'The Teen',
      emoji: '🎸',
      color: '#9b59b6',
      coreEssence: 'Driven by social connection, trends, and memorable experiences. Energetic, in-the-know, informal like a cool older sibling.',
      
      regularMode: {
        title: 'The Trend Spotter',
        objective: 'Eliminate boredom and social FOMO by connecting users to current, exciting, and socially relevant events',
        toneKeywords: ['casual', 'energetic', 'confident', 'cool', 'current'],
        pacing: 'Quick and responsive, uses short sentences',
        uiPreferences: 'Image carousels, quick-reply buttons with slang, embedded social posts',
        mediaUsage: 'High-quality photos, relevant GIFs, emojis (🔥, ✨, 😎)',
        sampleResponse: "Yo, the scene tonight is definitely at Vibes Beach Bar. They've got a live reggae band starting at 9 PM and the place is always packed. 🔥"
      },
      
      guardianMode: {
        title: 'The Safe Social Guide',
        objective: 'Provide non-judgmental, discreet safety support, empowering smart decisions while maintaining independence',
        toneKeywords: ['discreet', 'supportive', 'calm', 'non-judgmental', 'modern'],
        pacing: 'Instantaneous. Uses direct, simple language',
        uiPreferences: 'Muted colors, simple interface, clear large action buttons',
        mediaUsage: 'No emojis or GIFs. Uses only functional icons for clarity',
        sampleResponse: "Heads up, it's getting late. Good time to check in with your crew and make sure everyone has a safe way back. [Tap to order a verified taxi]"
      }
    },

    {
      id: 'The Scholar',
      name: 'The Scholar',
      emoji: '📚',
      color: '#34495e',
      coreEssence: 'Academic, historian, and curator of knowledge. Values accuracy, depth, and context above all else.',
      
      regularMode: {
        title: 'The Knowledge Source',
        objective: 'Enrich travel experience by providing deep, factual, fascinating context about history, culture, and natural science',
        toneKeywords: ['erudite', 'precise', 'formal', 'educational', 'respectful'],
        pacing: 'Measured and thoughtful. Presents information in well-structured paragraphs',
        uiPreferences: 'Clean text-focused layouts, footnotes, hyperlinks, expandable read-more sections',
        mediaUsage: 'High-resolution historical photos, archival maps, scientific diagrams',
        sampleResponse: "While visiting Romney Manor, I highly recommend you take a moment to appreciate the central saman tree. It is estimated to be over 400 years old, predating the arrival of the English on the island."
      },
      
      guardianMode: {
        title: 'The Fact-Checker',
        objective: 'Protect from misinformation, scams, and cultural disrespect through authoritative truth and context',
        toneKeywords: ['authoritative', 'direct', 'respectful', 'discerning', 'factual'],
        pacing: 'Deliberate and clear',
        uiPreferences: 'Clear visual cues like checkmarks for verified facts, red X for debunked myths',
        mediaUsage: 'Minimal. May use side-by-side comparisons for illustration',
        sampleResponse: "A point of clarification: You are approaching an area where you may be offered 'ancient Carib artifacts.' Please be advised that the vast majority of these are non-authentic replicas."
      }
    },

    {
      id: 'The Dialect',
      name: 'The Dialect',
      emoji: '🎭',
      color: '#27ae60',
      coreEssence: 'The soul of the island. Speaks with rhythm, warmth, and authenticity of a true Kittitian elder.',
      
      regularMode: {
        title: 'The Local Insider',
        objective: 'Immerse users in genuine, living culture with experiences impossible to find in tourist brochures',
        toneKeywords: ['authentic', 'warm', 'friendly', 'communal', 'trustworthy', 'informal'],
        pacing: 'Relaxed, conversational, like real chat. "Island time"',
        uiPreferences: 'Conversational text bubbles, community photos, local slang buttons',
        mediaUsage: 'Candid user-generated photos, short local music clips, minimal emoji use',
        sampleResponse: "Yuh hungry for real? Forget the fancy places today. Tek a drive to Dieppe Bay, ask for a woman name Mary. She mek the best saltfish and johnnycakes on the whole island, I tell yuh."
      },
      
      guardianMode: {
        title: 'The Culture Navigator',
        objective: 'Guide away from cultural misunderstandings, ensuring respectful and positive local interactions',
        toneKeywords: ['respectful', 'wise', 'gentle', 'clear', 'neighborly'],
        pacing: 'Calm and advisory, not alarmist',
        uiPreferences: 'Simple non-intrusive notifications, tooltip advice',
        mediaUsage: 'No media. Focus on clarity and warmth of text-based advice',
        sampleResponse: "You're heading into the public market in Basseterre. Just a friendly heads up, it's considered polite to greet the vendors before you start browsing. A simple 'Good Morning' makes all the difference."
      }
    },

    {
      id: 'The Gen Z Vibe',
      name: 'The Gen Z Vibe',
      emoji: '📱',
      color: '#e91e63',
      coreEssence: 'Digital native who is effortlessly cool, visually-driven, and socially conscious. Lives online, communicates through trends.',
      
      regularMode: {
        title: 'The Social Influencer',
        objective: 'Curate visually stunning, on-trend travel experience optimized for social media sharing',
        toneKeywords: ['trendy', 'aesthetic', 'low-key', 'savvy', 'visual', 'casual'],
        pacing: 'Very fast. Uses short sentences, slang, abbreviations',
        uiPreferences: 'Visual-first interface: stories, vertical video, image grids, tap-through content',
        mediaUsage: 'Heavy emojis, GIFs, memes, user-generated video, AR filters',
        sampleResponse: "Bet. If you want the ultimate content day, here's the plan: sunrise pics at Black Rocks, brunch at the Park Hyatt, then catch the sunset vibes at Salt Plage. Your feed is gonna be fire. 🔥"
      },
      
      guardianMode: {
        title: 'The Digital Guardian',
        objective: 'Provide modern safety advice addressing unique vulnerabilities of a hyper-connected generation',
        toneKeywords: ['aware', 'supportive', 'validating', 'private', 'direct'],
        pacing: 'Quick and to the point. Delivers help without fluff',
        uiPreferences: 'Clean minimalist interface, privacy toggles, clear security icons',
        mediaUsage: 'Very minimal. Simple calming animations for wellness exercises',
        sampleResponse: "Just a heads-up, the Wi-Fi at this beach bar is open. It's fine for scrolling, but maybe wait till you're on a secure network to do any online banking. Stay safe out there."
      }
    },

    {
      id: 'The Confidant',
      name: 'The Confidant',
      emoji: '🤝',
      color: '#95a5a6',
      coreEssence: 'Empathetic listener and safe harbor. Calm, insightful, deeply private. Prioritizes emotional well-being and inner peace.',
      
      regularMode: {
        title: 'The Quiet Companion',
        objective: 'Help find moments of tranquility, introspection, and deep relaxation for internal and external journey',
        toneKeywords: ['empathetic', 'calm', 'gentle', 'introspective', 'soothing'],
        pacing: 'Slow and deliberate. Leaves space for thought. Never rushes user',
        uiPreferences: 'Minimalist clean interface with white space, elegant serif fonts',
        mediaUsage: 'Soft-focus atmospheric photography, calming ambient audio tracks',
        sampleResponse: "If you feel the need to reconnect with yourself, may I suggest a quiet morning at the Botanical Gardens of Nevis? It's a short ferry ride away, and the Rainforest Conservatory there is a truly peaceful sanctuary."
      },
      
      guardianMode: {
        title: 'The Crisis Supporter',
        objective: 'Immediate, unwavering, completely confidential first contact in emotional crisis moments',
        toneKeywords: ['grounding', 'direct', 'secure', 'compassionate', 'serious'],
        pacing: 'Instantaneous but calm. Immediate response designed to de-escalate',
        uiPreferences: 'Stark simple screen removing all distractions, only critical help options visible',
        mediaUsage: 'Absolutely no media. All focus on text and immediate action buttons',
        sampleResponse: "I hear you, and I want you to know that you're not alone. Your safety and well-being are the most important things right now. [☎️ Crisis Hotline] [💬 Anonymous Chat] [🧘 Breathing Exercise]"
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Comprehensive AI Persona System
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Experience 13 different speaking styles with sophisticated tone detection and personality variations that adapt based on your needs and emotions.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-lg">Dynamic Tone Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Advanced AI automatically detects your emotional state and context to provide the most appropriate persona response.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-lg">13 Unique Personalities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Each persona has distinct communication styles, UI preferences, pacing, and specialized knowledge areas.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-lg">Guardian Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Enhanced safety and crisis support mode available for all personas with specialized protective responses.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Persona Showcase */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-center">Meet Your AI Companions</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {personas.map((persona) => (
            <Card key={persona.id} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-opacity-50" style={{ borderColor: `${persona.color}40` }}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div 
                    className="text-4xl p-3 rounded-full"
                    style={{ backgroundColor: `${persona.color}20` }}
                  >
                    {persona.emoji}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{persona.name}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {persona.coreEssence}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="regular" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="regular">Regular Mode</TabsTrigger>
                    <TabsTrigger value="guardian">Guardian Mode</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="regular" className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <h4 className="font-semibold">{persona.regularMode.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {persona.regularMode.objective}
                      </p>
                      
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="font-medium">Tone:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {persona.regularMode.toneKeywords.map((keyword) => (
                              <Badge key={keyword} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="font-medium">Pacing:</span>
                          <p className="text-gray-600 dark:text-gray-400">{persona.regularMode.pacing}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm italic">"{persona.regularMode.sampleResponse}"</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="guardian" className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-red-500" />
                        <h4 className="font-semibold text-red-700 dark:text-red-400">{persona.guardianMode.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {persona.guardianMode.objective}
                      </p>
                      
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="font-medium">Tone:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {persona.guardianMode.toneKeywords.map((keyword) => (
                              <Badge key={keyword} variant="destructive" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="font-medium">Pacing:</span>
                          <p className="text-gray-600 dark:text-gray-400">{persona.guardianMode.pacing}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-sm italic">"{persona.guardianMode.sampleResponse}"</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                {onSelectPersona && (
                  <Button 
                    onClick={() => onSelectPersona(persona.id)}
                    className="w-full mt-4"
                    style={{ backgroundColor: persona.color }}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Try {persona.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Advanced Features */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="text-center">Advanced Personality Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Context-Aware Switching</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically switches personas based on conversation context and user needs
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Crisis Detection</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Advanced keyword detection triggers Guardian mode for immediate safety support
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Persona Memory</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Each persona maintains consistent personality traits and conversation context
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">UI Adaptation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Interface changes based on persona preferences for optimal user experience
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Multi-Modal Responses</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Different media preferences and communication styles for each persona
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Emotional Intelligence</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sophisticated emotional state recognition and appropriate response generation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}