// Enhanced persona color schemes with comprehensive theming
const PERSONA_THEMES = {
  'Ancestra': {
    light: {
      primary: '#e67e22',
      secondary: '#f39c12',
      background: '#fdf8f3',
      text: '#2c3e50',
      accent: '#d35400',
      surface: '#fff5eb',
      border: '#fdeaa7'
    },
    dark: {
      primary: '#2D5016',
      secondary: '#8B4513', 
      background: '#0D1B17',
      text: '#E8F5E8',
      accent: '#CD853F',
      surface: 'rgba(45, 80, 22, 0.25)',
      border: '#556B2F'
    }
  },

  'The Guardian': {
    light: {
      primary: '#3498db',
      secondary: '#2980b9',
      background: '#f8f9fb',
      text: '#2c3e50',
      accent: '#1abc9c',
      surface: '#e8f4f8',
      border: '#bdc3c7'
    },
    dark: {
      primary: '#2563eb',
      secondary: '#64748b',
      background: '#0A0E1A',
      text: '#F1F5F9',
      accent: '#94A3B8',
      surface: 'rgba(37, 99, 235, 0.15)',
      border: '#2563eb'
    }
  },

  'The Infant': {
    light: {
      primary: '#f39c12',
      secondary: '#ffeaa7',
      background: '#fffbf5',
      text: '#2c3e50',
      accent: '#e17055',
      surface: '#fff3e0',
      border: '#fce4b6'
    },
    dark: {
      primary: '#ffb74d',
      secondary: '#ff8a65',
      background: '#1a1611',
      text: '#fff3e0',
      accent: '#ffab40',
      surface: 'rgba(255, 183, 77, 0.1)',
      border: '#ff8a65'
    }
  },

  'The Teen': {
    light: {
      primary: '#9b59b6',
      secondary: '#e84393',
      background: '#fdf7ff',
      text: '#2c3e50',
      accent: '#fd79a8',
      surface: '#f8e7ff',
      border: '#dda0dd'
    },
    dark: {
      primary: '#ab47bc',
      secondary: '#e91e63',
      background: '#1a0d1a',
      text: '#f8e7ff',
      accent: '#ce93d8',
      surface: 'rgba(171, 71, 188, 0.15)',
      border: '#ab47bc'
    }
  },

  'The Scholar': {
    light: {
      primary: '#34495e',
      secondary: '#7f8c8d',
      background: '#f8f9fa',
      text: '#2c3e50',
      accent: '#95a5a6',
      surface: '#ecf0f1',
      border: '#bdc3c7'
    },
    dark: {
      primary: '#607d8b',
      secondary: '#546e7a',
      background: '#0f1419',
      text: '#eceff1',
      accent: '#78909c',
      surface: 'rgba(96, 125, 139, 0.1)',
      border: '#546e7a'
    }
  },

  'The Dialect': {
    light: {
      primary: '#27ae60',
      secondary: '#2ecc71',
      background: '#f8fff8',
      text: '#2c3e50',
      accent: '#00b894',
      surface: '#e8f8f5',
      border: '#a7d7c5'
    },
    dark: {
      primary: '#4caf50',
      secondary: '#66bb6a',
      background: '#0d1f0d',
      text: '#e8f5e8',
      accent: '#81c784',
      surface: 'rgba(76, 175, 80, 0.15)',
      border: '#4caf50'
    }
  },

  'The Gen Z Vibe': {
    light: {
      primary: '#e91e63',
      secondary: '#ff6b9d',
      background: '#fff5f8',
      text: '#2c3e50',
      accent: '#ff4757',
      surface: '#ffe0e6',
      border: '#ffb3d1'
    },
    dark: {
      primary: '#e91e63',
      secondary: '#ad1457',
      background: '#1a0a10',
      text: '#fce4ec',
      accent: '#f48fb1',
      surface: 'rgba(233, 30, 99, 0.15)',
      border: '#e91e63'
    }
  },

  'The Confidant': {
    light: {
      primary: '#95a5a6',
      secondary: '#bdc3c7',
      background: '#fafafa',
      text: '#2c3e50',
      accent: '#74b9ff',
      surface: '#f1f2f6',
      border: '#ddd'
    },
    dark: {
      primary: '#90a4ae',
      secondary: '#78909c',
      background: '#131518',
      text: '#eceff1',
      accent: '#81c784',
      surface: 'rgba(144, 164, 174, 0.1)',
      border: '#546e7a'
    }
  }
};

