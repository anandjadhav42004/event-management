import React, { useState } from 'react';
import { useGetVenues } from '@/api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  containerVariants,
  itemVariants,
  cardHover,
  pageVariants,
  SKELETON_CLASS,
} from '@/lib/animations';
import { appImages } from '@/assets';

export default function VenuesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: venues, isLoading } = useGetVenues({ search: searchTerm });

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-serif font-medium mb-1">Venue Directory</h1>
          <p className="text-muted-foreground">Manage affiliated locations and spaces.</p>
        </div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
          <Button className="shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" /> Add Venue
          </Button>
        </motion.div>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="relative w-full max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or location..."
          className="pl-9 bg-card/40 backdrop-blur border-white/10 h-11 transition-all duration-200 focus:ring-primary/40"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`h-72 rounded-xl ${SKELETON_CLASS}`} />
          ))}
        </div>
      ) : venues?.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="text-center py-20 border border-white/10 rounded-xl bg-card/20 backdrop-blur"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
            className="text-4xl mb-4"
          >
            🏛️
          </motion.div>
          <p className="text-muted-foreground">No venues found.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {venues?.map((venue) => (
            <motion.div
              key={venue.id}
              variants={itemVariants}
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              <motion.div
                variants={cardHover}
                className="h-full"
              >
                <Card className="bg-card/40 border-white/10 backdrop-blur overflow-hidden group hover:border-primary/50 transition-colors h-full cursor-pointer">
                  <div className="h-48 bg-white/5 relative overflow-hidden border-b border-white/5">
                    {venue.imageUrl ? (
                      <motion.img
                        src={venue.imageUrl}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.4 }}
                        style={{ filter: 'grayscale(0.2)', opacity: 0.9 }}
                      />
                    ) : (
                      <img
                        src={appImages.venue}
                        alt="Featured venue"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="outline"
                        className={`uppercase text-[10px] tracking-wider backdrop-blur-md ${
                          venue.status === 'available'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                        }`}
                      >
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
                          {venue.amenities
                            .split(',')
                            .slice(0, 3)
                            .map((amenity, i) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground truncate max-w-[100px]"
                              >
                                {amenity.trim()}
                              </motion.span>
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
                      <div className="font-medium text-lg text-primary">
                        ${venue.pricePerDay?.toLocaleString() || 0}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
