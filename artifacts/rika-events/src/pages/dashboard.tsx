import React from 'react';
import { 
  useGetDashboardStats, 
  useGetRevenueOverview, 
  useGetEventStatusBreakdown,
  useGetUpcomingEvents,
  useGetVendorSummary
} from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, DollarSign, Building, Package, CreditCard, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: revenueData } = useGetRevenueOverview();
  const { data: statusBreakdown } = useGetEventStatusBreakdown();
  const { data: upcomingEvents } = useGetUpcomingEvents();
  const { data: vendorSummary } = useGetVendorSummary();

  const PIE_COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-serif font-medium mb-2">Command Center</h1>
        <p className="text-muted-foreground">Welcome back. Here's what's happening across your events.</p>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white/5 border-white/10 animate-pulse h-32"></Card>
          ))}
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={item}>
            <Card className="bg-card/40 border-white/10 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/10">
                    <ChevronUp className="w-3 h-3 mr-1" /> {stats?.eventsThisMonth || 12} this month
                  </Badge>
                </div>
                <div className="text-3xl font-serif text-foreground mb-1">{stats?.totalEvents || 0}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Total Events</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-card/40 border-white/10 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-full bg-chart-2/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-chart-2" />
                  </div>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/10">
                    <ChevronUp className="w-3 h-3 mr-1" /> {stats?.revenueGrowth || 8}%
                  </Badge>
                </div>
                <div className="text-3xl font-serif text-foreground mb-1">
                  ${(stats?.totalRevenue || 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Total Revenue</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-card/40 border-white/10 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-full bg-chart-3/20 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-chart-3" />
                  </div>
                </div>
                <div className="text-3xl font-serif text-foreground mb-1">
                  ${(stats?.pendingPayments || 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Pending Payments</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-card/40 border-white/10 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-full bg-chart-4/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-chart-4" />
                  </div>
                </div>
                <div className="text-3xl font-serif text-foreground mb-1">{stats?.totalGuests || 0}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Total Guests</div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/40 border-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-serif text-xl font-medium">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {revenueData && revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickFormatter={(value) => `$${value/1000}k`} />
                    <RechartsTooltip 
                      cursor={{ fill: 'hsl(var(--white)/0.05)' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
                  Not enough data for chart
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/10 backdrop-blur flex flex-col">
          <CardHeader>
            <CardTitle className="font-serif text-xl font-medium">Event Status</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="h-[220px] w-full">
              {statusBreakdown && statusBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
                  Not enough data for chart
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              {statusBreakdown?.map((status, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                    <span className="capitalize">{status.label.replace('_', ' ')}</span>
                  </div>
                  <span className="font-medium">{status.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/40 border-white/10 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-xl font-medium">Upcoming Events</CardTitle>
            <Link href="/events"><span className="text-sm text-primary hover:underline cursor-pointer">View All</span></Link>
          </CardHeader>
          <CardContent>
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                      <div className="flex flex-col items-center justify-center min-w-[3rem] h-12 bg-primary/10 rounded-md text-primary shrink-0">
                        <span className="text-xs font-medium uppercase">{format(new Date(event.startDate), 'MMM')}</span>
                        <span className="text-lg font-bold leading-none">{format(new Date(event.startDate), 'dd')}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{event.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span className="capitalize px-1.5 py-0.5 rounded-sm bg-white/10">{event.type}</span>
                          <span className="truncate">{event.venueName || 'No Venue Assigned'}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize shrink-0">
                        {event.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                No upcoming events found
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/10 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-xl font-medium">Vendor Distribution</CardTitle>
            <Link href="/vendors"><span className="text-sm text-primary hover:underline cursor-pointer">Manage</span></Link>
          </CardHeader>
          <CardContent>
            {vendorSummary && vendorSummary.length > 0 ? (
              <div className="space-y-4">
                {vendorSummary.map((summary, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center shrink-0">
                      {summary.label.toLowerCase() === 'photography' ? <Users className="w-4 h-4 text-primary" /> :
                       summary.label.toLowerCase() === 'catering' ? <Package className="w-4 h-4 text-chart-2" /> :
                       summary.label.toLowerCase() === 'decor' ? <Building className="w-4 h-4 text-chart-3" /> :
                       <Package className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium capitalize">{summary.label}</span>
                        <span className="text-sm text-muted-foreground">{summary.count} vendors</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${Math.max(5, (summary.count / (stats?.totalVendors || 1)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                No vendor data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
