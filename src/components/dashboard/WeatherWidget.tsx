import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Droplets, Wind, Thermometer, Sun, CloudRain } from 'lucide-react';
import { weatherAPI } from '@/services/api';
import { WeatherData } from '@/types';

interface WeatherWidgetProps {
  location: { latitude: number; longitude: number } | null;
}

export const WeatherWidget = ({ location }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location]);

  const fetchWeather = async () => {
    if (!location) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await weatherAPI.getCurrentWeather(location.latitude, location.longitude);
      setWeather(data);
    } catch (error) {
      setError('Failed to fetch weather data');
      console.error('Weather fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="h-8 w-8 text-warning" />;
      case 'clouds':
        return <Cloud className="h-8 w-8 text-muted-foreground" />;
      case 'rain':
        return <CloudRain className="h-8 w-8 text-accent-foreground" />;
      default:
        return <Cloud className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getWeatherConditionBadge = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Badge className="bg-warning/20 text-warning-foreground hover:bg-warning/30">Clear</Badge>;
      case 'clouds':
        return <Badge variant="secondary">Cloudy</Badge>;
      case 'rain':
        return <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">Rainy</Badge>;
      default:
        return <Badge variant="outline">{condition}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cloud className="h-5 w-5 text-primary" />
            <span>Current Weather</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading weather...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cloud className="h-5 w-5 text-primary" />
            <span>Current Weather</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Cloud className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              {error || 'Weather data not available'}
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
            <Cloud className="h-5 w-5 text-primary" />
            <span>Current Weather</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{weather.name}</p>
            <p className="text-xs text-muted-foreground">{weather.sys.country}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getWeatherIcon(weather.weather[0].main)}
            <div>
              <p className="text-3xl font-bold text-foreground">
                {Math.round(weather.main.temp)}°C
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                {weather.weather[0].description}
              </p>
            </div>
          </div>
          {getWeatherConditionBadge(weather.weather[0].main)}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
            <Droplets className="h-5 w-5 text-accent-foreground" />
            <div>
              <p className="text-sm font-medium">Humidity</p>
              <p className="text-lg font-bold text-foreground">{weather.main.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
            <Wind className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Wind Speed</p>
              <p className="text-lg font-bold text-foreground">{weather.wind.speed} m/s</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
            <Thermometer className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-sm font-medium">Feels Like</p>
              <p className="text-lg font-bold text-foreground">{Math.round(weather.main.feels_like)}°C</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
            <CloudRain className="h-5 w-5 text-accent-foreground" />
            <div>
              <p className="text-sm font-medium">Rain (1h)</p>
              <p className="text-lg font-bold text-foreground">
                {weather.rain?.['1h'] ? `${weather.rain['1h']} mm` : '0 mm'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};