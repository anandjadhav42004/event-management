import React, { useState } from 'react';
import { useGetEvents, useCreateEvent } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Calendar, MapPin, Users, ChevronRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';
import { getGetEventsQueryKey } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';

const eventSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  type: z.string().min(1, 'Type is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  guestCount: z.coerce.number().min(1, 'Guest count is required'),
});

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: events, isLoading } = useGetEvents({ search: searchTerm });
  const createEvent = useCreateEvent();

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      type: '',
      startDate: '',
      endDate: '',
      guestCount: 100,
    },
  });

  const onSubmit = (values: z.infer<typeof eventSchema>) => {
    createEvent.mutate(
      { data: values as any },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetEventsQueryKey() });
          setOpen(false);
          form.reset();
          toast({ title: 'Event Created', description: 'The event has been successfully created.' });
        },
        onError: () => {
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to create event.' });
        }
      }
    );
  };

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium mb-1">Events Registry</h1>
          <p className="text-muted-foreground">Manage and orchestrate all your events.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" /> New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Create New Event</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl><Input placeholder="e.g. Smith-Johnson Wedding" className="bg-background/50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="bg-background/50"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="corporate">Corporate</SelectItem>
                          <SelectItem value="birthday">Birthday</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="guestCount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Guests</FormLabel>
                      <FormControl><Input type="number" className="bg-background/50" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="startDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl><Input type="date" className="bg-background/50" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="endDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl><Input type="date" className="bg-background/50" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={createEvent.isPending}>
                    {createEvent.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Create Event
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card/40 border-white/10 backdrop-blur">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search events..." 
              className="pl-9 bg-background/50 border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="font-medium text-muted-foreground">Event</TableHead>
                <TableHead className="font-medium text-muted-foreground">Client</TableHead>
                <TableHead className="font-medium text-muted-foreground">Date</TableHead>
                <TableHead className="font-medium text-muted-foreground">Venue</TableHead>
                <TableHead className="font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i} className="border-white/5">
                    <TableCell><div className="h-4 w-32 bg-white/5 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-24 bg-white/5 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-24 bg-white/5 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-32 bg-white/5 animate-pulse rounded"></div></TableCell>
                    <TableCell><div className="h-6 w-20 bg-white/5 animate-pulse rounded-full"></div></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))
              ) : events?.length === 0 ? (
                <TableRow className="border-white/5">
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No events found.
                  </TableCell>
                </TableRow>
              ) : (
                events?.map((event) => (
                  <TableRow key={event.id} className="border-white/5 hover:bg-white/5 cursor-pointer group" onClick={() => window.location.href = `/events/${event.id}`}>
                    <TableCell>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs text-muted-foreground uppercase mt-1 tracking-wider">{event.type} • {event.guestCount} Guests</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{event.clientName || 'Not assigned'}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground whitespace-nowrap">
                        <Calendar className="w-4 h-4 mr-2 opacity-70" />
                        {format(new Date(event.startDate), 'MMM d, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2 opacity-70" />
                        {event.venueName || 'TBD'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`uppercase tracking-wider text-[10px] ${getStatusColor(event.status)}`}>
                        {event.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
