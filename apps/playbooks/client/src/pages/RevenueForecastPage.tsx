import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, BarChart3, Calendar, DollarSign } from 'lucide-react';

interface ForecastData {
  month: string;
  actual?: number;
  forecast: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

const FORECAST_DATA: ForecastData[] = [
  { month: 'Jan', actual: 42000, forecast: 42500, confidence: 99, trend: 'stable' },
  { month: 'Feb', actual: 38000, forecast: 38200, confidence: 99, trend: 'down' },
  { month: 'Mar', actual: 45000, forecast: 45800, confidence: 99, trend: 'up' },
  { month: 'Apr', actual: 48000, forecast: 48500, confidence: 99, trend: 'up' },
  { month: 'May', actual: 52000, forecast: 52300, confidence: 98, trend: 'up' },
  { month: 'Jun', forecast: 58000, confidence: 92, trend: 'up' },
  { month: 'Jul', forecast: 62000, confidence: 88, trend: 'up' },
  { month: 'Aug', forecast: 60000, confidence: 85, trend: 'stable' },
  { month: 'Sep', forecast: 55000, confidence: 82, trend: 'down' },
  { month: 'Oct', forecast: 48000, confidence: 78, trend: 'down' },
  { month: 'Nov', forecast: 45000, confidence: 75, trend: 'stable' },
  { month: 'Dec', forecast: 52000, confidence: 72, trend: 'up' },
];

const maxValue = Math.max(...FORECAST_DATA.map(d => Math.max(d.actual || 0, d.forecast)));

export default function RevenueForecastPage() {
  const [, navigate] = useLocation();
  const [timeframe, setTimeframe] = useState<'quarterly' | 'annual'>('annual');

  const totalForecast = FORECAST_DATA.reduce((sum, d) => sum + d.forecast, 0);
  const totalActual = FORECAST_DATA.filter(d => d.actual).reduce((sum, d) => sum + (d.actual || 0), 0);
  const avgConfidence = Math.round(FORECAST_DATA.reduce((sum, d) => sum + d.confidence, 0) / FORECAST_DATA.length);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              Revenue Forecasting Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">Predict monthly/quarterly revenue based on booking pipeline and trends</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">YTD Actual</p>
              <p className="text-2xl font-bold text-green-400">€{(totalActual / 1000).toFixed(0)}k</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Annual Forecast</p>
              <p className="text-2xl font-bold text-blue-400">€{(totalForecast / 1000).toFixed(0)}k</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Avg Confidence</p>
              <p className="text-2xl font-bold text-amber-400">{avgConfidence}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Peak Month</p>
              <p className="text-2xl font-bold text-purple-400">Jul</p>
              <p className="text-xs text-muted-foreground">€62k</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Revenue Trend</CardTitle>
              <div className="flex gap-1">
                {(['quarterly', 'annual'] as const).map(tf => (
                  <Button
                    key={tf}
                    variant={timeframe === tf ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeframe(tf)}
                    className="text-xs capitalize"
                  >
                    {tf}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-64 pb-4">
              {FORECAST_DATA.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full h-48 flex items-end justify-center">
                    {/* Actual bar */}
                    {data.actual && (
                      <div
                        className="absolute bottom-0 w-1/3 bg-green-500/60 rounded-t"
                        style={{ height: `${(data.actual / maxValue) * 100}%` }}
                        title={`${data.month}: €${data.actual}`}
                      />
                    )}
                    {/* Forecast bar */}
                    <div
                      className="absolute bottom-0 w-1/3 ml-auto bg-blue-500/60 rounded-t"
                      style={{ height: `${(data.forecast / maxValue) * 100}%`, marginLeft: data.actual ? '0.5rem' : '0' }}
                      title={`${data.month}: €${data.forecast}`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{data.month}</p>
                  <Badge variant="outline" className="text-xs mt-1">{data.confidence}%</Badge>
                </div>
              ))}
            </div>
            <div className="flex gap-4 text-xs mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500/60" />
                <span>Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500/60" />
                <span>Forecast</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {FORECAST_DATA.map((data, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-12">{data.month}</span>
                    {data.actual && (
                      <span className="text-xs text-green-400">Actual: €{data.actual}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">€{data.forecast}</span>
                    <Badge className={data.trend === 'up' ? 'bg-green-500/20 text-green-300' : data.trend === 'down' ? 'bg-red-500/20 text-red-300' : 'bg-zinc-700'}>
                      {data.trend === 'up' ? '↑' : data.trend === 'down' ? '↓' : '→'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{data.confidence}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
