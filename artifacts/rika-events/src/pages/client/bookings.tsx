import React from 'react';
import { useGetBookings, useGetPayments } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, Download, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function ClientBookingsPage() {
  const { data: bookings, isLoading: bookingsLoading } = useGetBookings();
  const { data: payments, isLoading: paymentsLoading } = useGetPayments();

  const primaryBooking = bookings?.[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-medium mb-1">Financial Overview</h1>
        <p className="text-muted-foreground">Manage your event budget and payment schedule.</p>
      </div>

      {bookingsLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : primaryBooking ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/40 border-white/10 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground">Total Budget</div>
                </div>
                <div className="text-4xl font-serif">${primaryBooking.totalAmount.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-white/10 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground">Amount Paid</div>
                </div>
                <div className="text-4xl font-serif text-emerald-400">${primaryBooking.paidAmount.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-primary/20 backdrop-blur relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[30px]"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground">Balance Due</div>
                </div>
                <div className="text-4xl font-serif text-amber-400">${(primaryBooking.balanceAmount || 0).toLocaleString()}</div>
                {(primaryBooking.balanceAmount || 0) > 0 && (
                  <Button className="w-full mt-6 shadow-lg shadow-primary/20" variant="default">
                    Make a Payment
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/40 border-white/10 backdrop-blur mt-8">
            <CardHeader className="border-b border-white/5 bg-white/[0.02] flex flex-row items-center justify-between">
              <CardTitle className="font-serif text-xl font-medium">Payment History</CardTitle>
              <Button variant="outline" size="sm" className="bg-transparent border-white/10">
                <Download className="w-4 h-4 mr-2" /> Download Statement
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentsLoading ? (
                    <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                  ) : payments?.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No payments recorded yet.</TableCell></TableRow>
                  ) : (
                    payments?.map((payment) => (
                      <TableRow key={payment.id} className="border-white/5">
                        <TableCell className="text-muted-foreground">{format(new Date(payment.createdAt), 'MMM do, yyyy')}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{payment.transactionId || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <span className="capitalize">{payment.method.replace('_', ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${payment.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-white/10'}`}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-serif font-medium text-lg">${payment.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-xl border border-white/5 mt-8">
          <DollarSign className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-medium mb-2">No Financial Data</h2>
          <p className="text-muted-foreground">There are no bookings or invoices associated with your account yet.</p>
        </div>
      )}
    </div>
  );
}
