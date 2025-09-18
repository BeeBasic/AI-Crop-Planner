import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  Sun,
  CloudRain,
  Gauge,
  Leaf,
  Eye,
  EyeOff,
  RefreshCw,
  MapPin,
  Activity,
} from "lucide-react";
import { weatherAPI, soilAPI } from "@/services/api";
import { WeatherData } from "@/types";
import { TranslatedText } from "@/components/i18n/TranslatedText";

interface WeatherSoilInfoDialogProps {
  location: { latitude: number; longitude: number } | null;
}

interface SoilData {
  N: number;
  ph: number;
}

export const WeatherSoilInfoDialog = ({
  location,
}: WeatherSoilInfoDialogProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (location) {
      fetchAllData();
    }
  }, [location]);

  const fetchAllData = async () => {
    if (!location) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch weather and soil data in parallel
      const [weatherData, soilDataResult] = await Promise.all([
        weatherAPI.getCurrentWeather(location.latitude, location.longitude),
        soilAPI.getTopsoilNandPH(location.latitude, location.longitude),
      ]);

      setWeather(weatherData);
      setSoilData(soilDataResult);
    } catch (error) {
      setError("Failed to fetch environmental data");
      console.error("Data fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="h-6 w-6 text-warning" />;
      case "clouds":
        return <Cloud className="h-6 w-6 text-muted-foreground" />;
      case "rain":
        return <CloudRain className="h-6 w-6 text-accent-foreground" />;
      default:
        return <Cloud className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getWeatherConditionBadge = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return (
          <Badge className="bg-warning/20 text-warning-foreground hover:bg-warning/30">
            Clear
          </Badge>
        );
      case "clouds":
        return <Badge variant="secondary">Cloudy</Badge>;
      case "rain":
        return (
          <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">
            Rainy
          </Badge>
        );
      default:
        return <Badge variant="outline">{condition}</Badge>;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!location) {
    return (
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>
              <TranslatedText>Environmental Data</TranslatedText>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              <TranslatedText>
                Location required to fetch environmental data
              </TranslatedText>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>
              <TranslatedText>Environmental Data</TranslatedText>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchAllData}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">
              <TranslatedText>Loading environmental data...</TranslatedText>
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          <>
            {/* Weather Information */}
            {weather && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Cloud className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium text-foreground">
                    <TranslatedText>Weather Information</TranslatedText>
                  </h4>
                  <Badge variant="outline">OpenWeather</Badge>
                </div>

                {/* Main Weather Display */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-4">
                    {getWeatherIcon(weather.weather[0].main)}
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {Math.round(weather.main.temp)}°C
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {weather.weather[0].description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {weather.name}, {weather.sys.country}
                      </p>
                    </div>
                  </div>
                  {getWeatherConditionBadge(weather.weather[0].main)}
                </div>

                {/* Detailed Weather Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                    <Droplets className="h-4 w-4 text-accent-foreground" />
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        <TranslatedText>Humidity</TranslatedText>
                      </p>
                      <p className="text-sm font-mono text-muted-foreground">
                        {weather.main.humidity}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                    <Wind className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        <TranslatedText>Wind Speed</TranslatedText>
                      </p>
                      <p className="text-sm font-mono text-muted-foreground">
                        {weather.wind.speed} m/s
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                    <Thermometer className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        <TranslatedText>Feels Like</TranslatedText>
                      </p>
                      <p className="text-sm font-mono text-muted-foreground">
                        {Math.round(weather.main.feels_like)}°C
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                    <Gauge className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        <TranslatedText>Pressure</TranslatedText>
                      </p>
                      <p className="text-sm font-mono text-muted-foreground">
                        {weather.main.pressure} hPa
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Weather Details (when expanded) */}
                {isExpanded && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                        <CloudRain className="h-4 w-4 text-accent-foreground" />
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            <TranslatedText>Rain (1h)</TranslatedText>
                          </p>
                          <p className="text-sm font-mono text-muted-foreground">
                            {weather.rain?.["1h"]
                              ? `${weather.rain["1h"]} mm`
                              : "0 mm"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                        <Wind className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            <TranslatedText>Wind Direction</TranslatedText>
                          </p>
                          <p className="text-sm font-mono text-muted-foreground">
                            {weather.wind.deg}°
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                        <Sun className="h-4 w-4 text-warning" />
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            <TranslatedText>Sunrise</TranslatedText>
                          </p>
                          <p className="text-sm font-mono text-muted-foreground">
                            {formatTime(weather.sys.sunrise)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                        <Sun className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            <TranslatedText>Sunset</TranslatedText>
                          </p>
                          <p className="text-sm font-mono text-muted-foreground">
                            {formatTime(weather.sys.sunset)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Soil Information */}
            {soilData && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Leaf className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium text-foreground">
                    <TranslatedText>Soil Properties</TranslatedText>
                  </h4>
                  <Badge variant="outline">SoilGrids</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-2">
                      <Leaf className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          <TranslatedText>Nitrogen (N)</TranslatedText>
                        </p>
                        <p className="text-sm font-mono text-muted-foreground">
                          {soilData.N.toFixed(3)} g/kg
                        </p>
                        <p className="text-xs text-muted-foreground">
                          0-5cm depth
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-2">
                      <Gauge className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          <TranslatedText>pH Level</TranslatedText>
                        </p>
                        <p className="text-sm font-mono text-muted-foreground">
                          {soilData.ph.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          0-5cm depth
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Soil Information (when expanded) */}
                {isExpanded && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <h5 className="text-xs font-medium text-foreground mb-2">
                        <TranslatedText>Soil Analysis Details</TranslatedText>
                      </h5>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <p>
                          <TranslatedText>
                            • Nitrogen content indicates soil fertility for
                            plant growth
                          </TranslatedText>
                        </p>
                        <p>
                          <TranslatedText>
                            • pH level affects nutrient availability and plant
                            health
                          </TranslatedText>
                        </p>
                        <p>
                          <TranslatedText>
                            • Data sourced from SoilGrids global soil database
                          </TranslatedText>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Summary Information */}
            {weather && soilData && (
              <div className="pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    <TranslatedText>Last updated:</TranslatedText>{" "}
                    {new Date().toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <TranslatedText>Location:</TranslatedText>{" "}
                    {location.latitude.toFixed(4)}°N,{" "}
                    {location.longitude.toFixed(4)}°E
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
