export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface Language {
  code: string;
  name: string;
}

export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  rain?: {
    '1h': number;
  };
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface CropRecommendation {
  id: string;
  name: string;
  suitability: 'high' | 'medium' | 'low';
  reason: string;
  plantingTime: string;
  harvestTime: string;
  marketPrice?: string;
  priceChange?: string;
}

export interface Alert {
  id: string;
  type: 'weather' | 'market' | 'farming' | 'urgent';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
}