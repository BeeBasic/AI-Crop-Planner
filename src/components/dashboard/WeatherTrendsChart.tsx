import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TranslatedText } from "@/components/i18n/TranslatedText";

interface WeatherTrendsChartProps {
  data?: Array<{ day: string; temp: number; rain: number }>;
}

const defaultData = [
  { day: "Mon", temp: 31, rain: 2 },
  { day: "Tue", temp: 33, rain: 0 },
  { day: "Wed", temp: 35, rain: 1 },
  { day: "Thu", temp: 34, rain: 3 },
  { day: "Fri", temp: 36, rain: 0 },
  { day: "Sat", temp: 37, rain: 4 },
  { day: "Sun", temp: 32, rain: 1 },
];

export const WeatherTrendsChart = ({
  data = defaultData,
}: WeatherTrendsChartProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle><TranslatedText>Weekly Weather Trends</TranslatedText></CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            temp: { label: "Temperature (°C)", color: "hsl(var(--primary))" },
            rain: { label: "Rain (mm)", color: "hsl(var(--accent))" },
          }}
          className="h-80"
        >
          <AreaChart data={data} margin={{ left: 8, right: 8 }}>
            <defs>
              <linearGradient id="temp" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-temp)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-temp)"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="rain" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-rain)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-rain)"
                  stopOpacity={0.03}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis width={28} tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="var(--color-temp)"
              strokeWidth={2}
              fill="url(#temp)"
            />
            <Area
              type="monotone"
              dataKey="rain"
              stroke="var(--color-rain)"
              strokeWidth={2}
              fill="url(#rain)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
