import { Globe } from 'lucide-react';
import { Theme } from '../utils/theming';

interface LanguageStatusIndicatorProps {
  language: string;
  theme: Theme;
  personaTone: string;
}

export default function LanguageStatusIndicator({ 
  language, 
  theme, 
  personaTone 
}: LanguageStatusIndicatorProps) {
  // Map language names to their common abbreviations
  const languageAbbrev = {
    'English': 'EN',
    'Spanish': 'ES', 
    'French': 'FR',
    'German': 'DE',
    'Japanese': 'JA'
  };

  const abbrev = languageAbbrev[language as keyof typeof languageAbbrev] || language.substring(0, 2).toUpperCase();

  return (
    <div 
      className="rounded-xl p-3 border"
      style={{
        backgroundColor: theme.cardBg || theme.bg,
        borderColor: theme.borderColor || theme.primary
      }}
    >
      <div className="space-y-2">
        {/* Language Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium" style={{ color: theme.text }}>
            Language
          </span>
          <div 
            className="px-2 py-1 text-xs rounded-md flex items-center gap-1"
            style={{
              backgroundColor: language !== 'English' ? theme.primary : `${theme.secondary}80`,
              color: language !== 'English' ? 'white' : theme.text
            }}
          >
            <Globe className="w-3 h-3" />
            {abbrev}
          </div>
        </div>

        {/* Persona Tone Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium" style={{ color: theme.text }}>
            Tone
          </span>
          <div 
            className="px-2 py-1 text-xs rounded-md"
            style={{
              backgroundColor: `${theme.secondary}80`,
              color: theme.text
            }}
          >
            {personaTone === 'Auto-Detect' ? 'Auto' : (personaTone || 'Auto').replace('The ', '')}
          </div>
        </div>

        {/* Translation Status */}
        {language !== 'English' && (
          <div className="text-xs" style={{ color: theme.text, opacity: 0.7 }}>
            🌐 Translation active for {language}
          </div>
        )}
      </div>
    </div>
  );
}