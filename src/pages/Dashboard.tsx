import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { LanguageSelectionModal } from "@/components/modals/LanguageSelectionModal";
// import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { LocationInfo } from "@/components/dashboard/LocationInfo";
import { CropRecommendations } from "@/components/dashboard/CropRecommendations";
import { GovernmentSchemes } from "@/components/dashboard/GovernmentSchemes";
import { WeatherTrendsChart } from "@/components/dashboard/WeatherTrendsChart";
import { Chatbot } from "@/components/dashboard/Chatbot";
import { locationAPI, weatherAPI, soilAPI, modelAPI } from "@/services/api";
import { Language, CropRecommendation } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { TranslatedText } from "@/components/i18n/TranslatedText";
import { useNavigate } from "react-router-dom";

interface DashboardProps {
  user: { email: string; name: string };
  onLogout: () => void;
}

// Available languages - only English and Hindi supported
const availableLanguages: Language[] = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
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
  const [isRecoLoading, setIsRecoLoading] = useState(false);
  const [predictedCrop, setPredictedCrop] = useState<string | null>(null);
  const [top3, setTop3] = useState<Array<{ name: string; score: number }> | null>(null);
  const [pricePredictions, setPricePredictions] = useState<Array<{
    crop_name: string;
    predicted_price_90d: number;
    current_price: number;
    price_change: number;
    price_change_percent: number;
    harvest_month: string;
  }> | null>(null);
  const [modelInputs, setModelInputs] = useState<{
    soilData: { N: number; ph: number } | null;
    weatherData: { temperature: number; humidity: number; rainfall: number } | null;
  }>({ soilData: null, weatherData: null });
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
      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setLocation(locationData);
      
      // Save location to localStorage for persistence
      localStorage.setItem('user-location', JSON.stringify(locationData));

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
      const demoLocation = {
        latitude: 40.7128,
        longitude: -74.006,
      };
      setLocation(demoLocation);
      localStorage.setItem('user-location', JSON.stringify(demoLocation));
    } finally {
      setIsLocationLoading(false);
    }
  };

  // Fetch soil + weather + call model when location becomes available
  useEffect(() => {
    const fetchAndPredict = async () => {
      if (!location) return;
      setIsRecoLoading(true);
      setPredictedCrop(null);
      setTop3(null);
      setPricePredictions(null);
      setModelInputs({ soilData: null, weatherData: null });
      try {
        // SoilGrids: N and pH
        const soil = await soilAPI.getTopsoilNandPH(location.latitude, location.longitude);

        // OpenWeather: temperature, humidity, 10-day average rainfall
        const weather = await weatherAPI.getCurrentWeather(location.latitude, location.longitude);
        const temperature = weather?.main?.temp ?? 0;
        const humidity = weather?.main?.humidity ?? 0;
        const rainfall = await weatherAPI.getAverageRainfall(location.latitude, location.longitude);

        const { N, ph } = soil;
        
        // Store model inputs for display
        setModelInputs({
          soilData: { N, ph },
          weatherData: { temperature, humidity, rainfall }
        });

        const resTop = await modelAPI.predictTop3({ N, ph, temperature, humidity, rainfall });
        setTop3(resTop.top3);
        if (resTop.top3?.[0]?.name) setPredictedCrop(resTop.top3[0].name);

        // Get price predictions for the top 3 crops
        if (resTop.top3 && resTop.top3.length > 0) {
          const cropNames = resTop.top3.map(crop => crop.name);
          const priceRes = await modelAPI.predictPrices(cropNames, location.latitude, location.longitude);
          setPricePredictions(priceRes.price_predictions);
        }
      } catch (err) {
        console.error('Recommendation pipeline error:', err);
        toast({ title: 'Recommendation failed', description: 'Could not fetch data or predict crop', variant: 'destructive' });
      } finally {
        setIsRecoLoading(false);
      }
    };

    fetchAndPredict();
  }, [location]);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setLanguage(language.code);
    toast({
      title: "Language changed",
      description: `Interface switched to ${language.name}`,
    });
  };

  useEffect(() => {
    // Load saved location from localStorage
    const savedLocation = localStorage.getItem('user-location');
    if (savedLocation) {
      try {
        const locationData = JSON.parse(savedLocation);
        setLocation(locationData);
      } catch (error) {
        console.error('Error parsing saved location:', error);
        localStorage.removeItem('user-location');
      }
    }

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
          <div className="space-y-6 w-full">
            <LocationInfo
              location={location}
              onRequestLocation={requestLocation}
              isLoading={isLocationLoading}
              onSetLocation={(coords) => {
                setLocation(coords);
                localStorage.setItem('user-location', JSON.stringify(coords));
              }}
            />
            {/* Weather chart */}
            <WeatherTrendsChart />
          </div>

          {/* Right Column - Crop Recommendations */}
          <div className="space-y-8 w-full">
            <CropRecommendations 
              onSelectCrop={handleCropSelect} 
              predictedCrop={predictedCrop} 
              loading={isRecoLoading} 
              top3={top3} 
              pricePredictions={pricePredictions}
            />
            {/* Chatbot below recommendations */}
            <Chatbot />
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
