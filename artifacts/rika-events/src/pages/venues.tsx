import React, { useState } from 'react';
import { useGetVenues } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, MapPin, Users, DollarSign, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VenuesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: venues, isLoading } = useGetVenues({ search: searchTerm });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium mb-1">Venue Directory</h1>
          <p className="text-muted-foreground">Manage affiliated locations and spaces.</p>
        </div>
        <Button className="shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Add Venue</Button>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by name or location..." 
          className="pl-9 bg-card/40 backdrop-blur border-white/10 h-11"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : venues?.length === 0 ? (
        <div className="text-center py-20 border border-white/10 rounded-xl bg-card/20 backdrop-blur">
          <p className="text-muted-foreground">No venues found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {venues?.map(venue => (
            <Card key={venue.id} className="bg-card/40 border-white/10 backdrop-blur overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="h-48 bg-white/5 relative overflow-hidden border-b border-white/5">
                {venue.imageUrl ? (
                  <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-card to-background">
                    <MapPin className="w-12 h-12 text-white/10" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className={`uppercase text-[10px] tracking-wider backdrop-blur-md ${venue.status === 'available' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-amber-500/20 text-amber-400 border-amber-500/50'}`}>
                    {venue.status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-serif text-xl font-medium truncate mb-2">{venue.name}</h3>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 opacity-70 shrink-0" /> 
                    <span className="truncate">{venue.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 opacity-70 shrink-0" /> 
                    <span>Up to {venue.capacity} guests</span>
                  </div>
                </div>

                {venue.amenities && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {venue.amenities.split(',').slice(0, 3).map((amenity, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground truncate max-w-[100px]">
                          {amenity.trim()}
                        </span>
                      ))}
                      {venue.amenities.split(',').length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                          +{venue.amenities.split(',').length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-auto">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Per Day</div>
                  <div className="font-medium text-lg text-primary">${venue.pricePerDay?.toLocaleString() || 0}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
