import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Leaf, Languages, LogOut, User, Menu } from 'lucide-react';
import { Language } from '@/types';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import logo from '@/assets/logo.jpeg';

interface NavbarProps {
  user: { email: string; name: string };
  currentLanguage: Language;
  languages: Language[];
  onLanguageChange: (language: Language) => void;
  onLogout: () => void;
}

export const Navbar = ({ 
  user, 
  currentLanguage, 
  languages, 
  onLanguageChange, 
  onLogout 
}: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLanguageSelect = (value: string) => {
    const language = languages.find(lang => lang.code === value);
    if (language) {
      onLanguageChange(language);
    }
  };

  return (
    <nav className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-50 shadow-[var(--shadow-soft)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src={logo} 
              alt="AI Crop Planner Logo" 
              className="h-10 w-10 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">AI Crop Planner</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Smart Farming Solutions</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <Select value={currentLanguage.code} onValueChange={handleLanguageSelect}>
                <SelectTrigger className="w-32 h-8 text-sm">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <div className="flex items-center space-x-2">
                        <span>{language.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {language.code.toUpperCase()}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline ml-1">Logout</span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-4">
            <div className="flex items-center space-x-3 px-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-2 px-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Theme</span>
                <ThemeToggle />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Language</span>
                <Select value={currentLanguage.code} onValueChange={handleLanguageSelect}>
                  <SelectTrigger className="w-32 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="w-full justify-start text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};