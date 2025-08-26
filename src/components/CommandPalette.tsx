import { useState } from 'react';
import { Search } from 'lucide-react';
import { Theme } from '../utils/theming';

interface Command {
  name: string;
  action: () => void;
}

interface CommandPaletteProps {
  showCommandPalette: boolean;
  onClose: () => void;
  commands: Command[];
  theme: Theme;
}

export default function CommandPalette({ 
  showCommandPalette, 
  onClose, 
  commands, 
  theme 
}: CommandPaletteProps) {
  const [commandSearch, setCommandSearch] = useState('');

  if (!showCommandPalette) return null;

  const handleCommandSelect = (command: Command) => {
    command.action();
    onClose();
    setCommandSearch('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50">
      <div className="rounded-xl shadow-2xl w-96 max-w-md" style={{ backgroundColor: theme.cardBg, backdropFilter: 'blur(10px)' }}>
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="w-5 h-5" style={{ color: theme.text }} />
            <input
              type="text"
              placeholder="Search for commands..."
              value={commandSearch}
              onChange={(e) => setCommandSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none placeholder-gray-400"
              style={{ color: theme.text }}
              autoFocus
            />
          </div>
          <div className="space-y-1">
            {commands
              .filter(cmd => cmd.name.toLowerCase().includes(commandSearch.toLowerCase()))
              .map((cmd, index) => (
                <button
                  key={index}
                  onClick={() => handleCommandSelect(cmd)}
                  className="w-full text-left p-3 rounded-lg transition-colors hover:opacity-80"
                  style={{
                    color: theme.text,
                    backgroundColor: `${theme.primary}20`
                  }}
                >
                  {cmd.name}
                </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}