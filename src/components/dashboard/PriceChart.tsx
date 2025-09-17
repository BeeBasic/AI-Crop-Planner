import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

interface PriceData {
  date: string;
  price: number;
  day: number;
}

interface PriceChartProps {
  cropName: string;
  className?: string;
}

// Crop name mapping from model predictions to CSV data
const cropNameMapping: Record<string, string> = {
  'rice': 'Rice',
  'wheat': 'Wheat', 
  'maize': 'Maize',
  'cotton': 'Cotton',
  'banana': 'Banana',
  'grapes': 'Grapes',
  'mango': 'Mango',
  'orange': 'Orange',
  'papaya': 'Papaya',
  'pomegranate': 'Pomegranate',
  'coconut': 'Coconut',
  'jute': 'Jute',
  'lentil': 'Lentil (Masur)(Whole)',
  'chickpea': 'Kabuli Chana(Chickpeas-White)',
  'blackgram': 'Black Gram (Urd Beans)(Whole)',
  'moath': 'Moath Dal',
  'soybeans': 'Soybeans', // Fallback if not in CSV
};

export const PriceChart = ({ cropName, className }: PriceChartProps) => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPriceData = async () => {
      try {
        // Try to load the real price data
        const response = await fetch('/crop_price_data.json');
        if (response.ok) {
          const data = await response.json();
          const cropKey = cropName.toLowerCase();
          if (data[cropKey]) {
            setPriceData(data[cropKey]);
          } else {
            // Fallback to dummy data if crop not found
            setPriceData(getDummyData());
          }
        } else {
          // Fallback to dummy data if file not found
          setPriceData(getDummyData());
        }
      } catch (error) {
        console.error('Error loading price data:', error);
        // Fallback to dummy data on error
        setPriceData(getDummyData());
      } finally {
        setLoading(false);
      }
    };

    loadPriceData();
  }, [cropName]);

  const getDummyData = (): PriceData[] => [
    { date: '2024-01-01', price: 1850, day: 1 },
    { date: '2024-01-02', price: 1920, day: 2 },
    { date: '2024-01-03', price: 1880, day: 3 },
    { date: '2024-01-04', price: 1950, day: 4 },
    { date: '2024-01-05', price: 2010, day: 5 },
    { date: '2024-01-06', price: 1980, day: 6 },
    { date: '2024-01-07', price: 2050, day: 7 },
    { date: '2024-01-08', price: 2120, day: 8 },
    { date: '2024-01-09', price: 2080, day: 9 },
    { date: '2024-01-10', price: 2150, day: 10 },
    { date: '2024-01-11', price: 2200, day: 11 },
    { date: '2024-01-12', price: 2180, day: 12 },
    { date: '2024-01-13', price: 2250, day: 13 },
    { date: '2024-01-14', price: 2300, day: 14 },
    { date: '2024-01-15', price: 2280, day: 15 },
    { date: '2024-01-16', price: 2350, day: 16 },
    { date: '2024-01-17', price: 2320, day: 17 },
    { date: '2024-01-18', price: 2380, day: 18 },
    { date: '2024-01-19', price: 2420, day: 19 },
    { date: '2024-01-20', price: 2400, day: 20 },
    { date: '2024-01-21', price: 2450, day: 21 },
    { date: '2024-01-22', price: 2480, day: 22 },
    { date: '2024-01-23', price: 2520, day: 23 },
    { date: '2024-01-24', price: 2500, day: 24 },
    { date: '2024-01-25', price: 2550, day: 25 },
    { date: '2024-01-26', price: 2580, day: 26 },
    { date: '2024-01-27', price: 2620, day: 27 },
    { date: '2024-01-28', price: 2600, day: 28 },
    { date: '2024-01-29', price: 2650, day: 29 },
    { date: '2024-01-30', price: 2680, day: 30 },
  ];

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>30-Day Price Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-muted-foreground">Loading price data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentPrice = priceData[priceData.length - 1]?.price || 0;
  const previousPrice = priceData[priceData.length - 2]?.price || 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>30-Day Price Trend</span>
          <div className="flex items-center space-x-2">
            {priceChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
              {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(1)}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `Day ${value}`}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value}`, 'Price']}
                labelFormatter={(label) => `Day ${label}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Historical price data for {cropNameMapping[cropName.toLowerCase()] || cropName}
        </div>
      </CardContent>
    </Card>
  );
};
