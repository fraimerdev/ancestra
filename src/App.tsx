import { useState, useEffect } from "react";
import Homepage from "./components/Homepage";
import ChatInterface from "./components/ChatInterface";
import DiscoveryHub from "./components/DiscoveryHub";
import QuestDashboard from "./components/QuestDashboard";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import SettingsModal from "./components/SettingsModal";
import { useAuthentication } from "./hooks/useAuthentication";
import { usePersonaManagement } from "./hooks/usePersonaManagement";
import { useThemeAndAnimation } from "./hooks/useThemeAndAnimation";
import { useNavigation } from "./hooks/useNavigation";
import { useQuestManagement } from "./hooks/useQuestManagement";
import { aiService } from "./utils/aiService";

export default function App() {
  // Custom hooks for state management
  const auth = useAuthentication();
  const persona = usePersonaManagement();
  const navigation = useNavigation();
  const theme = useThemeAndAnimation(persona.currentPersona, persona.shouldUseGuardianAnimation());
  const questManagement = useQuestManagement();
  
  // Voice state
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  
  // Settings modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Quest Dashboard state
  const [isQuestDashboardOpen, setIsQuestDashboardOpen] = useState(false);

  // Initialize services and data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize AI service with pre-configured API key (no connection test)
        console.log('🤖 Initializing AI service...');
        await aiService.initialize({
          apiKey: "AIzaSyDpvQM-7jWsUInf6i28XjU7mk9mYx2Sgz0"
        });
        console.log('✅ AI Service initialized successfully with pre-configured API key');
        
        // Tourism data will be initialized by the quest management hook
        console.log('🌴 Tourism data will be loaded by quest system...');
        
        // Don't test connection on startup to preserve quota
        // Connection will be tested when first message is sent
      } catch (error) {
        console.error('❌ Failed to initialize app services:', error);
      }
    };

    initializeApp();
  }, []);

  // 🌺 Force coral theme application on component mount
  useEffect(() => {
    // Add coral theme classes to body and html
    document.documentElement.className = 'ancestra-theme';
    document.body.className = 'ancestra-theme bg-background text-foreground';
    
    // Apply coral background to body
    document.body.style.backgroundColor = 'var(--background)';
    document.body.style.color = 'var(--foreground)';
    
    // Apply to html element as well
    document.documentElement.style.backgroundColor = 'var(--background)';
    document.documentElement.style.color = 'var(--foreground)';
    
    console.log('🌺 Coral beachy theme applied to document');
  }, []);

  // Enhanced logout handler that also handles navigation
  const handleLogout = () => {
    auth.handleLogout();
    navigation.handleLogoutNavigation();
  };

  // Handle account switching
  const handleSwitchAccount = () => {
    auth.handleLogout();
    auth.setAuthView('login');
  };

  // Handle settings modal
  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  // Enhanced start chat handler
  const handleStartChat = (personaId: string, userName?: string) => {
    navigation.handleStartChat(
      personaId, 
      userName, 
      persona.handlePersonaChange,
      auth.updateUserName
    );
  };

  // Authentication gate - show login/signup if not authenticated
  if (!auth.isAuthenticated) {
    if (auth.authView === 'login') {
      return (
        <div className="min-h-screen bg-background text-foreground" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
          <LoginPage
            onLogin={auth.handleLogin}
            onShowSignUp={() => auth.setAuthView('signup')}
            theme={theme.theme}
            currentPersona={theme.themePersona}
            onToggleDarkMode={() => theme.setDarkMode(!theme.darkMode)}
            darkMode={theme.darkMode}
          />
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-background text-foreground" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
          <SignUpPage
            onSignUp={auth.handleSignUp}
            onBackToLogin={() => auth.setAuthView('login')}
            theme={theme.theme}
            currentPersona={theme.themePersona}
            onToggleDarkMode={() => theme.setDarkMode(!theme.darkMode)}
            darkMode={theme.darkMode}
          />
        </div>
      );
    }
  }

  // Render Homepage
  if (navigation.currentView === 'homepage') {
    return (
      <div className={`min-h-screen transition-all duration-500 bg-background text-foreground ancestra-theme ${
        persona.shouldUseGuardianAnimation() ? 'guardian-color-shift' : ''
      }`} style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
        <Homepage
          onStartChat={handleStartChat}
          onNavigate={navigation.handlePageNavigation}
          currentPage={navigation.currentPage}
          darkMode={theme.darkMode}
          onToggleDarkMode={() => theme.setDarkMode(!theme.darkMode)}
          theme={theme.theme}
          currentPersona={theme.themePersona}
          currentUser={auth.currentUser}
          onLogout={handleLogout}
          onSwitchAccount={handleSwitchAccount}
          onSettings={handleOpenSettings}
          personaTone={persona.personaTone}
          questManagement={questManagement}
        />
        
        {/* 🫧 Bubbly Settings Modal */}
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden" style={{ borderRadius: 'var(--radius-2xl)' }}>
              <SettingsModal
                currentPersona={persona.currentPersona}
                setCurrentPersona={persona.handlePersonaChange}
                darkMode={theme.darkMode}
                setDarkMode={theme.setDarkMode}
                highContrast={theme.highContrast}
                setHighContrast={theme.setHighContrast}
                largerText={theme.largerText}
                setLargerText={theme.setLargerText}
                language={navigation.language}
                setLanguage={navigation.setLanguage}
                personaTone={persona.personaTone}
                setPersonaTone={persona.setPersonaTone}
                voiceEnabled={voiceEnabled}
                setVoiceEnabled={setVoiceEnabled}
                theme={theme.theme}
              >
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center hover:scale-110 transition-all duration-300 bubble-float"
                  style={{
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    border: '2px solid var(--border)',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  ✕
                </button>
              </SettingsModal>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Chat Interface
  return (
    <div className={`min-h-screen transition-all duration-500 bg-background text-foreground ancestra-theme ${
      persona.shouldUseGuardianAnimation() ? 'guardian-color-shift' : ''
    }`} style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <ChatInterface
        currentPersona={persona.currentPersona}
        setCurrentPersona={persona.handlePersonaChange}
        darkMode={theme.darkMode}
        setDarkMode={theme.setDarkMode}
        highContrast={theme.highContrast}
        setHighContrast={theme.setHighContrast}
        largerText={theme.largerText}
        setLargerText={theme.setLargerText}
        language={navigation.language}
        setLanguage={navigation.setLanguage}
        personaTone={persona.personaTone}
        setPersonaTone={persona.setPersonaTone}
        personaMemory={persona.personaMemory}
        setPersonaMemory={persona.setPersonaMemory}
        theme={theme.theme}
        rotation={theme.rotation}
        userName={auth.userName}
        onNavigateToHomepage={navigation.handleNavigateToHomepage}
        onOpenDiscoveryHub={() => navigation.setIsDiscoveryHubOpen(true)}
        onOpenQuestDashboard={() => setIsQuestDashboardOpen(true)}
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        questManagement={questManagement}
      />
      
      {/* 🫧 Bubbly Discovery Hub Modal Overlay */}
      {navigation.isDiscoveryHubOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div 
            className="w-full max-w-7xl max-h-[95vh] overflow-y-auto shadow-2xl animate-scale-in bubble-float"
            style={{ 
              borderRadius: 'var(--radius-2xl)',
              backgroundColor: 'var(--background)',
              border: '3px solid var(--border)',
              boxShadow: '0 25px 50px rgba(239, 68, 68, 0.3)'
            }}
          >
            <DiscoveryHub
              onClose={() => navigation.setIsDiscoveryHubOpen(false)}
              persona={persona.currentPersona}
              theme={theme.theme}
            />
          </div>
        </div>
      )}

      {/* 🫧 Bubbly Quest Dashboard Modal Overlay */}
      {isQuestDashboardOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div 
            className="w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl animate-scale-in bubble-float"
            style={{ 
              borderRadius: 'var(--radius-2xl)',
              backgroundColor: 'var(--background)',
              border: '3px solid var(--border)',
              boxShadow: '0 25px 50px rgba(239, 68, 68, 0.3)'
            }}
          >
            <QuestDashboard
              isOpen={isQuestDashboardOpen}
              onClose={() => setIsQuestDashboardOpen(false)}
              activePersona={persona.currentPersona === 'Ancestra' ? 'ancestra' : 'guardian'}
              personality={persona.personaTone}
              theme={theme.theme}
              userName={auth.userName || 'Explorer'}
              questManagement={questManagement}
            />
          </div>
        </div>
      )}
    </div>
  );
}