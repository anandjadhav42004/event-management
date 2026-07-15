import React, { useState } from 'react';
import { useGetRooms } from '@/api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: rooms, isLoading } = useGetRooms(); // The API might need search params implemented if needed, filtering client-side for now if not supported

  const filteredRooms = rooms?.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (room.venueName && room.venueName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (room.guestName && room.guestName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium mb-1">Room Allocations</h1>
          <p className="text-muted-foreground">Manage venue spaces and guest accommodations.</p>
        </div>
        <Button className="shadow-lg shadow-primary/20">Add Room Block</Button>
      </div>

      <Card className="bg-card/40 border-white/10 backdrop-blur">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search rooms, venues, or guests..." 
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
                <TableHead>Room Details</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Guest Assignment</TableHead>
                <TableHead className="text-right">Price/Night</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : filteredRooms?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No rooms found.</TableCell></TableRow>
              ) : (
                filteredRooms?.map((room) => (
                  <TableRow key={room.id} className="border-white/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <BedDouble className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{room.name}</div>
                          <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                            <span className="capitalize">{room.type}</span>
                            <span>•</span>
                            <span>Floor {room.floor || '-'}</span>
                            <span>•</span>
                            <span>Cap: {room.capacity}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{room.venueName || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${
                        room.status === 'available' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 
                        room.status === 'occupied' ? 'bg-primary/20 text-primary border-primary/20' :
                        'bg-destructive/20 text-destructive border-destructive/20'
                      }`}>
                        {room.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {room.guestName ? (
                        <div>
                          <div className="font-medium">{room.guestName}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {room.checkIn ? format(new Date(room.checkIn), 'MMM d') : '-'} to {room.checkOut ? format(new Date(room.checkOut), 'MMM d') : '-'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-sm">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">${room.pricePerNight?.toLocaleString() || 0}</TableCell>
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
