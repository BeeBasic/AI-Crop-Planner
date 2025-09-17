import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wheat, Calendar, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { CropRecommendation } from '@/types';
import { TranslatedText } from '@/components/i18n/TranslatedText';

// Dummy price data for model recommendations
const getDummyPrice = (cropName: string) => {
  const prices: Record<string, { price: string; change: string }> = {
    'rice': { price: '₹1,890', change: '+2.8%' },
    'wheat': { price: '₹2,150', change: '+5.2%' },
    'maize': { price: '₹1,750', change: '-1.2%' },
    'soybeans': { price: '₹4,200', change: '+8.5%' },
    'cotton': { price: '₹6,500', change: '+3.1%' },
    'sugarcane': { price: '₹3,200', change: '+1.8%' },
    'potato': { price: '₹1,200', change: '-2.5%' },
    'tomato': { price: '₹2,800', change: '+4.2%' },
  };
  return prices[cropName.toLowerCase()] || { price: '₹2,000', change: '+0.0%' };
};

// Enhanced dummy data with market prices
const mockRecommendations: CropRecommendation[] = [
  {
    id: '1',
    name: 'Wheat',
    suitability: 'high',
    reason: 'Optimal temperature and soil conditions detected',
    plantingTime: 'October - November',
    harvestTime: 'March - April',
    marketPrice: '₹2,150',
    priceChange: '+5.2%'
  },
  {
    id: '2', 
    name: 'Rice',
    suitability: 'high',
    reason: 'High humidity and warm weather favorable',
    plantingTime: 'June - July',
    harvestTime: 'November - December',
    marketPrice: '₹1,890',
    priceChange: '+2.8%'
  },
  {
    id: '3',
    name: 'Maize',
    suitability: 'medium',
    reason: 'Good conditions but monitor rainfall',
    plantingTime: 'March - May',
    harvestTime: 'August - October',
    marketPrice: '₹1,750',
    priceChange: '-1.2%'
  },
  {
    id: '4',
    name: 'Soybeans',
    suitability: 'medium',
    reason: 'Moderate soil conditions, requires attention',
    plantingTime: 'April - June',
    harvestTime: 'September - November',
    marketPrice: '₹4,200',
    priceChange: '+8.5%'
  }
];

interface CropRecommendationsProps {
  onSelectCrop: (crop: CropRecommendation) => void;
  predictedCrop?: string | null;
  loading?: boolean;
  top3?: Array<{ name: string; score: number }> | null;
  pricePredictions?: Array<{
    crop_name: string;
    predicted_price_90d: number;
    current_price: number;
    price_change: number;
    price_change_percent: number;
    harvest_month: string;
  }> | null;
}

export const CropRecommendations = ({ onSelectCrop, predictedCrop, loading, top3, pricePredictions }: CropRecommendationsProps) => {
  const getSuitabilityBadge = (suitability: CropRecommendation['suitability']) => {
    switch (suitability) {
      case 'high':
        return <Badge className="bg-success/20 text-success-foreground hover:bg-success/30">High</Badge>;
      case 'medium':
        return <Badge className="bg-warning/20 text-warning-foreground hover:bg-warning/30">Medium</Badge>;
      case 'low':
        return <Badge variant="destructive">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wheat className="h-5 w-5 text-success" />
          <span><TranslatedText>Recommended Crops</TranslatedText></span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {predictedCrop && (
            <div className="p-4 rounded-lg border-2 border-success/30 bg-success/5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wheat className="h-5 w-5 text-success" />
                  <span className="font-semibold text-foreground"><TranslatedText>AI Suggests:</TranslatedText></span>
                </div>
                <Badge className="bg-success text-success-foreground hover:bg-success/90 font-semibold px-3 py-1"><TranslatedText>Top Match</TranslatedText></Badge>
              </div>
              <div className="mt-2 text-xl font-bold text-success">{predictedCrop}</div>
            </div>
          )}

          {loading && (
            <div className="text-sm text-muted-foreground"><TranslatedText>Fetching recommendation…</TranslatedText></div>
          )}

          {/* Show only top 3 model results if available */}
          {top3 && top3.length > 0 ? (
            <div className="grid gap-4">
              {top3.map((item, idx) => {
                // Get real price prediction if available, otherwise use dummy data
                const realPriceData = pricePredictions?.find(p => p.crop_name.toLowerCase() === item.name.toLowerCase());
                const priceData = realPriceData ? {
                  price: `₹${realPriceData.predicted_price_90d.toLocaleString()}`,
                  change: `${realPriceData.price_change_percent >= 0 ? '+' : ''}${realPriceData.price_change_percent.toFixed(1)}%`,
                  harvestMonth: realPriceData.harvest_month
                } : getDummyPrice(item.name);
                
                return (
                  <Card key={item.name + idx} className="border border-border/50 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Wheat className="h-5 w-5 text-success" />
                          <h3 className="font-semibold text-foreground">{item.name}</h3>
                        </div>
                        <Badge className="bg-success/20 text-success-foreground hover:bg-success/30">{(item.score * 100).toFixed(1)}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3"><TranslatedText>Highly suitable based on current soil and weather</TranslatedText></p>
                      
                      {/* Market Price Section */}
                      <div className="bg-market-price/10 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-market-price" />
                            <span className="text-sm font-medium text-foreground">
                              {realPriceData ? <TranslatedText>Predicted Price (90d):</TranslatedText> : <TranslatedText>Market Price:</TranslatedText>}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-market-price">{priceData.price}</div>
                            <div className={`text-xs ${priceData.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                              {priceData.change} <TranslatedText>per quintal</TranslatedText>
                            </div>
                            {realPriceData && 'harvestMonth' in priceData && priceData.harvestMonth && (
                              <div className="text-xs text-muted-foreground mt-1">
                                <TranslatedText>Harvest:</TranslatedText> {priceData.harvestMonth}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={() => onSelectCrop({ 
                          id: String(idx+1), 
                          name: item.name, 
                          suitability: 'high', 
                          reason: 'Model confidence score', 
                          plantingTime: '-', 
                          harvestTime: '-',
                          marketPrice: priceData.price,
                          priceChange: priceData.change
                        })}
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                      >
                        <span><TranslatedText>View Details</TranslatedText></span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <Wheat className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2"><TranslatedText>No Recommendations Yet</TranslatedText></p>
              <p className="text-sm"><TranslatedText>Allow location access or enter coordinates to get crop recommendations</TranslatedText></p>
            </div>
          )}
         </div>
       </CardContent>
     </Card>
   );
 };