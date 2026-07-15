import React, { useState } from 'react';
import { useGetInventoryItems } from '@/api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, AlertTriangle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: items, isLoading } = useGetInventoryItems({ search: searchTerm });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium mb-1">Equipment Inventory</h1>
          <p className="text-muted-foreground">Track hardware, supplies, and operational assets.</p>
        </div>
        <Button className="shadow-lg shadow-primary/20"><Package className="w-4 h-4 mr-2" /> Receive Stock</Button>
      </div>

      <Card className="bg-card/40 border-white/10 backdrop-blur">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search items, categories..." 
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
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right">Stock Level</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="h-32 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : items?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No inventory items found.</TableCell></TableRow>
              ) : (
                items?.map((item) => {
                  const isLowStock = item.minQuantity && item.quantity <= item.minQuantity;
                  
                  return (
                    <TableRow key={item.id} className="border-white/5">
                      <TableCell>
                        <div className="font-medium text-foreground">{item.name}</div>
                        {item.description && <div className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">{item.description}</div>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase text-[10px] tracking-wider bg-white/5 border-white/10">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.location || '-'}</TableCell>
                      <TableCell className="text-right text-muted-foreground">${item.unitCost?.toLocaleString() || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className={`font-mono font-medium text-lg ${isLowStock ? 'text-destructive' : 'text-emerald-400'}`}>
                          {item.quantity} <span className="text-xs font-sans font-normal text-muted-foreground ml-1">{item.unit}</span>
                        </div>
                      </TableCell>
                      <TableCell className="w-10">
                        {isLowStock && (
                          <div title={`Low stock warning (Min: ${item.minQuantity})`}>
                            <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
