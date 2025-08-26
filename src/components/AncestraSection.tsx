import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { MessageSquare, Sparkles, ArrowRight, BookOpen, Map, Coffee } from 'lucide-react';

interface AncestraSectionProps {
  title: string;
  bulletPoints: string[];
  onStartChat: () => void;
  isSelected?: boolean;
  theme?: any;
}

export default function AncestraSection({ 
  title, 
  bulletPoints, 
  onStartChat, 
  isSelected = false,
  theme 
}: AncestraSectionProps) {
  const handleStartChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onStartChat();
  };

  return (
    <Card className={`
      relative overflow-hidden p-8 h-full
      bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50
      border-2 transition-all duration-500 ease-out
      hover:shadow-2xl hover:scale-105 group
      ${isSelected ? 'border-coral-400 shadow-xl' : 'border-sand-200 hover:border-coral-300'}
    `}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-gradient-to-br from-coral-400 to-pink-400"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-gradient-to-br from-ocean-300 to-blue-400"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-sand-300 to-amber-300"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
            <div className="text-7xl mb-4 filter drop-shadow-lg">🏺</div>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-3 tracking-wide">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-coral-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* Description */}
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-700 leading-relaxed max-w-sm mx-auto">
            Your guide to heritage, culture, and the stories that make St. Kitts magical
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-4 mb-8">
          {bulletPoints.map((point, index) => (
            <div 
              key={index} 
              className="flex items-center p-3 rounded-xl bg-white/70 backdrop-blur-sm
                       transform transition-all duration-300 hover:bg-white/90 hover:translate-x-2"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-coral-400 to-pink-400 
                            flex items-center justify-center mr-4 shadow-lg">
                {index === 0 && <BookOpen className="w-5 h-5 text-white" />}
                {index === 1 && <Sparkles className="w-5 h-5 text-white" />}
                {index === 2 && <Map className="w-5 h-5 text-white" />}
                {index === 3 && <Coffee className="w-5 h-5 text-white" />}
              </div>
              <span className="text-gray-700 font-medium leading-relaxed">
                {point}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            onClick={handleStartChat}
            size="lg"
            className="
              w-full py-4 px-8 text-lg font-bold
              bg-gradient-to-r from-coral-400 via-pink-400 to-coral-500
              hover:from-coral-500 hover:via-pink-500 hover:to-coral-600
              text-white border-none shadow-xl
              transform transition-all duration-300
              hover:scale-105 hover:shadow-2xl
              active:scale-95
              focus:outline-none focus:ring-4 focus:ring-coral-300/50
            "
          >
            <MessageSquare className="w-6 h-6 mr-3" />
            Start Chatting with {title}
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <p className="mt-3 text-sm text-gray-600">
            🌺 Ready to explore St. Kitts culture and heritage?
          </p>
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full 
                      bg-gradient-to-br from-coral-400 to-pink-400 
                      flex items-center justify-center shadow-lg animate-pulse">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      )}
    </Card>
  );
}