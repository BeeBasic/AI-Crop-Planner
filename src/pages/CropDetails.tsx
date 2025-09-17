import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp, DollarSign, AlertTriangle, Droplets, Thermometer, Wind } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CropRecommendation } from '@/types';

export const CropDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const crop = location.state?.crop as CropRecommendation;

  if (!crop) {
    navigate('/dashboard');
    return null;
  }

  // Mock detailed data
  const cropDetails = {
    ...crop,
    waterRequirement: '500-700mm',
    temperatureRange: '15-25°C',
    soilType: 'Well-drained loamy soil',
    fertilizers: ['Urea', 'DAP', 'Potash'],
    diseases: ['Rust', 'Smut', 'Aphids'],
    expectedYield: '25-30 quintals/hectare',
    profitMargin: '₹15,000-20,000 per hectare'
  };

  const alerts = [
    {
      id: '1',
      type: 'warning',
      message: 'Heavy rainfall expected in next 3 days - ensure proper drainage',
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'info',
      message: 'Market price trending upward - good time for harvest planning',
      time: '1 day ago'
    },
    {
      id: '3',
      type: 'alert',
      message: 'Pest alert: Aphid activity detected in nearby fields',
      time: '2 days ago'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-foreground">{crop.name} Details</h1>
              <Badge className={crop.suitability === 'high' ? 'bg-success/20 text-success-foreground' : 'bg-warning/20 text-warning-foreground'}>
                {crop.suitability} suitability
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Crop Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Crop Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Planting Season</p>
                        <p className="text-sm text-muted-foreground">{crop.plantingTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium">Harvest Season</p>
                        <p className="text-sm text-muted-foreground">{crop.harvestTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Water Requirement</p>
                        <p className="text-sm text-muted-foreground">{cropDetails.waterRequirement}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Thermometer className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">Temperature Range</p>
                        <p className="text-sm text-muted-foreground">{cropDetails.temperatureRange}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Wind className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Soil Type</p>
                        <p className="text-sm text-muted-foreground">{cropDetails.soilType}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-market-price" />
                      <div>
                        <p className="font-medium">Expected Yield</p>
                        <p className="text-sm text-muted-foreground">{cropDetails.expectedYield}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-market-price" />
                  <span>Market Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-market-price/10 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Current Price</p>
                    <p className="text-2xl font-bold text-market-price">{crop.marketPrice}</p>
                    <p className="text-sm text-success">{crop.priceChange}</p>
                  </div>
                  <div className="text-center p-4 bg-success/10 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Expected Profit</p>
                    <p className="text-xl font-bold text-success">{cropDetails.profitMargin}</p>
                    <p className="text-sm text-muted-foreground">per hectare</p>
                  </div>
                  <div className="text-center p-4 bg-accent/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Market Trend</p>
                    <p className="text-lg font-semibold text-foreground">Bullish</p>
                    <p className="text-sm text-muted-foreground">Next 30 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Growing Guide */}
            <Card>
              <CardHeader>
                <CardTitle>Growing Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Recommended Fertilizers</h4>
                    <div className="space-y-2">
                      {cropDetails.fertilizers.map((fertilizer, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {fertilizer}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Common Diseases</h4>
                    <div className="space-y-2">
                      {cropDetails.diseases.map((disease, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2">
                          {disease}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Alerts & Recommendations */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <span>Alerts & Updates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <Alert key={alert.id} className={
                      alert.type === 'warning' ? 'border-warning bg-warning/10' :
                      alert.type === 'info' ? 'border-blue-500 bg-blue-500/10' :
                      'border-destructive bg-destructive/10'
                    }>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <p className="text-sm mb-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="default">
                    Add to Planting Schedule
                  </Button>
                  <Button className="w-full" variant="outline">
                    Get Weather Forecast
                  </Button>
                  <Button className="w-full" variant="outline">
                    Find Local Suppliers
                  </Button>
                  <Button className="w-full" variant="outline">
                    Contact Extension Officer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};