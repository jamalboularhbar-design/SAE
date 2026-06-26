import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, DollarSign, Calendar, Users, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MonthlyMetric {
  month: string;
  bookings: number;
  revenue: number;
  avgNightRate: number;
  occupancySupported: number;
  commissionEarned: number;
}

// Sample data representing RR concierge business metrics
const MONTHLY_DATA: MonthlyMetric[] = [
  { month: 'Jan 2026', bookings: 42, revenue: 28500, avgNightRate: 320, occupancySupported: 68, commissionEarned: 4275 },
  { month: 'Feb 2026', bookings: 38, revenue: 25200, avgNightRate: 310, occupancySupported: 62, commissionEarned: 3780 },
  { month: 'Mar 2026', bookings: 56, revenue: 41800, avgNightRate: 345, occupancySupported: 78, commissionEarned: 6270 },
  { month: 'Apr 2026', bookings: 64, revenue: 52400, avgNightRate: 380, occupancySupported: 85, commissionEarned: 7860 },
  { month: 'May 2026', bookings: 58, revenue: 46200, avgNightRate: 365, occupancySupported: 82, commissionEarned: 6930 },
];

const PROVIDER_REVENUE = [
  { name: 'Grand Palace Hotel', bookings: 18, revenue: 42000, commission: 6300, trend: 'up' },
  { name: 'Cedar Boutique Hotel', bookings: 34, revenue: 18700, commission: 2805, trend: 'up' },
  { name: 'Riverside Luxury Hotel', bookings: 12, revenue: 28800, commission: 4320, trend: 'stable' },
  { name: 'Highland Retreat', bookings: 8, revenue: 14400, commission: 2160, trend: 'up' },
  { name: 'Garden Court Hotel', bookings: 22, revenue: 11000, commission: 1650, trend: 'down' },
  { name: 'Vista Resort', bookings: 15, revenue: 19500, commission: 2925, trend: 'up' },
  { name: 'Harbor View Lodge', bookings: 28, revenue: 12600, commission: 1890, trend: 'stable' },
  { name: 'Summit Inn', bookings: 19, revenue: 7600, commission: 1140, trend: 'down' },
];

export default function RevenueAnalyticsPage() {
  const [, navigate] = useLocation();
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  const currentMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1];
  const prevMonth = MONTHLY_DATA[MONTHLY_DATA.length - 2];

  const bookingChange = prevMonth ? ((currentMonth.bookings - prevMonth.bookings) / prevMonth.bookings * 100).toFixed(1) : '0';
  const revenueChange = prevMonth ? ((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue * 100).toFixed(1) : '0';

  const totalRevenue = MONTHLY_DATA.reduce((sum, m) => sum + m.revenue, 0);
  const totalCommission = MONTHLY_DATA.reduce((sum, m) => sum + m.commissionEarned, 0);
  const totalBookings = MONTHLY_DATA.reduce((sum, m) => sum + m.bookings, 0);

  const trendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUpRight className="w-3 h-3 text-green-400" />;
    if (trend === 'down') return <ArrowDownRight className="w-3 h-3 text-red-400" />;
    return <span className="w-3 h-3 text-muted-foreground">—</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <TrendingUp className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold">Revenue & Booking Analytics</h1>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Period Toggle */}
        <div className="flex gap-2">
          {(['month', 'quarter', 'year'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg border text-sm transition-colors capitalize ${period === p ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent/50'}`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Users className="w-3 h-3" /> Bookings (May)
              </div>
              <p className="text-2xl font-bold">{currentMonth.bookings}</p>
              <p className={`text-xs mt-1 ${Number(bookingChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {Number(bookingChange) >= 0 ? '+' : ''}{bookingChange}% vs prev month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <DollarSign className="w-3 h-3" /> Revenue (May)
              </div>
              <p className="text-2xl font-bold">€{currentMonth.revenue.toLocaleString()}</p>
              <p className={`text-xs mt-1 ${Number(revenueChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {Number(revenueChange) >= 0 ? '+' : ''}{revenueChange}% vs prev month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <BarChart3 className="w-3 h-3" /> YTD Revenue
              </div>
              <p className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</p>
              <p className="text-xs mt-1 text-muted-foreground">{totalBookings} total bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <TrendingUp className="w-3 h-3" /> YTD Commission
              </div>
              <p className="text-2xl font-bold">€{totalCommission.toLocaleString()}</p>
              <p className="text-xs mt-1 text-muted-foreground">~15% avg rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" /> Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 px-2">Month</th>
                    <th className="text-right py-2 px-2">Bookings</th>
                    <th className="text-right py-2 px-2">Revenue</th>
                    <th className="text-right py-2 px-2">Avg Rate</th>
                    <th className="text-right py-2 px-2">Occupancy</th>
                    <th className="text-right py-2 px-2">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {MONTHLY_DATA.map(m => (
                    <tr key={m.month} className="border-b border-border/50">
                      <td className="py-2 px-2 font-medium">{m.month}</td>
                      <td className="text-right py-2 px-2">{m.bookings}</td>
                      <td className="text-right py-2 px-2">€{m.revenue.toLocaleString()}</td>
                      <td className="text-right py-2 px-2">€{m.avgNightRate}</td>
                      <td className="text-right py-2 px-2">{m.occupancySupported}%</td>
                      <td className="text-right py-2 px-2 text-accent">€{m.commissionEarned.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Provider Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" /> Revenue by Provider (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {PROVIDER_REVENUE.sort((a, b) => b.revenue - a.revenue).map(p => {
                const maxRevenue = Math.max(...PROVIDER_REVENUE.map(x => x.revenue));
                const barWidth = (p.revenue / maxRevenue) * 100;
                return (
                  <div key={p.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {trendIcon(p.trend)}
                        <span className="font-medium">{p.name}</span>
                        <span className="text-xs text-muted-foreground">({p.bookings} bookings)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">€{p.revenue.toLocaleString()}</span>
                        <Badge variant="outline" className="text-xs text-accent">€{p.commission.toLocaleString()}</Badge>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent/60 rounded-full" style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
