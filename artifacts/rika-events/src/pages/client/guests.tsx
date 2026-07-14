import React, { useState } from 'react';
import { useGetGuests } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ClientGuestsPage() {
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
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium mb-1">Your Guest List</h1>
          <p className="text-muted-foreground">Manage invitations, RSVPs, and dietary requirements.</p>
        </div>
        <Button className="shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Add Guest</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card/40 border-white/10 backdrop-blur">
          <CardContent className="p-4 flex flex-col justify-center">
            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Total Invited</div>
            <div className="font-serif text-3xl">{guests?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20 backdrop-blur">
          <CardContent className="p-4 flex flex-col justify-center">
            <div className="text-sm text-emerald-400/80 uppercase tracking-wider mb-1">Confirmed</div>
            <div className="font-serif text-3xl text-emerald-400">{guests?.filter(g => g.rsvpStatus === 'confirmed').length || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20 backdrop-blur">
          <CardContent className="p-4 flex flex-col justify-center">
            <div className="text-sm text-amber-400/80 uppercase tracking-wider mb-1">Pending</div>
            <div className="font-serif text-3xl text-amber-400">{guests?.filter(g => g.rsvpStatus === 'pending').length || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/20 backdrop-blur">
          <CardContent className="p-4 flex flex-col justify-center">
            <div className="text-sm text-destructive/80 uppercase tracking-wider mb-1">Declined</div>
            <div className="font-serif text-3xl text-destructive">{guests?.filter(g => g.rsvpStatus === 'declined').length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/40 border-white/10 backdrop-blur">
        <div className="p-4 border-b border-white/5">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name..." 
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
                <TableHead>Email</TableHead>
                <TableHead>RSVP Status</TableHead>
                <TableHead>Meal Choice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="h-32 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : guests?.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="h-32 text-center text-muted-foreground">No guests found. Start by adding one.</TableCell></TableRow>
              ) : (
                guests?.map((guest) => (
                  <TableRow key={guest.id} className="border-white/5">
                    <TableCell className="font-medium text-lg">{guest.name}</TableCell>
                    <TableCell className="text-muted-foreground">{guest.email || 'Not provided'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${getRsvpColor(guest.rsvpStatus)}`}>
                        {guest.rsvpStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">{guest.mealPreference || '-'}</TableCell>
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