// Enhanced animation themes for personas
const PERSONA_ANIMATIONS = {
  'The Infant': {
    gentle: 'animate-float',
    transition: 'transition-all duration-500 ease-in-out',
    hover: 'hover:scale-105',
    colors: {
      warm: '#ffeaa7',
      soft: '#fab1a0'
    }
  },

  'The Teen': {
    energetic: 'animate-bounce-gentle', 
    transition: 'transition-all duration-300 ease-out',
    hover: 'hover:scale-110 hover:rotate-1',
    colors: {
      vibrant: '#fd79a8',
      electric: '#a29bfe'
    }
  },

  'The Scholar': {
    measured: 'animate-fade-in',
    transition: 'transition-all duration-700 ease-in-out',
    hover: 'hover:shadow-lg',
    colors: {
      academic: '#636e72',
      distinguished: '#2d3436'
    }
  },

  'The Dialect': {
    flowing: 'wave-animation',
    transition: 'transition-all duration-600 ease-in-out',
    hover: 'hover-lift',
    colors: {
      island: '#00b894',
      tropical: '#00cec9'
    }
  },

  'The Gen Z Vibe': {
    trendy: 'animate-pulse-slow',
    transition: 'transition-all duration-200 ease-out',
    hover: 'hover:scale-105 hover:shadow-neon',
    colors: {
      neon: '#fd79a8',
      electric: '#6c5ce7'
    }
  },

  'The Confidant': {
    serene: 'animate-float-delayed',
    transition: 'transition-all duration-800 ease-in-out',
    hover: 'hover:opacity-80',
    colors: {
      calm: '#74b9ff',
      peaceful: '#81ecec'
    }
  },

  'The Guardian': {
    protective: 'guardian-color-shift',
    transition: 'transition-all duration-400 ease-in-out', 
    hover: 'hover-glow',
    colors: {
      alert: '#e17055',
      secure: '#00b894'
    }
  },

  'Ancestra': {
    heritage: 'animate-fade-in',
    transition: 'transition-all duration-500 ease-in-out',
    hover: 'hover-lift',
    colors: {
      heritage: '#e17055',
      cultural: '#fdcb6e'
    }
  }
};

// Enhanced mood-responsive color shifting
const MOOD_COLORS = {
  crisis: {
    background: '#fff5f5',
    primary: '#dc2626',
    accent: '#fca5a5',
    text: '#7f1d1d'
  },
  energetic: {
    background: '#fef3c7', 
    primary: '#f59e0b',
    accent: '#fcd34d',
    text: '#78350f'
  },
  peaceful: {
    background: '#f0f9ff',
    primary: '#0ea5e9',
    accent: '#7dd3fc',
    text: '#0c4a6e'
  },
  academic: {
    background: '#f8fafc',
    primary: '#475569',
    accent: '#cbd5e1',
    text: '#1e293b'
  },
  social: {
    background: '#fdf4ff',
    primary: '#c026d3',
    accent: '#e879f9',
    text: '#86198f'
  },
  local: {
    background: '#f0fdf4',
    primary: '#16a34a',
    accent: '#86efac',
    text: '#14532d'
  }
};

// Enhanced theme generation function for personas
export function getPersonaTheme(persona: keyof typeof PERSONA_THEMES, isDark: boolean, colorPhase?: number) {
  const personaTheme = PERSONA_THEMES[persona] || PERSONA_THEMES['Ancestra'];
  const theme = isDark ? personaTheme.dark : personaTheme.light;
  const animation = PERSONA_ANIMATIONS[persona];

  // Apply dynamic color shifting for Guardian
  if (persona === 'The Guardian' && colorPhase !== undefined) {
    const shift = Math.sin(colorPhase * 0.1) * 20;
    return {
      ...theme,
      primary: adjustHue(theme.primary, shift),
      accent: adjustHue(theme.accent, shift),
      animation: animation || PERSONA_ANIMATIONS['Ancestra']
    };
  }

  return {
    ...theme,
    animation: animation || PERSONA_ANIMATIONS['Ancestra']
  };
}

