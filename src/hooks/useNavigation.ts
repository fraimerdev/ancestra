import { useState } from "react";
import { PERSONA_AVATARS } from "../utils/constants";

export function useNavigation() {
  const [currentView, setCurrentView] = useState<'homepage' | 'chat'>('homepage');
  const [currentPage, setCurrentPage] = useState('home');
  const [isDiscoveryHubOpen, setIsDiscoveryHubOpen] = useState(false);
  const [language, setLanguage] = useState('English');

  // Initialize chat when starting from homepage
  const handleStartChat = (persona: string, userName?: string, onPersonaChange?: (persona: string) => void, onUserNameUpdate?: (name: string) => void) => {
    // Store the user's name if provided
    if (userName && userName.trim() && onUserNameUpdate) {
      onUserNameUpdate(userName.trim());
    }
    
    // Validate persona selection
    const validPersona = PERSONA_AVATARS[persona as keyof typeof PERSONA_AVATARS];
    if (validPersona && onPersonaChange) {
      onPersonaChange(persona);
      setCurrentView('chat');
      
      console.log('🚀 Starting chat with persona:', persona, userName ? `for user: ${userName}` : '');
    } else {
      console.warn('Invalid persona selected:', persona, 'defaulting to Ancestra');
      if (onPersonaChange) {
        onPersonaChange('Ancestra');
      }
      setCurrentView('chat');
    }
  };

  // Navigation functions
  const handleNavigateToHomepage = () => {
    setCurrentView('homepage');
  };

  const handlePageNavigation = (page: string) => {
    setCurrentPage(page);
  };

  const handleLogoutNavigation = () => {
    setCurrentView('homepage');
  };

  return {
    currentView,
    setCurrentView,
    currentPage,
    setCurrentPage,
    isDiscoveryHubOpen,
    setIsDiscoveryHubOpen,
    language,
    setLanguage,
    handleStartChat,
    handleNavigateToHomepage,
    handlePageNavigation,
    handleLogoutNavigation
  };
}