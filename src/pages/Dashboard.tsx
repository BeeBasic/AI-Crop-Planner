import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { LanguageSelectionModal } from "@/components/modals/LanguageSelectionModal";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { LocationInfo } from "@/components/dashboard/LocationInfo";
import { CropRecommendations } from "@/components/dashboard/CropRecommendations";
import { GovernmentSchemes } from "@/components/dashboard/GovernmentSchemes";
import { WeatherTrendsChart } from "@/components/dashboard/WeatherTrendsChart";
import { locationAPI } from "@/services/api";
import { Language, CropRecommendation } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { TranslatedText } from "@/components/i18n/TranslatedText";
import { useNavigate } from "react-router-dom";

interface DashboardProps {
  user: { email: string; name: string };
  onLogout: () => void;
}

// Available languages for the demo
const availableLanguages: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "hi", name: "Hindi" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
];

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const { language, setLanguage, translate } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>({
    code: language,
    name:
      availableLanguages.find((l) => l.code === language)?.name || "English",
  });
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCropSelect = (crop: CropRecommendation) => {
    navigate("/crop-details", { state: { crop } });
  };

  const handleLanguageSelect = (language: Language) => {
    setCurrentLanguage(language);
    setLanguage(language.code);
    sessionStorage.setItem("language-selected-this-login", "1");
    setShowLanguageModal(false);
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
        longitude: position.coords.longitude,
      });

      toast({
        title: "Location detected",
        description:
          "Weather data and recommendations will be personalized for your area",
      });
    } catch (error) {
      console.error("Location error:", error);
      toast({
        title: "Location access denied",
        description: "Using demo data for weather and recommendations",
        variant: "destructive",
      });

      // Set demo location (New York area for demo purposes)
      setLocation({
        latitude: 40.7128,
        longitude: -74.006,
      });
    } finally {
      setIsLocationLoading(false);
    }
  };

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setLanguage(language.code);
    toast({
      title: "Language changed",
      description: `Interface switched to ${language.name}`,
    });
  };

  useEffect(() => {
    // Show language modal only once per login session
    const alreadySelected = sessionStorage.getItem(
      "language-selected-this-login"
    );
    if (!alreadySelected) {
      setShowLanguageModal(true);
    }
  }, []);

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
            {user.name}, <TranslatedText>Welcome back</TranslatedText>!
          </h1>
          <p className="text-muted-foreground">
            <TranslatedText>
              Here&apos;s what&apos;s happening on your farm today
            </TranslatedText>
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
            {/* Fill leftover space on wide screens */}
            <WeatherTrendsChart />
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
