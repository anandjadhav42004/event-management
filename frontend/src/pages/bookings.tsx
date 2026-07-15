import React, { useState } from 'react';
import { useGetBookings } from '@/api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: bookings, isLoading } = useGetBookings(); 

  const filteredBookings = bookings?.filter(b => 
    (b.eventTitle && b.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.clientName && b.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      case 'advance_paid': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
      case 'cancelled': return 'bg-destructive/20 text-destructive border-destructive/20';
      default: return 'bg-white/10 text-white border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-medium mb-1">Bookings Ledger</h1>
        <p className="text-muted-foreground">Financial overview of contracted events.</p>
      </div>

      <Card className="bg-card/40 border-white/10 backdrop-blur">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by event or client..." 
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
                <TableHead>Booking ID</TableHead>
                <TableHead>Event & Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right">Balance Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : filteredBookings?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No bookings found.</TableCell></TableRow>
              ) : (
                filteredBookings?.map((booking) => (
                  <TableRow key={booking.id} className="border-white/5">
                    <TableCell>
                      <div className="font-mono text-sm">BKG-{booking.id.toString().padStart(4, '0')}</div>
                      <div className="text-[10px] text-muted-foreground uppercase mt-1">{format(new Date(booking.createdAt), 'MMM d, yyyy')}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{booking.eventTitle || `Event #${booking.eventId}`}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{booking.clientName || 'Unknown Client'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${booking.totalAmount.toLocaleString()}
                      <div className="text-[10px] text-emerald-400 mt-1 uppercase">Paid: ${booking.paidAmount.toLocaleString()}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`font-serif text-lg ${(booking.balanceAmount || 0) > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        ${(booking.balanceAmount || 0).toLocaleString()}
                      </div>
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
