import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { LanguageSelectionModal } from '@/components/modals/LanguageSelectionModal';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { LocationInfo } from '@/components/dashboard/LocationInfo';
import { CropRecommendations } from '@/components/dashboard/CropRecommendations';
import { GovernmentSchemes } from '@/components/dashboard/GovernmentSchemes';
import { locationAPI } from '@/services/api';
import { Language, CropRecommendation } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  user: { email: string; name: string };
  onLogout: () => void;
}

// Available languages for the demo
const availableLanguages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'hi', name: 'Hindi' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' }
];

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [showLanguageModal, setShowLanguageModal] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<Language>({ code: 'en', name: 'English' });
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCropSelect = (crop: CropRecommendation) => {
    navigate('/crop-details', { state: { crop } });
  };

  const handleLanguageSelect = (language: Language) => {
    setCurrentLanguage(language);
    setShowLanguageModal(false);
    
    // After language selection, request location
    setTimeout(() => {
      requestLocation();
    }, 500);
  };

  const requestLocation = async () => {
    setIsLocationLoading(true);
    
    try {
      const position = await locationAPI.getCurrentPosition();
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      
      toast({
        title: "Location detected",
        description: "Weather data and recommendations will be personalized for your area",
      });
    } catch (error) {
      console.error('Location error:', error);
      toast({
        title: "Location access denied",
        description: "Using demo data for weather and recommendations",
        variant: "destructive",
      });
      
      // Set demo location (New York area for demo purposes)
      setLocation({
        latitude: 40.7128,
        longitude: -74.0060
      });
    } finally {
      setIsLocationLoading(false);
    }
  };

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    toast({
      title: "Language changed",
      description: `Interface switched to ${language.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Language Selection Modal */}
      <LanguageSelectionModal
        open={showLanguageModal}
        onSelect={handleLanguageSelect}
      />

      {/* Navbar */}
      <Navbar
        user={user}
        currentLanguage={currentLanguage}
        languages={availableLanguages}
        onLanguageChange={handleLanguageChange}
        onLogout={onLogout}
      />

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening on your farm today
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Weather & Location */}
          <div className="space-y-6">
            <LocationInfo
              location={location}
              onRequestLocation={requestLocation}
              isLoading={isLocationLoading}
            />
            <WeatherWidget location={location} />
          </div>

          {/* Right Column - Crop Recommendations */}
          <div>
            <CropRecommendations onSelectCrop={handleCropSelect} />
          </div>
        </div>

        {/* Government Schemes Section */}
        <div className="mt-8">
          <GovernmentSchemes />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            AI Crop Planner - Smart Farming Solutions © 2024
          </p>
        </footer>
      </main>
    </div>
  );
};