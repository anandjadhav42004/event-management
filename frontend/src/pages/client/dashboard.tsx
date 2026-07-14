import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetEvents } from "@/api";
import { Calendar, MapPin, Users, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

export default function ClientDashboardPage() {
  // Using events hook to fetch the client's events (would normally filter by clientId, but API will handle based on token in a real scenario)
  const { data: events, isLoading } = useGetEvents();
  
  // Assume the first event is the "primary" one for the client dashboard view
  const primaryEvent = events?.[0];

  return (
    <div className="space-y-8 pb-8 max-w-5xl mx-auto">
      <div className="text-center py-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
        <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4 relative z-10 text-transparent bg-clip-text premium-button-gradient">Your Wedding Portal</h1>
        <p className="text-muted-foreground relative z-10 text-lg font-sans">Track the progress of your upcoming celebration ✨</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : primaryEvent ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Main Event Card */}
          <Card className="bg-white/90 border-primary/10 backdrop-blur premium-shadow rounded-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <Badge variant="outline" className="mb-3 text-primary border-primary/30 uppercase tracking-widest text-xs">
                    {primaryEvent.type}
                  </Badge>
                  <h2 className="text-3xl font-serif font-medium mb-2">{primaryEvent.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(primaryEvent.startDate), 'MMMM do, yyyy')}</span>
                    </div>
                    {primaryEvent.venueName && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{primaryEvent.venueName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{primaryEvent.guestCount} Guests</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-primary/5 border border-primary/10 rounded-2xl p-6 min-w-[200px] premium-shadow">
                  <div className="text-sm uppercase tracking-widest text-muted-foreground mb-2">Countdown</div>
                  <div className="text-4xl font-serif text-primary">
                    {Math.max(0, Math.ceil((new Date(primaryEvent.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                  </div>
                  <div className="text-sm mt-1">Days to go</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/90 border-primary/10 backdrop-blur premium-shadow premium-card-hover rounded-2xl cursor-pointer" onClick={() => window.location.href = '/client/tasks'}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-1">Planning Checklist</h3>
                <p className="text-sm text-muted-foreground mb-4">Review your upcoming tasks and decisions</p>
                <div className="w-full bg-primary/5 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-right">45% Complete</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-primary/10 backdrop-blur premium-shadow premium-card-hover rounded-2xl cursor-pointer" onClick={() => window.location.href = '/client/guests'}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-1">Guest Management</h3>
                <p className="text-sm text-muted-foreground mb-4">Track RSVPs, meals, and accommodations</p>
                <div className="flex justify-between items-end">
                  <div className="text-3xl font-serif">{primaryEvent.guestCount}</div>
                  <div className="text-sm text-emerald-400">Total</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-primary/10 backdrop-blur premium-shadow premium-card-hover rounded-2xl cursor-pointer" onClick={() => window.location.href = '/client/bookings'}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-1">Financial Overview</h3>
                <p className="text-sm text-muted-foreground mb-4">Review invoices and payment schedule</p>
                <div className="flex justify-between items-end">
                  <div className="text-3xl font-serif text-primary">${primaryEvent.totalAmount?.toLocaleString() || '0'}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-serif mb-2">No Active Events</h2>
          <p className="text-muted-foreground">You don't have any events currently being planned.</p>
        </div>
      )}
    </div>
  );
}
