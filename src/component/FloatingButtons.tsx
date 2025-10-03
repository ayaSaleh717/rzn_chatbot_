import { Home, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

export const FloatingButtons = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      <Button
        size="icon"
        onClick={() => navigate('/')}
        className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 glow-effect animate-pulse-glow"
      >
        <Home className="w-5 h-5" />
      </Button>
      <Button
        size="icon"
        onClick={toggleTheme}
        className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 glow-effect animate-pulse-glow"
      >
        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </Button>
    </div>
  );
};
