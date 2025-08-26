import { useState, useEffect } from "react";
import { getTheme } from "../utils/theming";

export function useThemeAndAnimation(currentPersona: string, shouldUseGuardianAnimation: boolean) {
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largerText, setLargerText] = useState(false);
  const [guardianColorPhase, setGuardianColorPhase] = useState(0);
  const [rotation, setRotation] = useState(0);

  // Fix theme function call - only pass main personas to getTheme
  const isMainPersona = currentPersona === 'Ancestra' || currentPersona === 'The Guardian';
  const themePersona = isMainPersona ? currentPersona as ('Ancestra' | 'The Guardian') : 'Ancestra';
  const theme = getTheme(themePersona, darkMode, guardianColorPhase, highContrast, largerText);

  // Apply persona-specific theme classes to body
  useEffect(() => {
    const body = document.body;
    
    // Remove all theme classes
    body.classList.remove('ancestra-theme', 'guardian-theme');
    
    // Add persona-specific theme class for main personas (both light and dark)
    if (currentPersona === 'Ancestra') {
      body.classList.add('ancestra-theme');
    } else if (currentPersona === 'The Guardian') {
      body.classList.add('guardian-theme');
    }
    
    // Apply dark mode
    if (darkMode) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
    
    // Apply accessibility settings
    if (highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }
    
    if (largerText) {
      body.classList.add('larger-text');
    } else {
      body.classList.remove('larger-text');
    }
  }, [darkMode, currentPersona, highContrast, largerText]);

  // Animation effects
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Guardian color animation - runs for Guardian persona in both light and dark mode
  useEffect(() => {
    if (currentPersona === 'The Guardian') {
      const interval = setInterval(() => {
        setGuardianColorPhase(prev => (prev + 1) % 200);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [currentPersona]);

  // Speech synthesis cleanup
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    darkMode,
    setDarkMode,
    highContrast,
    setHighContrast,
    largerText,
    setLargerText,
    guardianColorPhase,
    rotation,
    theme,
    themePersona
  };
}