import React, { useState } from 'react';
import { useGetGuests } from '@/api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GuestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: guests, isLoading } = useGetGuests({ search: searchTerm });

  const getRsvpColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      case 'declined': return 'bg-destructive/20 text-destructive border-destructive/20';
      case 'maybe': return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
      default: return 'bg-white/10 text-white border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium mb-1">Guest Registry</h1>
          <p className="text-muted-foreground">Manage attendees across all events.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 bg-card"><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button className="bg-white text-black hover:bg-white/90"><Upload className="w-4 h-4 mr-2" /> Import CSV</Button>
        </div>
      </div>

      <Card className="bg-card/40 border-white/10 backdrop-blur">
        <div className="p-4 border-b border-white/5">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search guests by name or email..." 
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
                <TableHead>Guest Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>RSVP</TableHead>
                <TableHead>Dietary</TableHead>
                <TableHead className="text-right">Table</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="h-32 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : guests?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No guests found.</TableCell></TableRow>
              ) : (
                guests?.map((guest) => (
                  <TableRow key={guest.id} className="border-white/5">
                    <TableCell className="font-medium">{guest.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">{guest.email}</div>
                      <div className="text-xs text-muted-foreground">{guest.phone || '-'}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{guest.eventTitle || 'Unknown'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${getRsvpColor(guest.rsvpStatus)}`}>
                        {guest.rsvpStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">{guest.mealPreference || 'Standard'}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{guest.tableNumber || '-'}</TableCell>
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
