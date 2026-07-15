import React from 'react';
import { useLocation } from 'wouter';
import { 
  useGetEvent, 
  useGetTasks,
  useGetBookings,
  useGetGuests,
  getGetEventQueryKey,
} from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Users, DollarSign, Clock, ChevronLeft, CheckSquare, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [location, setLocation] = useLocation();
  const eventId = parseInt(params.id);

  const { data: event, isLoading: eventLoading } = useGetEvent(eventId, { 
    query: { enabled: !!eventId, queryKey: getGetEventQueryKey(eventId) } 
  });
  const { data: tasks } = useGetTasks({ eventId });
  const { data: bookings } = useGetBookings({ eventId });
  const { data: guests } = useGetGuests({ eventId });

  if (eventLoading) {
    return <div className="p-12 text-center text-muted-foreground animate-pulse">Loading event details...</div>;
  }

  if (!event) {
    return <div className="p-12 text-center text-muted-foreground">Event not found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inquiry': return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
      case 'planning': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'booked': return 'bg-primary/20 text-primary border-primary/20';
      case 'in_progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      case 'cancelled': return 'bg-destructive/20 text-destructive border-destructive/20';
      default: return 'bg-white/10 text-white border-white/10';
    }
  };

  const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
  const totalTasks = tasks?.length || 0;
  const taskProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground cursor-pointer transition-colors w-fit" onClick={() => setLocation('/events')}>
        <ChevronLeft className="w-4 h-4" /> Back to Events
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-serif font-medium">{event.title}</h1>
            <Badge variant="outline" className={`uppercase tracking-wider text-[10px] ${getStatusColor(event.status)}`}>
              {event.status.replace('_', ' ')}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {format(new Date(event.startDate), 'MMM d, yyyy')} - {format(new Date(event.endDate), 'MMM d, yyyy')}</div>
            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {event.venueName || 'Venue TBD'}</div>
            <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {event.guestCount} Guests</div>
          </div>
        </div>
        <Button variant="outline" className="border-white/10 bg-white/5"><Edit className="w-4 h-4 mr-2" /> Edit Details</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/40 border-white/10 backdrop-blur">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Timeline</div>
            <div className="font-serif text-2xl text-foreground">
              {Math.max(0, Math.ceil((new Date(event.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} Days
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/40 border-white/10 backdrop-blur">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
            <div className="w-10 h-10 rounded-full bg-chart-2/10 flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-chart-2" />
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Budget</div>
            <div className="font-serif text-2xl text-foreground">${event.budget?.toLocaleString() || '0'}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/10 backdrop-blur">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
            <div className="w-10 h-10 rounded-full bg-chart-3/10 flex items-center justify-center mb-2">
              <CheckSquare className="w-5 h-5 text-chart-3" />
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Tasks</div>
            <div className="w-full mt-2">
              <div className="flex justify-between text-xs mb-1"><span>{completedTasks}/{totalTasks}</span> <span>{taskProgress}%</span></div>
              <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-chart-3 h-1.5 rounded-full" style={{ width: `${taskProgress}%` }}></div></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/10 backdrop-blur">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
            <div className="w-10 h-10 rounded-full bg-chart-4/10 flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-chart-4" />
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Client</div>
            <div className="font-medium text-foreground truncate w-full">{event.clientName || 'Unassigned'}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full mt-8">
        <TabsList className="bg-white/5 border-white/10 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({totalTasks})</TabsTrigger>
          <TabsTrigger value="guests">Guests ({guests?.length || 0})</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-card/40 border-white/10 backdrop-blur">
            <CardHeader><CardTitle className="font-serif text-lg">Event Notes</CardTitle></CardHeader>
            <CardContent>
              {event.notes ? <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{event.notes}</p> : <p className="text-muted-foreground/50 italic">No notes added.</p>}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks">
          <Card className="bg-card/40 border-white/10 backdrop-blur">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white/5 border-white/5">
                  <TableRow className="border-white/5">
                    <TableHead>Task</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks?.length === 0 ? (
                    <TableRow className="border-white/5"><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No tasks created yet.</TableCell></TableRow>
                  ) : tasks?.map(task => (
                    <TableRow key={task.id} className="border-white/5">
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell className="text-muted-foreground">{task.assigneeName || 'Unassigned'}</TableCell>
                      <TableCell><Badge variant="outline" className="uppercase text-[10px] bg-white/5 border-white/10">{task.priority}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`uppercase text-[10px] ${task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>{task.status.replace('_', ' ')}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guests">
           <Card className="bg-card/40 border-white/10 backdrop-blur">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white/5 border-white/5">
                  <TableRow className="border-white/5">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>RSVP</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Meal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests?.length === 0 ? (
                    <TableRow className="border-white/5"><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No guests added yet.</TableCell></TableRow>
                  ) : guests?.map(guest => (
                    <TableRow key={guest.id} className="border-white/5">
                      <TableCell className="font-medium">{guest.name}</TableCell>
                      <TableCell className="text-muted-foreground">{guest.email}</TableCell>
                      <TableCell><Badge variant="outline" className={`uppercase text-[10px] ${guest.rsvpStatus === 'confirmed' ? 'bg-primary/20 text-primary border-primary/20' : 'bg-white/5 border-white/10'}`}>{guest.rsvpStatus}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{guest.tableNumber || '-'}</TableCell>
                      <TableCell className="text-muted-foreground capitalize">{guest.mealPreference || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials">
           <Card className="bg-card/40 border-white/10 backdrop-blur">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white/5 border-white/5">
                  <TableRow className="border-white/5">
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings?.length === 0 ? (
                    <TableRow className="border-white/5"><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No bookings associated yet.</TableCell></TableRow>
                  ) : bookings?.map(booking => (
                    <TableRow key={booking.id} className="border-white/5">
                      <TableCell className="font-medium font-mono">BKG-{booking.id.toString().padStart(4, '0')}</TableCell>
                      <TableCell><Badge variant="outline" className="uppercase text-[10px] bg-white/5 border-white/10">{booking.status.replace('_', ' ')}</Badge></TableCell>
                      <TableCell className="text-right font-medium">${booking.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-emerald-400">${booking.paidAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-amber-400 font-medium">${booking.balanceAmount?.toLocaleString() || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
