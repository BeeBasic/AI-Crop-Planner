import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, RefreshCw } from 'lucide-react';

interface LocationInfoProps {
  location: { latitude: number; longitude: number } | null;
  onRequestLocation: () => void;
  isLoading?: boolean;
}

export const LocationInfo = ({ location, onRequestLocation, isLoading = false }: LocationInfoProps) => {
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
            <span>Farm Location</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="py-6">
            <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">Location Access Required</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We need your location to provide accurate weather data and crop recommendations.
            </p>
            <Button
              onClick={onRequestLocation}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Enable Location
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
            <span>Farm Location</span>
          </div>
          <Badge className="bg-success/20 text-success-foreground hover:bg-success/30">
            Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm font-medium text-foreground">Latitude</p>
              <p className="text-lg font-mono text-muted-foreground">
                {formatCoordinate(location.latitude, 'lat')}
              </p>
            </div>
            <Navigation className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm font-medium text-foreground">Longitude</p>
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
            Update Location
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center">
          Location accuracy may vary based on device GPS capability
        </div>
      </CardContent>
    </Card>
  );
};