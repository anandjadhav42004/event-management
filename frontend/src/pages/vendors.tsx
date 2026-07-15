import React, { useState } from 'react';
import { useGetVendors } from '@/api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Star, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: vendors, isLoading } = useGetVendors({ search: searchTerm });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium mb-1">Vendor Directory</h1>
          <p className="text-muted-foreground">Manage your network of luxury suppliers and partners.</p>
        </div>
        <Button className="shadow-lg shadow-primary/20">Add Vendor</Button>
      </div>

      <Card className="bg-card/40 border-white/10 backdrop-blur">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search vendors..." 
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
                <TableHead>Business</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : vendors?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No vendors found.</TableCell></TableRow>
              ) : (
                vendors?.map((vendor) => (
                  <TableRow key={vendor.id} className="border-white/5">
                    <TableCell>
                      <div className="font-medium text-foreground">{vendor.name}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {vendor.email}</span>
                        {vendor.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {vendor.phone}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="uppercase text-[10px] bg-white/5 border-white/10">
                        {vendor.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{vendor.contactName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="font-medium">{vendor.rating?.toFixed(1) || 'New'}</span>
                        <span className="text-xs text-muted-foreground ml-1">({vendor.totalEvents || 0} events)</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`uppercase text-[10px] ${vendor.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-destructive/20 text-destructive border-destructive/20'}`}>
                        {vendor.status}
                      </Badge>
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
