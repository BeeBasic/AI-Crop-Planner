import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wheat, Calendar, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { CropRecommendation } from '@/types';

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
}

export const CropRecommendations = ({ onSelectCrop }: CropRecommendationsProps) => {
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
          <span>Recommended Crops</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            {mockRecommendations.map((crop) => (
              <Card key={crop.id} className="border border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Wheat className="h-5 w-5 text-success" />
                      <h3 className="font-semibold text-foreground">{crop.name}</h3>
                    </div>
                    {getSuitabilityBadge(crop.suitability)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{crop.reason}</p>
                  
                   <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                     <div className="flex items-center space-x-2">
                       <Calendar className="h-4 w-4 text-accent-foreground" />
                       <div>
                         <span className="font-medium">Planting:</span>
                         <span className="ml-1 text-muted-foreground">{crop.plantingTime}</span>
                       </div>
                     </div>
                     
                     <div className="flex items-center space-x-2">
                       <TrendingUp className="h-4 w-4 text-warning" />
                       <div>
                         <span className="font-medium">Harvest:</span>
                         <span className="ml-1 text-muted-foreground">{crop.harvestTime}</span>
                       </div>
                     </div>
                   </div>

                   {/* Market Price Section */}
                   <div className="bg-market-price/10 rounded-lg p-3 mb-3">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-2">
                         <DollarSign className="h-4 w-4 text-market-price" />
                         <span className="text-sm font-medium text-foreground">Market Price:</span>
                       </div>
                       <div className="text-right">
                         <div className="text-lg font-bold text-market-price">{crop.marketPrice}</div>
                         <div className={`text-xs ${crop.priceChange?.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                           {crop.priceChange} per quintal
                         </div>
                       </div>
                     </div>
                   </div>

                   <Button 
                     onClick={() => onSelectCrop(crop)}
                     variant="outline" 
                     size="sm" 
                     className="w-full"
                   >
                     <span>View Details</span>
                     <ArrowRight className="h-4 w-4 ml-2" />
                   </Button>
                </CardContent>
              </Card>
            ))}
           </div>
         </div>
       </CardContent>
     </Card>
   );
 };