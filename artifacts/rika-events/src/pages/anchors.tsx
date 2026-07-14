import React, { useState } from 'react';
import { useGetAnchors } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Star, Languages, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AnchorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: anchors, isLoading } = useGetAnchors({ search: searchTerm });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium mb-1">Anchors & MCs</h1>
          <p className="text-muted-foreground">Elite talent directory for hosting your events.</p>
        </div>
        <Button className="shadow-lg shadow-primary/20">Add Anchor</Button>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by name, specialization, or language..." 
          className="pl-9 bg-card/40 backdrop-blur border-white/10 h-11"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : anchors?.length === 0 ? (
        <div className="text-center py-20 border border-white/10 rounded-xl bg-card/20 backdrop-blur">
          <p className="text-muted-foreground">No anchors found in the directory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {anchors?.map(anchor => (
            <Card key={anchor.id} className="bg-card/40 border-white/10 backdrop-blur overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="aspect-square bg-white/5 relative overflow-hidden flex items-center justify-center border-b border-white/5">
                {anchor.imageUrl ? (
                  <img src={anchor.imageUrl} alt={anchor.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                ) : (
                  <div className="font-serif text-6xl text-white/10">{anchor.name.charAt(0)}</div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className={`uppercase text-[10px] tracking-wider backdrop-blur-md ${anchor.status === 'available' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-destructive/20 text-destructive border-destructive/50'}`}>
                    {anchor.status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-serif text-xl font-medium truncate">{anchor.name}</h3>
                  <div className="flex items-center gap-1 text-amber-400 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-sm font-medium">{anchor.rating?.toFixed(1) || 'New'}</span>
                  </div>
                </div>
                <div className="text-primary text-xs uppercase tracking-widest mb-4">{anchor.specialization.replace('_', ' ')}</div>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  {anchor.languages && (
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 opacity-70" /> 
                      <span className="truncate">{anchor.languages}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 opacity-70" /> 
                    <span>{anchor.phone}</span>
                  </div>
                  {anchor.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 opacity-70" /> 
                      <span className="truncate">{anchor.email}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Starting Fee</div>
                  <div className="font-medium text-lg">${anchor.fee?.toLocaleString() || 'Custom'}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
