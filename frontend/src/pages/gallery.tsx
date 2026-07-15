import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { appImages, galleryImages } from '@/assets';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<(typeof galleryImages)[number] | null>(null);

  const categories = ['All', 'Wedding', 'Birthday', 'Corporate', 'Decoration', 'Reception', 'Venue', 'Luxury'];

  const filteredImages = useMemo(() => {
    if (activeCategory === 'All') return galleryImages;
    return galleryImages.filter((image) => image.category === activeCategory || activeCategory === 'Luxury');
  }, [activeCategory]);

  return (
    <div className="space-y-8 pb-12">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-card/40 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)]">
        <div className="relative h-72 md:h-96">
          <img
            src={appImages.hero}
            alt="Luxury gallery showcase"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-background/20" />
          <div className="absolute inset-0 flex items-end p-6 md:p-10">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-primary">
                <Sparkles className="h-4 w-4" /> Curated gallery
              </div>
              <h1 className="font-serif text-3xl md:text-5xl">A visual story of glamour, warmth, and celebration.</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${activeCategory === category ? 'border-primary bg-primary/15 text-primary' : 'border-white/10 bg-white/5 text-muted-foreground hover:text-foreground'}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filteredImages.map((image, index) => (
          <motion.button
            key={`${image.title}-${index}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
            whileHover={{ y: -5, scale: 1.01 }}
            onClick={() => setSelectedImage(image)}
            className="mb-4 block w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-card/40 text-left shadow-[0_20px_50px_-24px_rgba(0,0,0,0.45)]"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-64 w-full object-cover transition duration-500 hover:scale-105"
              loading="lazy"
            />
            <div className="p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-primary">{image.category}</div>
              <div className="mt-1 text-lg font-medium">{image.title}</div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/90 p-4 backdrop-blur"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-card/95 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-h-[80vh] w-full object-contain"
                loading="lazy"
              />
              <button
                aria-label="Close preview"
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 rounded-full border border-white/10 bg-background/80 p-2"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-6">
                <div className="text-xs uppercase tracking-[0.3em] text-primary">{selectedImage.category}</div>
                <div className="text-2xl font-medium">{selectedImage.title}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
