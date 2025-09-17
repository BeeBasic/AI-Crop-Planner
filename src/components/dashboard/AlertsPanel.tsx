import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, CloudRain, Bell } from 'lucide-react';
import { Alert } from '@/types';

// Mock alerts data
const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'weather',
    title: 'Heavy Rain Expected',
    message: 'Heavy rainfall predicted for tomorrow. Consider protecting sensitive crops.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    priority: 'high'
  },
  {
    id: '2',
    type: 'market',
    title: 'Rice Prices Rising',
    message: 'Market price of rice has increased by 15% this week. Good time to sell.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    priority: 'medium'
  },
  {
    id: '3',
    type: 'farming',
    title: 'Pest Alert',
    message: 'Aphid activity detected in nearby farms. Monitor your crops closely.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    priority: 'medium'
  },
  {
    id: '4',
    type: 'weather',
    title: 'Optimal Watering Time',
    message: 'Morning humidity levels are ideal for irrigation. Start early tomorrow.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    priority: 'low'
  }
];

export const AlertsPanel = () => {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'weather':
        return <CloudRain className="h-4 w-4" />;
      case 'market':
        return <TrendingUp className="h-4 w-4" />;
      case 'farming':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High</Badge>;
      case 'medium':
        return <Badge className="bg-warning/20 text-warning-foreground hover:bg-warning/30 text-xs">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary" className="text-xs">Low</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Info</Badge>;
    }
  };

  const getAlertTypeColor = (type: Alert['type']) => {
    switch (type) {
      case 'weather':
        return 'text-accent-foreground';
      case 'market':
        return 'text-success';
      case 'farming':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-warning" />
            <span>Alerts & Notifications</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {mockAlerts.filter(alert => alert.priority === 'high').length} urgent
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className={`mt-0.5 ${getAlertTypeColor(alert.type)}`}>
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-sm text-foreground truncate">{alert.title}</h4>
                    <div className="flex items-center space-x-2 ml-2">
                      {getPriorityBadge(alert.priority)}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {alert.message}
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    {formatTimestamp(alert.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center pt-2">
            <Button variant="outline" size="sm">
              View All Alerts
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};