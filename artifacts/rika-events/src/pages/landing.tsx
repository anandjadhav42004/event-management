import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Calendar, Users, Building, Diamond, Star, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-serif text-3xl font-bold tracking-widest text-primary">RIKA</div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#modules" className="hover:text-primary transition-colors">Platform</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex-1 flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Luxury Event" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.div variants={fadeIn} className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-primary"></div>
              <span className="text-primary uppercase tracking-widest text-sm font-medium">Enterprise Event Management</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.1] mb-6 text-foreground">
              Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300 italic">Memories.</span><br />
              Master Every Detail.
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl text-muted-foreground mb-10 max-w-2xl font-light leading-relaxed">
              The premier command center for luxury wedding planners and high-end event organizers. 
              Elevate your operations from scattered spreadsheets to a unified, flawless experience.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-primary/20">
                  Request Access <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-background/50 backdrop-blur-sm">
                  Explore Platform
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Trust Banner */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: 'Events Managed', value: '10,000+' },
              { label: 'Luxury Vendors', value: '5,000+' },
              { label: 'Platform Uptime', value: '99.99%' },
              { label: 'Client Satisfaction', value: '4.9/5' }
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left border-l border-primary/20 pl-6">
                <div className="text-3xl md:text-4xl font-serif text-primary mb-2">{stat.value}</div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 md:py-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Orchestrate with Precision</h2>
            <p className="text-muted-foreground text-lg">Every module is crafted to eliminate friction and elevate your service delivery to the standard your clients expect.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: "Event Command",
                desc: "A centralized hub for every event. Timelines, vendor assignments, floor plans, and real-time status updates."
              },
              {
                icon: Diamond,
                title: "Luxury CRM",
                desc: "Manage high-net-worth client inquiries, custom quotations, and seamless communication from lead to conversion."
              },
              {
                icon: Building,
                title: "Venue & Inventory",
                desc: "Complete oversight of room blocks, decor inventory, and venue scheduling to prevent double-bookings."
              },
              {
                icon: Users,
                title: "Guest Experience",
                desc: "RSVP tracking, dietary requirements, table assignments, and personalized touchpoints for every attendee."
              },
              {
                icon: ShieldCheck,
                title: "Financial Mastery",
                desc: "Automated payment schedules, invoice generation, expense tracking, and real-time profit analytics."
              },
              {
                icon: Clock,
                title: "Task Orchestration",
                desc: "Intelligent workflow automation ensuring no detail is missed by your team or external vendors."
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-white/5 border-white/10 hover:border-primary/50 transition-colors duration-300 group backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Showcase */}
      <section id="modules" className="py-24 bg-card/50 border-y border-white/5 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">The Client Portal</h2>
              <p className="text-xl text-muted-foreground mb-8 font-light">
                Give your clients a branded, white-glove digital experience. They can review proposals, sign contracts, pay invoices, and monitor planning progress from their own dedicated dashboard.
              </p>
              <ul className="space-y-6">
                {['Branded to your agency', 'Transparent milestone tracking', 'Secure one-click payments', 'Collaborative guest list management'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Star className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="relative rounded-2xl border border-white/10 bg-background shadow-2xl overflow-hidden aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-card to-background">
                {/* Abstract UI representation instead of generic screenshot */}
                <div className="w-[80%] h-[80%] rounded-xl border border-white/5 shadow-2xl bg-card flex flex-col overflow-hidden">
                  <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/10"></div>
                    <div className="w-3 h-3 rounded-full bg-white/10"></div>
                    <div className="w-3 h-3 rounded-full bg-white/10"></div>
                  </div>
                  <div className="flex-1 p-6 flex gap-6">
                    <div className="w-1/4 flex flex-col gap-4">
                      <div className="h-8 bg-white/5 rounded-md"></div>
                      <div className="h-8 bg-white/5 rounded-md w-3/4"></div>
                      <div className="h-8 bg-white/5 rounded-md w-5/6"></div>
                    </div>
                    <div className="w-3/4 flex flex-col gap-6">
                      <div className="flex gap-4">
                        <div className="h-24 flex-1 bg-primary/10 border border-primary/20 rounded-xl"></div>
                        <div className="h-24 flex-1 bg-white/5 rounded-xl"></div>
                        <div className="h-24 flex-1 bg-white/5 rounded-xl"></div>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-xl"></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating decorative elements */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-[40px]"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-[50px]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-4xl text-center mb-16">Trusted by Industry Leaders</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Rika has completely transformed how we manage our high-profile weddings. The level of detail we can track is unprecedented.",
                author: "Eleanor Vance",
                role: "Founder, Vance Luxury Events"
              },
              {
                quote: "The client portal alone is worth the investment. Our clients constantly compliment us on how professional and organized our process feels.",
                author: "Marcus Chen",
                role: "Director, Chen Corporate"
              },
              {
                quote: "Finally, a platform that understands the complexity of multi-day luxury events. The vendor and room block management is flawless.",
                author: "Sarah Jenkins",
                role: "Head Planner, The Azure Group"
              }
            ].map((t, i) => (
              <Card key={i} className="bg-transparent border-white/10 relative">
                <div className="absolute -top-4 -left-2 text-6xl text-primary/20 font-serif">"</div>
                <CardContent className="pt-10 pb-8 px-8 relative z-10 flex flex-col h-full">
                  <p className="text-lg italic text-muted-foreground mb-8 flex-1">{t.quote}</p>
                  <div>
                    <div className="font-medium">{t.author}</div>
                    <div className="text-sm text-primary uppercase tracking-wide mt-1">{t.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="font-serif text-4xl md:text-6xl mb-6">Ready to Elevate Your Standard?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light">
            Join the world's most prestigious event management firms. Request access to Rika Events today.
          </p>
          <Link href="/register">
            <Button size="lg" className="h-14 px-10 text-lg shadow-2xl shadow-primary/20">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="font-serif text-2xl font-bold tracking-widest text-primary mb-4 md:mb-0">RIKA</div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Rika Events Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