// Enhanced persona-specific UI preferences
export function getPersonaUIPreferences(personaId: string) {
  const preferences = {
    'The Infant': {
      buttonSize: 'large',
      borderRadius: 'rounded-full',
      iconSize: '2xl',
      spacing: 'loose',
      fontFamily: 'sans-serif',
      colorScheme: 'warm',
      animations: 'gentle'
    },
    
    'The Teen': {
      buttonSize: 'medium', 
      borderRadius: 'rounded-lg',
      iconSize: 'xl',
      spacing: 'normal',
      fontFamily: 'sans-serif',
      colorScheme: 'vibrant',
      animations: 'energetic'
    },

    'The Scholar': {
      buttonSize: 'medium',
      borderRadius: 'rounded-md', 
      iconSize: 'lg',
      spacing: 'tight',
      fontFamily: 'serif',
      colorScheme: 'neutral',
      animations: 'measured'
    },

    'The Dialect': {
      buttonSize: 'medium',
      borderRadius: 'rounded-xl',
      iconSize: 'lg', 
      spacing: 'normal',
      fontFamily: 'sans-serif',
      colorScheme: 'natural',
      animations: 'flowing'
    },

    'The Gen Z Vibe': {
      buttonSize: 'small',
      borderRadius: 'rounded-2xl',
      iconSize: 'md',
      spacing: 'tight',
      fontFamily: 'modern',
      colorScheme: 'neon',
      animations: 'trendy'
    },

    'The Confidant': {
      buttonSize: 'medium',
      borderRadius: 'rounded-lg',
      iconSize: 'lg',
      spacing: 'loose',
      fontFamily: 'serif',
      colorScheme: 'muted', 
      animations: 'serene'
    }
  };

  return preferences[personaId as keyof typeof preferences] || preferences['The Infant'];
}

// Media usage preferences for each persona
export function getPersonaMediaPreferences(personaId: string) {
  const mediaPrefs = {
    'The Infant': {
      imageStyle: 'soft-rounded',
      preferredMedia: ['illustrations', 'family-photos'],
      avoidMedia: ['GIFs', 'animations'],
      colorFilter: 'warm',
      brightness: 'high'
    },

    'The Teen': {
      imageStyle: 'modern-rounded',
      preferredMedia: ['photos', 'GIFs', 'videos'],
      avoidMedia: [],
      colorFilter: 'vibrant',
      brightness: 'high'
    },

    'The Scholar': {
      imageStyle: 'classic-square',
      preferredMedia: ['historical-photos', 'diagrams', 'maps'],
      avoidMedia: ['memes', 'casual-photos'],
      colorFilter: 'neutral',
      brightness: 'standard'
    },

    'The Dialect': {
      imageStyle: 'natural-rounded',
      preferredMedia: ['authentic-photos', 'cultural-images'],
      avoidMedia: ['stock-photos', 'staged-images'],
      colorFilter: 'natural',
      brightness: 'standard'
    },

    'The Gen Z Vibe': {
      imageStyle: 'trendy-rounded',
      preferredMedia: ['memes', 'GIFs', 'videos', 'AR-filters'],
      avoidMedia: [],
      colorFilter: 'saturated',
      brightness: 'high'
    },

    'The Confidant': {
      imageStyle: 'soft-rounded',
      preferredMedia: ['atmospheric-photos', 'nature-images'],
      avoidMedia: ['busy-images', 'loud-media'],
      colorFilter: 'soft',
      brightness: 'low'
    }
  };

  return mediaPrefs[personaId as keyof typeof mediaPrefs] || mediaPrefs['The Infant'];
}

// Utility function to adjust hue for dynamic color shifting
function adjustHue(color: string, shift: number): string {
  // Simple hue adjustment - in production would use proper color manipulation
  return color; // Placeholder - would implement actual hue shifting
}

