import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp, AlertTriangle, Droplets, Thermometer, Wind, Leaf, Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PriceChart } from '@/components/dashboard/PriceChart';
import { CropRecommendation } from '@/types';
import { TranslatedText } from '@/components/i18n/TranslatedText';
import { getCropInfo } from '@/data/cropDatabase';

export const CropDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const crop = location.state?.crop as CropRecommendation;

  if (!crop) {
    navigate('/dashboard');
    return null;
  }

  // Get detailed crop information from database
  const cropInfo = getCropInfo(crop.name);
  
  if (!cropInfo) {
    navigate('/dashboard');
    return null;
  }

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
      message: 'Optimal planting conditions detected for this crop',
      time: '1 day ago'
    },
    {
      id: '3',
      type: 'alert',
      message: 'Pest alert: Monitor for common diseases in this season',
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
              <TranslatedText>Back to Dashboard</TranslatedText>
            </Button>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-foreground">{crop.name} <TranslatedText>Details</TranslatedText></h1>
              <Badge className={crop.suitability === 'high' ? 'bg-success/20 text-success-foreground' : 'bg-warning/20 text-warning-foreground'}>
                {crop.suitability} <TranslatedText>suitability</TranslatedText>
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
                <CardTitle className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  <span><TranslatedText>Crop Information</TranslatedText></span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cropInfo.description && (
                  <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">{cropInfo.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium"><TranslatedText>Planting Season</TranslatedText></p>
                        <p className="text-sm text-muted-foreground">{cropInfo.plantingSeason}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium"><TranslatedText>Harvest Season</TranslatedText></p>
                        <p className="text-sm text-muted-foreground">{cropInfo.harvestSeason}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium"><TranslatedText>Water Requirement</TranslatedText></p>
                        <p className="text-sm text-muted-foreground">{cropInfo.waterRequirement}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Thermometer className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium"><TranslatedText>Temperature Range</TranslatedText></p>
                        <p className="text-sm text-muted-foreground">{cropInfo.temperatureRange}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Wind className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium"><TranslatedText>Soil Type</TranslatedText></p>
                        <p className="text-sm text-muted-foreground">{cropInfo.soilType}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Sun className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium"><TranslatedText>Expected Yield</TranslatedText></p>
                        <p className="text-sm text-muted-foreground">{cropInfo.expectedYield}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span><TranslatedText>Current Market Price</TranslatedText></span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-muted/30 rounded-lg mb-6">
                  <p className="text-sm text-muted-foreground mb-2"><TranslatedText>Current Price</TranslatedText></p>
                  <p className="text-3xl font-bold text-primary">{crop.marketPrice}</p>
                  <p className="text-sm text-success mt-2">{crop.priceChange}</p>
                </div>
                
                {/* Price Chart */}
                <PriceChart cropName={crop.name} />
              </CardContent>
            </Card>

            {/* Growing Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sun className="h-5 w-5 text-primary" />
                  <span><TranslatedText>Growing Guide</TranslatedText></span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center space-x-2">
                      <Leaf className="h-4 w-4 text-green-500" />
                      <span><TranslatedText>Recommended Fertilizers</TranslatedText></span>
                    </h4>
                    <div className="space-y-2">
                      {cropInfo.fertilizers.map((fertilizer, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {fertilizer}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span><TranslatedText>Common Diseases & Pests</TranslatedText></span>
                    </h4>
                    <div className="space-y-2">
                      {cropInfo.diseases.map((disease, index) => (
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
                  <span><TranslatedText>Alerts & Updates</TranslatedText></span>
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
                        <p className="text-sm mb-1"><TranslatedText>{alert.message}</TranslatedText></p>
                        <p className="text-xs text-muted-foreground"><TranslatedText>{alert.time}</TranslatedText></p>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};