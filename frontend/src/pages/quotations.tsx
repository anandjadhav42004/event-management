import React, { useState } from 'react';
import { useGetQuotations } from "@/api";
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, FileText, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function QuotationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: quotations, isLoading } = useGetQuotations();

  const filteredQuotations = quotations?.filter(q => 
    (q.eventTitle && q.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (q.clientName && q.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      case 'sent': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'viewed': return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
      case 'rejected': return 'bg-destructive/20 text-destructive border-destructive/20';
      case 'draft': return 'bg-primary/5 text-white border-white/10';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium mb-1">Proposals & Quotations</h1>
          <p className="text-muted-foreground">Manage financial proposals sent to clients.</p>
        </div>
        <Button className="shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Draft Quotation</Button>
      </div>

      <Card className="bg-white/90 border-primary/10 backdrop-blur premium-shadow rounded-2xl">
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
                <TableHead>Quotation ID</TableHead>
                <TableHead>Event & Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : filteredQuotations?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No quotations found.</TableCell></TableRow>
              ) : (
                filteredQuotations?.map((quotation) => (
                  <TableRow key={quotation.id} className="border-white/5">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-sm">QTN-{quotation.id.toString().padStart(4, '0')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{quotation.eventTitle || `Event #${quotation.eventId}`}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{quotation.clientName || 'Unknown Client'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${getStatusColor(quotation.status)}`}>
                        {quotation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`text-sm ${quotation.validUntil && new Date(quotation.validUntil) < new Date() && quotation.status === 'sent' ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {quotation.validUntil ? format(new Date(quotation.validUntil), 'MMM d, yyyy') : 'No expiry'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-serif text-lg font-medium text-primary">
                      ${quotation.total.toLocaleString()}
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