// Generate persona-specific CSS classes
export function generatePersonaStyles(personaId: string, isDark: boolean = false) {
  const theme = getPersonaTheme(personaId as keyof typeof PERSONA_THEMES, isDark);
  const uiPrefs = getPersonaUIPreferences(personaId);
  const mediaPrefs = getPersonaMediaPreferences(personaId);

  return {
    container: `${theme.animation.transition} bg-[${theme.background}] text-[${theme.text}]`,
    button: `${uiPrefs.borderRadius} ${uiPrefs.buttonSize === 'large' ? 'px-8 py-4' : 'px-6 py-3'} bg-[${theme.primary}] text-white ${theme.animation.hover}`,
    card: `${uiPrefs.borderRadius} bg-[${theme.surface}] border border-[${theme.border}] ${theme.animation.transition}`,
    text: `font-${uiPrefs.fontFamily} text-[${theme.text}]`,
    accent: `text-[${theme.accent}]`,
    animation: theme.animation
  };
}

// Dynamic theme switching based on context
export function getContextualTheme(personaId: string, context: string, isDark: boolean = false) {
  const baseTheme = getPersonaTheme(personaId as keyof typeof PERSONA_THEMES, isDark);
  const moodColors = MOOD_COLORS[context as keyof typeof MOOD_COLORS];

  if (moodColors) {
    return {
      ...baseTheme,
      background: moodColors.background,
      primary: moodColors.primary,
      accent: moodColors.accent,
      text: moodColors.text
    };
  }

  return baseTheme;
}

export interface Theme {
  bg: string;
  bgGradient: string;
  primary: string;
  secondary: string;
  text: string;
  cardBg: string;
  borderColor: string;
  isDynamic?: boolean;
  animationColors?: {
    primary1: string;
    primary2: string;
    secondary1: string;
    secondary2: string;
  };
  // Accessibility enhancements
  isHighContrast?: boolean;
  isLargerText?: boolean;
}

