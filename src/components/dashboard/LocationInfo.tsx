import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { TranslatedText } from '@/components/i18n/TranslatedText';

interface LocationInfoProps {
  location: { latitude: number; longitude: number } | null;
  onRequestLocation: () => void;
  isLoading?: boolean;
  onSetLocation?: (coords: { latitude: number; longitude: number }) => void;
}

export const LocationInfo = ({ location, onRequestLocation, isLoading = false, onSetLocation }: LocationInfoProps) => {
  const [latInput, setLatInput] = useState<string>(location ? String(location.latitude) : '');
  const [lonInput, setLonInput] = useState<string>(location ? String(location.longitude) : '');
  const formatCoordinate = (coord: number, type: 'lat' | 'lng') => {
    const abs = Math.abs(coord);
    const direction = type === 'lat' 
      ? (coord >= 0 ? 'N' : 'S')
      : (coord >= 0 ? 'E' : 'W');
    return `${abs.toFixed(6)}° ${direction}`;
  };

  if (!location) {
    return (
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span><TranslatedText>Farm Location</TranslatedText></span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="py-6">
            <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2"><TranslatedText>Location Access Required</TranslatedText></h3>
            <p className="text-sm text-muted-foreground mb-4">
              <TranslatedText>We need your location to provide accurate weather data and crop recommendations.</TranslatedText>
            </p>
            <Button
              onClick={onRequestLocation}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  <TranslatedText>Getting Location...</TranslatedText>
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  <TranslatedText>Enable Location</TranslatedText>
                </>
              )}
            </Button>
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
            <MapPin className="h-5 w-5 text-primary" />
            <span><TranslatedText>Farm Location</TranslatedText></span>
          </div>
          <Badge className="bg-success/20 text-success-foreground hover:bg-success/30">
            <TranslatedText>Active</TranslatedText>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm font-medium text-foreground"><TranslatedText>Latitude</TranslatedText></p>
              <p className="text-lg font-mono text-muted-foreground">
                {formatCoordinate(location.latitude, 'lat')}
              </p>
            </div>
            <Navigation className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm font-medium text-foreground"><TranslatedText>Longitude</TranslatedText></p>
              <p className="text-lg font-mono text-muted-foreground">
                {formatCoordinate(location.longitude, 'lng')}
              </p>
            </div>
            <Navigation className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        
        <div className="pt-2 text-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRequestLocation}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <TranslatedText>Update Location</TranslatedText>
          </Button>
        </div>

        {/* Manual Lat/Lon input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground"><TranslatedText>Custom Latitude</TranslatedText></label>
            <Input
              type="number"
              step="any"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              placeholder="e.g. 28.6139"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground"><TranslatedText>Custom Longitude</TranslatedText></label>
            <Input
              type="number"
              step="any"
              value={lonInput}
              onChange={(e) => setLonInput(e.target.value)}
              placeholder="e.g. 77.2090"
            />
          </div>
        </div>
        <Button
          onClick={() => {
            const lat = parseFloat(latInput);
            const lon = parseFloat(lonInput);
            if (Number.isFinite(lat) && Number.isFinite(lon) && onSetLocation) {
              const clampedLat = Math.max(-90, Math.min(90, lat));
              const clampedLon = Math.max(-180, Math.min(180, lon));
              onSetLocation({ latitude: clampedLat, longitude: clampedLon });
            }
          }}
          className="w-full"
          variant="secondary"
        >
          <TranslatedText>Set Custom Coordinates</TranslatedText>
        </Button>
        
        <div className="text-xs text-muted-foreground text-center">
          <TranslatedText>Location accuracy may vary based on device GPS capability</TranslatedText>
        </div>
      </CardContent>
    </Card>
  );
};