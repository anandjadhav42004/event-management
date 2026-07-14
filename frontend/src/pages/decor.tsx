import React, { useState } from 'react';
import { useGetDecorItems } from "@/api";
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Sparkles, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DecorPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string>('all');
  const { data: items, isLoading } = useGetDecorItems({ 
    search: searchTerm, 
    category: category !== 'all' ? category : undefined 
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium mb-1">Decor Catalog</h1>
          <p className="text-muted-foreground">Premium design elements and styling inventory.</p>
        </div>
        <Button className="shadow-lg shadow-primary/20">Add Item</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search decor items..." 
            className="pl-9 bg-card/40 backdrop-blur border-white/10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11 bg-card/40 backdrop-blur border-white/10">
              <div className="flex items-center gap-2"><Filter className="w-4 h-4 text-muted-foreground" /> <SelectValue placeholder="All Categories" /></div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="flowers">Flowers</SelectItem>
              <SelectItem value="lighting">Lighting</SelectItem>
              <SelectItem value="draping">Draping</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="centerpiece">Centerpieces</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : items?.length === 0 ? (
        <div className="text-center py-20 border border-white/10 rounded-xl bg-card/20 backdrop-blur">
          <p className="text-muted-foreground">No decor items found.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {items?.map(item => (
            <Card key={item.id} className="break-inside-avoid bg-white/90 border-primary/10 backdrop-blur premium-shadow rounded-2xl overflow-hidden group hover:border-primary/50 transition-colors inline-block w-full">
              <div className="aspect-[4/5] bg-primary/5 relative overflow-hidden border-b border-white/5">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-card to-background">
                    <Sparkles className="w-12 h-12 text-white/10" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <Badge variant="outline" className={`uppercase text-[10px] tracking-wider backdrop-blur-md ${item.available ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-destructive/20 text-destructive border-destructive/50'}`}>
                    {item.available ? 'Available' : 'In Use'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-5">
                <Badge variant="secondary" className="bg-primary/5 text-[10px] uppercase tracking-wider mb-2 border-white/10">
                  {item.category}
                </Badge>
                <h3 className="font-serif text-lg font-medium leading-tight mb-2">{item.name}</h3>
                {item.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>}
                
                <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Price / Unit</div>
                  <div className="font-medium text-primary">${item.pricePerUnit?.toLocaleString() || 0}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