export function getTheme(
  currentPersona: 'Ancestra' | 'The Guardian',
  darkMode: boolean,
  guardianColorPhase: number,
  highContrast: boolean = false,
  largerText: boolean = false
): Theme {
  const themes = {
    'Ancestra_light': {
      bg: '#fffbeb', // Sand background
      bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fde68a 25%, #fca5a5 50%, #7dd3fc 75%, #0ea5e9 100%)', // Sand to coral to ocean
      primary: '#dc2626', // Coral red
      secondary: '#0ea5e9', // Ocean blue
      text: '#451a03', // Deep brown
      cardBg: 'rgba(220, 38, 38, 0.25)', // Darker coral tint
      borderColor: 'rgba(220, 38, 38, 0.4)' // Darker coral border
    },
    // 🌺 BEACHY THEME for Ancestra Dark Mode
    'Ancestra_dark': {
      bg: '#0a0f1a', // Deep ocean night
      bgGradient: 'linear-gradient(135deg, #0a0f1a 0%, #1e293b 25%, #374151 50%, #f87171 75%, #fcd34d 100%)', // Night ocean to coral to sand
      primary: '#f87171', // Light coral
      secondary: '#7dd3fc', // Light ocean blue
      text: '#fef7f7', // Coral white
      cardBg: 'rgba(248, 113, 113, 0.35)', // Darker coral tint
      borderColor: 'rgba(248, 113, 113, 0.5)', // Darker coral border
      accent: '#fcd34d', // Sand accent
      beachyAccent: '#ec4899', // Pink accent
      oceanAccent: '#0ea5e9' // Ocean accent
    },
    // 🚔 GUARDIAN LIGHT MODE with Police Colors & Moving Animation
    'Guardian_light': {
      bg: '#F0F4F8',
      bgGradient: 'linear-gradient(135deg, #F0F4F8 0%, #E1E8ED 30%, #D6E3F0 60%, #B8CCE0 100%)',
      primary: '#1E40AF', // Police Navy Blue
      secondary: '#3B82F6', // Police Light Blue
      text: '#1F2937', // Dark Gray
      cardBg: 'rgba(30, 64, 175, 0.15)', // Navy blue tint
      borderColor: '#1E40AF',
      isDynamic: true,
      animationColors: {
        primary1: '#1E40AF', // Police Navy Blue
        primary2: '#2563EB', // Royal Blue
        secondary1: '#3B82F6', // Police Light Blue
        secondary2: '#60A5FA'  // Sky Blue
      }
    },
    // 🚔 GUARDIAN DARK MODE with Police/Tactical Colors & Moving Animation
    'Guardian_dark': {
      bg: '#0A0E1A', // Almost black tactical
      bgGradient: 'linear-gradient(135deg, #0A0E1A 0%, #1E293B 30%, #334155 60%, #475569 100%)', // Tactical gradient
      primary: '#2563EB', // Police Royal Blue
      secondary: '#64748B', // Tactical Gray
      text: '#F1F5F9', // Clean white
      cardBg: 'rgba(37, 99, 235, 0.15)', // Royal blue tint
      borderColor: '#2563EB',
      accent: '#94A3B8', // Silver accent
      tacticalAccent: '#1D4ED8', // Deep Police Blue
      isDynamic: true,
      animationColors: {
        primary1: '#2563EB', // Police Royal Blue
        primary2: '#1D4ED8', // Deep Police Blue
        secondary1: '#64748B', // Tactical Gray
        secondary2: '#94A3B8'  // Silver
      }
    }
  };

  const personaName = currentPersona.replace('The ', '');
  const themeKey = `${personaName}_${darkMode ? 'dark' : 'light'}` as keyof typeof themes;
  const baseTheme = themes[themeKey] || themes['Ancestra_light'];

  // Apply dynamic color animation for Guardian (both light and dark)
  if (currentPersona === 'The Guardian' && baseTheme.isDynamic) {
    const phase = Math.sin(guardianColorPhase * 0.025); // Smooth, slower animation
    const mixRatio = (phase + 1) / 2; // Convert from [-1,1] to [0,1]

    const interpolateColor = (color1: string, color2: string, ratio: number) => {
      const hex1 = color1.replace('#', '');
      const hex2 = color2.replace('#', '');

      const r1 = parseInt(hex1.substr(0, 2), 16);
      const g1 = parseInt(hex1.substr(2, 2), 16);
      const b1 = parseInt(hex1.substr(4, 2), 16);

      const r2 = parseInt(hex2.substr(0, 2), 16);
      const g2 = parseInt(hex2.substr(2, 2), 16);
      const b2 = parseInt(hex2.substr(4, 2), 16);

      const r = Math.round(r1 + (r2 - r1) * ratio);
      const g = Math.round(g1 + (g2 - g1) * ratio);
      const b = Math.round(b1 + (b2 - b1) * ratio);

      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    // Create animated gradient background for police theme
    const animatedBgGradient = darkMode 
      ? `linear-gradient(135deg, #0A0E1A 0%, ${interpolateColor('#1E293B', '#334155', mixRatio)} 30%, ${interpolateColor('#334155', '#475569', mixRatio)} 60%, ${interpolateColor('#475569', '#64748B', mixRatio)} 100%)`
      : `linear-gradient(135deg, #F0F4F8 0%, ${interpolateColor('#E1E8ED', '#D6E3F0', mixRatio)} 30%, ${interpolateColor('#D6E3F0', '#B8CCE0', mixRatio)} 60%, ${interpolateColor('#B8CCE0', '#93C5FD', mixRatio)} 100%)`;

    return {
      ...baseTheme,
      bgGradient: animatedBgGradient,
      primary: interpolateColor(baseTheme.animationColors!.primary1, baseTheme.animationColors!.primary2, mixRatio),
      secondary: interpolateColor(baseTheme.animationColors!.secondary1, baseTheme.animationColors!.secondary2, mixRatio),
      borderColor: interpolateColor(baseTheme.animationColors!.primary1, baseTheme.animationColors!.primary2, mixRatio),
      cardBg: `rgba(${parseInt(interpolateColor(baseTheme.animationColors!.primary1, baseTheme.animationColors!.primary2, mixRatio).substr(1, 2), 16)}, ${parseInt(interpolateColor(baseTheme.animationColors!.primary1, baseTheme.animationColors!.primary2, mixRatio).substr(3, 2), 16)}, ${parseInt(interpolateColor(baseTheme.animationColors!.primary1, baseTheme.animationColors!.primary2, mixRatio).substr(5, 2), 16)}, 0.15)`,
      isHighContrast: highContrast,
      isLargerText: largerText
    };
  }

  return {
    ...baseTheme,
    isHighContrast: highContrast,
    isLargerText: largerText
  };
}