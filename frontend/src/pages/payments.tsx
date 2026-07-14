import React, { useState } from 'react';
import { useGetPayments } from "@/api";
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, CreditCard, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: payments, isLoading } = useGetPayments();

  const filteredPayments = payments?.filter(p => 
    (p.eventTitle && p.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.clientName && p.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.transactionId && p.transactionId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
      case 'failed': return 'bg-destructive/20 text-destructive border-destructive/20';
      case 'refunded': return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
      default: return 'bg-primary/5 text-white border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium mb-1">Payment Transactions</h1>
          <p className="text-muted-foreground">Global view of all incoming transactions.</p>
        </div>
        <Button className="shadow-lg shadow-primary/20"><DollarSign className="w-4 h-4 mr-2" /> Record Payment</Button>
      </div>

      <Card className="bg-white/90 border-primary/10 backdrop-blur premium-shadow rounded-2xl">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by transaction ID, event, or client..." 
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
                <TableHead>Date</TableHead>
                <TableHead>Transaction Ref</TableHead>
                <TableHead>Client / Event</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="h-32 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : filteredPayments?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No transactions found.</TableCell></TableRow>
              ) : (
                filteredPayments?.map((payment) => (
                  <TableRow key={payment.id} className="border-white/5">
                    <TableCell className="text-muted-foreground">
                      {format(new Date(payment.createdAt), 'MMM d, yyyy')}
                      <div className="text-[10px] uppercase tracking-widest mt-1">{format(new Date(payment.createdAt), 'h:mm a')}</div>
                    </TableCell>
                    <TableCell>
                      {payment.transactionId ? (
                        <div className="font-mono text-xs p-1 px-2 rounded bg-primary/5 border border-white/10 inline-block">
                          {payment.transactionId}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">No reference</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{payment.clientName || 'Unknown Client'}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{payment.eventTitle || `BKG-${payment.bookingId}`}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span className="capitalize text-sm">{payment.method.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-serif text-lg font-medium">
                      <span className={payment.status === 'refunded' ? 'text-gray-400 line-through decoration-gray-500' : 'text-emerald-400'}>
                        ${payment.amount.toLocaleString()}
                      </span>
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
