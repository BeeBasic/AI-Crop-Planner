import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Thermometer, Gauge, Leaf, CloudRain } from 'lucide-react';

interface ModelInputsProps {
  soilData?: { N: number; ph: number } | null;
  weatherData?: {
    temperature: number;
    humidity: number;
    rainfall: number;
  } | null;
  loading?: boolean;
}

export const ModelInputs = ({ soilData, weatherData, loading }: ModelInputsProps) => {
  if (loading) {
    return (
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gauge className="h-5 w-5 text-primary" />
            <span>Soil & Weather Conditions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading input data...</div>
        </CardContent>
      </Card>
    );
  }

  if (!soilData && !weatherData) {
    return (
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gauge className="h-5 w-5 text-primary" />
            <span>Soil & Weather Conditions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No input data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Gauge className="h-5 w-5 text-primary" />
          <span>Soil & Weather Conditions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Soil Data */}
        {soilData && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Leaf className="h-4 w-4 mr-2" />
              Soil Properties
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-xs font-medium text-foreground">Nitrogen (N)</p>
                  <p className="text-lg font-mono text-muted-foreground">
                    {soilData.N.toFixed(2)} g/kg
                  </p>
                </div>
                <Badge variant="outline">SoilGrids</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-xs font-medium text-foreground">pH Level</p>
                  <p className="text-lg font-mono text-muted-foreground">
                    {soilData.ph.toFixed(1)}
                  </p>
                </div>
                <Badge variant="outline">SoilGrids</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Weather Data */}
        {weatherData && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <CloudRain className="h-4 w-4 mr-2" />
              Weather Conditions
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Temperature</p>
                    <p className="text-lg font-mono text-muted-foreground">
                      {weatherData.temperature.toFixed(1)}°C
                    </p>
                  </div>
                </div>
                <Badge variant="outline">OpenWeather</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Humidity</p>
                    <p className="text-lg font-mono text-muted-foreground">
                      {weatherData.humidity.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <Badge variant="outline">OpenWeather</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <CloudRain className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Rainfall (10-day avg)</p>
                    <p className="text-lg font-mono text-muted-foreground">
                      {weatherData.rainfall.toFixed(1)} mm
                    </p>
                  </div>
                </div>
                <Badge variant="outline">OpenWeather</Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
