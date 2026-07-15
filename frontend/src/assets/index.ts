import heroWedding from './hero/hero-wedding.jpg';
import luxuryWedding from './weddings/luxury-wedding.jpg';
import birthdayCelebration from './birthdays/birthday-celebration.jpg';
import corporateEvent from './corporate/corporate-event.jpg';
import decorSetup from './decor/decor-setup.jpg';
import venueShowcase from './venues/venue-showcase.jpg';
import galleryScene from './gallery/gallery-scene.jpg';
import testimonialScene from './testimonials/testimonial-scene.jpg';

export const appImages = {
  hero: heroWedding,
  wedding: luxuryWedding,
  birthday: birthdayCelebration,
  corporate: corporateEvent,
  decor: decorSetup,
  venue: venueShowcase,
  gallery: galleryScene,
  testimonial: testimonialScene,
};

export const galleryImages = [
  { src: appImages.wedding, title: 'Royal Wedding Setup', category: 'Wedding' },
  { src: appImages.birthday, title: 'Birthday Celebration', category: 'Birthday' },
  { src: appImages.corporate, title: 'Corporate Gala', category: 'Corporate' },
  { src: appImages.decor, title: 'Luxury Decoration', category: 'Decoration' },
  { src: appImages.venue, title: 'Grand Venue', category: 'Venue' },
  { src: appImages.gallery, title: 'Elegant Reception', category: 'Reception' },
];
